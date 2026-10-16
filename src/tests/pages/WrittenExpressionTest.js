import {
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../../supabaseClient";

const EXAM_DURATION_SECONDS = 45 * 60;

export default function WrittenExpressionTest() {
  const [answers, setAnswers] = useState({
    task1: "",
    task2: "",
    task3: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeoutSaveFailed, setTimeoutSaveFailed] = useState(false);
  const [checkingAttempt, setCheckingAttempt] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submittedByTimeout, setSubmittedByTimeout] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [tabSwitches, setTabSwitches] = useState(0);
  const [terminatedByTabSwitch, setTerminatedByTabSwitch] =
    useState(false);

  const [accessDenied, setAccessDenied] = useState(false);
  const [accessReason, setAccessReason] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [remainingSeconds, setRemainingSeconds] =
    useState(EXAM_DURATION_SECONDS);

  const tabSwitchCountRef = useRef(0);
  const tabSwitchProcessingRef = useRef(false);
  const timerExpiredRef = useRef(false);
  const submissionStartedRef = useRef(false);

  // Keep the latest answers available without restarting the timer.
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  function getStorageKeys(id) {
    return {
      start: `ifa_expression_start_${id}`,
      draft: `ifa_expression_draft_${id}`,
    };
  }

  useEffect(() => {
    checkAccessAndAttempt();
    // Check the student's access once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        return;
      }

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

      if (studentError) {
        console.error("STUDENT PROFILE ACCESS ERROR:", studentError);
        setMessage("Impossible de vérifier votre accès au test.");
        return;
      }

      if (!student) {
        setAccessDenied(true);
        setAccessReason("no_profile");
        return;
      }

      const status = student.status || "pending";
      const paymentStatus = student.payment_status || "unpaid";

      if (status === "pending") {
        setAccessDenied(true);
        setAccessReason("pending");
        return;
      }

      if (status === "rejected") {
        setAccessDenied(true);
        setAccessReason("rejected");
        return;
      }

      if (status !== "approved") {
        setAccessDenied(true);
        setAccessReason("not_approved");
        return;
      }

      if (paymentStatus !== "paid") {
        setAccessDenied(true);
        setAccessReason("unpaid");
        return;
      }

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
        console.error("CHECK EXISTING EXPRESSION ERROR:", existingError);
        setMessage("Impossible de vérifier votre tentative.");
        return;
      }

      if (existingResult) {
        setAlreadySubmitted(true);
        return;
      }

      setStudentId(student.id);

      // Restore the saved draft and original deadline after refresh.
      const keys = getStorageKeys(student.id);

      try {
        const savedDraft = localStorage.getItem(keys.draft);

        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);

          setAnswers({
            task1: parsedDraft.task1 || "",
            task2: parsedDraft.task2 || "",
            task3: parsedDraft.task3 || "",
          });
        }

        let startTime = Number(localStorage.getItem(keys.start));

        if (!startTime || !Number.isFinite(startTime)) {
          startTime = Date.now();
          localStorage.setItem(keys.start, String(startTime));
        }

        const elapsedSeconds = Math.floor(
          (Date.now() - startTime) / 1000
        );

        setRemainingSeconds(
          Math.max(0, EXAM_DURATION_SECONDS - elapsedSeconds)
        );
      } catch (storageError) {
        console.error("RESTORE EXPRESSION DRAFT ERROR:", storageError);
      }
    } catch (error) {
      console.error("EXPRESSION ACCESS CHECK ERROR:", error);
      setMessage("Une erreur inattendue est survenue.");
    } finally {
      setCheckingAttempt(false);
    }
  }

  // Save the draft locally whenever the student's answers change.
  useEffect(() => {
    if (
      !studentId ||
      checkingAttempt ||
      submitted ||
      alreadySubmitted ||
      terminatedByTabSwitch
    ) {
      return;
    }

    try {
      const keys = getStorageKeys(studentId);

      localStorage.setItem(keys.draft, JSON.stringify(answers));
    } catch (error) {
      console.error("SAVE EXPRESSION DRAFT ERROR:", error);
    }
  }, [
    answers,
    studentId,
    checkingAttempt,
    submitted,
    alreadySubmitted,
    terminatedByTabSwitch,
  ]);

  // Count down from the original start time; refreshing won't reset it.
  useEffect(() => {
    if (
      checkingAttempt ||
      accessDenied ||
      alreadySubmitted ||
      submitted ||
      terminatedByTabSwitch ||
      !studentId
    ) {
      return;
    }

    const keys = getStorageKeys(studentId);
    const startTime = Number(localStorage.getItem(keys.start));

    if (!startTime || !Number.isFinite(startTime)) {
      return;
    }

    const deadline = startTime + EXAM_DURATION_SECONDS * 1000;

    const updateTimer = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((deadline - Date.now()) / 1000)
      );

      setRemainingSeconds(secondsLeft);

      if (secondsLeft === 0 && !timerExpiredRef.current) {
  timerExpiredRef.current = true;
  void submitAnswers(true);
}
};

