import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EXAM_TYPE = "exam_idriss";
const EXAM_TABLE_ATTEMPTS = "exam_idriss_attempts";
const TEST_DURATION = 2 * 60 * 60;

const ANSWERS_STORAGE_PREFIX = "ifa_exam_idriss_answers_";
const POSITION_STORAGE_PREFIX = "ifa_exam_idriss_position_";

const questions = [
  // I. LE PRÉSENT DE L’INDICATIF
  {
    id: 1,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Je __________ (être) très heureux aujourd’hui.",
    acceptedAnswers: ["suis"],
  },
  {
    id: 2,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Nous __________ (avoir) beaucoup de devoirs.",
    acceptedAnswers: ["avons"],
  },
  {
    id: 3,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Tu __________ (aller) à l’école tous les jours.",
    acceptedAnswers: ["vas"],
  },
  {
    id: 4,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Ils __________ (faire) leurs exercices.",
    acceptedAnswers: ["font"],
  },
  {
    id: 5,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Elle __________ (prendre) le bus le matin.",
    acceptedAnswers: ["prend"],
  },
  {
    id: 6,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Vous __________ (finir) votre travail à midi.",
    acceptedAnswers: ["finissez"],
  },
  {
    id: 7,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Je __________ (manger) une pomme.",
    acceptedAnswers: ["mange"],
  },
  {
    id: 8,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Nous __________ (venir) de l’école.",
    acceptedAnswers: ["venons"],
  },
  {
    id: 9,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Paul __________ (lire) un livre.",
    acceptedAnswers: ["lit"],
  },
  {
    id: 10,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Les enfants __________ (jouer) dans la cour.",
    acceptedAnswers: ["jouent"],
  },
  {
    id: 11,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Tu __________ (écrire) une lettre à ton ami.",
    acceptedAnswers: ["écris"],
  },
  {
    id: 12,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Elles __________ (boire) du lait.",
    acceptedAnswers: ["boivent"],
  },
  {
    id: 13,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Vous __________ (parler) français en classe.",
    acceptedAnswers: ["parlez"],
  },
  {
    id: 14,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Ma sœur __________ (dormir) huit heures par nuit.",
    acceptedAnswers: ["dort"],
  },
  {
    id: 15,
    section: "I. LE PRÉSENT DE L’INDICATIF",
    instruction: "Conjugue le verbe au présent :",
    text: "Je __________ (voir) mes amis chaque samedi.",
    acceptedAnswers: ["vois"],
  },

  // II. LE PASSÉ COMPOSÉ
  {
    id: 16,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Hier, j’__________ (manger) au restaurant.",
    acceptedAnswers: ["ai mange", "ai mangé"],
  },
  {
    id: 17,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Nous __________ (regarder) un film hier soir.",
    acceptedAnswers: ["avons regarde", "avons regardé"],
  },
  {
    id: 18,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Tu __________ (finir) tes devoirs.",
    acceptedAnswers: ["as fini"],
  },
  {
    id: 19,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Elle __________ (prendre) le train.",
    acceptedAnswers: ["a pris"],
  },
  {
    id: 20,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Ils __________ (jouer) au football.",
    acceptedAnswers: ["ont joue", "ont joué"],
  },
  {
    id: 21,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Vous __________ (faire) un bon travail.",
    acceptedAnswers: ["avez fait"],
  },
  {
    id: 22,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Je __________ (lire) ce livre.",
    acceptedAnswers: ["ai lu"],
  },
  {
    id: 23,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Marie __________ (aller) au marché.",
    acceptedAnswers: ["est allee", "est allée"],
  },
  {
    id: 24,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Nous __________ (venir) à l’école à huit heures.",
    acceptedAnswers: ["sommes venus"],
  },
  {
    id: 25,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Les élèves __________ (écrire) une composition.",
    acceptedAnswers: ["ont ecrit", "ont écrit"],
  },
  {
    id: 26,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Tu __________ (boire) du jus.",
    acceptedAnswers: ["as bu"],
  },
  {
    id: 27,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Il __________ (voir) son professeur.",
    acceptedAnswers: ["a vu"],
  },
  {
    id: 28,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Elles __________ (arriver) à l’heure.",
    acceptedAnswers: ["sont arrivees", "sont arrivées"],
  },
  {
    id: 29,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "J’__________ (acheter) une nouvelle chemise.",
    acceptedAnswers: ["ai achete", "ai acheté"],
  },
  {
    id: 30,
    section: "II. LE PASSÉ COMPOSÉ",
    instruction: "Mets le verbe au passé composé :",
    text: "Paul et Jean __________ (partir) tôt ce matin.",
    acceptedAnswers: ["sont partis"],
  },

  // III. LE FUTUR PROCHE
  {
    id: 31,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Demain, je __________ (aller) au marché.",
    acceptedAnswers: ["vais aller"],
  },
  {
    id: 32,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Nous __________ (faire) nos devoirs ce soir.",
    acceptedAnswers: ["allons faire"],
  },
  {
    id: 33,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Tu __________ (manger) au restaurant demain.",
    acceptedAnswers: ["vas manger"],
  },
  {
    id: 34,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Elle __________ (prendre) le bus dans quelques minutes.",
    acceptedAnswers: ["va prendre"],
  },
  {
    id: 35,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Ils __________ (jouer) au football cet après-midi.",
    acceptedAnswers: ["vont jouer"],
  },
  {
    id: 36,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Vous __________ (visiter) le musée samedi.",
    acceptedAnswers: ["allez visiter"],
  },
  {
    id: 37,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Je __________ (lire) ce livre ce soir.",
    acceptedAnswers: ["vais lire"],
  },
  {
    id: 38,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Nous __________ (acheter) une nouvelle voiture.",
    acceptedAnswers: ["allons acheter"],
  },
  {
    id: 39,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Il __________ (téléphoner) à son ami.",
    acceptedAnswers: ["va telephoner", "va téléphoner"],
  },
  {
    id: 40,
    section: "III. LE FUTUR PROCHE",
    instruction: "Mets le verbe au futur proche :",
    text: "Elles __________ (préparer) le repas ce soir.",
    acceptedAnswers: ["vont preparer", "vont préparer"],
  },

  // IV. LE FUTUR SIMPLE
  {
    id: 41,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Demain, je __________ (aller) à l’école.",
    acceptedAnswers: ["irai"],
  },
  {
    id: 42,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Nous __________ (avoir) un examen lundi.",
    acceptedAnswers: ["aurons"],
  },
  {
    id: 43,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Tu __________ (être) heureux dans cette nouvelle école.",
    acceptedAnswers: ["seras"],
  },
  {
    id: 44,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Elle __________ (faire) ses devoirs après le dîner.",
    acceptedAnswers: ["fera"],
  },
  {
    id: 45,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Ils __________ (venir) chez nous dimanche.",
    acceptedAnswers: ["viendront"],
  },
  {
    id: 46,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Vous __________ (finir) votre travail demain.",
    acceptedAnswers: ["finirez"],
  },
  {
    id: 47,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Je __________ (prendre) le train la semaine prochaine.",
    acceptedAnswers: ["prendrai"],
  },
  {
    id: 48,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Nous __________ (manger) ensemble ce soir.",
    acceptedAnswers: ["mangerons"],
  },
  {
    id: 49,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Il __________ (lire) ce livre pendant les vacances.",
    acceptedAnswers: ["lira"],
  },
  {
    id: 50,
    section: "IV. LE FUTUR SIMPLE",
    instruction: "Mets le verbe au futur simple :",
    text: "Elles __________ (partir) en voyage l’année prochaine.",
    acceptedAnswers: ["partiront"],
  },
];

