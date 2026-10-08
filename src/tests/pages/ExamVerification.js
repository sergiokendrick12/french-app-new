import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const TEST_TYPE = "exam_verification";
const TEACHER_EMAIL = "reiuhoa@gmail.com";

const QUESTIONS = [
  {
    id: "q1a",
    section: "1. Accorde l’adjectif entre parenthèses.",
    text: "Marie est très ________. (content)",
    type: "text",
    points: 0.5,
    accepted: ["contente"],
  },
  {
    id: "q1b",
    section: "1. Accorde l’adjectif entre parenthèses.",
    text: "Les garçons sont ________. (fatigué)",
    type: "text",
    points: 0.5,
    accepted: ["fatigués"],
  },
  {
    id: "q1c",
    section: "1. Accorde l’adjectif entre parenthèses.",
    text: "Alice et Sarah sont ________. (heureux)",
    type: "text",
    points: 0.5,
    accepted: ["heureuses"],
  },
  {
    id: "q1d",
    section: "1. Accorde l’adjectif entre parenthèses.",
    text: "La voiture est ________. (rouge)",
    type: "text",
    points: 0.5,
    accepted: ["rouge"],
  },

  {
    id: "q2a",
    section: "2. Mets les phrases au féminin.",
    text: "Il est intelligent. →",
    type: "text",
    points: 1,
    accepted: [
      "elle est intelligente",
      "elle est intelligente.",
    ],
  },
  {
    id: "q2b",
    section: "2. Mets les phrases au féminin.",
    text: "Mon frère est fatigué. →",
    type: "text",
    points: 1,
    accepted: [
      "ma soeur est fatiguee",
      "ma soeur est fatiguee.",
      "ma sœur est fatiguée",
      "ma sœur est fatiguée.",
    ],
  },

  {
    id: "q3a",
    section: "3. Mets les verbes au passé composé.",
    text: "Je ________ au marché. (aller)",
    type: "text",
    points: 0.5,
    accepted: [
      "suis allé",
      "suis allée",
      "suis alle",
      "suis allee",
    ],
  },
  {
    id: "q3b",
    section: "3. Mets les verbes au passé composé.",
    text: "Nous ________ un film. (regarder)",
    type: "text",
    points: 0.5,
    accepted: ["avons regardé", "avons regarde"],
  },
  {
    id: "q3c",
    section: "3. Mets les verbes au passé composé.",
    text: "Elle ________ une lettre. (écrire)",
    type: "text",
    points: 0.5,
    accepted: ["a écrit", "a ecrit"],
  },
  {
    id: "q3d",
    section: "3. Mets les verbes au passé composé.",
    text: "Ils ________ très tôt. (partir)",
    type: "text",
    points: 0.5,
    accepted: ["sont partis"],
  },

  {
    id: "q4a",
    section: "4. Choisis la bonne réponse.",
    text: "Elle est (arrivé / arrivée) hier.",
    type: "choice",
    options: ["arrivé", "arrivée"],
    points: 0.5,
    accepted: ["arrivée"],
  },
  {
    id: "q4b",
    section: "4. Choisis la bonne réponse.",
    text: "Ils sont (parti / partis) à 8 heures.",
    type: "choice",
    options: ["parti", "partis"],
    points: 0.5,
    accepted: ["partis"],
  },
  {
    id: "q4c",
    section: "4. Choisis la bonne réponse.",
    text: "Nous avons (mangé / mangées) une pizza.",
    type: "choice",
    options: ["mangé", "mangées"],
    points: 0.5,
    accepted: ["mangé"],
  },
  {
    id: "q4d",
    section: "4. Choisis la bonne réponse.",
    text: "Marie et Sarah sont (venues / venu) chez moi.",
    type: "choice",
    options: ["venues", "venu"],
    points: 0.5,
    accepted: ["venues"],
  },

  {
    id: "q5a",
    section: "5. Corrige les erreurs.",
    text: "Elle est allé au travail. →",
    type: "text",
    points: 0.5,
    accepted: ["elle est allée au travail"],
  },
  {
    id: "q5b",
    section: "5. Corrige les erreurs.",
    text: "Les filles sont arrivé hier. →",
    type: "text",
    points: 0.5,
    accepted: ["les filles sont arrivées hier"],
  },
  {
    id: "q5c",
    section: "5. Corrige les erreurs.",
    text: "Il a mangée une pomme. →",
    type: "text",
    points: 0.5,
    accepted: ["il a mangé une pomme"],
  },
  {
    id: "q5d",
    section: "5. Corrige les erreurs.",
    text: "Nous sommes parti à 7 heures. →",
    type: "text",
    points: 0.5,
    accepted: ["nous sommes partis à 7 heures"],
  },
];