updateTimer();

const intervalId = setInterval(updateTimer, 1000);

return () => clearInterval(intervalId);
    // The deadline is fixed; typing does not restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkingAttempt,
    accessDenied,
    alreadySubmitted,
    submitted,
    terminatedByTabSwitch,
    studentId,
  ]);

  // First tab switch warns; second tab switch terminates the attempt.
  useEffect(() => {
    async function handleVisibilityChange() {
      if (document.visibilityState !== "hidden") return;
      if (tabSwitchProcessingRef.current) return;
      if (submitted || alreadySubmitted || terminatedByTabSwitch) return;

      const nextCount = tabSwitchCountRef.current + 1;

      tabSwitchCountRef.current = nextCount;
      setTabSwitches(nextCount);

      if (nextCount === 1) return;

      if (nextCount >= 2) {
        tabSwitchProcessingRef.current = true;

        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            console.error("TAB SWITCH TERMINATION AUTH ERROR:", userError);
            setTerminatedByTabSwitch(true);
            return;
          }

          const currentAnswers = answersRef.current;

          const { error: insertError } = await supabase
            .from("test_results")
            .insert({
              student_id: user.id,
              score: 0,
              total_questions: 3,
              percentage: 0,
              test_type: "expression_ecrite",
              task1_answer: currentAnswers.task1.trim(),
              task2_answer: currentAnswers.task2.trim(),
              task3_answer: currentAnswers.task3.trim(),
              grading_status: "pending",
     });

          if (insertError) {
            console.error(
              "TAB SWITCH TERMINATION INSERT ERROR:",
              insertError
            );

            if (
              insertError.code === "23505" ||
              insertError.message?.toLowerCase().includes("duplicate") ||
              insertError.message?.toLowerCase().includes("unique")
            ) {
              setAlreadySubmitted(true);
              return;
            }

            setTerminatedByTabSwitch(true);
            return;
          }

          setTerminatedByTabSwitch(true);
        } catch (error) {
          console.error("TAB SWITCH TERMINATION ERROR:", error);
          setTerminatedByTabSwitch(true);
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [answers, submitted, alreadySubmitted, terminatedByTabSwitch]);

  function handleChange(task, value) {
    setAnswers((current) => {
      const nextAnswers = {
      ...current,
      [task]: value,
    };

    answersRef.current = nextAnswers;
    return nextAnswers;
  });
}

  function countWords(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }

  async function submitAnswers(timedOut = false, event = null) {
  if (event) event.preventDefault();

  const currentAnswers = answersRef.current;

  if (submissionStartedRef.current || submitted || alreadySubmitted) {
    return;
  }

  setMessage("");

    // Normal submission requires all three answers.
    // When time expires, save whatever the student has written.
    if (
      !timedOut &&
      (!currentAnswers.task1.trim() ||
      !currentAnswers.task2.trim() ||
      !currentAnswers.task3.trim())
    ) {
      setMessage("Veuillez répondre aux trois tâches.");
      return;
    }

    submissionStartedRef.current = true;
    setLoading(true);

    let savedSuccessfully = false;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage(
          "Vous devez être connecté pour envoyer votre test."
        );
        return;
      }

      const {
        data: student,
        error: studentError,
      } = await supabase
        .from("student_profiles")
        .select("id, status, payment_status")
        .eq("id", user.id)
        .maybeSingle();

      if (studentError || !student) {
        console.error("STUDENT PROFILE ERROR:", studentError);
        setMessage("Profil étudiant introuvable.");
        return;
      }

      const status = student.status || "pending";
      const paymentStatus = student.payment_status || "unpaid";

      if (status !== "approved") {
        setAccessDenied(true);
        setAccessReason(
          status === "pending"
            ? "pending"
            : status === "rejected"
              ? "rejected"
              : "not_approved"
        );
        return;
      }

      if (paymentStatus !== "paid") {
        setAccessDenied(true);
        setAccessReason("unpaid");
        return;
      }

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
        console.error("CHECK EXPRESSION ERROR:", existingError);
        setMessage("Impossible de vérifier votre tentative.");
        return;
      }

      if (existingResult) {
        setAlreadySubmitted(true);
        return;
      }

  const { error: insertError } = await supabase
    .from("test_results")
    .insert({
      student_id: student.id,
      score: 0,
      total_questions: 3,
      percentage: 0,
      test_type: "expression_ecrite",
      task1_answer: currentAnswers.task1.trim(),
      task2_answer: currentAnswers.task2.trim(),
      task3_answer: currentAnswers.task3.trim(),
      grading_status: "pending",
    });

      if (insertError) {
        console.error("EXPRESSION INSERT ERROR:", insertError);

        if (timedOut) {
          setTimeoutSaveFailed(true);
      }

        if (
          insertError.code === "23505" ||
          insertError.message?.toLowerCase().includes("duplicate") ||
          insertError.message?.toLowerCase().includes("unique")
        ) {
          setAlreadySubmitted(true);
          return;
        }

        setMessage(
          timedOut
            ? "Le temps est écoulé, mais l'enregistrement a échoué. Gardez cette page ouverte et réessayez."
            : "Impossible d'enregistrer vos réponses."
        );
        return;
      }

      savedSuccessfully = true;
      setSubmittedByTimeout(timedOut);
      setSubmitted(true);

      // Remove the local draft only after Supabase confirms the save.
      try {
        const keys = getStorageKeys(student.id);
        localStorage.removeItem(keys.draft);
        localStorage.removeItem(keys.start);
      } catch (storageError) {
        console.error("CLEAR EXPRESSION DRAFT ERROR:", storageError);
      }
    } catch (error) {
      console.error("EXPRESSION TEST ERROR:", error);

      if (timedOut) {
        setTimeoutSaveFailed(true);
      }

      setMessage(
        timedOut
          ? "Le temps est écoulé, mais l'enregistrement a échoué. Gardez cette page ouverte et réessayez."
          : "Une erreur inattendue est survenue. Vos réponses locales seront conservées."
      );
    } finally {
      setLoading(false);

      if (!savedSuccessfully) {
        submissionStartedRef.current = false;
      }
    }
  }

  function handleSubmit(event) {
    return submitAnswers(
      remainingSeconds === 0,
      event
      );
    }
    // Loading screen
  if (checkingAttempt) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>
          <div style={styles.loadingIcon}>...</div>
          <h1 style={styles.title}>Vérification en cours</h1>
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
      text = "Votre profil étudiant n'a pas été trouvé.";
      infoTitle = "Contactez l'administration";
      infoText =
        "Veuillez contacter l'International French Academy afin de vérifier votre inscription.";
    }

    if (accessReason === "pending") {
      title = "Compte en attente de validation";
      text = "Votre compte étudiant n'a pas encore été approuvé.";
      infoTitle = "Validation nécessaire";
      infoText =
        "L'équipe administrative doit d'abord approuver votre compte avant que vous puissiez accéder aux tests.";
    }

    if (accessReason === "rejected") {
      title = "Accès non autorisé";
      text = "Votre compte étudiant n'a pas été approuvé.";
      infoTitle = "Compte non approuvé";
      infoText =
        "Veuillez contacter l'équipe administrative de l'International French Academy pour plus d'informations.";
    }

    if (accessReason === "not_approved") {
      title = "Compte non approuvé";
      text = "Votre compte doit être approuvé avant de commencer le test.";
      infoTitle = "Validation nécessaire";
      infoText =
        "L'équipe administrative doit d'abord approuver votre compte.";
    }

    if (accessReason === "unpaid") {
      title = "Paiement requis";
      text = "Votre paiement n'a pas encore été confirmé.";
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
          <div style={styles.lockIcon}>🔒</div>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.text}>{text}</p>

          <div style={styles.infoBox}>
            <strong>{infoTitle}</strong>
            <p style={styles.infoText}>{infoText}</p>
          </div>

          <div style={styles.linkArea}>
            <a href="/student-dashboard" style={styles.linkButton}>
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
          <div style={styles.lockIcon}>🔒</div>
          <h1 style={styles.title}>
            Expression écrite déjà envoyée
          </h1>
          <p style={styles.text}>
            Cette partie du test a déjà été envoyée.
          </p>
          <p style={styles.text}>
            Une seule tentative est autorisée pour l'expression écrite.
          </p>

          <div style={styles.infoBox}>
            <strong>Test terminé</strong>
            <p style={styles.infoText}>
              Votre production écrite a bien été enregistrée et peut être
              consultée par l'équipe pédagogique pour correction.
            </p>
          </div>

          <div style={styles.linkArea}>
            <a href="/tests/results" style={styles.linkButton}>
              Voir mes résultats →
            </a>
            <a href="/student-dashboard" style={styles.backButton}>
              ← Retour à mon espace
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Terminated after two tab switches
  if (terminatedByTabSwitch) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>
          <div style={styles.lockIcon}>🔒</div>
          <h1 style={styles.title}>Test terminé</h1>
          <p style={styles.text}>
            Le test a été automatiquement terminé après deux changements
            d'onglet.
          </p>
          <p style={styles.text}>
            Cette tentative est considérée comme terminée.
          </p>

          <div style={styles.infoBox}>
            <strong>Test terminé</strong>
            <p style={styles.infoText}>
              Vous ne pouvez pas recommencer cette partie du test.
            </p>
          </div>

          <div style={styles.linkArea}>
            <a href="/tests/results" style={styles.linkButton}>
              Voir mes résultats →
            </a>
            <a href="/student-dashboard" style={styles.backButton}>
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
          <div style={styles.successIcon}>✓</div>

          <h1 style={styles.title}>
            Expression écrite terminée
          </h1>

          {submittedByTimeout ? (
            <p style={styles.text}>
              Le temps est écoulé. Vos réponses disponibles ont été
              enregistrées automatiquement.
            </p>
          ) : (
            <p style={styles.text}>
              Merci d'avoir envoyé vos réponses.
            </p>
          )}

          <p style={styles.text}>
            Votre production écrite sera évaluée par l'équipe pédagogique
            de l'International French Academy.
          </p>

          <div style={styles.infoBox}>
            <strong>Évaluation manuelle</strong>
            <p style={styles.infoText}>
              Cette partie est corrigée par un évaluateur afin de prendre
              en compte la qualité de votre expression, votre vocabulaire,
              votre grammaire et l'organisation de vos idées.
            </p>
          </div>

          <div style={styles.linkArea}>
            <a href="/tests/results" style={styles.linkButton}>
              Voir mes résultats →
            </a>
            <a href="/student-dashboard" style={styles.backButton}>
              ← Retour à mon espace
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main test
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

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

          <h1 style={styles.title}>Expression écrite</h1>

          <div
            style={{
              ...styles.timerBox,
              ...(remainingSeconds <= 300
                ? styles.timerUrgent
                : {}),
            }}
            aria-live="polite"
          >
            ⏱️ Temps restant :{" "}
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>

          {remainingSeconds <= 300 && remainingSeconds > 0 && (
            <div style={styles.warningBox}>
              ⚠️ Attention : il vous reste 5 minutes ou moins.
              Vérifiez vos réponses.
            </div>
          )}

          <p style={styles.intro}>
            Répondez aux trois tâches en français. Écrivez des réponses
            claires et complètes.
          </p>

          {tabSwitches === 1 && (
            <div style={styles.warningBox}>
              ⚠️ Attention : vous avez changé d'onglet. Un deuxième
              changement d'onglet terminera automatiquement le test.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* TÂCHE 1 */}
          <div style={styles.taskCard}>
            <div style={styles.taskNumber}>TÂCHE 1</div>
            <h2 style={styles.taskTitle}>Écrire un message</h2>
            <p style={styles.level}>Niveau indicatif : A1 – A2</p>

            <p style={styles.question}>
              Vous voulez proposer à un ami de faire une activité ensemble
              ce week-end. Écrivez-lui un message pour proposer l'activité,
              préciser le jour et le lieu, et lui demander s'il est
              disponible.
            </p>

            <p style={styles.instruction}>
              Écrivez environ 80 à 100 mots.
            </p>

            <textarea
              value={answers.task1}
              onChange={(e) => handleChange("task1", e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              style={styles.textarea}
              rows="8"
              disabled={loading}
            />

            <div style={styles.wordCount}>
              {countWords(answers.task1)} mots
            </div>
          </div>

          {/* TÂCHE 2 */}
          <div style={styles.taskCard}>
            <div style={styles.taskNumber}>TÂCHE 2</div>
            <h2 style={styles.taskTitle}>
              Écrire un message professionnel
            </h2>
            <p style={styles.level}>Niveau indicatif : B1 – B2</p>

            <p style={styles.question}>
              Vous devez être absent(e) de votre cours ou de votre travail
              pendant une journée. Écrivez un email pour expliquer la
              raison de votre absence, préciser la date et proposer une
              solution pour rattraper le travail ou le cours.
            </p>

            <p style={styles.instruction}>
              Écrivez environ 120 à 150 mots.
            </p>

            <textarea
              value={answers.task2}
              onChange={(e) => handleChange("task2", e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              style={styles.textarea}
              rows="10"
              disabled={loading}
            />

            <div style={styles.wordCount}>
              {countWords(answers.task2)} mots
            </div>
          </div>

          {/* TÂCHE 3 */}
          <div style={styles.taskCard}>
            <div style={styles.taskNumber}>TÂCHE 3</div>
            <h2 style={styles.taskTitle}>Donner son opinion</h2>
            <p style={styles.level}>Niveau indicatif : B2 – C1/C2</p>

            <p style={styles.question}>
              Aujourd'hui, beaucoup de personnes utilisent Internet et les
              réseaux sociaux pour communiquer, travailler et apprendre.
              Selon vous, quels sont les avantages et les inconvénients de
              cette utilisation dans la vie quotidienne ?
            </p>

            <p style={styles.instruction}>
              Donnez votre opinion avec des arguments et des exemples.
              Écrivez environ 180 à 250 mots.
            </p>

            <textarea
              value={answers.task3}
              onChange={(e) => handleChange("task3", e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              style={styles.textarea}
              rows="13"
              disabled={loading}
            />

            <div style={styles.wordCount}>
              {countWords(answers.task3)} mots
            </div>
          </div>

          {message && (
            <div style={styles.errorBox}>{message}</div>
          )}

          <div style={styles.submitArea}>
            <button
              type="submit"
              disabled={
                loading ||
                (remainingSeconds === 0 && !timeoutSaveFailed)
              }
              style={{
                ...styles.submitButton,
                opacity:
                  loading ||
                  (timeoutSaveFailed === false && remainingSeconds === 0)
                    ? 0.7
                    : 1
              }}
             >
              {loading
                ? "Enregistrement en cours..."
                : timeoutSaveFailed
                  ? "Réessayer l'enregistrement →"
                  : "Envoyer mes réponses →"}
            </button>

            <p style={styles.warning}>
              ⚠️ Vérifiez vos réponses avant de les envoyer. Cette partie
              ne pourra être envoyée qu'une seule fois.
            </p>
            <p style={styles.draftNote}>
              Vos réponses sont sauvegardées automatiquement dans ce
              navigateur pendant que vous écrivez.
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
    boxShadow: "0 15px 45px rgba(13,27,42,0.10)",
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
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: "38px",
  },

  intro: {
    maxWidth: "650px",
    margin: "18px auto 0",
    color: "#667085",
    lineHeight: 1.6,
  },

  timerBox: {
    display: "inline-block",
    marginTop: "18px",
    padding: "12px 22px",
    borderRadius: "12px",
    background: "#0d1b2a",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  timerUrgent: {
    background: "#a33a3a",
  },

  warningBox: {
    maxWidth: "650px",
    margin: "20px auto 0",
    background: "#fff9e8",
    border: "1px solid #ead9a6",
    borderRadius: "10px",
    padding: "12px 15px",
    color: "#66551f",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: 1.5,
  },

  taskCard: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "22px",
    boxShadow: "0 8px 25px rgba(13,27,42,0.05)",
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
    fontFamily: '"Playfair Display", Georgia, serif',
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
    fontFamily: '"DM Sans", Arial, sans-serif',
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

  draftNote: {
    marginTop: "8px",
    color: "#667085",
    fontSize: "12px",
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