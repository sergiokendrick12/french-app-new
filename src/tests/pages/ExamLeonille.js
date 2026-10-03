import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EXAM_TYPE = "exam_leonille";
const EXAM_TABLE_ATTEMPTS = "exam_leonille_attempts";
const TEST_DURATION = 2 * 60 * 60;

const ANSWERS_STORAGE_PREFIX = "ifa_exam_leonille_answers_";

const questions = [
  {
    id: 1,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Remplace le groupe souligné par un pronom personnel :",
    text: "Marie va à l’école. → __________ va à l’école.",
    underlinedText: "Marie",
    acceptedAnswers: ["elle"],
  },
  {
    id: 2,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Remplace le groupe souligné par un pronom personnel :",
    text: "Paul et Jean jouent au football. → __________ jouent au football.",
    underlinedText: "Paul et Jean",
    acceptedAnswers: ["ils"],
  },
  {
    id: 3,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Remplace le groupe souligné par un pronom personnel :",
    text: "Ma sœur et moi sommes à la maison. → __________ sommes à la maison.",
    underlinedText: "Ma sœur et moi",
    acceptedAnswers: ["nous"],
  },
  {
    id: 4,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Complète avec le, la, les :",
    text: "Je regarde le film. → Je __________ regarde.",
    type: "select",
    options: ["le", "la", "les"],
    correctAnswer: "le",
  },
  {
    id: 5,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Complète avec lui ou leur :",
    text: "Je téléphone à mes parents. → Je __________ téléphone.",
    type: "select",
    options: ["lui", "leur"],
    correctAnswer: "leur",
  },
  {
    id: 6,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Remplace le groupe souligné par un pronom :",
    text: "Elle parle à son professeur. → Elle __________ parle.",
    underlinedText: "à son professeur",
    acceptedAnswers: ["lui"],
  },
  {
    id: 7,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Remplace le groupe souligné par un pronom :",
    text: "Nous aimons nos amis. → Nous __________ aimons.",
    underlinedText: "nos amis",
    acceptedAnswers: ["les"],
  },
  {
    id: 8,
    section: "PARTIE A — LES PRONOMS",
    instruction: "Complète avec le pronom qui convient :",
    text: "__________ aimez le français.",
    type: "select",
    options: ["Je", "Tu", "Vous", "Ils"],
    correctAnswer: "Vous",
  },

  {
    id: 9,
    section: "PARTIE B — LES PRÉPOSITIONS",
    instruction: "Complète avec à, au, aux, en :",
    text: "Je vais __________ école.",
    type: "select",
    options: ["à", "au", "aux", "en"],
    correctAnswer: "à",
  },
  {
    id: 10,
    section: "PARTIE B — LES PRÉPOSITIONS",
    instruction: "Complète avec à, au, aux, en :",
    text: "Nous habitons __________ Rwanda.",
    type: "select",
    options: ["à", "au", "aux", "en"],
    correctAnswer: "au",
  },
  {
    id: 11,
    section: "PARTIE B — LES PRÉPOSITIONS",
    instruction: "Complète avec dans, sur, sous :",
    text: "Le livre est __________ la table.",
    type: "select",
    options: ["dans", "sur", "sous"],
    correctAnswer: "sur",
  },
  {
    id: 12,
    section: "PARTIE B — LES PRÉPOSITIONS",
    instruction: "Complète avec dans, sur, sous :",
    text: "Le chat dort __________ le lit.",
    type: "select",
    options: ["dans", "sur", "sous"],
    correctAnswer: "sous",
  },
  {
    id: 13,
    section: "PARTIE B — LES PRÉPOSITIONS",
    instruction: "Complète avec chez, avec, sans :",
    text: "Je vais __________ mon ami.",
    type: "select",
    options: ["chez", "avec", "sans"],
    correctAnswer: "chez",
  },
  {
    id: 14,
    section: "PARTIE B — LES PRÉPOSITIONS",
    instruction: "Complète avec une préposition correcte :",
    text: "Je travaille __________ mon professeur.",
    type: "select",
    options: ["chez", "avec", "sans"],
    correctAnswer: "avec",
  },

  {
    id: 15,
    section: "PARTIE C — LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Je __________ (être) content aujourd’hui.",
    acceptedAnswers: ["suis"],
  },
  {
    id: 16,
    section: "PARTIE C — LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Nous __________ (avoir) beaucoup de travail.",
    acceptedAnswers: ["avons"],
  },
  {
    id: 17,
    section: "PARTIE C — LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Tu __________ (faire) tes devoirs.",
    acceptedAnswers: ["fais"],
  },
  {
    id: 18,
    section: "PARTIE C — LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Ils __________ (aller) à l’école.",
    acceptedAnswers: ["vont"],
  },
  {
    id: 19,
    section: "PARTIE C — LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Elle __________ (prendre) le bus.",
    acceptedAnswers: ["prend"],
  },
  {
    id: 20,
    section: "PARTIE C — LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Vous __________ (finir) votre exercice.",
    acceptedAnswers: ["finissez"],
  },

  {
    id: 21,
    section: "PARTIE D — LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Hier, j’__________ (manger) au restaurant.",
    acceptedAnswers: ["ai mange", "ai mangé"],
  },
  {
    id: 22,
    section: "PARTIE D — LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Nous __________ (regarder) un film.",
    acceptedAnswers: ["avons regarde", "avons regardé"],
  },
  {
    id: 23,
    section: "PARTIE D — LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Tu __________ (finir) tes devoirs.",
    acceptedAnswers: ["as fini"],
  },
  {
    id: 24,
    section: "PARTIE D — LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Elle __________ (prendre) le train.",
    acceptedAnswers: ["a pris"],
  },
  {
    id: 25,
    section: "PARTIE D — LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Ils __________ (aller) au marché.",
    acceptedAnswers: ["sont alles", "sont allés"],
  },
  {
    id: 26,
    section: "PARTIE D — LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Vous __________ (faire) vos exercices.",
    acceptedAnswers: ["avez fait"],
  },

  {
    id: 27,
    section: "PARTIE E — LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Demain, je __________ (aller) au marché.",
    acceptedAnswers: ["vais aller"],
  },
  {
    id: 28,
    section: "PARTIE E — LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Nous __________ (faire) nos devoirs ce soir.",
    acceptedAnswers: ["allons faire"],
  },
  {
    id: 29,
    section: "PARTIE E — LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Tu __________ (manger) au restaurant demain.",
    acceptedAnswers: ["vas manger"],
  },
  {
    id: 30,
    section: "PARTIE E — LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Elle __________ (prendre) le bus dans quelques minutes.",
    acceptedAnswers: ["va prendre"],
  },
  {
    id: 31,
    section: "PARTIE E — LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Ils __________ (jouer) au football cet après-midi.",
    acceptedAnswers: ["vont jouer"],
  },

  {
    id: 32,
    section: "PARTIE F — LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Demain, je __________ (aller) à l’école.",
    acceptedAnswers: ["irai"],
  },
  {
    id: 33,
    section: "PARTIE F — LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Nous __________ (avoir) un examen lundi.",
    acceptedAnswers: ["aurons"],
  },
  {
    id: 34,
    section: "PARTIE F — LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Tu __________ (être) à la maison demain.",
    acceptedAnswers: ["seras"],
  },
  {
    id: 35,
    section: "PARTIE F — LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Elle __________ (faire) ses devoirs ce soir.",
    acceptedAnswers: ["fera"],
  },
  {
    id: 36,
    section: "PARTIE F — LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Ils __________ (venir) chez nous dimanche.",
    acceptedAnswers: ["viendront"],
  },

  {
    id: 37,
    section: "PARTIE G — CE, CETTE, CET, CES",
    instruction: "Complète avec ce, cet, cette ou ces :",
    text: "__________ garçon est très intelligent.",
    type: "select",
    options: ["ce", "cet", "cette", "ces"],
    correctAnswer: "ce",
  },
  {
    id: 38,
    section: "PARTIE G — CE, CETTE, CET, CES",
    instruction: "Complète :",
    text: "__________ fille est ma sœur.",
    type: "select",
    options: ["ce", "cet", "cette", "ces"],
    correctAnswer: "cette",
  },
  {
    id: 39,
    section: "PARTIE G — CE, CETTE, CET, CES",
    instruction: "Complète :",
    text: "__________ enfants jouent dans la cour.",
    type: "select",
    options: ["ce", "cet", "cette", "ces"],
    correctAnswer: "ces",
  },
  {
    id: 40,
    section: "PARTIE G — CE, CETTE, CET, CES",
    instruction: "Complète :",
    text: "__________ arbre est très grand.",
    type: "select",
    options: ["ce", "cet", "cette", "ces"],
    correctAnswer: "cet",
  },
  {
    id: 41,
    section: "PARTIE G — CE, CETTE, CET, CES",
    instruction: "Complète :",
    text: "__________ livre est intéressant.",
    type: "select",
    options: ["ce", "cet", "cette", "ces"],
    correctAnswer: "ce",
  },
  {
    id: 42,
    section: "PARTIE G — CE, CETTE, CET, CES",
    instruction: "Complète :",
    text: "__________ école est près de chez moi.",
    type: "select",
    options: ["ce", "cet", "cette", "ces"],
    correctAnswer: "cette",
  },

  {
    id: 43,
    section: "PARTIE H — LES DÉTERMINANTS",
    instruction: "Complète avec un, une ou des :",
    text: "J’ai __________ livre et __________ trousse.",
    type: "multi",
    fields: [
      {
        placeholder: "Premier blanc",
        options: ["un", "une", "des"],
        answer: "un",
      },
      {
        placeholder: "Deuxième blanc",
        options: ["un", "une", "des"],
        answer: "une",
      },
    ],
  },
  {
    id: 44,
    section: "PARTIE H — LES DÉTERMINANTS",
    instruction: "Complète avec le, la, les :",
    text: "__________ élèves sont dans __________ classe.",
    type: "multi",
    fields: [
      {
        placeholder: "Premier blanc",
        options: ["le", "la", "les"],
        answer: "les",
      },
      {
        placeholder: "Deuxième blanc",
        options: ["le", "la", "les"],
        answer: "la",
      },
    ],
  },
  {
    id: 45,
    section: "PARTIE H — LES DÉTERMINANTS",
    instruction: "Complète avec mon, ma ou mes :",
    text: "Voici __________ frère et __________ sœurs.",
    type: "multi",
    fields: [
      {
        placeholder: "Premier blanc",
        options: ["mon", "ma", "mes"],
        answer: "mon",
      },
      {
        placeholder: "Deuxième blanc",
        options: ["mon", "ma", "mes"],
        answer: "mes",
      },
    ],
  },
  {
    id: 46,
    section: "PARTIE H — LES DÉTERMINANTS",
    instruction: "Complète avec ton, ta ou tes :",
    text: "Où sont __________ cahiers et __________ trousse ?",
    type: "multi",
    fields: [
      {
        placeholder: "Premier blanc",
        options: ["ton", "ta", "tes"],
        answer: "tes",
      },
      {
        placeholder: "Deuxième blanc",
        options: ["ton", "ta", "tes"],
        answer: "ta",
      },
    ],
  },

  {
    id: 47,
    section: "PARTIE I — LES PROPOSITIONS ET LES CONJONCTIONS",
    instruction: "Souligne la proposition principale :",
    text: "Je reste à la maison parce qu’il pleut.",
    type: "proposition",
    parts: [
      "Je reste à la maison",
      "parce qu'il pleut",
    ],
    propositionAnswer: "main",
  },
  {
    id: 48,
    section: "PARTIE I — LES PROPOSITIONS ET LES CONJONCTIONS",
    instruction: "Souligne la proposition subordonnée :",
    text: "Je reste à la maison parce qu’il pleut.",
    type: "proposition",
    parts: [
      "Je reste à la maison",
      "parce qu'il pleut",
    ],
    propositionAnswer: "subordinate",
  },
  {
    id: 49,
    section: "PARTIE I — LES PROPOSITIONS ET LES CONJONCTIONS",
    instruction: "Complète avec et, mais, ou, parce que :",
    text: "Je reste à la maison __________ je suis malade.",
    type: "select",
    options: ["et", "mais", "ou", "parce que"],
    correctAnswer: "parce que",
  },
  {
    id: 50,
    section: "PARTIE I — LES PROPOSITIONS ET LES CONJONCTIONS",
    instruction: "Complète avec et, mais, ou, parce que :",
    text: "Tu veux du thé __________ du café ?",
    type: "select",
    options: ["et", "mais", "ou", "parce que"],
    correctAnswer: "ou",
  },
];

function normalizeAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019\u0060]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .trim();
}

function isAnswerCorrect(studentAnswer, acceptedAnswers) {
  const normalizedStudent = normalizeAnswer(studentAnswer);

  if (!normalizedStudent) {
    return false;
  }

  return acceptedAnswers.some(
    (answer) => normalizeAnswer(answer) === normalizedStudent
  );
}

function isQuestionCorrect(item, studentAnswer) {
  if (item.type === "select") {
    if (
      studentAnswer === undefined ||
      studentAnswer === null ||
      String(studentAnswer).trim() === ""
    ) {
      return false;
    }

    return (
      normalizeAnswer(studentAnswer) ===
      normalizeAnswer(item.correctAnswer)
    );
  }

  if (!item.type || item.type === "text") {
    return isAnswerCorrect(
      studentAnswer,
      item.acceptedAnswers || []
    );
  }

  if (item.type === "multi") {
    if (!Array.isArray(studentAnswer)) {
      return false;
    }

    if (studentAnswer.length !== item.fields.length) {
      return false;
    }

    return item.fields.every(
      (field, index) =>
        normalizeAnswer(studentAnswer[index]) ===
        normalizeAnswer(field.answer)
    );
  }

  if (item.type === "proposition") {
    return studentAnswer === item.propositionAnswer;
  }

  return false;
}

function calculateScore(answerSet) {
  return questions.reduce((total, item) => {
    const studentAnswer = answerSet?.[item.id];

    return (
      total +
      (isQuestionCorrect(item, studentAnswer) ? 1 : 0)
    );
  }, 0);
}

function calculatePercentage(calculatedScore) {
  if (!Number.isFinite(calculatedScore)) {
    return 0;
  }

  return Math.round(
    (calculatedScore / questions.length) * 100
  );
}

function getStorageKey(attemptId) {
  return `${ANSWERS_STORAGE_PREFIX}${attemptId}`;
}

function loadAnswersFromStorage(attemptId) {
  if (!attemptId) {
    return {};
  }

  try {
    const raw = localStorage.getItem(
      getStorageKey(attemptId)
    );

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }
  } catch (error) {
    console.error(
      "LOAD ANSWERS STORAGE ERROR:",
      error
    );
  }

  return {};
}

function saveAnswersToStorage(attemptId, answerSet) {
  if (!attemptId) {
    return;
  }

  try {
    localStorage.setItem(
      getStorageKey(attemptId),
      JSON.stringify(answerSet || {})
    );
  } catch (error) {
    console.error(
      "SAVE ANSWERS STORAGE ERROR:",
      error
    );
  }
}

function clearAnswersFromStorage(attemptId) {
  if (!attemptId) {
    return;
  }

  try {
    localStorage.removeItem(
      getStorageKey(attemptId)
    );
  } catch (error) {
    console.error(
      "CLEAR ANSWERS STORAGE ERROR:",
      error
    );
  }
}

