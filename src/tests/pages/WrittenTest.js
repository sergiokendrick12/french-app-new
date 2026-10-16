import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const questions = [
  { id: 1, section: "Les verbes au présent", level: "A1", instruction: "Conjugue le verbe entre parenthèses au présent.", text: "Je __________ au marché tous les samedis. (aller)", acceptedAnswers: ["vais"] },
  { id: 2, section: "Les verbes au présent", level: "A1", instruction: "Conjugue le verbe entre parenthèses au présent.", text: "Nous __________ le français à l’école. (étudier)", acceptedAnswers: ["étudions"] },
  { id: 3, section: "Les verbes au présent", level: "A1", instruction: "Conjugue le verbe entre parenthèses au présent.", text: "Ils __________ souvent au football. (jouer)", acceptedAnswers: ["jouent"] },
  { id: 4, section: "Les verbes au présent", level: "A1", instruction: "Conjugue le verbe entre parenthèses au présent.", text: "Tu __________ un livre intéressant. (lire)", acceptedAnswers: ["lis"] },
  { id: 5, section: "Les verbes au présent", level: "A1", instruction: "Conjugue le verbe entre parenthèses au présent.", text: "Elle __________ une belle chanson. (chanter)", acceptedAnswers: ["chante"] },
  { id: 6, section: "Les verbes au présent", level: "A1", instruction: "Conjugue le verbe entre parenthèses au présent.", text: "Vous __________ très bien français. (parler)", acceptedAnswers: ["parlez"] },
  { id: 7, section: "Les verbes au présent", level: "A1", instruction: "Complète avec le verbe faire au présent.", text: "Je __________ mes devoirs chaque soir.", acceptedAnswers: ["fais"] },
  { id: 8, section: "Les verbes au présent", level: "A1", instruction: "Complète avec le verbe voir au présent.", text: "Nous __________ nos amis tous les jours.", acceptedAnswers: ["voyons"] },
  { id: 9, section: "Le passé composé", level: "A2", instruction: "Mets le verbe entre parenthèses au passé composé.", text: "Hier, j’__________ un film. (regarder)", acceptedAnswers: ["ai regardé"] },
  { id: 10, section: "Le passé composé", level: "A2", instruction: "Mets le verbe entre parenthèses au passé composé.", text: "Elle __________ à Kigali hier matin. (arriver)", acceptedAnswers: ["est arrivée"] },
  { id: 11, section: "Le passé composé", level: "A2", instruction: "Mets le verbe entre parenthèses au passé composé.", text: "Nous __________ nos devoirs. (terminer)", acceptedAnswers: ["avons terminé"] },
  { id: 12, section: "Le passé composé", level: "A2", instruction: "Mets le verbe entre parenthèses au passé composé.", text: "Ils __________ au marché dimanche dernier. (aller)", acceptedAnswers: ["sont allés"] },
  { id: 13, section: "Le passé composé", level: "A2", instruction: "Mets le verbe entre parenthèses au passé composé.", text: "Tu __________ ton petit-déjeuner ? (prendre)", acceptedAnswers: ["as pris"] },
  { id: 14, section: "Le passé composé", level: "A2", instruction: "Mets le verbe entre parenthèses au passé composé.", text: "Marie __________ une lettre à sa mère. (écrire)", acceptedAnswers: ["a écrit"] },
  { id: 15, section: "Le passé composé", level: "A2", instruction: "Mets toute la phrase au passé composé.", text: "Je mange une pomme.", acceptedAnswers: ["j'ai mangé une pomme"] },
  { id: 16, section: "Le passé composé", level: "A2", instruction: "Mets toute la phrase au passé composé.", text: "Nous allons à l’école.", acceptedAnswers: ["nous sommes allés à l'école", "nous sommes allées à l'école"] },
  { id: 17, section: "Le futur simple", level: "A2", instruction: "Mets le verbe entre parenthèses au futur simple.", text: "Demain, je __________ mes grands-parents. (visiter)", acceptedAnswers: ["visiterai"] },
  { id: 18, section: "Le futur simple", level: "A2", instruction: "Mets le verbe entre parenthèses au futur simple.", text: "Nous __________ nos examens la semaine prochaine. (passer)", acceptedAnswers: ["passerons"] },
  { id: 19, section: "Le futur simple", level: "A2", instruction: "Mets le verbe entre parenthèses au futur simple.", text: "Elle __________ médecin plus tard. (être)", acceptedAnswers: ["sera"] },
  { id: 20, section: "Le futur simple", level: "A2", instruction: "Mets le verbe entre parenthèses au futur simple.", text: "Ils __________ une nouvelle maison. (acheter)", acceptedAnswers: ["achèteront"] },
  { id: 21, section: "Le futur simple", level: "A2", instruction: "Mets le verbe entre parenthèses au futur simple.", text: "Tu __________ beaucoup de choses demain. (apprendre)", acceptedAnswers: ["apprendras"] },
  { id: 22, section: "Le futur simple", level: "A2", instruction: "Conjugue le verbe venir au futur simple.", text: "Vous __________ demain matin.", acceptedAnswers: ["viendrez"] },
  { id: 23, section: "Le futur simple", level: "A2", instruction: "Mets toute la phrase au futur simple.", text: "Je fais mes devoirs.", acceptedAnswers: ["je ferai mes devoirs"] },
  { id: 24, section: "Le futur proche", level: "A2", instruction: "Mets le verbe entre parenthèses au futur proche.", text: "Je __________ manger maintenant. (manger)", acceptedAnswers: ["vais manger"] },
  { id: 25, section: "Le futur proche", level: "A2", instruction: "Mets le verbe entre parenthèses au futur proche.", text: "Nous __________ regarder un film ce soir. (regarder)", acceptedAnswers: ["allons regarder"] },
  { id: 26, section: "Le futur proche", level: "A2", instruction: "Mets le verbe entre parenthèses au futur proche.", text: "Elle __________ une nouvelle robe. (acheter)", acceptedAnswers: ["va acheter"] },
  { id: 27, section: "Le futur proche", level: "A2", instruction: "Mets le verbe entre parenthèses au futur proche.", text: "Ils __________ au football. (jouer)", acceptedAnswers: ["vont jouer"] },
  { id: 28, section: "Le futur proche", level: "A2", instruction: "Mets la phrase au futur proche.", text: "Tu fais tes devoirs.", acceptedAnswers: ["tu vas faire tes devoirs"] },
  { id: 29, section: "Le futur proche", level: "A2", instruction: "Mets la phrase au futur proche.", text: "Nous visitons le musée.", acceptedAnswers: ["nous allons visiter le musée"] },
  { id: 30, section: "Les pronoms", level: "A2", instruction: "Remplace le groupe souligné par un pronom personnel.", text: "Marie parle à Paul.", acceptedAnswers: ["elle parle à paul", "elle parle a paul"] },
  { id: 31, section: "Les pronoms", level: "A2", instruction: "Remplace le groupe souligné par un pronom personnel.", text: "Paul et Jean jouent au football.", acceptedAnswers: ["ils jouent au football"] },
  { id: 32, section: "Les pronoms", level: "A2", instruction: "Remplace le groupe souligné par un pronom.", text: "Je parle à Marie.", acceptedAnswers: ["je lui parle"] },
  { id: 33, section: "Les pronoms", level: "A2", instruction: "Remplace le groupe souligné par un pronom.", text: "Je regarde les enfants.", acceptedAnswers: ["je les regarde"] },
  { id: 34, section: "Les pronoms", level: "A2", instruction: "Remplace le groupe souligné par un pronom.", text: "Je parle à mes parents.", acceptedAnswers: ["je leur parle"] },
  { id: 35, section: "Les pronoms", level: "A2", instruction: "Remplace le groupe souligné par un pronom.", text: "Nous aimons Marie.", acceptedAnswers: ["nous l'aimons", "nous laimons", "nous l aimons"] },
  { id: 36, section: "Les déterminants", level: "A2", instruction: "Complète avec le déterminant qui convient.", text: "__________ garçon joue dans le jardin.", acceptedAnswers: ["un", "le"] },
  { id: 37, section: "Les déterminants", level: "A2", instruction: "Complète avec le déterminant qui convient.", text: "J’ai acheté __________ pommes.", acceptedAnswers: ["des"] },
  { id: 38, section: "Les déterminants", level: "A2", instruction: "Complète avec le déterminant qui convient.", text: "__________ maison est très grande.", acceptedAnswers: ["la", "une"] },
  { id: 39, section: "Les déterminants", level: "A2", instruction: "Complète avec le déterminant qui convient.", text: "Il mange __________ pain.", acceptedAnswers: ["du"] },
  { id: 40, section: "Les déterminants", level: "A2", instruction: "Complète avec le déterminant qui convient.", text: "Nous avons __________ voiture rouge.", acceptedAnswers: ["une"] },
  { id: 41, section: "Ce, cet, cette, ces", level: "A2", instruction: "Complète avec ce, cet, cette ou ces.", text: "__________ garçon est mon frère.", acceptedAnswers: ["ce"] },
  { id: 42, section: "Ce, cet, cette, ces", level: "A2", instruction: "Complète avec ce, cet, cette ou ces.", text: "__________ arbre est très vieux.", acceptedAnswers: ["cet"] },
  { id: 43, section: "Ce, cet, cette, ces", level: "A2", instruction: "Complète avec ce, cet, cette ou ces.", text: "__________ fille est ma sœur.", acceptedAnswers: ["cette"] },
  { id: 44, section: "Ce, cet, cette, ces", level: "A2", instruction: "Complète avec ce, cet, cette ou ces.", text: "__________ livres sont intéressants.", acceptedAnswers: ["ces"] },
  { id: 45, section: "Les prépositions", level: "A2", instruction: "Complète avec la préposition qui convient.", text: "Je vais __________ l’école.", acceptedAnswers: ["à"] },
  { id: 46, section: "Les prépositions", level: "A2", instruction: "Complète avec la préposition qui convient.", text: "Le livre est __________ la table.", acceptedAnswers: ["sur"] },
  { id: 47, section: "Les prépositions", level: "A2", instruction: "Complète avec la préposition qui convient.", text: "Je vais au marché __________ ma mère.", acceptedAnswers: ["avec"] },
  { id: 48, section: "Les conjonctions", level: "A2", instruction: "Complète avec une conjonction qui convient.", text: "Je veux sortir __________ il pleut.", acceptedAnswers: ["mais"] },
  { id: 49, section: "Les conjonctions", level: "A2", instruction: "Complète avec une conjonction qui convient.", text: "Paul aime le thé __________ le café.", acceptedAnswers: ["et"] },
  { id: 50, section: "Les conjonctions", level: "A2", instruction: "Complète avec une conjonction qui convient.", text: "Je reste à la maison __________ je suis malade.", acceptedAnswers: ["parce que", "car"] },
];