const bonusQuestions = [
  {
    id: "bonus_1",
    question: "Écris une phrase au présent :",
  },
  {
    id: "bonus_2",
    question: "Écris une phrase au passé composé :",
  },
  {
    id: "bonus_3",
    question: "Écris une phrase au futur proche :",
  },
  {
    id: "bonus_4",
    question: "Écris une phrase au futur simple :",
  },
  {
    id: "bonus_5",
    question: "Écris une phrase contenant deux temps différents :",
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

function calculateScore(answerSet) {
  return questions.reduce((total, question) => {
    const studentAnswer = answerSet?.[question.id];

    return (
      total +
      (isAnswerCorrect(
        studentAnswer,
        question.acceptedAnswers || []
      )
        ? 1
        : 0)
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

function getPositionStorageKey(attemptId) {
  return `${POSITION_STORAGE_PREFIX}${attemptId}`;
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

function loadPositionFromStorage(attemptId) {
  if (!attemptId) {
    return null;
  }

  try {
    const raw = localStorage.getItem(
      getPositionStorageKey(attemptId)
    );

    if (raw === null) {
      return null;
    }

    const position = Number(raw);

    if (
      Number.isInteger(position) &&
      position >= 0 &&
      position < questions.length
    ) {
      return position;
    }
  } catch (error) {
    console.error(
      "LOAD POSITION STORAGE ERROR:",
      error
    );
  }

  return null;
}

function savePositionToStorage(
  attemptId,
  position
) {
  if (
    !attemptId ||
    !Number.isInteger(position) ||
    position < 0 ||
    position >= questions.length
  ) {
    return;
  }

  try {
    localStorage.setItem(
      getPositionStorageKey(attemptId),
      String(position)
    );
  } catch (error) {
    console.error(
      "SAVE POSITION STORAGE ERROR:",
      error
    );
  }
}

function clearPositionFromStorage(attemptId) {
  if (!attemptId) {
    return;
  }

  try {
    localStorage.removeItem(
      getPositionStorageKey(attemptId)
    );
  } catch (error) {
    console.error(
      "CLEAR POSITION STORAGE ERROR:",
      error
    );
  }
}

export default function ExamIdriss() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [bonusAnswers, setBonusAnswers] = useState({});

  const [draftAnswer, setDraftAnswer] = useState("");
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

  const [showBonus, setShowBonus] = useState(false);

  const attemptRef = useRef(null);

  const answersRef = useRef({});
  const bonusAnswersRef = useRef({});

  const draftAnswerRef = useRef("");
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
    bonusAnswersRef.current = bonusAnswers;
  }, [bonusAnswers]);

  useEffect(() => {
    draftAnswerRef.current = draftAnswer;
  }, [draftAnswer]);

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
          Number(existingResult.percentage)
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

      /*
       * RESTORE SAVED ANSWERS
       */

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
       * RESTORE CURRENT QUESTION
       *
       * This fixes the refresh problem.
       */

      const storedPosition =
        loadPositionFromStorage(
          attempt.id
        );

      let resumePosition = 0;

      if (
        storedPosition !== null &&
        !Object.prototype.hasOwnProperty.call(
          storedAnswers,
          questions[storedPosition]?.id
        )
      ) {
        resumePosition =
          storedPosition;
      } else {
        const firstUnansweredIndex =
          questions.findIndex(
            (item) =>
              !Object.prototype.hasOwnProperty.call(
                storedAnswers,
                item.id
              )
          );

        if (
          firstUnansweredIndex >= 0
        ) {
          resumePosition =
            firstUnansweredIndex;
        } else {
          resumePosition =
            questions.length - 1;
        }
      }

      currentQuestionRef.current =
        resumePosition;

      setCurrentQuestion(
        resumePosition
      );

      draftAnswerRef.current =
        "";

      setDraftAnswer("");

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
   * GET THE MOST RECENT ANSWERS
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

    if (
      Object.prototype.hasOwnProperty.call(
        finalAnswers,
        currentItem.id
      )
    ) {
      return finalAnswers;
    }

    const value =
      String(
        draftAnswerRef.current ?? ""
      ).trim();

    if (value) {
      finalAnswers[
        currentItem.id
      ] = value;
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
     * CLEAR RESUME POSITION
     */

    clearPositionFromStorage(
      attempt.id
    );

    draftAnswerRef.current =
      "";

    setDraftAnswer("");

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

  function saveCurrentAnswer() {
    const value =
      String(
        draftAnswerRef.current ?? ""
      ).trim();

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

  function goNext() {
    if (answerLocked) {
      return;
    }

    if (
      !String(
        draftAnswerRef.current ?? ""
      ).trim()
    ) {
      setAnswerMessage(
        "Veuillez écrire une réponse avant de continuer."
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

      /*
       * SAVE CURRENT POSITION
       *
       * This ensures refresh returns
       * to the question the student
       * was actually working on.
       */

      if (
        serverAttemptIdRef.current
      ) {
        savePositionToStorage(
          serverAttemptIdRef.current,
          nextQuestion
        );
      }

      currentQuestionRef.current =
        nextQuestion;

      setCurrentQuestion(
        nextQuestion
      );

      draftAnswerRef.current =
        "";

      setDraftAnswer("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
   * BONUS
   */

  function handleBonusChange(
    questionId,
    value
  ) {
    const updated = {
      ...bonusAnswersRef.current,
      [questionId]: value,
    };

    bonusAnswersRef.current =
      updated;

    setBonusAnswers(
      updated
    );
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
        !String(
          draftAnswerRef.current ?? ""
        ).trim()
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

      const activeAttemptId =
        serverAttemptIdRef.current ||
        serverAttemptId;

      if (activeAttemptId) {
        saveAnswersToStorage(
          activeAttemptId,
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

          clearPositionFromStorage(
            activeAttemptId
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
       * CLEAR RESUME POSITION
       */

      clearPositionFromStorage(
        activeAttemptId
      );

      draftAnswerRef.current =
        "";

      setDraftAnswer("");

      setCompleted(true);

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
   * LOADING SCREEN
   */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.spinner}>
            ◌
          </div>

          <h1 style={styles.loadingTitle}>
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
          <div style={styles.errorCard}>
            <div style={styles.logoText}>
              INTERNATIONAL FRENCH ACADEMY
            </div>

            <div style={styles.errorIcon}>
              !
            </div>

            <h1 style={styles.title}>
              Examen terminé
            </h1>

            <p style={styles.errorText}>
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

            <div style={styles.scoreBox}>
              <div style={styles.scoreLabel}>
                VOTRE SCORE
              </div>

              <div style={styles.scoreValue}>
                {score ?? 0} /{" "}
                {questions.length}
              </div>

              <div style={styles.percentage}>
                {percentage ?? 0}%
              </div>
            </div>

            <p style={styles.text}>
              Le bonus de 5 points est corrigé
              séparément par l’enseignant.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student-dashboard"
                )
              }
              style={styles.primaryButton}
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
          <div style={styles.errorCard}>
            <div style={styles.logoText}>
              INTERNATIONAL FRENCH ACADEMY
            </div>

            <div style={styles.errorIcon}>
              !
            </div>

            <h1 style={styles.title}>
              Temps écoulé
            </h1>

            <p style={styles.errorText}>
              Les 2 heures de l'examen sont
              terminées.
            </p>

            <p style={styles.text}>
              Vos réponses ont été enregistrées
              automatiquement.
            </p>

            <div style={styles.scoreBox}>
              <div style={styles.scoreLabel}>
                VOTRE SCORE
              </div>

              <div style={styles.scoreValue}>
                {score ?? 0} /{" "}
                {questions.length}
              </div>

              <div style={styles.percentage}>
                {percentage ?? 0}%
              </div>
            </div>

            <p style={styles.text}>
              Le bonus de 5 points est corrigé
              séparément par l’enseignant.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student-dashboard"
                )
              }
              style={styles.primaryButton}
            >
              Retour à mon espace
            </button>
          </div>
        </div>
      );
    }

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
            Examen terminé
          </h1>

          <p style={styles.text}>
            Votre examen a été enregistré avec
            succès.
          </p>

          <div style={styles.scoreBox}>
            <div style={styles.scoreLabel}>
              VOTRE SCORE
            </div>

            <div style={styles.scoreValue}>
              {score ?? 0} /{" "}
              {questions.length}
            </div>

            <div style={styles.percentage}>
              {percentage ?? 0}%
            </div>
          </div>

          <p style={styles.text}>
            Le bonus de 5 points est corrigé
            séparément par l’enseignant.
          </p>

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
            style={styles.primaryButton}
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
        <div style={styles.errorCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.errorIcon}>
            !
          </div>

          <h1 style={styles.title}>
            Accès à l'examen
          </h1>

          <p style={styles.errorText}>
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
            style={styles.primaryButton}
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  /*
   * MAIN EXAM UI
   */

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.examMeta}>
            <span>
              Mme IDRISS
            </span>

            <span>
              Classe : A1
            </span>

            <span>
              Date : Le 04/10/2026
            </span>
          </div>

          <h1 style={styles.title}>
            EXAMEN DE FRANÇAIS
          </h1>

          <div style={styles.examSubtitle}>
            LES TEMPS DES VERBES
          </div>

          <div style={styles.examInstructions}>
            <strong>
              50 questions — 50 points
            </strong>

            <span>
              Durée : 2 heures
            </span>

            <span>
              Bonus : 5 points
            </span>
          </div>

          <p style={styles.intro}>
            Lisez attentivement chaque question.
            Répondez à toutes les questions avant
            de terminer l'examen.
          </p>
        </header>

        {tabSwitches === 1 && (
          <div style={styles.tabWarning}>
            <div style={styles.warningTitle}>
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

            <div style={styles.tabWarningCount}>
              Changements d'onglet : 1 / 2
            </div>
          </div>
        )}

        <div style={styles.topBar}>
          <div style={styles.topBarItem}>
            <div style={styles.progressLabel}>
              QUESTION
            </div>

            <div style={styles.progressValue}>
              {currentQuestion + 1} /{" "}
              {questions.length}
            </div>
          </div>

          <div style={styles.timerBox}>
            <div style={styles.timerLabel}>
              TEMPS RESTANT
            </div>

            <div
              style={{
                ...styles.timer,
                ...(timeLeft !== null &&
                timeLeft <= 600
                  ? styles.timerDanger
                  : {}),
              }}
            >
              {formatTime(timeLeft)}
            </div>

            <div style={styles.timerSubtext}>
              2 HEURES
            </div>
          </div>

          <div style={styles.topBarItem}>
            <div style={styles.progressLabel}>
              RÉPONDUES
            </div>

            <div style={styles.progressValue}>
              {answeredCount} /{" "}
              {questions.length}
            </div>
          </div>
        </div>

        <div style={styles.progressBarOuter}>
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

        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <div style={styles.questionNumber}>
              QUESTION {currentQuestion + 1}
            </div>

            <div style={styles.pointsBadge}>
              1 POINT
            </div>
          </div>

          <div style={styles.sectionName}>
            {question.section}
          </div>

          <div style={styles.instruction}>
            {question.instruction}
          </div>

          <div style={styles.questionText}>
            {question.text}
          </div>

          <div style={styles.answerArea}>
            <label style={styles.answerLabel}>
              Votre réponse
            </label>

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
                    String(
                      draftAnswerRef.current ??
                      ""
                    ).trim()
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

            {answerMessage && (
              <div style={styles.answerErrorMessage}>
                {answerMessage}
              </div>
            )}

            {answerLocked && (
              <div style={styles.answerLockedMessage}>
                ✓ Réponse enregistrée — cette
                réponse ne peut plus être
                modifiée.
              </div>
            )}
          </div>
        </div>

        <div style={styles.navigation}>
          {!isLastQuestion ? (
            <button
              type="button"
              onClick={goNext}
              disabled={
                answerLocked ||
                !String(
                  draftAnswer
                ).trim()
              }
              style={{
                ...styles.primaryButton,
                ...(answerLocked ||
                !String(
                  draftAnswer
                ).trim()
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
                !String(
                  draftAnswer
                ).trim()
              }
              style={{
                ...styles.submitButton,
                ...(submitting ||
                answerLocked ||
                !String(
                  draftAnswer
                ).trim()
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

        {isLastQuestion && (
          <div style={styles.bonusSection}>
            <button
              type="button"
              onClick={() =>
                setShowBonus(
                  !showBonus
                )
              }
              style={styles.bonusToggle}
            >
              {showBonus
                ? "Masquer le bonus"
                : "Voir les questions bonus — 5 points"}
            </button>

            {showBonus && (
              <div style={styles.bonusCard}>
                <div style={styles.bonusTitle}>
                  BONUS — 5 points
                </div>

                <p style={styles.bonusIntro}>
                  Ces questions sont corrigées
                  manuellement par l’enseignant.
                </p>

                {bonusQuestions.map(
                  (bonus) => (
                    <div
                      key={bonus.id}
                      style={
                        styles.bonusQuestion
                      }
                    >
                      <label
                        style={
                          styles.bonusLabel
                        }
                      >
                        {bonus.question}
                      </label>

                      <textarea
                        value={
                          bonusAnswers[
                            bonus.id
                          ] || ""
                        }
                        onChange={(event) =>
                          handleBonusChange(
                            bonus.id,
                            event.target.value
                          )
                        }
                        rows={4}
                        placeholder="Écrivez votre phrase ici..."
                        style={
                          styles.bonusTextarea
                        }
                      />
                    </div>
                  )
                )}

                <div style={styles.bonusNotice}>
                  ⚠️ Le bonus est indépendant du
                  score automatique /50 et doit
                  être corrigé par l’enseignant.
                </div>
              </div>
            )}
          </div>
        )}

        <div style={styles.warning}>
          <strong>
            ⚠️ Attention :
          </strong>{" "}
          Une seule tentative est autorisée.
          Après avoir enregistré une réponse et
          continué, cette réponse ne peut plus
          être modifiée.
        </div>

        <div style={styles.examFooter}>
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
    maxWidth: "700px",
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

  answerInputLocked: {
    background: "#f1f8f3",
    border:
      "2px solid #b9d9c1",
    color: "#24713b",
    fontWeight: "800",
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

  bonusSection: {
    marginTop: "25px",
  },

  bonusToggle: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #c9a84c",
    borderRadius: "12px",
    padding: "15px 20px",
    color: "#8a6d1d",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  bonusCard: {
    marginTop: "12px",
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "16px",
    padding: "25px",
  },

  bonusTitle: {
    fontSize: "20px",
    fontWeight: "900",
    color: "#0d1b2a",
    marginBottom: "8px",
  },

  bonusIntro: {
    color: "#667085",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "20px",
  },

  bonusQuestion: {
    marginBottom: "20px",
  },

  bonusLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "800",
    color: "#0d1b2a",
    marginBottom: "8px",
  },

  bonusTextarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "2px solid #d8d1c5",
    borderRadius: "10px",
    padding: "14px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    fontSize: "16px",
    lineHeight: 1.5,
    resize: "vertical",
    outline: "none",
  },

  bonusNotice: {
    background: "#fffaf0",
    border: "1px solid #e5c76b",
    borderRadius: "10px",
    padding: "13px 15px",
    color: "#6b5512",
    fontSize: "12px",
    lineHeight: 1.6,
    fontWeight: "700",
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