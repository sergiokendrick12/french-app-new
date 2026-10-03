import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EXAM_TYPE = "exam_joan";
const EXAM_TABLE_ATTEMPTS = "exam_joan_attempts";

const TEST_DURATION = 2 * 60 * 60;

const ANSWERS_STORAGE_PREFIX = "ifa_exam_joan_answers_";
const POSITION_STORAGE_PREFIX = "ifa_exam_joan_position_";

/* =========================================================
   EXAM QUESTIONS — 50 QUESTIONS
========================================================= */

const questions = [
  /* =========================================================
     A. PRÉSENT DE L'INDICATIF
  ========================================================= */

  {
    id: 1,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt: "Conjugue le verbe être au présent avec « je ».",
    answer: "suis",
  },
  {
    id: 2,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt: "Conjugue le verbe avoir au présent avec « nous ».",
    answer: "avons",
  },
  {
    id: 3,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt: "Conjugue le verbe aller au présent avec « ils ».",
    answer: "vont",
  },
  {
    id: 4,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt:
      "Mets le verbe entre parenthèses au présent : Nous __________ (manger) à la cantine.",
    answer: "mangeons",
  },
  {
    id: 5,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt:
      "Mets le verbe entre parenthèses au présent : Tu __________ (finir) tes devoirs.",
    answer: "finis",
  },
  {
    id: 6,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt:
      "Mets le verbe entre parenthèses au présent : Elle __________ (prendre) le bus.",
    answer: "prend",
  },
  {
    id: 7,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt:
      "Mets le verbe entre parenthèses au présent : Vous __________ (faire) du sport.",
    answer: "faites",
  },
  {
    id: 8,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt:
      "Mets le verbe entre parenthèses au présent : Je __________ (lire) un livre.",
    answer: "lis",
  },
  {
    id: 9,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt:
      "Mets la phrase au présent : « Hier, Paul jouait au football. » → Aujourd’hui, Paul __________ au football.",
    answer: "joue",
  },
  {
    id: 10,
    section: "A. LES VERBES : PRÉSENT DE L’INDICATIF",
    prompt:
      "Complète : Nous __________ (venir) de l’école à 16 heures.",
    answer: "venons",
  },

  /* =========================================================
     B. PASSÉ COMPOSÉ
  ========================================================= */

  {
    id: 11,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt: "Conjugue manger au passé composé avec « je ».",
    answer: "ai mangé",
  },
  {
    id: 12,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt: "Conjugue finir au passé composé avec « nous ».",
    answer: "avons fini",
  },
  {
    id: 13,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Mets le verbe entre parenthèses au passé composé : Tu __________ (regarder) un film.",
    answer: "as regardé",
  },
  {
    id: 14,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Mets le verbe entre parenthèses au passé composé : Ils __________ (jouer) au football.",
    answer: "ont joué",
  },
  {
    id: 15,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Mets le verbe entre parenthèses au passé composé : Elle __________ (prendre) son petit-déjeuner.",
    answer: "a pris",
  },
  {
    id: 16,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Mets le verbe entre parenthèses au passé composé : Nous __________ (aller) au marché.",
    answer: "sommes allés",
    acceptedAnswers: [
      "sommes allés",
      "sommes alles",
      "sommes allées",
      "sommes allees",
    ],
  },
  {
    id: 17,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Mets le verbe entre parenthèses au passé composé : Vous __________ (faire) vos exercices.",
    answer: "avez fait",
  },
  {
    id: 18,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Mets le verbe entre parenthèses au passé composé : Je __________ (lire) ce livre.",
    answer: "ai lu",
  },
  {
    id: 19,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Transforme au passé composé : « Marie prépare le repas. »",
    answer: "Marie a préparé le repas.",
    acceptedAnswers: [
      "Marie a préparé le repas.",
      "Marie a prepare le repas.",
    ],
  },
  {
    id: 20,
    section: "B. LE PASSÉ COMPOSÉ",
    prompt:
      "Transforme au passé composé : « Les enfants arrivent à l’école. »",
    answer: "Les enfants sont arrivés à l’école.",
    acceptedAnswers: [
      "Les enfants sont arrivés à l’école.",
      "Les enfants sont arrives a l'ecole.",
      "Les enfants sont arrives a l’école.",
      "Les enfants sont arrivés a l'ecole.",
    ],
  },

  /* =========================================================
     C. FUTUR PROCHE
  ========================================================= */

  {
    id: 21,
    section: "C. LE FUTUR PROCHE",
    prompt: "Conjugue manger au futur proche avec « je ».",
    answer: "vais manger",
  },
  {
    id: 22,
    section: "C. LE FUTUR PROCHE",
    prompt:
      "Mets le verbe entre parenthèses au futur proche : Nous __________ (visiter) le musée demain.",
    answer: "allons visiter",
  },
  {
    id: 23,
    section: "C. LE FUTUR PROCHE",
    prompt:
      "Mets le verbe entre parenthèses au futur proche : Elle __________ (faire) ses devoirs ce soir.",
    answer: "va faire",
  },
  {
    id: 24,
    section: "C. LE FUTUR PROCHE",
    prompt:
      "Mets la phrase au futur proche : « Je prends le train. »",
    answer: "Je vais prendre le train.",
    acceptedAnswers: [
      "Je vais prendre le train.",
      "Je vais prendre le train",
    ],
  },
  {
    id: 25,
    section: "C. LE FUTUR PROCHE",
    prompt:
      "Mets la phrase au futur proche : « Ils jouent au football. »",
    answer: "Ils vont jouer au football.",
    acceptedAnswers: [
      "Ils vont jouer au football.",
      "Ils vont jouer au football",
    ],
  },

  /* =========================================================
     D. FUTUR SIMPLE
  ========================================================= */

  {
    id: 26,
    section: "D. LE FUTUR SIMPLE",
    prompt: "Conjugue parler au futur simple avec « je ».",
    answer: "parlerai",
  },
  {
    id: 27,
    section: "D. LE FUTUR SIMPLE",
    prompt:
      "Mets le verbe entre parenthèses au futur simple : Nous __________ (finir) nos devoirs demain.",
    answer: "finirons",
  },
  {
    id: 28,
    section: "D. LE FUTUR SIMPLE",
    prompt:
      "Mets le verbe entre parenthèses au futur simple : Tu __________ (avoir) une bonne note.",
    answer: "auras",
  },
  {
    id: 29,
    section: "D. LE FUTUR SIMPLE",
    prompt:
      "Mets le verbe entre parenthèses au futur simple : Ils __________ (être) à l’école lundi.",
    answer: "seront",
  },
  {
    id: 30,
    section: "D. LE FUTUR SIMPLE",
    prompt:
      "Mets la phrase au futur simple : « Je vais au marché. »",
    answer: "J’irai au marché.",
    acceptedAnswers: [
      "J’irai au marché.",
      "J'irai au marché.",
      "J'irai au marche.",
      "J’irai au marche.",
    ],
  },

  /* =========================================================
     E. PRONOMS PERSONNELS
  ========================================================= */

  {
    id: 31,
    section: "E. LES PRONOMS PERSONNELS",
    prompt:
      "Remplace le groupe souligné par un pronom personnel : Marie chante très bien. → __________ chante très bien.",
    answer: "elle",
  },
  {
    id: 32,
    section: "E. LES PRONOMS PERSONNELS",
    prompt:
      "Remplace le groupe souligné par un pronom personnel : Paul et Jean jouent au football. → __________ jouent au football.",
    answer: "ils",
  },
  {
    id: 33,
    section: "E. LES PRONOMS PERSONNELS",
    prompt:
      "Remplace le groupe souligné par un pronom personnel : Ma sœur et moi allons à l’école. → __________ allons à l’école.",
    answer: "nous",
  },
  {
    id: 34,
    section: "E. LES PRONOMS PERSONNELS",
    prompt:
      "Complète avec le pronom qui convient : __________ mangeons à la maison.",
    answer: "nous",
  },
  {
    id: 35,
    section: "E. LES PRONOMS PERSONNELS",
    prompt:
      "Complète avec le pronom qui convient : __________ aimez le français.",
    answer: "vous",
  },

  /* =========================================================
     F. EN ET Y
  ========================================================= */

  {
    id: 36,
    section: "F. LES PRONOMS « EN » ET « Y »",
    prompt:
      "Remplace le groupe souligné par en : Je mange du pain. → J’__________ mange.",
    answer: "en",
  },
  {
    id: 37,
    section: "F. LES PRONOMS « EN » ET « Y »",
    prompt:
      "Remplace le groupe souligné par en : Elle achète trois pommes. → Elle __________ achète trois.",
    answer: "en",
  },
  {
    id: 38,
    section: "F. LES PRONOMS « EN » ET « Y »",
    prompt:
      "Remplace le groupe souligné par y : Nous allons à l’école. → Nous __________ allons.",
    answer: "y",
  },
  {
    id: 39,
    section: "F. LES PRONOMS « EN » ET « Y »",
    prompt:
      "Remplace le groupe souligné par y : Il pense à son travail. → Il __________ pense.",
    answer: "y",
  },
  {
    id: 40,
    section: "F. LES PRONOMS « EN » ET « Y »",
    prompt:
      "Complète avec en ou y : Tu vas au marché ? Oui, j’__________ vais.",
    answer: "y",
  },

  /* =========================================================
     G. PRONOMS COMPLÉMENTS
  ========================================================= */

  {
    id: 41,
    section: "G. LES PRONOMS COMPLÉMENTS",
    prompt:
      "Remplace le complément par un pronom : Je regarde Paul. → Je __________ regarde.",
    answer: "le",
  },
  {
    id: 42,
    section: "G. LES PRONOMS COMPLÉMENTS",
    prompt:
      "Remplace le complément par un pronom : Elle aime sa mère. → Elle __________ aime.",
    answer: "la",
    acceptedAnswers: ["la", "l’", "l'"],
  },
  {
    id: 43,
    section: "G. LES PRONOMS COMPLÉMENTS",
    prompt:
      "Remplace le complément par un pronom : Nous parlons à Marie. → Nous __________ parlons.",
    answer: "lui",
  },
  {
    id: 44,
    section: "G. LES PRONOMS COMPLÉMENTS",
    prompt:
      "Complète avec le, la, les, lui ou leur : Je téléphone à mes parents. → Je __________ téléphone.",
    answer: "leur",
  },
  {
    id: 45,
    section: "G. LES PRONOMS COMPLÉMENTS",
    prompt:
      "Complète avec le, la, les, lui ou leur : Il achète les livres. → Il __________ achète.",
    answer: "les",
  },

  /* =========================================================
     H. CONJONCTIONS
  ========================================================= */

  {
    id: 46,
    section: "H. LES CONJONCTIONS",
    prompt:
      "Complète avec mais, et, ou, parce que : Je reste à la maison __________ il pleut.",
    answer: "parce que",
  },
  {
    id: 47,
    section: "H. LES CONJONCTIONS",
    prompt:
      "Complète avec mais, et, ou, parce que : Tu veux du thé __________ du café ?",
    answer: "ou",
  },
  {
    id: 48,
    section: "H. LES CONJONCTIONS",
    prompt:
      "Complète avec mais, et, ou, parce que : Paul est intelligent __________ il travaille beaucoup.",
    answer: "et",
  },

  /* =========================================================
     I. PRÉPOSITIONS
  ========================================================= */

  {
    id: 49,
    section: "I. LES PRÉPOSITIONS",
    prompt:
      "Complète avec la préposition qui convient : Je vais __________ l’école.",
    answer: "à",
  },
  {
    id: 50,
    section: "I. LES PRÉPOSITIONS",
    prompt:
      "Complète avec la préposition qui convient : Le livre est __________ la table.",
    answer: "sur",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .trim();
}

function isAnswerCorrect(question, userAnswer) {
  const normalizedUserAnswer =
    normalizeAnswer(userAnswer);

  if (!normalizedUserAnswer) {
    return false;
  }

  const accepted =
    question.acceptedAnswers || [question.answer];

  return accepted.some(
    (answer) =>
      normalizeAnswer(answer) ===
      normalizedUserAnswer
  );
}

function calculateScore(allAnswers) {
  return questions.reduce(
    (total, question) => {
      const userAnswer =
        allAnswers[question.id];

      if (
        isAnswerCorrect(
          question,
          userAnswer
        )
      ) {
        return total + 1;
      }

      return total;
    },
    0
  );
}

function calculatePercentage(score) {
  return Math.round(
    (score / questions.length) * 100
  );
}

function getAnswersStorageKey(attemptId) {
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
      getAnswersStorageKey(attemptId)
    );

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return {};
    }

    return parsed;
  } catch (error) {
    console.error(
      "LOAD ANSWERS STORAGE ERROR:",
      error
    );

    return {};
  }
}