const TEST_DURATION = 2 * 60 * 60;
const TEST_TYPE = "comprehension_ecrite";
const MAX_TAB_SWITCHES = 2;

function normalizeAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?,;:]+$/g, "");
}

function isAnswerCorrect(studentAnswer, acceptedAnswers = []) {
  const normalizedStudentAnswer = normalizeAnswer(studentAnswer);
  if (!normalizedStudentAnswer) return false;

  return acceptedAnswers.some(
    (answer) => normalizeAnswer(answer) === normalizedStudentAnswer
  );
}

function numericAnswersFromStored(stored) {
  const result = {};

  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return result;
  }

  Object.entries(stored).forEach(([key, value]) => {
    if (/^\d+$/.test(key) && typeof value === "string") {
      result[key] = value;
    }
  });

  return result;
}

export default function WrittenTest() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [draftAnswer, setDraftAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [resultScore, setResultScore] = useState(null);
  const [resultPercentage, setResultPercentage] = useState(null);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [terminationReason, setTerminationReason] = useState(null);

  const attemptRef = useRef(null);
  const tabSwitchProcessingRef = useRef(false);
  const submitStartedRef = useRef(false);
  const completedRef = useRef(false);
  const answersRef = useRef({});
  const draftAnswerRef = useRef("");
  const currentQuestionRef = useRef(0);
  const studentIdRef = useRef(null);
  const storedAnswersRef = useRef({});
  const saveQueueRef = useRef(Promise.resolve());
  const visibilityCountedRef = useRef(false);

  const question = questions[currentQuestion];

  const answeredCount = useMemo(
    () =>
      questions.filter((item) => {
        const answer = answers[item.id];
        return answer !== undefined && answer !== null && answer !== "";
      }).length,
    [answers]
  );

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    draftAnswerRef.current = draftAnswer;
  }, [draftAnswer]);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    studentIdRef.current = studentId;
  }, [studentId]);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  const saveStoredAnswers = useCallback(
    (snapshot, attemptId = attemptRef.current?.id) => {
      if (!attemptId) {
        return Promise.reject(new Error("Tentative introuvable."));
      }

      const operation = saveQueueRef.current.then(async () => {
        const { data, error } = await supabase
          .from("written_test_attempts")
          .update({ answers: snapshot })
          .eq("id", attemptId)
          .eq("status", "in_progress")
          .select("id, status, answers")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          throw new Error(
            "La tentative n’est plus active ; réponse non enregistrée."
          );
        }

        storedAnswersRef.current = data.answers || snapshot;

        console.log(
          "IFA WRITTEN TEST — Answers saved:",
          data.answers || snapshot
        );
      });

      saveQueueRef.current = operation.catch(() => {});
      return operation;
    },
    []
  );

  useEffect(() => {
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAccess() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/student-login", { replace: true });
        return;
      }

      const { data: student, error: studentError } = await supabase
        .from("student_profiles")
        .select("id, status, payment_status")
        .eq("id", user.id)
        .maybeSingle();

      if (studentError) throw studentError;

      if (!student) {
        setMessage("Profil étudiant introuvable.");
        return;
      }

      if (student.status !== "approved") {
        setMessage(
          "Votre compte doit être approuvé par l’administration avant de passer ce test."
        );
        return;
      }

      if (student.payment_status !== "paid") {
        setMessage(
          "Le paiement doit être confirmé par l’administration avant de passer ce test."
        );
        return;
      }

      setStudentId(student.id);
      studentIdRef.current = student.id;

      const { data: existingResult, error: resultError } = await supabase
        .from("test_results")
        .select("id, score, total_questions, percentage, termination_reason")
        .eq("student_id", student.id)
        .eq("test_type", TEST_TYPE)
        .maybeSingle();

      if (resultError) throw resultError;

      if (existingResult) {
        setResultScore(existingResult.score);
        setResultPercentage(existingResult.percentage ?? null);
        setTerminationReason(existingResult.termination_reason || null);
        setCompleted(true);
        completedRef.current = true;
        return;
      }

      const attemptSelect =
        "id, status, started_at, finished_at, tab_switches, termination_reason, answers";

      const { data: existingAttempt, error: attemptError } = await supabase
        .from("written_test_attempts")
        .select(attemptSelect)
        .eq("student_id", student.id)
        .maybeSingle();

      if (attemptError) throw attemptError;

      if (existingAttempt?.status === "finished") {
        attemptRef.current = existingAttempt;
        setTabSwitches(Number(existingAttempt.tab_switches || 0));
        setTerminationReason(existingAttempt.termination_reason || null);
        setCompleted(true);
        completedRef.current = true;
        return;
      }

      let activeAttempt = existingAttempt;

      if (!activeAttempt) {
        const { data: newAttempt, error: createError } = await supabase
          .from("written_test_attempts")
          .insert({
            student_id: student.id,
            status: "in_progress",
            tab_switches: 0,
            answers: {},
          })
          .select(attemptSelect)
          .single();

        if (createError) {
          if (createError.code === "23505") {
            const { data: racedAttempt, error: raceError } = await supabase
              .from("written_test_attempts")
              .select(attemptSelect)
              .eq("student_id", student.id)
              .maybeSingle();

            if (raceError || !racedAttempt) {
              throw raceError || createError;
            }

            activeAttempt = racedAttempt;
          } else {
            throw createError;
          }
        } else {
          activeAttempt = newAttempt;
        }
      }

      if (activeAttempt.status === "finished") {
        attemptRef.current = activeAttempt;
        setTabSwitches(Number(activeAttempt.tab_switches || 0));
        setTerminationReason(activeAttempt.termination_reason || null);
        setCompleted(true);
        completedRef.current = true;
        return;
      }

      attemptRef.current = activeAttempt;

      const stored =
        activeAttempt.answers &&
        typeof activeAttempt.answers === "object" &&
        !Array.isArray(activeAttempt.answers)
          ? activeAttempt.answers
          : {};

      storedAnswersRef.current = stored;

      const restoredAnswers = numericAnswersFromStored(stored);
      answersRef.current = restoredAnswers;
      setAnswers(restoredAnswers);

      const draftQuestionId = Number(stored._draftQuestionId);
      const savedDraft =
        typeof stored._draftAnswer === "string" ? stored._draftAnswer : "";

      const draftIndex = questions.findIndex(
        (item) => item.id === draftQuestionId
      );

      if (
        draftIndex !== -1 &&
        !Object.prototype.hasOwnProperty.call(
          restoredAnswers,
          draftQuestionId
        )
      ) {
        currentQuestionRef.current = draftIndex;
        setCurrentQuestion(draftIndex);
        draftAnswerRef.current = savedDraft;
        setDraftAnswer(savedDraft);
      } else {
        const firstUnanswered = questions.findIndex(
          (item) =>
            !Object.prototype.hasOwnProperty.call(restoredAnswers, item.id)
        );

        const resumeIndex =
          firstUnanswered === -1 ? questions.length - 1 : firstUnanswered;

        currentQuestionRef.current = resumeIndex;
        setCurrentQuestion(resumeIndex);

        const resumeDraft =
          typeof stored._draftAnswer === "string" &&
          Number(stored._draftQuestionId) === questions[resumeIndex].id
            ? stored._draftAnswer
            : "";

        draftAnswerRef.current = resumeDraft;
        setDraftAnswer(resumeDraft);
      }

      const savedSwitches = Number(activeAttempt.tab_switches || 0);
      setTabSwitches(savedSwitches);

      const { data: serverTime, error: serverTimeError } =
        await supabase.rpc("get_server_time");

      if (serverTimeError) throw serverTimeError;

      const startedAt = new Date(activeAttempt.started_at).getTime();
      const serverNow = new Date(serverTime).getTime();

      if (!Number.isFinite(startedAt) || !Number.isFinite(serverNow)) {
        throw new Error("Impossible de vérifier l’heure de début du test.");
      }

      const elapsedSeconds = Math.max(
        0,
        Math.floor((serverNow - startedAt) / 1000)
      );

      const remainingSeconds = Math.max(
        0,
        TEST_DURATION - elapsedSeconds
      );

      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        window.setTimeout(() => handleSubmit(true, "time"), 0);
      }
    } catch (error) {
      console.error("WRITTEN TEST ACCESS ERROR:", error);
      setMessage(
        "Impossible de vérifier ou de démarrer votre test. Veuillez réessayer ou contacter l’administration."
      );
    } finally {
      setLoading(false);
    }
  }

  function calculateScore(finalAnswers) {
    let correct = 0;

    questions.forEach((item) => {
      if (isAnswerCorrect(finalAnswers[item.id], item.acceptedAnswers)) {
        correct += 1;
      }
    });

    return {
      score: correct,
      percentage: Math.round((correct / questions.length) * 100),
    };
  }

  async function persistCurrentDraft() {
    const activeQuestion = questions[currentQuestionRef.current];

    if (!activeQuestion || !attemptRef.current?.id) return;

    const currentDraft = draftAnswerRef.current;

    const snapshot = {
      ...storedAnswersRef.current,
      _draftQuestionId: activeQuestion.id,
      _draftAnswer: currentDraft,
    };

    // Keep the latest draft available to submission immediately.
    storedAnswersRef.current = snapshot;

    await saveStoredAnswers(snapshot, attemptRef.current.id);
  }

  async function processTabSwitch() {
    if (
      tabSwitchProcessingRef.current ||
      submitStartedRef.current ||
      completedRef.current ||
      !attemptRef.current
    ) {
      return;
    }

    tabSwitchProcessingRef.current = true;

    try {
      // Persist the current draft before recording the tab switch.
      await persistCurrentDraft();

      // Wait for all queued answer writes to finish.
      await saveQueueRef.current;

      const attempt = attemptRef.current;
      const currentSwitches = Number(attempt.tab_switches || 0);
      const nextCount = Math.min(
        currentSwitches + 1,
        MAX_TAB_SWITCHES
      );

      if (nextCount === 1) {
        const { data: updatedAttempt, error } = await supabase
          .from("written_test_attempts")
          .update({ tab_switches: 1 })
          .eq("id", attempt.id)
          .eq("status", "in_progress")
          .select(
            "id, status, started_at, finished_at, tab_switches, termination_reason, answers"
          )
          .maybeSingle();

        if (error) throw error;

        if (!updatedAttempt) {
          throw new Error("La tentative n’est plus active.");
        }

        attemptRef.current = updatedAttempt;
        setTabSwitches(1);
        return;
      }

      setTabSwitches(MAX_TAB_SWITCHES);
      await handleSubmit(true, "tab_switch");
    } catch (error) {
      console.error("TAB SWITCH ERROR:", error);
      setMessage(
        "Impossible d’enregistrer le changement d’onglet. Vérifiez votre connexion et contactez l’administration si le problème persiste."
      );
    } finally {
      tabSwitchProcessingRef.current = false;
    }
  }

  useEffect(() => {
    if (loading || completed || submitting) return undefined;

    if (timeLeft <= 0) {
      handleSubmit(true, "time");
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, completed, submitting, timeLeft]);

  useEffect(() => {
    if (loading || completed || submitting || !attemptRef.current) {
      return undefined;
    }

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        !visibilityCountedRef.current
      ) {
        visibilityCountedRef.current = true;
        processTabSwitch();
      } else if (document.visibilityState === "visible") {
        visibilityCountedRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, completed, submitting, Boolean(attemptRef.current?.id)]);

  function handleAnswerChange(value) {
    if (submitting || completedRef.current) return;

    setDraftAnswer(value);
    draftAnswerRef.current = value;
    setMessage("");

    const activeQuestion = questions[currentQuestionRef.current];

    if (!activeQuestion || !attemptRef.current?.id) return;

    const snapshot = {
      ...storedAnswersRef.current,
      _draftQuestionId: activeQuestion.id,
      _draftAnswer: value,
    };

    storedAnswersRef.current = snapshot;

    saveStoredAnswers(snapshot).catch((error) => {
      console.error("SAVE DRAFT ERROR:", error);
      setMessage(
        "La réponse n’a pas encore été enregistrée sur le serveur. Vérifiez votre connexion avant de continuer."
      );
    });
  }
    async function saveCurrentAnswer() {
    const activeQuestion = questions[currentQuestionRef.current];
    const value = draftAnswerRef.current.trim();

    if (!activeQuestion) return false;

    if (!value) {
      setMessage("Veuillez saisir une réponse avant de continuer.");
      return false;
    }

    const updatedAnswers = {
      ...answersRef.current,
      [activeQuestion.id]: value,
    };

    const snapshot = { ...storedAnswersRef.current };

    delete snapshot._draftQuestionId;
    delete snapshot._draftAnswer;

    snapshot[activeQuestion.id] = value;

    try {
      setMessage("");

      await saveStoredAnswers(snapshot);

      storedAnswersRef.current = snapshot;
      answersRef.current = updatedAnswers;
      setAnswers(updatedAnswers);

      return true;
    } catch (error) {
      console.error("SAVE ANSWER ERROR:", error);
      setMessage(
        "Impossible d’enregistrer votre réponse. Vérifiez votre connexion et réessayez."
      );
      return false;
    }
  }

  async function goNext() {
    if (submitting || completedRef.current) return;

    const activeQuestion = questions[currentQuestionRef.current];
    if (!activeQuestion) return;

    const alreadyAnswered = Object.prototype.hasOwnProperty.call(
      answersRef.current,
      activeQuestion.id
    );

    if (!alreadyAnswered && !(await saveCurrentAnswer())) return;

    if (currentQuestionRef.current < questions.length - 1) {
      const nextQuestion = currentQuestionRef.current + 1;

      currentQuestionRef.current = nextQuestion;
      setCurrentQuestion(nextQuestion);

      const nextDraft =
        answersRef.current[questions[nextQuestion].id] || "";

      draftAnswerRef.current = nextDraft;
      setDraftAnswer(nextDraft);
      setMessage("");

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  async function handleSubmit(autoSubmit = false, reason = "completed") {
    if (submitStartedRef.current || completedRef.current) return;

    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Voulez-vous vraiment terminer le test ? Cette action est définitive."
      );

      if (!confirmed) return;
    }

    submitStartedRef.current = true;
    setSubmitting(true);
    setMessage("");

    try {
      const activeStudentId = studentIdRef.current;
      const attempt = attemptRef.current;

      if (!activeStudentId || !attempt?.id) {
        throw new Error(
          "Votre session étudiant ou votre tentative est introuvable."
        );
      }

      // Capture all committed answers and the current unsaved draft.
      const currentQuestionItem = questions[currentQuestionRef.current];
      const currentDraft = draftAnswerRef.current;

      const snapshot = { ...storedAnswersRef.current };

      Object.assign(snapshot, answersRef.current);

      if (
        currentQuestionItem &&
        currentDraft.trim() &&
        !Object.prototype.hasOwnProperty.call(
          answersRef.current,
          currentQuestionItem.id
        )
      ) {
        snapshot[currentQuestionItem.id] = currentDraft.trim();
      }

      delete snapshot._draftQuestionId;
      delete snapshot._draftAnswer;

      // Wait for pending writes and persist the final answer snapshot.
      await saveQueueRef.current;
      await saveStoredAnswers(snapshot, attempt.id);

      storedAnswersRef.current = snapshot;

      // Read the persisted answers before calculating the score.
      const {
        data: freshAttempt,
        error: freshAttemptError,
      } = await supabase
        .from("written_test_attempts")
        .select("id, status, tab_switches, termination_reason, answers")
        .eq("id", attempt.id)
        .single();

      if (freshAttemptError) throw freshAttemptError;

      const finalAnswers = numericAnswersFromStored(
        freshAttempt.answers || snapshot
      );

      const { score: finalScore, percentage: finalPercentage } =
        calculateScore(finalAnswers);

      const finalTerminationReason =
        reason === "tab_switch"
          ? "tab_switch"
          : reason === "time"
            ? "time"
            : null;

      // Do not create a duplicate result.
      const {
        data: existingResult,
        error: lookupError,
      } = await supabase
        .from("test_results")
        .select("id, score, total_questions, percentage, termination_reason")
        .eq("student_id", activeStudentId)
        .eq("test_type", TEST_TYPE)
        .maybeSingle();

      if (lookupError) throw lookupError;

      let savedResult = existingResult;

      if (!savedResult) {
        const {
          data: insertedResult,
          error: insertError,
        } = await supabase
          .from("test_results")
          .insert({
            student_id: activeStudentId,
            score: finalScore,
            total_questions: questions.length,
            percentage: finalPercentage,
            test_type: TEST_TYPE,
            ...(finalTerminationReason
              ? { termination_reason: finalTerminationReason }
              : {}),
          })
          .select(
            "id, score, total_questions, percentage, termination_reason"
          )
          .single();

        if (insertError) {
          if (insertError.code === "23505") {
            const {
              data: racedResult,
              error: racedResultError,
            } = await supabase
              .from("test_results")
              .select(
                "id, score, total_questions, percentage, termination_reason"
              )
              .eq("student_id", activeStudentId)
              .eq("test_type", TEST_TYPE)
              .maybeSingle();

            if (racedResultError || !racedResult) {
              throw racedResultError || insertError;
            }

            savedResult = racedResult;
          } else {
            throw insertError;
          }
        } else {
          savedResult = insertedResult;
        }
      }

      // Mark the attempt finished only after saving the result.
      const finishReason =
        reason === "tab_switch"
          ? "tab_switch"
          : reason === "time"
            ? "time"
            : "completed";

      const {
        data: finishedAttempt,
        error: finishError,
      } = await supabase
        .from("written_test_attempts")
        .update({
          status: "finished",
          finished_at: new Date().toISOString(),
          tab_switches:
            reason === "tab_switch"
              ? MAX_TAB_SWITCHES
              : Number(freshAttempt.tab_switches || 0),
          termination_reason: finishReason,
          answers: finalAnswers,
        })
        .eq("id", attempt.id)
        .eq("status", "in_progress")
        .select(
          "id, status, started_at, finished_at, tab_switches, termination_reason, answers"
        )
        .maybeSingle();

      if (finishError) throw finishError;

      if (!finishedAttempt) {
        // A concurrent submission may already have finished the attempt.
        const {
          data: verifyAttempt,
          error: verifyError,
        } = await supabase
          .from("written_test_attempts")
          .select("id, status, tab_switches, termination_reason, answers")
          .eq("id", attempt.id)
          .single();

        if (verifyError) throw verifyError;

        if (verifyAttempt.status !== "finished") {
          throw new Error("La tentative n’a pas été confirmée comme terminée.");
        }

        attemptRef.current = verifyAttempt;
      } else {
        attemptRef.current = finishedAttempt;
      }

      setAnswers(finalAnswers);
      answersRef.current = finalAnswers;
      storedAnswersRef.current = finalAnswers;

      setResultScore(savedResult.score);
      setResultPercentage(savedResult.percentage ?? null);
      setTerminationReason(
        savedResult.termination_reason ||
          finalTerminationReason ||
          (reason === "time" ? "time" : "completed")
      );

      setCompleted(true);
      completedRef.current = true;
    } catch (error) {
      console.error("WRITTEN TEST SUBMIT ERROR:", error);

      setMessage(
        "Impossible de confirmer l’enregistrement de votre examen. Vérifiez votre connexion et contactez l’administration. Ne relancez pas une nouvelle tentative."
      );

      submitStartedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.panel}>
          <div style={styles.brand}>INTERNATIONAL FRENCH ACADEMY</div>
          <div style={styles.spinner} />
          <h1 style={styles.heading}>Vérification de votre accès...</h1>
          <p style={styles.muted}>
            Veuillez patienter quelques instants.
          </p>
        </div>
      </div>
    );
  }

  if (message && !completed && !attemptRef.current) {
    return (
      <div style={styles.page}>
        <div style={styles.panel}>
          <div style={styles.errorIcon}>!</div>
          <h1 style={styles.heading}>Accès au test</h1>
          <p style={styles.errorText}>{message}</p>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/student-dashboard")}
          >
            Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    const stoppedForTabSwitch = terminationReason === "tab_switch";
    const stoppedForTime =
      terminationReason === "time" ||
      terminationReason === "time_expired";

    return (
      <div style={styles.page}>
        <div style={styles.panel}>
          <div style={styles.brand}>INTERNATIONAL FRENCH ACADEMY</div>

          <div
            style={
              stoppedForTabSwitch
                ? styles.errorIcon
                : styles.successIcon
            }
          >
            {stoppedForTabSwitch ? "!" : "✓"}
          </div>

          <h1 style={styles.heading}>
            {stoppedForTabSwitch
              ? "Test interrompu"
              : stoppedForTime
                ? "Temps écoulé"
                : "Compréhension écrite terminée"}
          </h1>

          <p
            style={
              stoppedForTabSwitch
                ? styles.errorText
                : styles.muted
            }
          >
            {stoppedForTabSwitch
              ? "Votre tentative a été terminée après deux changements d’onglet. Contactez l’administration si vous pensez qu’il s’agit d’une erreur."
              : stoppedForTime
                ? "Le temps de deux heures est écoulé. Votre résultat a été enregistré."
                : "Votre résultat a été enregistré. Une seule tentative est autorisée."}
          </p>

          {resultScore !== null && (
            <div style={styles.scoreCard}>
              <span style={styles.scoreLabel}>VOTRE RÉSULTAT</span>
              <strong style={styles.scoreValue}>
                {resultScore} / {questions.length}
              </strong>
              {resultPercentage !== null && (
                <span style={styles.muted}>
                  {resultPercentage}%
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/tests/results")}
          >
            Voir mes résultats
          </button>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/student-dashboard")}
          >
            Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }

  const answerLocked = Object.prototype.hasOwnProperty.call(
    answers,
    question.id
  );

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <header style={styles.header}>
          <div style={styles.brand}>INTERNATIONAL FRENCH ACADEMY</div>
          <p style={styles.subtitle}>Évaluation de positionnement</p>
          <h1 style={styles.heading}>Compréhension écrite</h1>
          <p style={styles.intro}>
            Répondez aux 50 questions. Une fois enregistrée, une réponse ne
            peut plus être modifiée.
          </p>
        </header>

        {tabSwitches === 1 && (
          <div style={styles.warningBanner}>
            <strong>Premier avertissement :</strong> vous avez quitté
            l’onglet du test. Un deuxième changement d’onglet terminera
            votre tentative.
          </div>
        )}

        <section style={styles.progressCard}>
          <div style={styles.progressInfo}>
            <span>
              Question {currentQuestion + 1} sur {questions.length}
            </span>
            <span>{answeredCount} réponse(s) enregistrée(s)</span>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressBar,
                width: `${
                  ((currentQuestion + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>

          <div style={styles.examMeta}>
            <span style={styles.sectionBadge}>{question.section}</span>

            <div
              style={{
                ...styles.timer,
                ...(timeLeft <= 300 ? styles.timerWarning : {}),
              }}
            >
              <span style={styles.timerLabel}>Temps restant</span>
              <strong>{formatTime(timeLeft)}</strong>
            </div>
          </div>
        </section>

        <section style={styles.questionCard}>
          <div style={styles.questionNumber}>
            QUESTION {currentQuestion + 1}
          </div>

          <p style={styles.instruction}>{question.instruction}</p>
          <h2 style={styles.questionText}>{question.text}</h2>

          <label
            htmlFor="written-test-answer"
            style={styles.answerLabel}
          >
            Votre réponse
          </label>

          <input
            id="written-test-answer"
            type="text"
            value={answerLocked ? answers[question.id] : draftAnswer}
            onChange={(event) => handleAnswerChange(event.target.value)}
            disabled={answerLocked || submitting}
            autoComplete="off"
            spellCheck={false}
            placeholder={
              answerLocked
                ? "Réponse enregistrée"
                : "Écrivez votre réponse ici..."
            }
            style={{
              ...styles.answerInput,
              ...(answerLocked ? styles.answerInputLocked : {}),
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                currentQuestion < questions.length - 1 &&
                !answerLocked &&
                !submitting
              ) {
                event.preventDefault();
                goNext();
              }
            }}
          />

          {answerLocked && (
            <p style={styles.lockedMessage}>
              ✓ Réponse enregistrée — cette réponse ne peut plus être
              modifiée.
            </p>
          )}

          {message && (
            <p role="alert" style={styles.errorText}>
              {message}
            </p>
          )}
        </section>

        <div style={styles.navigation}>
          {currentQuestion > 0 ? (
            <button
              type="button"
              style={styles.secondaryButton}
              disabled={submitting}
              onClick={() => {
                const previousQuestion = currentQuestion - 1;

                setCurrentQuestion(previousQuestion);
                currentQuestionRef.current = previousQuestion;

                const previousDraft =
                  answers[questions[previousQuestion].id] || "";

                setDraftAnswer(previousDraft);
                draftAnswerRef.current = previousDraft;
                setMessage("");

                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ← Précédent
            </button>
          ) : (
            <span />
          )}

          {currentQuestion < questions.length - 1 ? (
            <button
              type="button"
              style={styles.primaryButton}
              onClick={goNext}
              disabled={submitting}
            >
              {answerLocked
                ? "Question suivante →"
                : "Enregistrer et continuer →"}
            </button>
          ) : (
            <button
              type="button"
              style={styles.submitButton}
              onClick={() => handleSubmit(false, "completed")}
              disabled={submitting}
            >
              {submitting
                ? "Enregistrement..."
                : "Terminer le test ✓"}
            </button>
          )}
        </div>

        <section style={styles.questionGrid}>
          {questions.map((item, index) => {
            const isAnswered = Object.prototype.hasOwnProperty.call(
              answers,
              item.id
            );

            return (
              <button
                type="button"
                key={item.id}
                title={`Question ${index + 1}`}
                aria-label={`Aller à la question ${index + 1}`}
                style={{
                  ...styles.questionDot,
                  ...(index === currentQuestion
                    ? styles.activeDot
                    : {}),
                  ...(isAnswered ? styles.answeredDot : {}),
                }}
                disabled={submitting}
                onClick={() => {
                  const nextIndex = index;

                  setCurrentQuestion(nextIndex);
                  currentQuestionRef.current = nextIndex;

                  const nextDraft =
                    answers[item.id] ||
                    (Number(storedAnswersRef.current._draftQuestionId) ===
                    item.id
                      ? storedAnswersRef.current._draftAnswer || ""
                      : "");

                  setDraftAnswer(nextDraft);
                  draftAnswerRef.current = nextDraft;
                  setMessage("");

                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </section>

        <p style={styles.footerWarning}>
          Important : ne quittez pas la page de l’examen. Après deux
          changements d’onglet, votre tentative sera terminée.
        </p>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f5f9",
    padding: "32px 16px 48px",
    boxSizing: "border-box",
    color: "#172b4d",
    fontFamily: '"DM Sans", Arial, sans-serif',
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  panel: {
    maxWidth: "560px",
    margin: "60px auto",
    padding: "36px 28px",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 8px 30px rgba(20,40,80,0.08)",
    textAlign: "center",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "26px",
  },
  brand: {
    color: "#b18a35",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#667085",
    fontSize: "13px",
    margin: "0 0 8px",
  },
  heading: {
    color: "#0d1b2a",
    fontSize: "28px",
    margin: "0 0 14px",
    fontFamily: '"Playfair Display", Georgia, serif',
  },
  intro: {
    color: "#667085",
    lineHeight: 1.7,
    maxWidth: "680px",
    margin: "0 auto",
  },
  muted: {
    color: "#667085",
    lineHeight: 1.7,
  },
  progressCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 4px 18px rgba(20,40,80,0.04)",
  },
  progressInfo: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
    color: "#475467",
    fontSize: "13px",
    marginBottom: "12px",
  },
  progressTrack: {
    height: "8px",
    background: "#e9edf4",
    borderRadius: "20px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "#c9a84c",
    borderRadius: "20px",
    transition: "width 0.2s ease",
  },
  examMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
    marginTop: "18px",
  },
  sectionBadge: {
    background: "#f8f4ee",
    color: "#805b10",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 700,
  },
  timer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: "130px",
    padding: "10px 14px",
    border: "1px solid #e0e6ef",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#0d1b2a",
    textAlign: "center",
    fontSize: "20px",
  },
  timerLabel: {
    fontSize: "10px",
    color: "#667085",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  timerWarning: {
    color: "#b42318",
    borderColor: "#fda29b",
    background: "#fff5f4",
  },
  questionCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(20,40,80,0.04)",
  },
  questionNumber: {
    color: "#9a7526",
    fontWeight: 800,
    fontSize: "12px",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  instruction: {
    color: "#667085",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: "0 0 12px",
  },
  questionText: {
    color: "#172b4d",
    fontSize: "21px",
    fontWeight: 600,
    lineHeight: 1.7,
    margin: "0 0 28px",
    whiteSpace: "pre-wrap",
  },
  answerLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "10px",
    color: "#344054",
  },
  answerInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    font: "inherit",
    fontSize: "16px",
    lineHeight: 1.6,
    outlineColor: "#c9a84c",
  },
  answerInputLocked: {
    background: "#f0fdf4",
    borderColor: "#75c69a",
    color: "#166534",
  },
  lockedMessage: {
    color: "#167647",
    fontSize: "13px",
    marginTop: "10px",
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    margin: "22px 0",
  },
  primaryButton: {
    background: "#0d1b2a",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    padding: "13px 20px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "#ffffff",
    color: "#172b4d",
    border: "1px solid #d0d5dd",
    borderRadius: "9px",
    padding: "13px 20px",
    fontWeight: 600,
    cursor: "pointer",
  },
  submitButton: {
    background: "#167647",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    padding: "13px 20px",
    fontWeight: 700,
    cursor: "pointer",
  },
  questionGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "18px",
    background: "#ffffff",
    borderRadius: "12px",
  },
  questionDot: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    background: "#ffffff",
    color: "#475467",
    cursor: "pointer",
  },
  activeDot: {
    outline: "2px solid #0d1b2a",
    outlineOffset: "1px",
    fontWeight: 700,
  },
  answeredDot: {
    background: "#e5f5eb",
    borderColor: "#75c69a",
    color: "#166534",
  },
  warningBanner: {
    background: "#fff8e6",
    border: "1px solid #f0d48a",
    color: "#805b10",
    padding: "14px 16px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "13px",
    lineHeight: 1.6,
  },
  footerWarning: {
    color: "#805b10",
    background: "#fff8e6",
    border: "1px solid #f0d48a",
    padding: "14px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    lineHeight: 1.6,
    marginTop: "22px",
  },
  errorIcon: {
    width: "48px",
    height: "48px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#fee4e2",
    color: "#b42318",
    display: "grid",
    placeItems: "center",
    fontSize: "28px",
    fontWeight: 700,
  },
  successIcon: {
    width: "48px",
    height: "48px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#dcfae6",
    color: "#167647",
    display: "grid",
    placeItems: "center",
    fontSize: "25px",
    fontWeight: 700,
  },
  scoreCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "20px",
    margin: "24px 0",
    background: "#f8f4ee",
    borderRadius: "12px",
  },
  scoreLabel: {
    color: "#667085",
    fontSize: "13px",
    fontWeight: 700,
  },
  scoreValue: {
    color: "#0d1b2a",
    fontSize: "30px",
  },
  errorText: {
    color: "#b42318",
    lineHeight: 1.7,
  },
  spinner: {
    width: "34px",
    height: "34px",
    border: "4px solid #e9edf4",
    borderTopColor: "#c9a84c",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "ifa-spin 1s linear infinite",
  },
};