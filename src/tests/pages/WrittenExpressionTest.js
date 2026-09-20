import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function WrittenExpressionTest() {
  const [answers, setAnswers] = useState({
    task1: "",
    task2: "",
    task3: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAttempt, setCheckingAttempt] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [accessDenied, setAccessDenied] = useState(false);
  const [accessReason, setAccessReason] = useState("");

  useEffect(() => {
    checkAccessAndAttempt();
  }, []);

  async function checkAccessAndAttempt() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setAccessDenied(true);
        setAccessReason("not_logged_in");
        setCheckingAttempt(false);
        return;
      }

      // Check student profile first
      const { data: student, error: studentError } = await supabase
        .from("student_profiles")
        .select("id, full_name, email, status, payment_status")
        .eq("id", user.id)
        .maybeSingle();

      if (studentError) {
        console.error(
          "STUDENT PROFILE ACCESS ERROR:",
          studentError
        );

        setMessage(
          "Impossible de vérifier votre accès au test."
        );

        setCheckingAttempt(false);
        return;
      }

      if (!student) {
        setAccessDenied(true);
        setAccessReason("no_profile");
        setCheckingAttempt(false);
        return;
      }

      const status = student.status || "pending";
      const paymentStatus =
        student.payment_status || "unpaid";

      // Account approval check
      if (status === "pending") {
        setAccessDenied(true);
        setAccessReason("pending");
        setCheckingAttempt(false);
        return;
      }

      if (status === "rejected") {
        setAccessDenied(true);
        setAccessReason("rejected");
        setCheckingAttempt(false);
        return;
      }

      if (status !== "approved") {
        setAccessDenied(true);
        setAccessReason("not_approved");
        setCheckingAttempt(false);
        return;
      }

      // Payment check
      if (paymentStatus !== "paid") {
        setAccessDenied(true);
        setAccessReason("unpaid");
        setCheckingAttempt(false);
        return;
      }

      // Only check previous attempt after approval + payment
      const {
        data: existingResult,
        error: existingError,
      } = await supabase
        .from("test_results")
        .select("id")
        .eq("student_id", student.id)
        .eq("test_type", "expression_ecrite")
        .maybeSingle();

      if (existingError) {
        console.error(
          "CHECK EXISTING EXPRESSION ERROR:",
          existingError
        );

        setMessage(
          "Impossible de vérifier votre tentative."
        );

        setCheckingAttempt(false);
        return;
      }

      if (existingResult) {
        setAlreadySubmitted(true);
      }
    } catch (error) {
      console.error(
        "EXPRESSION ACCESS CHECK ERROR:",
        error
      );

      setMessage(
        "Une erreur inattendue est survenue."
      );
    }

    setCheckingAttempt(false);
  }

  function handleChange(task, value) {
    setAnswers((current) => ({
      ...current,
      [task]: value,
    }));
  }

  function countWords(text) {
    if (!text.trim()) return 0;

    return text.trim().split(/\s+/).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (
      !answers.task1.trim() ||
      !answers.task2.trim() ||
      !answers.task3.trim()
    ) {
      setMessage(
        "Veuillez répondre aux trois tâches."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage(
          "Vous devez être connecté pour envoyer votre test."
        );
        setLoading(false);
        return;
      }

      // Re-check profile before submission
      const {
        data: student,
        error: studentError,
      } = await supabase
        .from("student_profiles")
        .select(
          "id, full_name, email, status, payment_status"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (studentError || !student) {
        console.error(
          "STUDENT PROFILE ERROR:",
          studentError
        );

        setMessage(
          "Profil étudiant introuvable."
        );

        setLoading(false);
        return;
      }

      const status = student.status || "pending";
      const paymentStatus =
        student.payment_status || "unpaid";

      // Approval check
      if (status !== "approved") {
        setAccessDenied(true);

        if (status === "pending") {
          setAccessReason("pending");
        } else if (status === "rejected") {
          setAccessReason("rejected");
        } else {
          setAccessReason("not_approved");
        }

        setLoading(false);
        return;
      }

      // Payment check
      if (paymentStatus !== "paid") {
        setAccessDenied(true);
        setAccessReason("unpaid");
        setLoading(false);
        return;
      }

      // Final one-attempt check
      const {
        data: existingResult,
        error: existingError,
      } = await supabase
        .from("test_results")
        .select("id")
        .eq("student_id", student.id)
        .eq("test_type", "expression_ecrite")
        .maybeSingle();

      if (existingError) {
        console.error(
          "CHECK EXPRESSION ERROR:",
          existingError
        );

        setMessage(
          "Impossible de vérifier votre tentative."
        );

        setLoading(false);
        return;
      }

      if (existingResult) {
        setAlreadySubmitted(true);
        setLoading(false);
        return;
      }

      // Save answers
      const { error: insertError } = await supabase
        .from("test_results")
        .insert({
          student_id: student.id,
          score: 0,
          total_questions: 3,
          percentage: 0,
          test_type: "expression_ecrite",
          task1_answer: answers.task1.trim(),
          task2_answer: answers.task2.trim(),
          task3_answer: answers.task3.trim(),
          grading_status: "pending",
        });

      if (insertError) {
        console.error(
          "EXPRESSION INSERT ERROR:",
          insertError
        );

        /*
         * PostgreSQL error 23505 = unique_violation.
         *
         * This is important because the database now has
         * a unique index protecting the one-attempt rule.
         *
         * If two requests happen at nearly the same time,
         * both could pass the frontend check, but the
         * database will reject the second INSERT.
         */
        if (
          insertError.code === "23505" ||
          insertError.message
            ?.toLowerCase()
            .includes("duplicate") ||
          insertError.message
            ?.toLowerCase()
            .includes("unique")
        ) {
          setAlreadySubmitted(true);
          setLoading(false);
          return;
        }

        setMessage(
          "Impossible d'enregistrer vos réponses."
        );

        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error(
        "EXPRESSION TEST ERROR:",
        error
      );

      setMessage(
        "Une erreur inattendue est survenue."
      );
    }

    setLoading(false);
  }

  // Loading screen
  if (checkingAttempt) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.loadingIcon}>
            ...
          </div>

          <h1 style={styles.title}>
            Vérification en cours
          </h1>

          <p style={styles.text}>
            Nous vérifions votre accès au test.
          </p>
        </div>
      </div>
    );
  }

  // Access denied
  if (accessDenied) {
    let title = "Accès au test non disponible";

    let text =
      "Vous ne pouvez pas encore accéder à cette partie du test.";

    let infoTitle = "Accès requis";

    let infoText =
      "Votre compte doit être approuvé et votre paiement doit être confirmé avant de commencer les tests.";

    if (accessReason === "not_logged_in") {
      title = "Connexion requise";

      text =
        "Vous devez être connecté pour accéder à cette partie du test.";

      infoTitle = "Connexion";

      infoText =
        "Connectez-vous à votre espace étudiant pour continuer.";
    }

    if (accessReason === "no_profile") {
      title = "Profil étudiant introuvable";

      text =
        "Votre profil étudiant n'a pas été trouvé.";

      infoTitle = "Contactez l'administration";

      infoText =
        "Veuillez contacter l'International French Academy afin de vérifier votre inscription.";
    }

    if (accessReason === "pending") {
      title = "Compte en attente de validation";

      text =
        "Votre compte étudiant n'a pas encore été approuvé.";

      infoTitle = "Validation nécessaire";

      infoText =
        "L'équipe administrative doit d'abord approuver votre compte avant que vous puissiez accéder aux tests.";
    }

    if (accessReason === "rejected") {
      title = "Accès non autorisé";

      text =
        "Votre compte étudiant n'a pas été approuvé.";

      infoTitle = "Compte non approuvé";

      infoText =
        "Veuillez contacter l'équipe administrative de l'International French Academy pour plus d'informations.";
    }

    if (accessReason === "not_approved") {
      title = "Compte non approuvé";

      text =
        "Votre compte doit être approuvé avant de commencer le test.";

      infoTitle = "Validation nécessaire";

      infoText =
        "L'équipe administrative doit d'abord approuver votre compte.";
    }

    if (accessReason === "unpaid") {
      title = "Paiement requis";

      text =
        "Votre paiement n'a pas encore été confirmé.";

      infoTitle = "Paiement nécessaire";

      infoText =
        "Votre compte doit être approuvé et votre paiement doit être confirmé avant d'accéder aux tests.";
    }

    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.lockIcon}>
            🔒
          </div>

          <h1 style={styles.title}>
            {title}
          </h1>

          <p style={styles.text}>
            {text}
          </p>

          <div style={styles.infoBox}>
            <strong>{infoTitle}</strong>

            <p style={styles.infoText}>
              {infoText}
            </p>
          </div>

          <div style={styles.linkArea}>
            <a
              href="/student-dashboard"
              style={styles.linkButton}
            >
              ← Retour à mon espace
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Already submitted
  if (alreadySubmitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.lockIcon}>
            🔒
          </div>

          <h1 style={styles.title}>
            Expression écrite déjà envoyée
          </h1>

          <p style={styles.text}>
            Cette partie du test a déjà été envoyée.
          </p>

          <p style={styles.text}>
            Une seule tentative est autorisée pour
            l'expression écrite.
          </p>

          <div style={styles.infoBox}>
            <strong>Test terminé</strong>

            <p style={styles.infoText}>
              Votre production écrite a bien été
              enregistrée et peut être consultée par
              l'équipe pédagogique pour correction.
            </p>
          </div>

          <div style={styles.linkArea}>
            <a
              href="/tests/results"
              style={styles.linkButton}
            >
              Voir mes résultats →
            </a>

            <a
              href="/student-dashboard"
              style={styles.backButton}
            >
              ← Retour à mon espace
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Successful submission
  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.successIcon}>
            ✓
          </div>

          <h1 style={styles.title}>
            Expression écrite terminée
          </h1>

          <p style={styles.text}>
            Merci d'avoir envoyé vos réponses.
          </p>

          <p style={styles.text}>
            Votre production écrite sera évaluée par
            l'équipe pédagogique de l'International
            French Academy.
          </p>

          <div style={styles.infoBox}>
            <strong>Évaluation manuelle</strong>

            <p style={styles.infoText}>
              Cette partie est corrigée par un évaluateur
              afin de prendre en compte la qualité de votre
              expression, votre vocabulaire, votre grammaire
              et l'organisation de vos idées.
            </p>
          </div>

          <div style={styles.linkArea}>
            <a
              href="/tests/results"
              style={styles.linkButton}
            >
              Voir mes résultats →
            </a>

            <a
              href="/student-dashboard"
              style={styles.backButton}
            >
              ← Retour à mon espace
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main test
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.subtitle}>
            Évaluation de positionnement
          </div>

          <h1 style={styles.title}>
            Expression écrite
          </h1>

          <p style={styles.intro}>
            Répondez aux trois tâches en français.
            Écrivez des réponses claires et complètes.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TÂCHE 1 */}
          <div style={styles.taskCard}>
            <div style={styles.taskNumber}>
              TÂCHE 1
            </div>

            <h2 style={styles.taskTitle}>
              Écrire un message
            </h2>

            <p style={styles.level}>
              Niveau indicatif : A1 – A2
            </p>

            <p style={styles.question}>
              Vous voulez proposer à un ami de faire une
              activité ensemble ce week-end. Écrivez-lui un
              message pour proposer l'activité, préciser le
              jour et le lieu, et lui demander s'il est
              disponible.
            </p>

            <p style={styles.instruction}>
              Écrivez environ 80 à 100 mots.
            </p>

            <textarea
              value={answers.task1}
              onChange={(e) =>
                handleChange(
                  "task1",
                  e.target.value
                )
              }
              placeholder="Écrivez votre réponse ici..."
              style={styles.textarea}
              rows="8"
            />

            <div style={styles.wordCount}>
              {countWords(answers.task1)} mots
            </div>
          </div>

          {/* TÂCHE 2 */}
          <div style={styles.taskCard}>
            <div style={styles.taskNumber}>
              TÂCHE 2
            </div>

            <h2 style={styles.taskTitle}>
              Écrire un message professionnel
            </h2>

            <p style={styles.level}>
              Niveau indicatif : B1 – B2
            </p>

            <p style={styles.question}>
              Vous devez être absent(e) de votre cours ou de
              votre travail pendant une journée. Écrivez un
              email pour expliquer la raison de votre absence,
              préciser la date et proposer une solution pour
              rattraper le travail ou le cours.
            </p>

            <p style={styles.instruction}>
              Écrivez environ 120 à 150 mots.
            </p>

            <textarea
              value={answers.task2}
              onChange={(e) =>
                handleChange(
                  "task2",
                  e.target.value
                )
              }
              placeholder="Écrivez votre réponse ici..."
              style={styles.textarea}
              rows="10"
            />

            <div style={styles.wordCount}>
              {countWords(answers.task2)} mots
            </div>
          </div>

          {/* TÂCHE 3 */}
          <div style={styles.taskCard}>
            <div style={styles.taskNumber}>
              TÂCHE 3
            </div>

            <h2 style={styles.taskTitle}>
              Donner son opinion
            </h2>

            <p style={styles.level}>
              Niveau indicatif : B2 – C1/C2
            </p>

            <p style={styles.question}>
              Aujourd'hui, beaucoup de personnes utilisent
              Internet et les réseaux sociaux pour communiquer,
              travailler et apprendre. Selon vous, quels sont
              les avantages et les inconvénients de cette
              utilisation dans la vie quotidienne ?
            </p>

            <p style={styles.instruction}>
              Donnez votre opinion avec des arguments et des
              exemples. Écrivez environ 180 à 250 mots.
            </p>

            <textarea
              value={answers.task3}
              onChange={(e) =>
                handleChange(
                  "task3",
                  e.target.value
                )
              }
              placeholder="Écrivez votre réponse ici..."
              style={styles.textarea}
              rows="13"
            />

            <div style={styles.wordCount}>
              {countWords(answers.task3)} mots
            </div>
          </div>

          {message && (
            <div style={styles.errorBox}>
              {message}
            </div>
          )}

          <div style={styles.submitArea}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Envoi en cours..."
                : "Envoyer mes réponses →"}
            </button>

            <p style={styles.warning}>
              ⚠️ Vérifiez vos réponses avant de les envoyer.
              Cette partie ne pourra être envoyée qu'une seule
              fois.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f4ee",
    padding: "40px 20px",
    fontFamily: '"DM Sans", Arial, sans-serif',
    color: "#0d1b2a",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  successCard: {
    maxWidth: "700px",
    margin: "80px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow:
      "0 15px 45px rgba(13,27,42,0.10)",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  logoText: {
    color: "#c9a84c",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#667085",
    fontSize: "13px",
    marginBottom: "8px",
  },

  title: {
    margin: "0 0 12px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "38px",
  },

  intro: {
    maxWidth: "650px",
    margin: "0 auto",
    color: "#667085",
    lineHeight: 1.6,
  },

  taskCard: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "22px",
    boxShadow:
      "0 8px 25px rgba(13,27,42,0.05)",
  },

  taskNumber: {
    color: "#c9a84c",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },

  taskTitle: {
    margin: "0 0 5px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "25px",
  },

  level: {
    margin: "0 0 18px",
    color: "#8a6d1d",
    fontSize: "12px",
    fontWeight: "700",
  },

  question: {
    fontSize: "15px",
    lineHeight: 1.7,
    marginBottom: "12px",
  },

  instruction: {
    background: "#f8f4ee",
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d8d1c5",
    borderRadius: "10px",
    padding: "14px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    fontSize: "14px",
    lineHeight: 1.6,
    resize: "vertical",
    outline: "none",
  },

  wordCount: {
    textAlign: "right",
    marginTop: "6px",
    color: "#667085",
    fontSize: "11px",
  },

  errorBox: {
    background: "#fdecec",
    border: "1px solid #efc2c2",
    color: "#a33a3a",
    borderRadius: "10px",
    padding: "13px",
    marginBottom: "18px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "700",
  },

  submitArea: {
    textAlign: "center",
    paddingBottom: "30px",
  },

  submitButton: {
    background: "#0d1b2a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  warning: {
    marginTop: "12px",
    color: "#667085",
    fontSize: "11px",
  },

  successIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#e8f5e9",
    color: "#24713b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    fontWeight: "800",
  },

  lockIcon: {
    fontSize: "48px",
    marginBottom: "20px",
  },

  loadingIcon: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#c9a84c",
    marginBottom: "20px",
  },

  text: {
    color: "#667085",
    lineHeight: 1.7,
  },

  infoBox: {
    marginTop: "25px",
    background: "#fff9e8",
    border: "1px solid #ead9a6",
    borderRadius: "12px",
    padding: "16px",
    color: "#66551f",
    textAlign: "left",
    fontSize: "13px",
  },

  infoText: {
    margin: "7px 0 0",
    lineHeight: 1.6,
  },

  linkArea: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
  },

  linkButton: {
    display: "inline-block",
    background: "#0d1b2a",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "10px",
    padding: "13px 22px",
    fontSize: "14px",
    fontWeight: "800",
  },

  backButton: {
    display: "inline-block",
    color: "#0d1b2a",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
  },
};