export default function ExamLeonille() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [draftAnswer, setDraftAnswer] = useState("");
  const [multiAnswers, setMultiAnswers] = useState([]);
  const [propositionAnswer, setPropositionAnswer] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [timeLeft, setTimeLeft] = useState(null);
  const [timerReady, setTimerReady] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [answerMessage, setAnswerMessage] = useState("");

  const [completed, setCompleted] = useState(false);

  const [studentId, setStudentId] = useState(null);
  const [score, setScore] = useState(null);
  const [percentage, setPercentage] = useState(null);

  const [tabSwitches, setTabSwitches] = useState(0);
  const [terminationReason, setTerminationReason] =
    useState(null);

  const [serverAttemptId, setServerAttemptId] =
    useState(null);

  const attemptRef = useRef(null);

  const answersRef = useRef({});
  const draftAnswerRef = useRef("");
  const multiAnswersRef = useRef([]);
  const propositionAnswerRef = useRef("");

  const currentQuestionRef = useRef(0);
  const studentIdRef = useRef(null);
  const serverAttemptIdRef = useRef(null);

  const tabSwitchProcessingRef = useRef(false);
  const accessCheckStartedRef = useRef(false);
  const submitStartedRef = useRef(false);

  const handleSubmitRef = useRef(null);

  const question = questions[currentQuestion];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const isLastQuestion =
    currentQuestion === questions.length - 1;

  const answerLocked =
    Object.prototype.hasOwnProperty.call(
      answers,
      question.id
    );

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    draftAnswerRef.current = draftAnswer;
  }, [draftAnswer]);

  useEffect(() => {
    multiAnswersRef.current = multiAnswers;
  }, [multiAnswers]);

  useEffect(() => {
    propositionAnswerRef.current =
      propositionAnswer;
  }, [propositionAnswer]);

  useEffect(() => {
    currentQuestionRef.current =
      currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    studentIdRef.current = studentId;
  }, [studentId]);

  useEffect(() => {
    serverAttemptIdRef.current =
      serverAttemptId;
  }, [serverAttemptId]);

  useEffect(() => {
    if (accessCheckStartedRef.current) {
      return;
    }

    accessCheckStartedRef.current = true;
    checkAccess();
  }, []);

  /*
   * TIMER
   */

  useEffect(() => {
    if (
      !timerReady ||
      completed ||
      submitting ||
      timeLeft === null
    ) {
      return;
    }

    if (timeLeft <= 0) {
      if (
        handleSubmitRef.current &&
        !submitStartedRef.current
      ) {
        handleSubmitRef.current(
          true,
          "time"
        );
      }

      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((current) => {
        if (current === null) {
          return current;
        }

        return Math.max(
          0,
          current - 1
        );
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    timerReady,
    completed,
    submitting,
    timeLeft,
  ]);

  /*
   * TAB SWITCH SECURITY
   */

  useEffect(() => {
    if (
      loading ||
      completed ||
      submitting ||
      !serverAttemptId
    ) {
      return;
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        return;
      }

      if (
        tabSwitchProcessingRef.current
      ) {
        return;
      }

      const attempt =
        attemptRef.current;

      if (!attempt) {
        return;
      }

      if (
        attempt.status !==
        "in_progress"
      ) {
        return;
      }

      tabSwitchProcessingRef.current =
        true;

      processTabSwitch(attempt).finally(
        () => {
          setTimeout(() => {
            tabSwitchProcessingRef.current =
              false;
          }, 500);
        }
      );
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    loading,
    completed,
    submitting,
    serverAttemptId,
  ]);

  /*
   * ACCESS CHECK
   */

  async function checkAccess() {
    try {
      setLoading(true);
      setMessage("");
      setTimerReady(false);

      const {
        data: {
          user,
        },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        setMessage(
          "Vous devez être connecté pour accéder à cet examen."
        );
        setLoading(false);
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("student_profiles")
        .select(
          "id, status, payment_status"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        setMessage(
          "Votre profil étudiant est introuvable."
        );
        setLoading(false);
        return;
      }

      if (
        profile.status !==
        "approved"
      ) {
        setMessage(
          "Votre profil étudiant n'est pas encore approuvé."
        );
        setLoading(false);
        return;
      }

      if (
        profile.payment_status !==
        "paid"
      ) {
        setMessage(
          "Votre paiement doit être confirmé avant de passer cet examen."
        );
        setLoading(false);
        return;
      }

      setStudentId(user.id);
      studentIdRef.current =
        user.id;

      /*
       * CHECK EXISTING RESULT
       */

      const {
        data: existingResult,
        error: resultCheckError,
      } = await supabase
        .from("test_results")
        .select(
          "id, score, total_questions, percentage, completed_at"
        )
        .eq(
          "student_id",
          user.id
        )
        .eq(
          "test_type",
          EXAM_TYPE
        )
        .maybeSingle();

      if (resultCheckError) {
        throw resultCheckError;
      }

      if (existingResult) {
        setScore(
          Number(existingResult.score)
        );

        setPercentage(
          Number(
            existingResult.percentage
          )
        );

        setTerminationReason(
          "completed"
        );

        setCompleted(true);
        setLoading(false);

        return;
      }

      /*
       * CHECK EXISTING SERVER ATTEMPT
       */

      const {
        data: existingAttempt,
        error: attemptCheckError,
      } = await supabase
        .from(
          EXAM_TABLE_ATTEMPTS
        )
        .select(
          "id, status, started_at, finished_at, tab_switches, termination_reason"
        )
        .eq(
          "student_id",
          user.id
        )
        .maybeSingle();

      if (attemptCheckError) {
        throw attemptCheckError;
      }

      let attempt =
        existingAttempt;

      /*
       * FINISHED ATTEMPT WITHOUT RESULT
       */

      if (
        attempt &&
        attempt.status ===
          "finished"
      ) {
        setTabSwitches(
          Number(
            attempt.tab_switches || 0
          )
        );

        setTerminationReason(
          attempt.termination_reason ||
            "completed"
        );

        setCompleted(true);
        setLoading(false);

        return;
      }

      /*
       * CREATE ATTEMPT
       */

      if (!attempt) {
        const {
          data: newAttempt,
          error: createAttemptError,
        } = await supabase
          .from(
            EXAM_TABLE_ATTEMPTS
          )
          .insert({
            student_id: user.id,
            status: "in_progress",
            tab_switches: 0,
          })
          .select(
            "id, status, started_at, finished_at, tab_switches, termination_reason"
          )
          .single();

        if (
          createAttemptError
        ) {
          /*
           * 23505 = another request created
           * the unique attempt first.
           */
          if (
            createAttemptError.code ===
            "23505"
          ) {
            const {
              data: raceAttempt,
              error: raceError,
            } = await supabase
              .from(
                EXAM_TABLE_ATTEMPTS
              )
              .select(
                "id, status, started_at, finished_at, tab_switches, termination_reason"
              )
              .eq(
                "student_id",
                user.id
              )
              .maybeSingle();

            if (raceError) {
              throw raceError;
            }

            attempt =
              raceAttempt;
          } else {
            throw createAttemptError;
          }
        } else {
          attempt =
            newAttempt;
        }
      }

      if (!attempt) {
        setMessage(
          "Impossible de préparer votre tentative d'examen."
        );
        setLoading(false);
        return;
      }

      if (
        attempt.status ===
        "finished"
      ) {
        setTabSwitches(
          Number(
            attempt.tab_switches || 0
          )
        );

        setTerminationReason(
          attempt.termination_reason ||
            "completed"
        );

        setCompleted(true);
        setLoading(false);

        return;
      }

      attemptRef.current =
        attempt;

      setServerAttemptId(
        attempt.id
      );

      serverAttemptIdRef.current =
        attempt.id;

      const storedAnswers =
        loadAnswersFromStorage(
          attempt.id
        );

      answersRef.current =
        storedAnswers;

      setAnswers(
        storedAnswers
      );

      /*
       * SERVER TIME
       */

      const {
        data: serverTimeData,
        error: serverTimeError,
      } = await supabase.rpc(
        "get_server_time"
      );

      if (serverTimeError) {
        throw serverTimeError;
      }

      const serverNow =
        new Date(
          serverTimeData
        );

      const startedAt =
        new Date(
          attempt.started_at
        );

      const elapsedSeconds =
        Math.floor(
          (
            serverNow.getTime() -
            startedAt.getTime()
          ) / 1000
        );

      const remainingSeconds =
        Math.max(
          0,
          TEST_DURATION -
            elapsedSeconds
        );

      setTabSwitches(
        Number(
          attempt.tab_switches || 0
        )
      );

      setTerminationReason(
        attempt.termination_reason ||
          null
      );

      setTimeLeft(
        remainingSeconds
      );

      setTimerReady(true);
      setLoading(false);

      if (remainingSeconds <= 0) {
        setTimeout(() => {
          if (
            handleSubmitRef.current &&
            !submitStartedRef.current
          ) {
            handleSubmitRef.current(
              true,
              "time"
            );
          }
        }, 100);
      }
    } catch (error) {
      console.error(
        "EXAM ACCESS ERROR:",
        error
      );

      setMessage(
        "Une erreur est survenue lors de la préparation de votre examen."
      );

      setLoading(false);
    }
  }

  /*
   * GET THE MOST RECENT ANSWERS.
   *
   * This is critical for:
   * - second tab switch
   * - timeout
   * - normal submit
   *
   * It also captures the answer currently
   * visible on screen even if the student
   * has not clicked "Enregistrer".
   */

  function getLatestAnswersForScoring() {
    const finalAnswers = {
      ...answersRef.current,
    };

    const currentItem =
      questions[
        currentQuestionRef.current
      ];

    if (!currentItem) {
      return finalAnswers;
    }

    /*
     * If this question is already saved,
     * keep the saved answer.
     */

    if (
      Object.prototype.hasOwnProperty.call(
        finalAnswers,
        currentItem.id
      )
    ) {
      return finalAnswers;
    }

    let currentValue;

    if (
      currentItem.type ===
      "multi"
    ) {
      const currentMulti = [
        ...multiAnswersRef.current,
      ];

      /*
       * A partially completed multi-question
       * is intentionally not scored.
       */
      if (
        currentMulti.length ===
          currentItem.fields.length &&
        currentMulti.every(
          (value) =>
            String(
              value ?? ""
            ).trim() !== ""
        )
      ) {
        currentValue =
          currentMulti;
      }
    } else if (
      currentItem.type ===
      "proposition"
    ) {
      const value =
        String(
          propositionAnswerRef.current ??
            ""
        ).trim();

      if (value) {
        currentValue = value;
      }
    } else {
      const value =
        String(
          draftAnswerRef.current ??
            ""
        ).trim();

      if (value) {
        currentValue = value;
      }
    }

    if (
      currentValue !==
      undefined
    ) {
      finalAnswers[
        currentItem.id
      ] = currentValue;
    }

    return finalAnswers;
  }

  /*
   * TAB SWITCH PROCESSING
   */

  async function processTabSwitch(
    attempt
  ) {
    if (
      !attempt ||
      attempt.status !==
        "in_progress"
    ) {
      return;
    }

    const currentSwitches =
      Number(
        attempt.tab_switches || 0
      );

    const newSwitchCount =
      currentSwitches + 1;

    /*
     * FIRST TAB SWITCH = WARNING
     */

    if (
      newSwitchCount === 1
    ) {
      const {
        data: updatedAttempt,
        error: updateError,
      } = await supabase
        .from(
          EXAM_TABLE_ATTEMPTS
        )
        .update({
          tab_switches: 1,
        })
        .eq(
          "id",
          attempt.id
        )
        .eq(
          "status",
          "in_progress"
        )
        .select(
          "id, status, started_at, finished_at, tab_switches, termination_reason"
        )
        .single();

      if (updateError) {
        console.error(
          "FIRST TAB SWITCH UPDATE ERROR:",
          updateError
        );

        setTabSwitches(1);

        attemptRef.current = {
          ...attempt,
          tab_switches: 1,
        };

        return;
      }

      setTabSwitches(1);

      attemptRef.current =
        updatedAttempt;

      return;
    }

    /*
     * SECOND TAB SWITCH = TERMINATE
     *
     * IMPORTANT:
     * We calculate the real score.
     * We DO NOT force 0 / 50.
     */

    const finalAnswers =
      getLatestAnswersForScoring();

    const calculatedScore =
      calculateScore(
        finalAnswers
      );

    const calculatedPercentage =
      calculatePercentage(
        calculatedScore
      );

    /*
     * Save final answers locally.
     */

    answersRef.current =
      finalAnswers;

    setAnswers(
      finalAnswers
    );

    saveAnswersToStorage(
      attempt.id,
      finalAnswers
    );

    setTabSwitches(2);

    setTerminationReason(
      "tab_switch"
    );

    setScore(
      calculatedScore
    );

    setPercentage(
      calculatedPercentage
    );

    submitStartedRef.current =
      true;

    setSubmitting(true);

    /*
     * SAVE RESULT
     */

    const {
      error: resultError,
    } = await supabase
      .from("test_results")
      .insert({
        student_id:
          studentIdRef.current,
        score:
          calculatedScore,
        total_questions:
          questions.length,
        percentage:
          calculatedPercentage,
        test_type:
          EXAM_TYPE,
      });

    if (
      resultError &&
      resultError.code !==
        "23505"
    ) {
      console.error(
        "TAB SWITCH RESULT INSERT ERROR:",
        resultError
      );

      setMessage(
        "Le test a été terminé, mais une erreur est survenue lors de l'enregistrement du résultat."
      );
    }

    /*
     * FINISH SERVER ATTEMPT
     */

    const {
      data: finishedAttempt,
      error: finishError,
    } = await supabase
      .from(
        EXAM_TABLE_ATTEMPTS
      )
      .update({
        status: "finished",
        finished_at:
          new Date().toISOString(),
        tab_switches: 2,
        termination_reason:
          "tab_switch",
      })
      .eq(
        "id",
        attempt.id
      )
      .eq(
        "status",
        "in_progress"
      )
      .select(
        "id, status, started_at, finished_at, tab_switches, termination_reason"
      )
      .single();

    if (finishError) {
      console.error(
        "TAB SWITCH ATTEMPT FINISH ERROR:",
        finishError
      );
    } else {
      attemptRef.current =
        finishedAttempt;
    }

    /*
     * Clear active inputs.
     */

    draftAnswerRef.current =
      "";

    multiAnswersRef.current =
      [];

    propositionAnswerRef.current =
      "";

    setDraftAnswer("");

    setMultiAnswers([]);

    setPropositionAnswer("");

    setCompleted(true);

    setSubmitting(false);
  }

  /*
   * ANSWER HANDLING
   */

  function handleDraftAnswer(value) {
    draftAnswerRef.current =
      value;

    setDraftAnswer(value);

    setAnswerMessage("");
  }

  function handleSelectAnswer(value) {
    draftAnswerRef.current =
      value;

    setDraftAnswer(value);

    setAnswerMessage("");
  }

  function handleMultiAnswer(
    index,
    value
  ) {
    const updated = [
      ...multiAnswersRef.current,
    ];

    updated[index] =
      value;

    multiAnswersRef.current =
      updated;

    setMultiAnswers(
      updated
    );

    setAnswerMessage("");
  }

  function handlePropositionAnswer(
    value
  ) {
    propositionAnswerRef.current =
      value;

    setPropositionAnswer(
      value
    );

    setAnswerMessage("");
  }

  function getCurrentAnswer() {
    if (
      question.type ===
      "multi"
    ) {
      return [
        ...multiAnswersRef.current,
      ];
    }

    if (
      question.type ===
      "proposition"
    ) {
      return propositionAnswerRef.current;
    }

    return String(
      draftAnswerRef.current
    ).trim();
  }

  function currentAnswerIsComplete() {
    if (
      question.type ===
      "multi"
    ) {
      return (
        multiAnswersRef.current
          .length ===
          question.fields.length &&
        multiAnswersRef.current.every(
          (answer) =>
            String(
              answer ?? ""
            ).trim() !== ""
        )
      );
    }

    if (
      question.type ===
      "proposition"
    ) {
      return (
        String(
          propositionAnswerRef.current
        ).trim() !== ""
      );
    }

    return (
      String(
        draftAnswerRef.current
      ).trim() !== ""
    );
  }

  function saveCurrentAnswer() {
    const value =
      getCurrentAnswer();

    const updatedAnswers = {
      ...answersRef.current,
      [question.id]: value,
    };

    answersRef.current =
      updatedAnswers;

    setAnswers(
      updatedAnswers
    );

    if (
      serverAttemptIdRef.current
    ) {
      saveAnswersToStorage(
        serverAttemptIdRef.current,
        updatedAnswers
      );
    }

    return value;
  }

  /*
   * GO NEXT
   */

  function goNext() {
    if (answerLocked) {
      return;
    }

    if (
      !currentAnswerIsComplete()
    ) {
      setAnswerMessage(
        question.type ===
          "multi"
          ? "Veuillez compléter tous les blancs avant de continuer."
          : question.type ===
            "proposition"
          ? "Veuillez sélectionner la proposition demandée avant de continuer."
          : "Veuillez écrire ou sélectionner une réponse avant de continuer."
      );

      return;
    }

    saveCurrentAnswer();

    setAnswerMessage("");

    if (
      currentQuestion <
      questions.length - 1
    ) {
      const nextQuestion =
        currentQuestion + 1;

      currentQuestionRef.current =
        nextQuestion;

      setCurrentQuestion(
        nextQuestion
      );

      draftAnswerRef.current =
        "";

      multiAnswersRef.current =
        [];

      propositionAnswerRef.current =
        "";

      setDraftAnswer("");

      setMultiAnswers([]);

      setPropositionAnswer("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
   * FORMAT TIME
   */

  function formatTime(seconds) {
    if (
      seconds === null ||
      !Number.isFinite(seconds)
    ) {
      return "02:00:00";
    }

    const safeSeconds =
      Math.max(
        0,
        Math.floor(seconds)
      );

    const hours =
      Math.floor(
        safeSeconds / 3600
      );

    const minutes =
      Math.floor(
        (safeSeconds % 3600) /
          60
      );

    const remainingSeconds =
      safeSeconds % 60;

    return `${String(
      hours
    ).padStart(
      2,
      "0"
    )}:${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(
      2,
      "0"
    )}`;
  }

  /*
   * SUBMIT EXAM
   */

  async function handleSubmit(
    autoSubmit = false,
    reason = "completed"
  ) {
    if (
      submitting ||
      completed ||
      submitStartedRef.current
    ) {
      return;
    }

    const finalAnswers =
      getLatestAnswersForScoring();

    /*
     * Manual submission validation.
     */

    if (!autoSubmit) {
      const currentIsLocked =
        Object.prototype.hasOwnProperty.call(
          finalAnswers,
          question.id
        );

      if (
        !currentIsLocked &&
        !currentAnswerIsComplete()
      ) {
        setAnswerMessage(
          "Veuillez compléter votre réponse avant de terminer le test."
        );

        return;
      }

      const finalAnsweredCount =
        Object.keys(
          finalAnswers
        ).length;

      const confirmed =
        window.confirm(
          "Êtes-vous certain de vouloir envoyer vos réponses ?\n\n" +
            `Vous avez répondu à ${finalAnsweredCount} question(s) sur ${questions.length}.\n\n` +
            "Cette partie ne pourra être envoyée qu'une seule fois."
        );

      if (!confirmed) {
        return;
      }
    }

    submitStartedRef.current =
      true;

    setSubmitting(true);

    setMessage("");

    try {
      const finalStudentId =
        studentIdRef.current ||
        studentId;

      if (!finalStudentId) {
        setMessage(
          "Votre session étudiant est introuvable."
        );

        submitStartedRef.current =
          false;

        setSubmitting(false);

        return;
      }

      /*
       * Save final answers.
       */

      answersRef.current =
        finalAnswers;

      setAnswers(
        finalAnswers
      );

      if (
        serverAttemptIdRef.current
      ) {
        saveAnswersToStorage(
          serverAttemptIdRef.current,
          finalAnswers
        );
      }

      /*
       * REAL SCORE
       */

      const calculatedScore =
        calculateScore(
          finalAnswers
        );

      const calculatedPercentage =
        calculatePercentage(
          calculatedScore
        );

      setScore(
        calculatedScore
      );

      setPercentage(
        calculatedPercentage
      );

      /*
       * SAVE RESULT
       */

      const {
        error: insertError,
      } = await supabase
        .from("test_results")
        .insert({
          student_id:
            finalStudentId,
          score:
            calculatedScore,
          total_questions:
            questions.length,
          percentage:
            calculatedPercentage,
          test_type:
            EXAM_TYPE,
        });

      if (insertError) {
        console.error(
          "EXAM INSERT ERROR:",
          insertError
        );

        /*
         * Duplicate result:
         * another request already saved it.
         */
        if (
          insertError.code ===
          "23505"
        ) {
          const {
            data: existingResult,
            error:
              existingResultError,
          } = await supabase
            .from("test_results")
            .select(
              "score, total_questions, percentage"
            )
            .eq(
              "student_id",
              finalStudentId
            )
            .eq(
              "test_type",
              EXAM_TYPE
            )
            .maybeSingle();

          if (
            !existingResultError &&
            existingResult
          ) {
            setScore(
              Number(
                existingResult.score
              )
            );

            setPercentage(
              Number(
                existingResult.percentage
              )
            );
          }

          setTerminationReason(
            reason === "time"
              ? "time"
              : "completed"
          );

          setCompleted(true);
          setSubmitting(false);

          return;
        }

        setMessage(
          "Impossible d'enregistrer votre résultat."
        );

        submitStartedRef.current =
          false;

        setSubmitting(false);

        return;
      }

      /*
       * FINISH SERVER ATTEMPT
       */

      const activeAttemptId =
        serverAttemptIdRef.current ||
        serverAttemptId;

      if (activeAttemptId) {
        const {
          data: finishedAttempt,
          error: finishError,
        } = await supabase
          .from(
            EXAM_TABLE_ATTEMPTS
          )
          .update({
            status: "finished",
            finished_at:
              new Date().toISOString(),
            termination_reason:
              reason === "time"
                ? "time"
                : "completed",
          })
          .eq(
            "id",
            activeAttemptId
          )
          .eq(
            "status",
            "in_progress"
          )
          .select(
            "id, status, started_at, finished_at, tab_switches, termination_reason"
          )
          .single();

        if (finishError) {
          console.error(
            "FINISH EXAM ATTEMPT ERROR:",
            finishError
          );
        } else {
          attemptRef.current =
            finishedAttempt;

          setTerminationReason(
            reason === "time"
              ? "time"
              : "completed"
          );
        }
      } else {
        setTerminationReason(
          reason === "time"
            ? "time"
            : "completed"
        );
      }

      /*
       * Clear active inputs.
       */

      draftAnswerRef.current =
        "";

      multiAnswersRef.current =
        [];

      propositionAnswerRef.current =
        "";

      setDraftAnswer("");

      setMultiAnswers([]);

      setPropositionAnswer("");

      setCompleted(true);

      /*
       * Keep the answer storage until the
       * result is displayed. It can safely
       * be removed after completion.
       */
      clearAnswersFromStorage(
        activeAttemptId
      );
    } catch (error) {
      console.error(
        "EXAM SUBMIT ERROR:",
        error
      );

      setMessage(
        "Une erreur inattendue est survenue."
      );

      submitStartedRef.current =
        false;
    }

    setSubmitting(false);
  }

  useEffect(() => {
    handleSubmitRef.current =
      handleSubmit;
  });

  /*
   * QUESTION TEXT RENDERING
   */

  function renderQuestionText(item) {
    if (item.underlinedText) {
      const fullText =
        item.text;

      const target =
        item.underlinedText;

      const targetIndex =
        fullText.indexOf(
          target
        );

      if (
        targetIndex !==
        -1
      ) {
        const before =
          fullText.slice(
            0,
            targetIndex
          );

        const after =
          fullText.slice(
            targetIndex +
              target.length
          );

        return (
          <>
            {before}

            <span
              style={
                styles.underlinedText
              }
            >
              {target}
            </span>

            {after}
          </>
        );
      }
    }

    return item.text;
  }

  /*
   * LOADING SCREEN
   */

  if (loading) {
    return (
      <div style={styles.page}>
        <div
          style={
            styles.loadingCard
          }
        >
          <div
            style={
              styles.logoText
            }
          >
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div
            style={
              styles.spinner
            }
          >
            ◌
          </div>

          <h1
            style={
              styles.loadingTitle
            }
          >
            Vérification de votre accès...
          </h1>

          <p style={styles.muted}>
            Préparation de votre examen.
          </p>
        </div>
      </div>
    );
  }

  /*
   * COMPLETED SCREEN
   */

  if (completed) {
    if (
      terminationReason ===
      "tab_switch"
    ) {
      return (
        <div style={styles.page}>
          <div
            style={
              styles.errorCard
            }
          >
            <div
              style={
                styles.logoText
              }
            >
              INTERNATIONAL FRENCH ACADEMY
            </div>

            <div
              style={
                styles.errorIcon
              }
            >
              !
            </div>

            <h1
              style={
                styles.title
              }
            >
              Examen terminé
            </h1>

            <p
              style={
                styles.errorText
              }
            >
              L'examen a été automatiquement
              terminé après deux changements
              d'onglet.
            </p>

            <p style={styles.text}>
              Cette tentative a été enregistrée
              avec un score de{" "}
              <strong>
                {score ?? 0} /{" "}
                {questions.length}
              </strong>.
            </p>

            <div
              style={
                styles.scoreBox
              }
            >
              <div
                style={
                  styles.scoreLabel
                }
              >
                VOTRE SCORE
              </div>

              <div
                style={
                  styles.scoreValue
                }
              >
                {score ?? 0} /{" "}
                {questions.length}
              </div>

              <div
                style={
                  styles.percentage
                }
              >
                {percentage ?? 0}%
              </div>
            </div>

            <p style={styles.text}>
              Une seule tentative est autorisée.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student-dashboard"
                )
              }
              style={
                styles.primaryButton
              }
            >
              Retour à mon espace
            </button>
          </div>
        </div>
      );
    }

    if (
      terminationReason ===
      "time"
    ) {
      return (
        <div style={styles.page}>
          <div
            style={
              styles.errorCard
            }
          >
            <div
              style={
                styles.logoText
              }
            >
              INTERNATIONAL FRENCH ACADEMY
            </div>

            <div
              style={
                styles.errorIcon
              }
            >
              !
            </div>

            <h1
              style={
                styles.title
              }
            >
              Temps écoulé
            </h1>

            <p
              style={
                styles.errorText
              }
            >
              Les 2 heures de l'examen sont terminées.
            </p>

            <p style={styles.text}>
              Vos réponses ont été enregistrées
              automatiquement.
            </p>

            <div
              style={
                styles.scoreBox
              }
            >
              <div
                style={
                  styles.scoreLabel
                }
              >
                VOTRE SCORE
              </div>

              <div
                style={
                  styles.scoreValue
                }
              >
                {score ?? 0} /{" "}
                {questions.length}
              </div>

              <div
                style={
                  styles.percentage
                }
              >
                {percentage ?? 0}%
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student-dashboard"
                )
              }
              style={
                styles.primaryButton
              }
            >
              Retour à mon espace
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.page}>
        <div
          style={
            styles.successCard
          }
        >
          <div
            style={
              styles.logoText
            }
          >
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div
            style={
              styles.successIcon
            }
          >
            ✓
          </div>

          <h1
            style={
              styles.title
            }
          >
            Examen terminé
          </h1>

          <p style={styles.text}>
            Votre examen a été enregistré avec succès.
          </p>

          <div
            style={
              styles.scoreBox
            }
          >
            <div
              style={
                styles.scoreLabel
              }
            >
              VOTRE SCORE
            </div>

            <div
              style={
                styles.scoreValue
              }
            >
              {score ?? 0} /{" "}
              {questions.length}
            </div>

            <div
              style={
                styles.percentage
              }
            >
              {percentage ?? 0}%
            </div>
          </div>

          <p style={styles.text}>
            Une seule tentative est autorisée.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
            style={
              styles.primaryButton
            }
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  /*
   * ERROR SCREEN
   */

  if (message) {
    return (
      <div style={styles.page}>
        <div
          style={
            styles.errorCard
          }
        >
          <div
            style={
              styles.logoText
            }
          >
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div
            style={
              styles.errorIcon
            }
          >
            !
          </div>

          <h1
            style={
              styles.title
            }
          >
            Accès à l'examen
          </h1>

          <p
            style={
              styles.errorText
            }
          >
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
            style={
              styles.primaryButton
            }
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  /*
   * ANSWER AREA
   */

  function renderAnswerArea() {
    if (
      question.type ===
      "select"
    ) {
      return (
        <select
          value={draftAnswer}
          disabled={answerLocked}
          onChange={(event) =>
            handleSelectAnswer(
              event.target.value
            )
          }
          style={{
            ...styles.answerSelect,
            ...(answerLocked
              ? styles.answerInputLocked
              : {}),
          }}
        >
          <option value="">
            — Choisissez votre réponse —
          </option>

          {question.options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>
      );
    }

    if (
      question.type ===
      "multi"
    ) {
      return (
        <div
          style={
            styles.multiAnswerArea
          }
        >
          {question.fields.map(
            (
              field,
              index
            ) => (
              <div
                key={index}
                style={
                  styles.multiField
                }
              >
                <label
                  style={
                    styles.multiFieldLabel
                  }
                >
                  {
                    field.placeholder
                  }
                </label>

                <select
                  value={
                    multiAnswers[
                      index
                    ] || ""
                  }
                  disabled={
                    answerLocked
                  }
                  onChange={(event) =>
                    handleMultiAnswer(
                      index,
                      event.target.value
                    )
                  }
                  style={{
                    ...styles.answerSelect,
                    ...(answerLocked
                      ? styles.answerInputLocked
                      : {}),
                  }}
                >
                  <option value="">
                    — Choisissez —
                  </option>

                  {field.options.map(
                    (
                      option
                    ) => (
                      <option
                        key={
                          option
                        }
                        value={
                          option
                        }
                      >
                        {
                          option
                        }
                      </option>
                    )
                  )}
                </select>
              </div>
            )
          )}
        </div>
      );
    }

    if (
      question.type ===
      "proposition"
    ) {
      return (
        <div
          style={
            styles.propositionArea
          }
        >
          <div
            style={
              styles.propositionHelp
            }
          >
            Cliquez sur la proposition que vous
            souhaitez souligner.
          </div>

          <div
            style={
              styles.propositionChoices
            }
          >
            {question.parts.map(
              (
                part,
                index
              ) => {
                const value =
                  index === 0
                    ? "main"
                    : "subordinate";

                const selected =
                  propositionAnswer ===
                  value;

                return (
                  <button
                    key={part}
                    type="button"
                    disabled={
                      answerLocked
                    }
                    onClick={() =>
                      handlePropositionAnswer(
                        value
                      )
                    }
                    style={{
                      ...styles.propositionButton,
                      ...(selected
                        ? styles.propositionButtonSelected
                        : {}),
                    }}
                  >
                    {selected && (
                      <span
                        style={
                          styles.selectedCheck
                        }
                      >
                        ✓
                      </span>
                    )}

                    <span
                      style={{
                        ...(selected
                          ? styles.selectedUnderline
                          : {}),
                      }}
                    >
                      {part}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      );
    }

    return (
      <input
        type="text"
        value={draftAnswer}
        disabled={answerLocked}
        autoComplete="off"
        spellCheck="false"
        autoFocus
        onChange={(event) =>
          handleDraftAnswer(
            event.target.value
          )
        }
        onKeyDown={(event) => {
          if (
            event.key ===
            "Enter"
          ) {
            event.preventDefault();

            if (
              !answerLocked &&
              currentAnswerIsComplete()
            ) {
              if (
                isLastQuestion
              ) {
                handleSubmit(
                  false,
                  "completed"
                );
              } else {
                goNext();
              }
            }
          }
        }}
        placeholder={
          answerLocked
            ? "Réponse enregistrée"
            : "Écrivez votre réponse ici..."
        }
        style={{
          ...styles.answerInput,
          ...(answerLocked
            ? styles.answerInputLocked
            : {}),
        }}
      />
    );
  }

  /*
   * MAIN EXAM UI
   */

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div
            style={
              styles.logoText
            }
          >
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div
            style={
              styles.examMeta
            }
          >
            <span>
              Madame LEONILLE
            </span>

            <span>
              Classe : A1
            </span>

            <span>
              Date : Le 03/10
            </span>
          </div>

          <h1
            style={
              styles.title
            }
          >
            EXAMEN DE FRANÇAIS
          </h1>

          <div
            style={
              styles.examSubtitle
            }
          >
            GRAMMAIRE ET CONJUGAISON
          </div>

          <div
            style={
              styles.examInstructions
            }
          >
            <strong>
              50 questions — 50 points
            </strong>

            <span>
              Durée : 2 heures
            </span>
          </div>

          <p
            style={
              styles.intro
            }
          >
            Lisez attentivement chaque question.
            Répondez à toutes les questions avant
            de terminer l'examen.
          </p>
        </header>

        {tabSwitches === 1 && (
          <div
            style={
              styles.tabWarning
            }
          >
            <div
              style={
                styles.warningTitle
              }
            >
              ⚠️ PREMIER AVERTISSEMENT
            </div>

            <div>
              Vous avez quitté l'onglet de
              l'examen.
            </div>

            <div>
              Un deuxième changement d'onglet
              entraînera automatiquement la fin
              de l'examen.
            </div>

            <div
              style={
                styles.tabWarningCount
              }
            >
              Changements d'onglet : 1 / 2
            </div>
          </div>
        )}

        <div
          style={
            styles.topBar
          }
        >
          <div
            style={
              styles.topBarItem
            }
          >
            <div
              style={
                styles.progressLabel
              }
            >
              QUESTION
            </div>

            <div
              style={
                styles.progressValue
              }
            >
              {currentQuestion + 1} /{" "}
              {questions.length}
            </div>
          </div>

          <div
            style={
              styles.timerBox
            }
          >
            <div
              style={
                styles.timerLabel
              }
            >
              TEMPS RESTANT
            </div>

            <div
              style={{
                ...styles.timer,
                ...(timeLeft !==
                  null &&
                timeLeft <= 600
                  ? styles.timerDanger
                  : {}),
              }}
            >
              {formatTime(timeLeft)}
            </div>

            <div
              style={
                styles.timerSubtext
              }
            >
              2 HEURES
            </div>
          </div>

          <div
            style={
              styles.topBarItem
            }
          >
            <div
              style={
                styles.progressLabel
              }
            >
              RÉPONDUES
            </div>

            <div
              style={
                styles.progressValue
              }
            >
              {answeredCount} /{" "}
              {questions.length}
            </div>
          </div>
        </div>

        <div
          style={
            styles.progressBarOuter
          }
        >
          <div
            style={{
              ...styles.progressBarInner,
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        <div
          style={
            styles.questionCard
          }
        >
          <div
            style={
              styles.questionHeader
            }
          >
            <div
              style={
                styles.questionNumber
              }
            >
              QUESTION {currentQuestion + 1}
            </div>

            <div
              style={
                styles.pointsBadge
              }
            >
              1 POINT
            </div>
          </div>

          <div
            style={
              styles.sectionName
            }
          >
            {question.section}
          </div>

          <div
            style={
              styles.instruction
            }
          >
            {question.instruction}
          </div>

          <div
            style={
              styles.questionText
            }
          >
            {renderQuestionText(
              question
            )}
          </div>

          <div
            style={
              styles.answerArea
            }
          >
            <label
              style={
                styles.answerLabel
              }
            >
              {question.type ===
              "proposition"
                ? "Votre sélection"
                : question.type ===
                  "multi"
                ? "Complétez les blancs"
                : question.type ===
                  "select"
                ? "Choisissez votre réponse"
                : "Votre réponse"}
            </label>

            {renderAnswerArea()}

            {answerMessage && (
              <div
                style={
                  styles.answerErrorMessage
                }
              >
                {answerMessage}
              </div>
            )}

            {answerLocked && (
              <div
                style={
                  styles.answerLockedMessage
                }
              >
                ✓ Réponse enregistrée — cette
                réponse ne peut plus être
                modifiée.
              </div>
            )}
          </div>
        </div>

        <div
          style={
            styles.navigation
          }
        >
          {!isLastQuestion ? (
            <button
              type="button"
              onClick={goNext}
              disabled={
                answerLocked ||
                !currentAnswerIsComplete()
              }
              style={{
                ...styles.primaryButton,
                ...(answerLocked ||
                !currentAnswerIsComplete()
                  ? styles.disabledButton
                  : {}),
              }}
            >
              Enregistrer et continuer →
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                handleSubmit(
                  false,
                  "completed"
                )
              }
              disabled={
                submitting ||
                answerLocked ||
                !currentAnswerIsComplete()
              }
              style={{
                ...styles.submitButton,
                ...(submitting ||
                answerLocked ||
                !currentAnswerIsComplete()
                  ? styles.disabledSubmitButton
                  : {}),
              }}
            >
              {submitting
                ? "Enregistrement..."
                : "TERMINER L'EXAMEN ✓"}
            </button>
          )}
        </div>

        <div
          style={
            styles.warning
          }
        >
          <strong>
            ⚠️ Attention :
          </strong>{" "}
          Une seule tentative est autorisée.
          Après avoir enregistré une réponse et
          continué, cette réponse ne peut plus
          être modifiée.
        </div>

        <div
          style={
            styles.examFooter
          }
        >
          INTERNATIONAL FRENCH ACADEMY
          <span>
            — Examen de français A1 —
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f4ee",
    padding: "35px 20px 70px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    color: "#0d1b2a",
  },

  container: {
    maxWidth: "980px",
    margin: "0 auto",
  },

  loadingCard: {
    maxWidth: "600px",
    margin: "120px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "45px 30px",
    textAlign: "center",
    boxShadow:
      "0 15px 45px rgba(13,27,42,0.10)",
  },

  successCard: {
    maxWidth: "650px",
    margin: "90px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow:
      "0 15px 45px rgba(13,27,42,0.10)",
  },

  errorCard: {
    maxWidth: "650px",
    margin: "90px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow:
      "0 15px 45px rgba(13,27,42,0.10)",
  },

  header: {
    textAlign: "center",
    marginBottom: "25px",
  },

  logoText: {
    color: "#c9a84c",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "2px",
    marginBottom: "12px",
  },

  examMeta: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px 24px",
    margin: "0 auto 16px",
    color: "#667085",
    fontSize: "13px",
    fontWeight: "700",
  },

  title: {
    margin: "0 0 8px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "40px",
    lineHeight: 1.15,
  },

  examSubtitle: {
    fontSize: "16px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    color: "#0d1b2a",
    marginBottom: "18px",
  },

  loadingTitle: {
    margin: "0 0 10px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "27px",
  },

  examInstructions: {
    maxWidth: "650px",
    margin: "0 auto 14px",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "8px 25px",
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "12px",
    padding: "13px 18px",
    color: "#0d1b2a",
    fontSize: "14px",
  },

  intro: {
    maxWidth: "700px",
    margin: "0 auto",
    color: "#667085",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  muted: {
    color: "#667085",
  },

  spinner: {
    fontSize: "45px",
    margin: "20px 0",
  },

  tabWarning: {
    background: "#fff4d6",
    border: "1px solid #e5c76b",
    borderRadius: "12px",
    padding: "15px 18px",
    marginBottom: "15px",
    color: "#6b5512",
    fontSize: "13px",
    lineHeight: 1.65,
  },

  warningTitle: {
    fontWeight: "900",
    marginBottom: "3px",
  },

  tabWarningCount: {
    marginTop: "6px",
    fontSize: "11px",
    fontWeight: "900",
  },

  topBar: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "15px",
    padding: "16px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "10px",
    boxShadow:
      "0 5px 18px rgba(13,27,42,0.04)",
  },

  topBarItem: {
    minWidth: "110px",
  },

  progressLabel: {
    fontSize: "9px",
    fontWeight: "900",
    color: "#8a8f98",
    letterSpacing: "1px",
  },

  progressValue: {
    marginTop: "4px",
    fontSize: "17px",
    fontWeight: "900",
  },

  timerBox: {
    textAlign: "center",
    padding: "5px 18px",
    borderLeft:
      "1px solid #eee8de",
    borderRight:
      "1px solid #eee8de",
  },

  timerLabel: {
    fontSize: "9px",
    fontWeight: "900",
    color: "#8a8f98",
    letterSpacing: "1px",
  },

  timer: {
    fontSize: "30px",
    fontWeight: "900",
    marginTop: "3px",
    color: "#0d1b2a",
    fontVariantNumeric:
      "tabular-nums",
    letterSpacing: "1px",
  },

  timerDanger: {
    color: "#a33a3a",
  },

  timerSubtext: {
    fontSize: "9px",
    fontWeight: "900",
    color: "#8a8f98",
    marginTop: "2px",
    letterSpacing: "1px",
  },

  progressBarOuter: {
    height: "6px",
    background: "#e5dfd5",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "22px",
  },

  progressBarInner: {
    height: "100%",
    background: "#c9a84c",
    borderRadius: "6px",
    transition:
      "width 0.2s ease",
  },

  questionCard: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "20px",
    padding: "34px",
    boxShadow:
      "0 8px 25px rgba(13,27,42,0.06)",
  },

  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "17px",
  },

  questionNumber: {
    color: "#c9a84c",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "1.5px",
  },

  pointsBadge: {
    background: "#f8f4ee",
    border: "1px solid #e8e2d8",
    borderRadius: "20px",
    padding: "6px 11px",
    fontSize: "10px",
    fontWeight: "900",
    color: "#8a6d1d",
  },

  sectionName: {
    display: "inline-block",
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "18px",
    letterSpacing: "0.3px",
  },

  instruction: {
    color: "#667085",
    fontSize: "17px",
    fontWeight: "800",
    lineHeight: 1.6,
    marginBottom: "16px",
  },

  questionText: {
    background: "#f8f4ee",
    borderLeft:
      "5px solid #c9a84c",
    borderRadius: "10px",
    padding: "23px 22px",
    marginBottom: "28px",
    fontSize: "22px",
    lineHeight: 1.75,
    color: "#18283a",
    fontWeight: "700",
  },

  underlinedText: {
    textDecorationLine:
      "underline",
    textDecorationThickness:
      "3px",
    textUnderlineOffset: "5px",
    fontWeight: "900",
  },

  answerArea: {
    marginTop: "10px",
  },

  answerLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "900",
    color: "#0d1b2a",
    marginBottom: "9px",
  },

  answerInput: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "2px solid #d8d1c5",
    borderRadius: "12px",
    padding: "16px 17px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    fontSize: "18px",
    color: "#0d1b2a",
    background: "#ffffff",
    outline: "none",
  },

  answerSelect: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "2px solid #d8d1c5",
    borderRadius: "12px",
    padding: "16px 15px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    fontSize: "18px",
    fontWeight: "700",
    color: "#0d1b2a",
    background: "#ffffff",
    outline: "none",
    cursor: "pointer",
  },

  answerInputLocked: {
    background: "#f1f8f3",
    border:
      "2px solid #b9d9c1",
    color: "#24713b",
    fontWeight: "800",
  },

  multiAnswerArea: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  multiField: {
    background: "#faf9f6",
    border:
      "1px solid #e8e2d8",
    borderRadius: "12px",
    padding: "15px",
  },

  multiFieldLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "900",
    color: "#667085",
    marginBottom: "8px",
    textTransform:
      "uppercase",
    letterSpacing: "0.8px",
  },

  propositionArea: {
    background: "#faf9f6",
    border:
      "1px solid #e8e2d8",
    borderRadius: "14px",
    padding: "20px",
  },

  propositionHelp: {
    color: "#667085",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  propositionChoices: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  propositionButton: {
    width: "100%",
    textAlign: "left",
    background: "#ffffff",
    border:
      "2px solid #ddd6cb",
    borderRadius: "11px",
    padding: "17px 18px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    fontSize: "18px",
    fontWeight: "700",
    color: "#263445",
    cursor: "pointer",
  },

  propositionButtonSelected: {
    border:
      "2px solid #c9a84c",
    background: "#fffaf0",
    color: "#0d1b2a",
  },

  selectedCheck: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#c9a84c",
    color: "#0d1b2a",
    marginRight: "10px",
    fontSize: "13px",
    fontWeight: "900",
  },

  selectedUnderline: {
    textDecorationLine:
      "underline",
    textDecorationThickness:
      "3px",
    textUnderlineOffset: "5px",
    fontWeight: "900",
  },

  answerLockedMessage: {
    marginTop: "12px",
    padding: "11px 14px",
    background: "#f1f8f3",
    border:
      "1px solid #cce5d2",
    borderRadius: "8px",
    color: "#24713b",
    fontSize: "12px",
    fontWeight: "800",
  },

  answerErrorMessage: {
    marginTop: "10px",
    padding: "11px 14px",
    background: "#fdecec",
    border:
      "1px solid #efc4c4",
    borderRadius: "8px",
    color: "#a33a3a",
    fontSize: "13px",
    fontWeight: "800",
  },

  navigation: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "22px",
  },

  primaryButton: {
    background: "#0d1b2a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "14px 24px",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.45,
    cursor: "not-allowed",
  },

  submitButton: {
    background: "#c9a84c",
    color: "#0d1b2a",
    border: "none",
    borderRadius: "10px",
    padding: "15px 27px",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  disabledSubmitButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  warning: {
    textAlign: "center",
    marginTop: "18px",
    color: "#667085",
    fontSize: "11px",
    lineHeight: 1.6,
  },

  examFooter: {
    textAlign: "center",
    marginTop: "35px",
    color: "#9a948b",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
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

  errorIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#fdecec",
    color: "#a33a3a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    fontWeight: "800",
  },

  scoreBox: {
    margin: "25px auto",
    padding: "22px",
    background: "#f8f4ee",
    border:
      "1px solid #e8e2d8",
    borderRadius: "14px",
  },

  scoreLabel: {
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    color: "#8a8f98",
  },

  scoreValue: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#0d1b2a",
    marginTop: "5px",
  },

  percentage: {
    fontSize: "17px",
    fontWeight: "900",
    color: "#8a6d1d",
    marginTop: "3px",
  },

  text: {
    color: "#667085",
    lineHeight: 1.7,
  },

  errorText: {
    color: "#a33a3a",
    lineHeight: 1.7,
    fontWeight: "700",
    marginBottom: "25px",
  },
};