function saveAnswersToStorage(
  attemptId,
  answers
) {
  if (!attemptId) {
    return;
  }

  try {
    localStorage.setItem(
      getAnswersStorageKey(attemptId),
      JSON.stringify(answers)
    );
  } catch (error) {
    console.error(
      "SAVE ANSWERS STORAGE ERROR:",
      error
    );
  }
}

function clearAnswersFromStorage(
  attemptId
) {
  if (!attemptId) {
    return;
  }

  try {
    localStorage.removeItem(
      getAnswersStorageKey(attemptId)
    );
  } catch (error) {
    console.error(
      "CLEAR ANSWERS STORAGE ERROR:",
      error
    );
  }
}

function loadPositionFromStorage(
  attemptId
) {
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

    const parsed = Number(raw);

    if (
      Number.isInteger(parsed) &&
      parsed >= 0 &&
      parsed < questions.length
    ) {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error(
      "LOAD POSITION STORAGE ERROR:",
      error
    );

    return null;
  }
}

function savePositionToStorage(
  attemptId,
  position
) {
  if (!attemptId) {
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

function clearPositionFromStorage(
  attemptId
) {
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

function formatTime(seconds) {
  const safeSeconds = Math.max(
    0,
    Number(seconds) || 0
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const secs = safeSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ].join(":");
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ExamJoan() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [draftAnswer, setDraftAnswer] =
    useState("");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(TEST_DURATION);

  const [timerReady, setTimerReady] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [answerMessage, setAnswerMessage] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  const [studentId, setStudentId] =
    useState(null);

  const [score, setScore] =
    useState(0);

  const [percentage, setPercentage] =
    useState(0);

  const [tabSwitches, setTabSwitches] =
    useState(0);

  const [terminationReason, setTerminationReason] =
    useState("");

  const [serverAttemptId, setServerAttemptId] =
    useState(null);

  const attemptIdRef =
    useRef(null);

  const answersRef =
    useRef({});

  const draftAnswerRef =
    useRef("");

  const currentQuestionRef =
    useRef(0);

  const studentIdRef =
    useRef(null);

  const serverAttemptIdRef =
    useRef(null);

  const tabSwitchProcessingRef =
    useRef(false);

  const accessCheckStartedRef =
    useRef(false);

  const submitStartedRef =
    useRef(false);

  const handleSubmitRef =
    useRef(null);

  const question =
    questions[currentQuestion];

  const answeredCount =
    useMemo(
      () =>
        Object.keys(answers).length,
      [answers]
    );

  const answerLocked =
    Object.prototype.hasOwnProperty.call(
      answers,
      question?.id
    );

  /* =========================================================
     SYNC REFS
  ========================================================= */

  useEffect(() => {
    answersRef.current =
      answers;
  }, [answers]);

  useEffect(() => {
    draftAnswerRef.current =
      draftAnswer;
  }, [draftAnswer]);

  useEffect(() => {
    currentQuestionRef.current =
      currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    studentIdRef.current =
      studentId;
  }, [studentId]);

  useEffect(() => {
    serverAttemptIdRef.current =
      serverAttemptId;
  }, [serverAttemptId]);

  /* =========================================================
     SAVE ANSWERS LOCALLY
  ========================================================= */

  useEffect(() => {
    if (!serverAttemptId) {
      return;
    }

    saveAnswersToStorage(
      serverAttemptId,
      answers
    );
  }, [
    answers,
    serverAttemptId,
  ]);

  /* =========================================================
     SAVE POSITION LOCALLY
  ========================================================= */

  useEffect(() => {
    if (!serverAttemptId) {
      return;
    }

    savePositionToStorage(
      serverAttemptId,
      currentQuestion
    );
  }, [
    currentQuestion,
    serverAttemptId,
  ]);

  /* =========================================================
     SAVE EXAM RESULT
  ========================================================= */

  const saveExamResult =
    useCallback(
      async (
        finalAnswers,
        reason = "completed"
      ) => {
        if (!studentIdRef.current) {
          throw new Error(
            "Student ID missing."
          );
        }

        const finalScore =
          calculateScore(
            finalAnswers
          );

        const finalPercentage =
          calculatePercentage(
            finalScore
          );

        const {
          data: existingResult,
          error: existingError,
        } = await supabase
          .from("test_results")
          .select("id")
          .eq(
            "student_id",
            studentIdRef.current
          )
          .eq(
            "test_type",
            EXAM_TYPE
          )
          .maybeSingle();

        if (existingError) {
          throw existingError;
        }

        if (!existingResult) {
          const {
            error: insertError,
          } = await supabase
            .from("test_results")
            .insert({
              student_id:
                studentIdRef.current,
              score: finalScore,
              total_questions:
                questions.length,
              percentage:
                finalPercentage,
              test_type:
                EXAM_TYPE,
              completed_at:
                new Date().toISOString(),
            });

          if (insertError) {
            throw insertError;
          }
        }

        if (
          serverAttemptIdRef.current
        ) {
          const {
            error: attemptError,
          } = await supabase
            .from(
              EXAM_TABLE_ATTEMPTS
            )
            .update({
              status: "finished",
              finished_at:
                new Date().toISOString(),
              tab_switches:
                reason === "tab_switch"
                  ? Math.max(
                      2,
                      Number(
                        tabSwitches || 0
                      )
                    )
                  : Number(
                      tabSwitches || 0
                    ),
              termination_reason:
                reason,
            })
            .eq(
              "id",
              serverAttemptIdRef.current
            )
            .eq(
              "student_id",
              studentIdRef.current
            );

          if (attemptError) {
            throw attemptError;
          }
        }

        setScore(finalScore);
        setPercentage(
          finalPercentage
        );
        setTerminationReason(
          reason
        );

        clearAnswersFromStorage(
          serverAttemptIdRef.current
        );

        clearPositionFromStorage(
          serverAttemptIdRef.current
        );

        setCompleted(true);
      },
      [tabSwitches]
    );

  /* =========================================================
     ACCESS CHECK
  ========================================================= */

  const checkAccess =
    useCallback(async () => {
      if (
        accessCheckStartedRef.current
      ) {
        return;
      }

      accessCheckStartedRef.current =
        true;

      try {
        setLoading(true);
        setMessage("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (
          userError ||
          !user
        ) {
          navigate(
            "/student-login",
            {
              replace: true,
            }
          );

          return;
        }

        studentIdRef.current =
          user.id;

        setStudentId(user.id);

        /* -----------------------------------------------------
           CHECK APPROVAL + PAYMENT
        ----------------------------------------------------- */

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from(
            "student_profiles"
          )
          .select(
            "id, status, payment_status"
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (
          !profile ||
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
            "Votre paiement n'a pas encore été validé."
          );

          setLoading(false);

          return;
        }

        /* -----------------------------------------------------
           CHECK EXISTING RESULT
        ----------------------------------------------------- */

        const {
          data: existingResult,
          error: resultError,
        } = await supabase
          .from("test_results")
          .select(
            "id, score, total_questions, percentage"
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

        if (resultError) {
          throw resultError;
        }

        if (existingResult) {
          setScore(
            existingResult.score ||
              0
          );

          setPercentage(
            existingResult.percentage ||
              0
          );

          setCompleted(true);
          setLoading(false);

          return;
        }

        /* -----------------------------------------------------
           CHECK / CREATE SERVER ATTEMPT
        ----------------------------------------------------- */

        let {
          data: attempt,
          error: attemptError,
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

        if (attemptError) {
          throw attemptError;
        }

        if (
          attempt?.status ===
          "finished"
        ) {
          setMessage(
            "Cette tentative d'examen est déjà terminée."
          );

          setLoading(false);

          return;
        }

        if (!attempt) {
          const {
            data: createdAttempt,
            error: createError,
          } = await supabase
            .from(
              EXAM_TABLE_ATTEMPTS
            )
            .insert({
              student_id:
                user.id,
              status:
                "in_progress",
              started_at:
                new Date().toISOString(),
              tab_switches: 0,
            })
            .select(
              "id, status, started_at, finished_at, tab_switches, termination_reason"
            )
            .single();

          if (createError) {
            throw createError;
          }

          attempt =
            createdAttempt;
        }

        attemptIdRef.current =
          attempt.id;

        serverAttemptIdRef.current =
          attempt.id;

        setServerAttemptId(
          attempt.id
        );

        setTabSwitches(
          Number(
            attempt.tab_switches ||
              0
          )
        );

        /* -----------------------------------------------------
           LOAD SAVED ANSWERS
        ----------------------------------------------------- */

        const storedAnswers =
          loadAnswersFromStorage(
            attempt.id
          );

        answersRef.current =
          storedAnswers;

        setAnswers(
          storedAnswers
        );

        /* -----------------------------------------------------
           RESTORE POSITION
        ----------------------------------------------------- */

        const storedPosition =
          loadPositionFromStorage(
            attempt.id
          );

        const firstUnansweredIndex =
          questions.findIndex(
            (item) =>
              !Object.prototype.hasOwnProperty.call(
                storedAnswers,
                item.id
              )
          );

        let resumeQuestionIndex =
          0;

        if (
          storedPosition !==
            null &&
          !Object.prototype.hasOwnProperty.call(
            storedAnswers,
            questions[
              storedPosition
            ]?.id
          )
        ) {
          resumeQuestionIndex =
            storedPosition;
        } else if (
          firstUnansweredIndex !==
          -1
        ) {
          resumeQuestionIndex =
            firstUnansweredIndex;
        } else {
          resumeQuestionIndex =
            questions.length - 1;
        }

        currentQuestionRef.current =
          resumeQuestionIndex;

        setCurrentQuestion(
          resumeQuestionIndex
        );

        draftAnswerRef.current =
          "";

        setDraftAnswer("");

        /* -----------------------------------------------------
           CALCULATE REMAINING TIME
        ----------------------------------------------------- */

        const startedAt =
          new Date(
            attempt.started_at
          ).getTime();

        const elapsedSeconds =
          Math.floor(
            (Date.now() -
              startedAt) /
              1000
          );

        const remainingSeconds =
          Math.max(
            0,
            TEST_DURATION -
              elapsedSeconds
          );

        setTimeLeft(
          remainingSeconds
        );

        setTimerReady(true);

        setLoading(false);

        if (
          remainingSeconds <=
          0
        ) {
          setTimeout(() => {
            handleSubmitRef.current(
              "time_expired"
            );
          }, 0);
        }
      } catch (error) {
        console.error(
          "EXAM JOAN ACCESS ERROR:",
          error
        );

        setMessage(
          "Une erreur est survenue lors de la préparation de votre examen."
        );

        setLoading(false);
      }
    }, [navigate]);

  /* =========================================================
     ACCESS CHECK ON LOAD
  ========================================================= */

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    if (
      !timerReady ||
      completed ||
      loading
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setTimeLeft(
          (previous) => {
            if (
              previous <= 1
            ) {
              clearInterval(
                interval
              );

              setTimeout(() => {
                handleSubmitRef.current(
                  "time_expired"
                );
              }, 0);

              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    timerReady,
    completed,
    loading,
  ]);

  /* =========================================================
     SUBMIT EXAM
  ========================================================= */

  const handleSubmit =
    useCallback(
      async (
        reason = "completed"
      ) => {
        if (
          submitStartedRef.current
        ) {
          return;
        }

        if (
          reason ===
            "completed" &&
          Object.keys(
            answersRef.current
          ).length <
            questions.length
        ) {
          setAnswerMessage(
            "Veuillez répondre à toutes les questions avant de terminer l'examen."
          );

          return;
        }

        if (
          !studentIdRef.current
        ) {
          return;
        }

        submitStartedRef.current =
          true;

        setSubmitting(true);
        setAnswerMessage("");

        try {
          await saveExamResult(
            answersRef.current,
            reason
          );
        } catch (error) {
          console.error(
            "SUBMIT JOAN EXAM ERROR:",
            error
          );

          submitStartedRef.current =
            false;

          setAnswerMessage(
            "Une erreur est survenue lors de l'enregistrement de votre examen. Veuillez réessayer."
          );
        } finally {
          setSubmitting(false);
        }
      },
      [saveExamResult]
    );

  useEffect(() => {
    handleSubmitRef.current =
      handleSubmit;
  }, [handleSubmit]);

  /* =========================================================
     TAB SWITCH SECURITY
  ========================================================= */

  const processTabSwitch =
    useCallback(
      async () => {
        if (
          completed ||
          loading ||
          !serverAttemptIdRef.current ||
          tabSwitchProcessingRef.current
        ) {
          return;
        }

        tabSwitchProcessingRef.current =
          true;

        try {
          const newCount =
            Number(
              tabSwitches || 0
            ) + 1;

          setTabSwitches(
            newCount
          );

          if (
            newCount === 1
          ) {
            const {
              error,
            } = await supabase
              .from(
                EXAM_TABLE_ATTEMPTS
              )
              .update({
                tab_switches: 1,
              })
              .eq(
                "id",
                serverAttemptIdRef.current
              )
              .eq(
                "student_id",
                studentIdRef.current
              );

            if (error) {
              throw error;
            }

            setAnswerMessage(
              "⚠️ Attention : vous avez quitté l'examen. Un deuxième changement d'onglet terminera automatiquement votre tentative."
            );
          } else {
            await saveExamResult(
              answersRef.current,
              "tab_switch"
            );
          }
        } catch (error) {
          console.error(
            "TAB SWITCH ERROR:",
            error
          );
        } finally {
          tabSwitchProcessingRef.current =
            false;
        }
      },
      [
        completed,
        loading,
        saveExamResult,
        tabSwitches,
      ]
    );

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "hidden"
        ) {
          processTabSwitch();
        }
      };

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
    processTabSwitch,
  ]);

  /* =========================================================
     SAVE CURRENT ANSWER
  ========================================================= */

  const saveCurrentAnswer =
    useCallback(() => {
      const current =
        questions[
          currentQuestionRef.current
        ];

      if (!current) {
        return false;
      }

      const value =
        draftAnswerRef.current.trim();

      if (!value) {
        setAnswerMessage(
          "Veuillez écrire une réponse avant de continuer."
        );

        return false;
      }

      if (
        Object.prototype.hasOwnProperty.call(
          answersRef.current,
          current.id
        )
      ) {
        return true;
      }

      const updatedAnswers = {
        ...answersRef.current,
        [current.id]:
          value,
      };

      answersRef.current =
        updatedAnswers;

      setAnswers(
        updatedAnswers
      );

      saveAnswersToStorage(
        serverAttemptIdRef.current,
        updatedAnswers
      );

      setAnswerMessage("");

      return true;
    }, []);

  /* =========================================================
     NEXT QUESTION
  ========================================================= */

  const goNext =
    useCallback(() => {
      if (answerLocked) {
        const nextIndex =
          currentQuestionRef.current +
          1;

        if (
          nextIndex >=
          questions.length
        ) {
          return;
        }

        savePositionToStorage(
          serverAttemptIdRef.current,
          nextIndex
        );

        currentQuestionRef.current =
          nextIndex;

        setCurrentQuestion(
          nextIndex
        );

        setDraftAnswer("");
        draftAnswerRef.current =
          "";

        setAnswerMessage("");

        return;
      }

      const saved =
        saveCurrentAnswer();

      if (!saved) {
        return;
      }

      const nextIndex =
        currentQuestionRef.current +
        1;

      if (
        nextIndex >=
        questions.length
      ) {
        return;
      }

      savePositionToStorage(
        serverAttemptIdRef.current,
        nextIndex
      );

      currentQuestionRef.current =
        nextIndex;

      setCurrentQuestion(
        nextIndex
      );

      setDraftAnswer("");
      draftAnswerRef.current =
        "";

      setAnswerMessage("");
    }, [
      answerLocked,
      saveCurrentAnswer,
    ]);

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown =
    useCallback(
      (event) => {
        if (
          event.key !==
            "Enter" ||
          event.shiftKey
        ) {
          return;
        }

        event.preventDefault();

        if (answerLocked) {
          goNext();
          return;
        }

        const saved =
          saveCurrentAnswer();

        if (!saved) {
          return;
        }

        const nextIndex =
          currentQuestionRef.current +
          1;

        if (
          nextIndex >=
          questions.length
        ) {
          handleSubmitRef.current(
            "completed"
          );

          return;
        }

        savePositionToStorage(
          serverAttemptIdRef.current,
          nextIndex
        );

        currentQuestionRef.current =
          nextIndex;

        setCurrentQuestion(
          nextIndex
        );

        setDraftAnswer("");
        draftAnswerRef.current =
          "";

        setAnswerMessage("");
      },
      [
        answerLocked,
        goNext,
        saveCurrentAnswer,
      ]
    );

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.logoMark}>
            ✓
          </div>

          <h2
            style={
              styles.loadingTitle
            }
          >
            Préparation de votre examen
          </h2>

          <p style={styles.muted}>
            Veuillez patienter...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ACCESS ERROR
  ========================================================= */

  if (
    message &&
    !serverAttemptId
  ) {
    return (
      <div style={styles.page}>
        <div
          style={
            styles.accessCard
          }
        >
          <div style={styles.errorMark}>
            !
          </div>

          <div style={styles.brand}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <h1
            style={
              styles.accessTitle
            }
          >
            Accès à l'examen
          </h1>

          <p
            style={
              styles.accessMessage
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

  /* =========================================================
     COMPLETED SCREEN
  ========================================================= */

  if (completed) {
    const wasTerminated =
      terminationReason ===
      "tab_switch";

    const wasTimeExpired =
      terminationReason ===
      "time_expired";

    return (
      <div style={styles.page}>
        <div
          style={
            styles.resultCard
          }
        >
          <div
            style={
              wasTerminated ||
              wasTimeExpired
                ? styles.errorMark
                : styles.successMark
            }
          >
            {wasTerminated ||
            wasTimeExpired
              ? "!"
              : "✓"}
          </div>

          <div style={styles.brand}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <h1
            style={
              styles.resultTitle
            }
          >
            Examen terminé
          </h1>

          {wasTerminated && (
            <p
              style={
                styles.resultMessage
              }
            >
              L'examen a été
              automatiquement terminé
              après deux changements
              d'onglet.
            </p>
          )}

          {wasTimeExpired && (
            <p
              style={
                styles.resultMessage
              }
            >
              Le temps prévu pour
              l'examen est arrivé à
              son terme.
            </p>
          )}

          {!wasTerminated &&
            !wasTimeExpired && (
              <p
                style={
                  styles.resultMessage
                }
              >
                Votre examen a été
                enregistré avec succès.
              </p>
            )}

          <div
            style={
              styles.scoreBox
            }
          >
            <span
              style={
                styles.scoreLabel
              }
            >
              VOTRE SCORE
            </span>

            <strong
              style={
                styles.scoreValue
              }
            >
              {score} / 50
            </strong>

            <span
              style={
                styles.percentValue
              }
            >
              {percentage}%
            </span>
          </div>

          <p
            style={
              styles.attemptNote
            }
          >
            Une seule tentative est
            autorisée.
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

  /* =========================================================
     EXAM SCREEN
  ========================================================= */

  return (
    <div style={styles.page}>
      <div
        style={
          styles.examContainer
        }
      >
        {/* HEADER */}

        <header
          style={
            styles.examHeader
          }
        >
          <div>
            <div
              style={
                styles.brand
              }
            >
              INTERNATIONAL FRENCH ACADEMY
            </div>

            <div
              style={
                styles.studentInfo
              }
            >
              <strong>
                Mme JOAN
              </strong>

              <span>
                Classe : A2
              </span>

              <span>
                Date : 02/10/2026
              </span>
            </div>
          </div>
        </header>

        {/* TITLE */}

        <section
          style={
            styles.titleCard
          }
        >
          <h1
            style={
              styles.examTitle
            }
          >
            EXAMEN DE FRANÇAIS
          </h1>

          <div
            style={
              styles.examLevel
            }
          >
            NIVEAU A2
          </div>

          <div
            style={
              styles.examMeta
            }
          >
            <span>
              50 questions
            </span>

            <span>
              50 points
            </span>

            <span>
              Durée : 2 heures
            </span>
          </div>

          <p
            style={
              styles.instructions
            }
          >
            Répondez à toutes les
            questions. Écrivez des
            phrases complètes lorsque
            cela est demandé.
          </p>
        </section>

        {/* STATUS BAR */}

        <section
          style={
            styles.statusBar
          }
        >
          <div
            style={
              styles.statusItem
            }
          >
            <span
              style={
                styles.statusLabel
              }
            >
              QUESTION
            </span>

            <strong
              style={
                styles.statusValue
              }
            >
              {currentQuestion + 1} /{" "}
              {questions.length}
            </strong>
          </div>

          <div
            style={
              styles.timerItem
            }
          >
            <span
              style={
                styles.statusLabel
              }
            >
              TEMPS RESTANT
            </span>

            <strong
              style={{
                ...styles.timerValue,
                ...(timeLeft <=
                300
                  ? styles.timerDanger
                  : {}),
              }}
            >
              {formatTime(
                timeLeft
              )}
            </strong>

            <span
              style={
                styles.timerSmall
              }
            >
              2 HEURES
            </span>
          </div>

          <div
            style={
              styles.statusItem
            }
          >
            <span
              style={
                styles.statusLabel
              }
            >
              RÉPONDUES
            </span>

            <strong
              style={
                styles.statusValue
              }
            >
              {answeredCount} /{" "}
              {questions.length}
            </strong>
          </div>
        </section>

        {/* QUESTION */}

        <main
          style={
            styles.questionCard
          }
        >
          <div
            style={
              styles.questionHeader
            }
          >
            <span
              style={
                styles.questionNumber
              }
            >
              QUESTION {question.id}
            </span>

            <span
              style={
                styles.pointsBadge
              }
            >
              1 POINT
            </span>
          </div>

          <div
            style={
              styles.sectionTitle
            }
          >
            {question.section}
          </div>

          <h2
            style={
              styles.questionPrompt
            }
          >
            {question.prompt}
          </h2>

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
              Votre réponse
            </label>

            <input
              type="text"
              value={
                answerLocked
                  ? answers[
                      question.id
                    ]
                  : draftAnswer
              }
              onChange={(
                event
              ) => {
                if (
                  answerLocked
                ) {
                  return;
                }

                const value =
                  event.target
                    .value;

                setDraftAnswer(
                  value
                );

                draftAnswerRef.current =
                  value;

                setAnswerMessage(
                  ""
                );
              }}
              onKeyDown={
                handleKeyDown
              }
              disabled={
                answerLocked ||
                submitting
              }
              autoComplete="off"
              spellCheck="false"
              placeholder="Écrivez votre réponse ici..."
              style={{
                ...styles.answerInput,
                ...(answerLocked
                  ? styles.answerLocked
                  : {}),
              }}
            />

            {answerLocked && (
              <div
                style={
                  styles.lockMessage
                }
              >
                ✓ Réponse
                enregistrée et
                verrouillée
              </div>
            )}
          </div>

          {answerMessage && (
            <div
              style={
                styles.warningBox
              }
            >
              {answerMessage}
            </div>
          )}

          <div
            style={
              styles.navigationArea
            }
          >
            {currentQuestion <
            questions.length -
              1 ? (
              <button
                type="button"
                onClick={
                  goNext
                }
                disabled={
                  submitting ||
                  (!answerLocked &&
                    !draftAnswer.trim())
                }
                style={{
                  ...styles.primaryButton,
                  ...((submitting ||
                    (!answerLocked &&
                      !draftAnswer.trim()))
                    ? styles.disabledButton
                    : {}),
                }}
              >
                Enregistrer et
                continuer →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const saved =
                    answerLocked ||
                    saveCurrentAnswer();

                  if (!saved) {
                    return;
                  }

                  handleSubmit(
                    "completed"
                  );
                }}
                disabled={
                  submitting ||
                  (!answerLocked &&
                    !draftAnswer.trim())
                }
                style={{
                  ...styles.submitButton,
                  ...((submitting ||
                    (!answerLocked &&
                      !draftAnswer.trim()))
                    ? styles.disabledButton
                    : {}),
                }}
              >
                {submitting
                  ? "Enregistrement..."
                  : "Terminer l'examen"}
              </button>
            )}
          </div>

          <div
            style={
              styles.securityNotice
            }
          >
            ⚠️{" "}
            <strong>
              Attention :
            </strong>{" "}
            Une seule tentative est
            autorisée. Après avoir
            enregistré une réponse
            et continué, cette
            réponse ne peut plus
            être modifiée.
          </div>
        </main>

        {/* FOOTER */}

        <footer
          style={
            styles.footer
          }
        >
          INTERNATIONAL FRENCH ACADEMY
          <span>
            {" "}
            — Examen de français A2 —{" "}
          </span>
          Mme JOAN
        </footer>
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f4ee",
    color: "#0d1b2a",
    fontFamily:
      "'DM Sans', Arial, sans-serif",
    padding:
      "28px 18px 50px",
    boxSizing: "border-box",
  },

  examContainer: {
    maxWidth: "980px",
    margin: "0 auto",
  },

  centerCard: {
    maxWidth: "560px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "50px 35px",
    textAlign: "center",
    boxShadow:
      "0 12px 40px rgba(13,27,42,0.10)",
  },

  accessCard: {
    maxWidth: "620px",
    margin: "90px auto",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "50px 35px",
    textAlign: "center",
    boxShadow:
      "0 12px 40px rgba(13,27,42,0.10)",
  },

  resultCard: {
    maxWidth: "650px",
    margin: "70px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "48px 35px",
    textAlign: "center",
    boxShadow:
      "0 15px 45px rgba(13,27,42,0.12)",
  },

  logoMark: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#c9a84c",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin:
      "0 auto 22px",
    fontSize: "30px",
    fontWeight: 700,
  },

  successMark: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background: "#1f8a5b",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin:
      "0 auto 22px",
    fontSize: "36px",
    fontWeight: 700,
  },

  errorMark: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background: "#b23a48",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin:
      "0 auto 22px",
    fontSize: "36px",
    fontWeight: 700,
  },

  brand: {
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "1.4px",
    color: "#0d1b2a",
    marginBottom: "10px",
  },

  loadingTitle: {
    fontFamily:
      "'Playfair Display', Georgia, serif",
    fontSize: "28px",
    margin:
      "0 0 10px",
  },

  muted: {
    color: "#68727d",
    margin: 0,
  },

  accessTitle: {
    fontFamily:
      "'Playfair Display', Georgia, serif",
    fontSize: "34px",
    margin:
      "12px 0",
  },

  accessMessage: {
    color: "#4f5964",
    fontSize: "16px",
    lineHeight: 1.6,
    margin:
      "0 auto 28px",
  },

  resultTitle: {
    fontFamily:
      "'Playfair Display', Georgia, serif",
    fontSize: "36px",
    margin:
      "10px 0 12px",
  },

  resultMessage: {
    color: "#4f5964",
    lineHeight: 1.65,
    fontSize: "16px",
    margin: "7px 0",
  },

  scoreBox: {
    margin:
      "28px auto 22px",
    padding: "25px",
    borderRadius: "15px",
    background: "#f8f4ee",
    border:
      "1px solid #e5ddcf",
    display: "flex",
    flexDirection:
      "column",
    alignItems: "center",
    gap: "5px",
  },

  scoreLabel: {
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    color: "#68727d",
  },

  scoreValue: {
    fontSize: "42px",
    color: "#0d1b2a",
    fontFamily:
      "'Playfair Display', Georgia, serif",
  },

  percentValue: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#c9a84c",
  },

  attemptNote: {
    color: "#0d1b2a",
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "22px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    background: "#0d1b2a",
    color: "#ffffff",
    padding:
      "14px 22px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    transition:
      "0.2s ease",
  },

  submitButton: {
    border: "none",
    borderRadius: "10px",
    background: "#c9a84c",
    color: "#0d1b2a",
    padding:
      "15px 26px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  examHeader: {
    background: "#ffffff",
    borderRadius: "16px",
    padding:
      "22px 25px",
    marginBottom: "18px",
    border:
      "1px solid rgba(13,27,42,0.08)",
    boxShadow:
      "0 7px 25px rgba(13,27,42,0.06)",
  },

  studentInfo: {
    display: "flex",
    flexWrap: "wrap",
    gap:
      "12px 24px",
    fontSize: "14px",
    color: "#58636e",
  },

  titleCard: {
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "18px",
    padding:
      "34px 30px",
    marginBottom: "18px",
    boxShadow:
      "0 10px 30px rgba(13,27,42,0.12)",
  },

  examTitle: {
    fontFamily:
      "'Playfair Display', Georgia, serif",
    fontSize: "34px",
    margin: 0,
    letterSpacing:
      "0.4px",
  },

  examLevel: {
    display: "inline-block",
    marginTop: "8px",
    marginBottom: "20px",
    color: "#c9a84c",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing:
      "1px",
  },

  examMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap:
      "8px 25px",
    fontSize: "14px",
    color: "#e7e9eb",
  },

  instructions: {
    margin:
      "20px 0 0",
    paddingTop: "18px",
    borderTop:
      "1px solid rgba(255,255,255,0.16)",
    color: "#e5e8eb",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  statusBar: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1.3fr 1fr",
    gap: "12px",
    marginBottom: "18px",
  },

  statusItem: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    textAlign: "center",
    border:
      "1px solid rgba(13,27,42,0.07)",
  },

  timerItem: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    textAlign: "center",
    border:
      "2px solid #c9a84c",
  },

  statusLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing:
      "1.3px",
    color: "#68727d",
    marginBottom: "5px",
  },

  statusValue: {
    fontSize: "20px",
  },

  timerValue: {
    display: "block",
    fontSize: "25px",
    fontFamily:
      "'DM Mono', 'Courier New', monospace",
  },

  timerDanger: {
    color: "#b23a48",
  },

  timerSmall: {
    display: "block",
    marginTop: "3px",
    fontSize: "10px",
    color: "#68727d",
    fontWeight: 700,
  },

  questionCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "32px",
    boxShadow:
      "0 10px 30px rgba(13,27,42,0.07)",
    border:
      "1px solid rgba(13,27,42,0.07)",
  },

  questionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "15px",
    marginBottom: "24px",
  },

  questionNumber: {
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing:
      "1.2px",
    color: "#0d1b2a",
  },

  pointsBadge: {
    padding:
      "7px 11px",
    borderRadius: "20px",
    background: "#f8f4ee",
    color: "#7b6630",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing:
      "0.6px",
  },

  sectionTitle: {
    display: "inline-block",
    background: "#f8f4ee",
    borderLeft:
      "4px solid #c9a84c",
    padding:
      "9px 13px",
    borderRadius:
      "0 8px 8px 0",
    fontSize: "13px",
    fontWeight: 800,
    color: "#0d1b2a",
    marginBottom: "20px",
  },

  questionPrompt: {
    fontFamily:
      "'Playfair Display', Georgia, serif",
    fontSize: "25px",
    lineHeight: 1.55,
    fontWeight: 600,
    color: "#0d1b2a",
    margin:
      "0 0 28px",
  },

  answerArea: {
    marginBottom: "20px",
  },

  answerLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: 800,
    color: "#4f5964",
    marginBottom: "8px",
  },

  answerInput: {
    width: "100%",
    boxSizing:
      "border-box",
    border:
      "2px solid #d8dde2",
    borderRadius: "10px",
    padding:
      "15px 16px",
    fontSize: "17px",
    color: "#0d1b2a",
    outline: "none",
    background: "#ffffff",
  },

  answerLocked: {
    background: "#f1f4f5",
    borderColor: "#c9a84c",
    fontWeight: 700,
  },

  lockMessage: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#1f8a5b",
    fontWeight: 700,
  },

  warningBox: {
    background: "#fff7df",
    border:
      "1px solid #ead28a",
    color: "#6f5a1c",
    borderRadius: "10px",
    padding:
      "13px 15px",
    fontSize: "13px",
    lineHeight: 1.5,
    marginBottom: "18px",
  },

  navigationArea: {
    display: "flex",
    justifyContent:
      "flex-end",
    paddingTop: "8px",
  },

  securityNotice: {
    marginTop: "22px",
    paddingTop: "18px",
    borderTop:
      "1px solid #e4e7e9",
    color: "#68727d",
    fontSize: "12px",
    lineHeight: 1.6,
  },

  footer: {
    textAlign: "center",
    marginTop: "25px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing:
      "0.5px",
    color: "#7b858e",
  },
};