const normalizeAnswer = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ");
};

const isCorrectAnswer = (answer, accepted) => {
  const normalized = normalizeAnswer(answer);

  return accepted.some(
    (expected) => normalizeAnswer(expected) === normalized
  );
};

export default function ExamVerification() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const totalPoints = useMemo(
    () => QUESTIONS.reduce((sum, question) => sum + question.points, 0),
    []
  );

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!currentUser) {
          navigate("/student-login");
          return;
        }

        if (
          String(currentUser.email || "").toLowerCase() !==
          TEACHER_EMAIL.toLowerCase()
        ) {
          setErrorMessage(
            "Ce test de vérification est réservé au compte autorisé."
          );
          setLoading(false);
          return;
        }

        setUser(currentUser);

        const { data: profile, error: profileError } = await supabase
          .from("student_profiles")
          .select("id, full_name, email, status, payment_status")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          setErrorMessage("Profil étudiant introuvable.");
          setLoading(false);
          return;
        }

        setStudentProfile(profile);

        if (
          profile.status !== "approved" ||
          profile.payment_status !== "paid"
        ) {
          setErrorMessage(
            "Votre compte doit être approuvé et le paiement doit être confirmé."
          );
          setLoading(false);
          return;
        }

        const { data: previousResult, error: previousError } =
          await supabase
            .from("test_results")
            .select("id, score, total_questions, percentage, created_at")
            .eq("student_id", currentUser.id)
            .eq("test_type", TEST_TYPE)
            .limit(1)
            .maybeSingle();

        if (previousError) {
          throw previousError;
        }

        if (previousResult) {
          setFinished(true);
          setResult({
            score: Number(previousResult.score || 0),
            total: totalPoints,
            percentage: Number(previousResult.percentage || 0),
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement du test de vérification :",
          error
        );

        setErrorMessage(
          "Impossible de charger le test. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [navigate, totalPoints]);

  const handleAnswerChange = (questionId, value) => {
    if (finished || submitting) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (submitting || finished || !user || !studentProfile) {
      return;
    }

    const unanswered = QUESTIONS.filter(
      (question) =>
        !String(answers[question.id] || "").trim()
    );

    if (unanswered.length > 0) {
      setErrorMessage(
        `Veuillez répondre à toutes les questions. Il reste ${unanswered.length} question(s).`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      let score = 0;

      const answerDetails = QUESTIONS.map((question) => {
        const studentAnswer = answers[question.id] || "";
        const correct = isCorrectAnswer(
          studentAnswer,
          question.accepted
        );

        if (correct) {
          score += question.points;
        }

        return {
          question_id: question.id,
          question: question.text,
          answer: studentAnswer,
          correct,
          points: correct ? question.points : 0,
          max_points: question.points,
        };
      });

      const percentage = Math.round(
        (score / totalPoints) * 100
      );

      const { error: insertError } = await supabase
        .from("test_results")
        .insert({
          student_id: user.id,
          score,
          total_questions: 10,
          percentage,
          test_type: TEST_TYPE,
          answers_detail: answerDetails,
          grading_status: "graded",
          graded_at: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      setResult({
        score,
        total: totalPoints,
        percentage,
      });

      setFinished(true);
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement du test :",
        error
      );

      setErrorMessage(
        error?.message ||
          "Impossible d'enregistrer le résultat. Veuillez réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centerPage}>
        <p style={styles.loadingText}>Chargement...</p>
      </div>
    );
  }

  if (errorMessage && !user) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.errorCard}>
          <h2>Accès au test</h2>
          <p>{errorMessage}</p>
          <button
            onClick={() => navigate("/student-dashboard")}
            style={styles.backButton}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (
    user &&
    studentProfile &&
    (
      studentProfile.status !== "approved" ||
      studentProfile.payment_status !== "paid"
    )
  ) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.errorCard}>
          <h2>Accès verrouillé 🔒</h2>
          <p>{errorMessage}</p>
          <button
            onClick={() => navigate("/student-dashboard")}
            style={styles.backButton}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <img
              src="/IFA logo.jpg"
              alt="International French Academy"
              style={styles.logo}
            />

            <div>
              <div style={styles.headerTitle}>
                International French Academy
              </div>
              <div style={styles.headerSubtitle}>
                Test de vérification
              </div>
            </div>
          </div>
        </header>

        <main style={styles.main}>
          <div style={styles.resultCard}>
            <div style={styles.resultIcon}>✓</div>

            <div style={styles.eyebrow}>TEST TERMINÉ</div>

            <h1 style={styles.resultTitle}>
              Test de vérification — Français
            </h1>

            <p style={styles.resultText}>
              Voici le résultat obtenu par le candidat.
            </p>

            <div style={styles.scoreBox}>
              <div style={styles.scoreLabel}>SCORE</div>

              <div style={styles.score}>
                {result.score} / {result.total}
              </div>

              <div style={styles.percentage}>
                {result.percentage}%
              </div>
            </div>

            <p style={styles.note}>
              Ce test est un test de vérification interne. Il ne
              modifie pas le niveau officiel de l'étudiant.
            </p>

            <button
              onClick={() => navigate("/student-dashboard")}
              style={styles.primaryButton}
            >
              Retour à mon espace
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={styles.logo}
          />

          <div>
            <div style={styles.headerTitle}>
              International French Academy
            </div>
            <div style={styles.headerSubtitle}>
              Test de vérification
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.topCard}>
          <div style={styles.eyebrow}>
            TEST DE VÉRIFICATION
          </div>

          <h1 style={styles.title}>
            Test de vérification — Français
          </h1>

          <p style={styles.description}>
            Répondez aux 5 exercices suivants. Ce test contient
            10 points au total.
          </p>

          <div style={styles.infoRow}>
            <span>📝 5 exercices</span>
            <span>🎯 10 points</span>
            <span>🤖 Correction automatique</span>
          </div>
        </div>

        {errorMessage && (
          <div style={styles.warning}>
            {errorMessage}
          </div>
        )}

        <div style={styles.examCard}>
          <section style={styles.section}>
            <div style={styles.sectionTitle}>
              1. Accorde l’adjectif entre parenthèses.
              <span>2 points</span>
            </div>

            {QUESTIONS.filter((q) =>
              q.id.startsWith("q1")
            ).map((question) => (
              <QuestionInput
                key={question.id}
                question={question}
                value={answers[question.id] || ""}
                onChange={handleAnswerChange}
                disabled={submitting}
              />
            ))}
          </section>

          <section style={styles.section}>
            <div style={styles.sectionTitle}>
              2. Mets les phrases au féminin.
              <span>2 points</span>
            </div>

            {QUESTIONS.filter((q) =>
              q.id.startsWith("q2")
            ).map((question) => (
              <QuestionInput
                key={question.id}
                question={question}
                value={answers[question.id] || ""}
                onChange={handleAnswerChange}
                disabled={submitting}
              />
            ))}
          </section>

          <section style={styles.section}>
            <div style={styles.sectionTitle}>
              3. Mets les verbes au passé composé.
              <span>2 points</span>
            </div>

            {QUESTIONS.filter((q) =>
              q.id.startsWith("q3")
            ).map((question) => (
              <QuestionInput
                key={question.id}
                question={question}
                value={answers[question.id] || ""}
                onChange={handleAnswerChange}
                disabled={submitting}
              />
            ))}
          </section>

          <section style={styles.section}>
            <div style={styles.sectionTitle}>
              4. Choisis la bonne réponse.
              <span>2 points</span>
            </div>

            {QUESTIONS.filter((q) =>
              q.id.startsWith("q4")
            ).map((question) => (
              <div key={question.id} style={styles.question}>
                <div style={styles.questionText}>
                  {question.text}
                </div>

                <div style={styles.options}>
                  {question.options.map((option) => (
                    <label
                      key={option}
                      style={styles.optionLabel}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={
                          answers[question.id] === option
                        }
                        onChange={(event) =>
                          handleAnswerChange(
                            question.id,
                            event.target.value
                          )
                        }
                        disabled={submitting}
                      />

                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section style={styles.section}>
            <div style={styles.sectionTitle}>
              5. Corrige les erreurs.
              <span>2 points</span>
            </div>

            {QUESTIONS.filter((q) =>
              q.id.startsWith("q5")
            ).map((question) => (
              <QuestionInput
                key={question.id}
                question={question}
                value={answers[question.id] || ""}
                onChange={handleAnswerChange}
                disabled={submitting}
              />
            ))}
          </section>

          <div style={styles.submitArea}>
            <p style={styles.submitText}>
              Vérifiez vos réponses avant de terminer le test.
            </p>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                ...styles.submitButton,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting
                ? "Enregistrement..."
                : "Terminer le test →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
  disabled,
}) {
  return (
    <div style={styles.question}>
      <div style={styles.questionText}>
        {question.text}
      </div>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(question.id, event.target.value)
        }
        disabled={disabled}
        autoComplete="off"
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    color: "#0d1b2a",
  },

  header: {
    background: "#0d1b2a",
    color: "white",
    padding: "18px 24px",
  },

  headerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    width: "55px",
    height: "55px",
    objectFit: "contain",
    background: "white",
    borderRadius: "10px",
    padding: "4px",
  },

  headerTitle: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  headerSubtitle: {
    fontSize: "13px",
    color: "#d9e2ec",
    marginTop: "3px",
  },

  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px 70px",
  },

  topCard: {
    background: "white",
    borderRadius: "18px",
    padding: "30px",
    marginBottom: "25px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.07)",
  },

  eyebrow: {
    color: "#c9a84c",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "8px",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "30px",
  },

  description: {
    margin: 0,
    color: "#667085",
    lineHeight: "1.7",
  },

  infoRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "20px",
    color: "#475467",
    fontSize: "14px",
    fontWeight: "bold",
  },

  warning: {
    background: "#fff4e5",
    border: "1px solid #f5d98b",
    color: "#8a4b00",
    borderRadius: "12px",
    padding: "15px 18px",
    marginBottom: "20px",
  },

  examCard: {
    background: "white",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.07)",
  },

  section: {
    paddingBottom: "30px",
    marginBottom: "30px",
    borderBottom: "1px solid #eaecf0",
  },

  sectionTitle: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "center",
    marginBottom: "22px",
    fontSize: "18px",
    fontWeight: "bold",
    lineHeight: "1.5",
  },

  question: {
    marginBottom: "22px",
  },

  questionText: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "1.7",
    marginBottom: "10px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #cfd6df",
    borderRadius: "9px",
    fontSize: "16px",
    outline: "none",
    background: "white",
  },

  options: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },

  optionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 15px",
    border: "1px solid #d0d5dd",
    borderRadius: "9px",
    cursor: "pointer",
    background: "#fafafa",
  },

  submitArea: {
    textAlign: "center",
    paddingTop: "10px",
  },

  submitText: {
    color: "#667085",
    marginBottom: "18px",
  },

  submitButton: {
    background: "#0d1b2a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "15px 28px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  centerPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f7fb",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  loadingText: {
    color: "#0d1b2a",
    fontSize: "18px",
  },

  errorCard: {
    maxWidth: "500px",
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  backButton: {
    marginTop: "15px",
    background: "#0d1b2a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  resultCard: {
    maxWidth: "650px",
    margin: "50px auto",
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 8px 35px rgba(0,0,0,0.08)",
  },

  resultIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#ecfdf3",
    color: "#067647",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    fontWeight: "bold",
    margin: "0 auto 20px",
  },

  resultTitle: {
    margin: "0 0 10px",
    fontSize: "28px",
  },

  resultText: {
    color: "#667085",
    lineHeight: "1.6",
  },

  scoreBox: {
    margin: "30px 0",
    padding: "25px",
    borderRadius: "16px",
    background: "#f8f4ee",
  },

  scoreLabel: {
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#667085",
  },

  score: {
    fontSize: "44px",
    fontWeight: "bold",
    color: "#0d1b2a",
    marginTop: "8px",
  },

  percentage: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#c9a84c",
    marginTop: "4px",
  },

  note: {
    color: "#667085",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "25px",
  },

  primaryButton: {
    background: "#0d1b2a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "14px 24px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};