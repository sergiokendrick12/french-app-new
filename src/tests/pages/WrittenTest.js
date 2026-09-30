import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

/*
 * =========================================================
 * EXAMEN DE FRANÇAIS — 50 QUESTIONS
 * Compréhension écrite / Grammaire
 * =========================================================
 *
 * One attempt only.
 * 2 hours.
 * First tab switch = warning.
 * Second tab switch = automatic termination with 0.
 */

const questions = [
  /*
   * =======================================================
   * I. LES VERBES AU PRÉSENT — QUESTIONS 1 À 8
   * =======================================================
   */

  {
    id: 1,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Conjugue le verbe entre parenthèses au présent.",
    text: "Je __________ au marché tous les samedis. (aller)",
    acceptedAnswers: ["vais"],
  },

  {
    id: 2,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Conjugue le verbe entre parenthèses au présent.",
    text: "Nous __________ le français à l’école. (étudier)",
    acceptedAnswers: ["étudions", "etudions"],
  },

  {
    id: 3,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Conjugue le verbe entre parenthèses au présent.",
    text: "Ils __________ souvent au football. (jouer)",
    acceptedAnswers: ["jouent"],
  },

  {
    id: 4,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Conjugue le verbe entre parenthèses au présent.",
    text: "Tu __________ un livre intéressant. (lire)",
    acceptedAnswers: ["lis"],
  },

  {
    id: 5,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Conjugue le verbe entre parenthèses au présent.",
    text: "Elle __________ une belle chanson. (chanter)",
    acceptedAnswers: ["chante"],
  },

  {
    id: 6,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Conjugue le verbe entre parenthèses au présent.",
    text: "Vous __________ très bien français. (parler)",
    acceptedAnswers: ["parlez"],
  },

  {
    id: 7,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Complète la phrase avec le verbe faire au présent.",
    text: "Je __________ mes devoirs chaque soir.",
    acceptedAnswers: ["fais"],
  },

  {
    id: 8,
    section: "Les verbes au présent",
    level: "A1",
    instruction:
      "Complète la phrase avec le verbe voir au présent.",
    text: "Nous __________ nos amis tous les jours.",
    acceptedAnswers: ["voyons"],
  },

  /*
   * =======================================================
   * II. LE PASSÉ COMPOSÉ — QUESTIONS 9 À 16
   * =======================================================
   */

  {
    id: 9,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au passé composé.",
    text: "Hier, j’__________ un film. (regarder)",
    acceptedAnswers: ["ai regardé", "ai regarde"],
  },

  {
    id: 10,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au passé composé.",
    text: "Elle __________ à Kigali hier matin. (arriver)",
    acceptedAnswers: ["est arrivée", "est arrivee"],
  },

  {
    id: 11,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au passé composé.",
    text: "Nous __________ nos devoirs. (terminer)",
    acceptedAnswers: ["avons terminé", "avons termine"],
  },

  {
    id: 12,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au passé composé.",
    text: "Ils __________ au marché dimanche dernier. (aller)",
    acceptedAnswers: ["sont allés", "sont alles"],
  },

  {
    id: 13,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au passé composé.",
    text: "Tu __________ ton petit-déjeuner ? (prendre)",
    acceptedAnswers: ["as pris"],
  },

  {
    id: 14,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au passé composé.",
    text: "Marie __________ une lettre à sa mère. (écrire)",
    acceptedAnswers: ["a écrit", "a ecrit"],
  },

  {
    id: 15,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets toute la phrase au passé composé.",
    text: "Je mange une pomme.",
    acceptedAnswers: [
      "j'ai mangé une pomme",
      "j'ai mange une pomme",
    ],
  },

  {
    id: 16,
    section: "Le passé composé",
    level: "A2",
    instruction:
      "Mets toute la phrase au passé composé.",
    text: "Nous allons à l’école.",
    acceptedAnswers: [
      "nous sommes allés à l'école",
      "nous sommes alles a l'ecole",
    ],
  },

  /*
   * =======================================================
   * III. LE FUTUR SIMPLE — QUESTIONS 17 À 23
   * =======================================================
   */

  {
    id: 17,
    section: "Le futur simple",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur simple.",
    text: "Demain, je __________ mes grands-parents. (visiter)",
    acceptedAnswers: ["visiterai"],
  },

  {
    id: 18,
    section: "Le futur simple",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur simple.",
    text: "Nous __________ nos examens la semaine prochaine. (passer)",
    acceptedAnswers: ["passerons"],
  },

  {
    id: 19,
    section: "Le futur simple",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur simple.",
    text: "Elle __________ médecin plus tard. (être)",
    acceptedAnswers: ["sera"],
  },

  {
    id: 20,
    section: "Le futur simple",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur simple.",
    text: "Ils __________ une nouvelle maison. (acheter)",
    acceptedAnswers: ["achèteront", "acheteront"],
  },

  {
    id: 21,
    section: "Le futur simple",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur simple.",
    text: "Tu __________ beaucoup de choses demain. (apprendre)",
    acceptedAnswers: ["apprendras"],
  },

  {
    id: 22,
    section: "Le futur simple",
    level: "A2",
    instruction:
      "Conjugue le verbe venir au futur simple.",
    text: "Vous __________ demain matin.",
    acceptedAnswers: ["viendrez"],
  },

  {
    id: 23,
    section: "Le futur simple",
    level: "A2",
    instruction:
      "Mets toute la phrase au futur simple.",
    text: "Je fais mes devoirs.",
    acceptedAnswers: ["je ferai mes devoirs"],
  },

  /*
   * =======================================================
   * IV. LE FUTUR PROCHE — QUESTIONS 24 À 29
   * =======================================================
   */

  {
    id: 24,
    section: "Le futur proche",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur proche.",
    text: "Je __________ manger maintenant. (manger)",
    acceptedAnswers: ["vais manger"],
  },

  {
    id: 25,
    section: "Le futur proche",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur proche.",
    text: "Nous __________ regarder un film ce soir. (regarder)",
    acceptedAnswers: ["allons regarder"],
  },

  {
    id: 26,
    section: "Le futur proche",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur proche.",
    text: "Elle __________ une nouvelle robe. (acheter)",
    acceptedAnswers: ["va acheter"],
  },

  {
    id: 27,
    section: "Le futur proche",
    level: "A2",
    instruction:
      "Mets le verbe entre parenthèses au futur proche.",
    text: "Ils __________ au football. (jouer)",
    acceptedAnswers: ["vont jouer"],
  },

  {
    id: 28,
    section: "Le futur proche",
    level: "A2",
    instruction:
      "Mets la phrase au futur proche.",
    text: "Tu fais tes devoirs.",
    acceptedAnswers: ["tu vas faire tes devoirs"],
  },

  {
    id: 29,
    section: "Le futur proche",
    level: "A2",
    instruction:
      "Mets la phrase au futur proche.",
    text: "Nous visitons le musée.",
    acceptedAnswers: ["nous allons visiter le musée"],
  },

  /*
   * =======================================================
   * V. LES PRONOMS — QUESTIONS 30 À 35
   * =======================================================
   */

  {
    id: 30,
    section: "Les pronoms",
    level: "A2",
    instruction:
      "Remplace le groupe souligné par un pronom personnel.",
    text: "Marie parle à Paul.",
    acceptedAnswers: [
      "elle parle à paul",
      "elle parle a paul",
    ],
  },

  {
    id: 31,
    section: "Les pronoms",
    level: "A2",
    instruction:
      "Remplace le groupe souligné par un pronom personnel.",
    text: "Paul et Jean jouent au football.",
    acceptedAnswers: ["ils jouent au football"],
  },

  {
    id: 32,
    section: "Les pronoms",
    level: "A2",
    instruction:
      "Remplace le groupe souligné par un pronom.",
    text: "Je parle à Marie.",
    acceptedAnswers: ["je lui parle"],
  },

  {
    id: 33,
    section: "Les pronoms",
    level: "A2",
    instruction:
      "Remplace le groupe souligné par un pronom.",
    text: "Je regarde les enfants.",
    acceptedAnswers: ["je les regarde"],
  },

  {
    id: 34,
    section: "Les pronoms",
    level: "A2",
    instruction:
      "Remplace le groupe souligné par un pronom.",
    text: "Je parle à mes parents.",
    acceptedAnswers: ["je leur parle"],
  },

  {
    id: 35,
    section: "Les pronoms",
    level: "A2",
    instruction:
      "Remplace le groupe souligné par un pronom.",
    text: "Nous aimons Marie.",
    acceptedAnswers: [
      "nous l'aimons",
      "nous laimons",
    ],
  },

  /*
   * =======================================================
   * VI. LES DÉTERMINANTS — QUESTIONS 36 À 40
   * =======================================================
   */

  {
    id: 36,
    section: "Les déterminants",
    level: "A2",
    instruction:
      "Complète avec le déterminant qui convient.",
    text: "__________ garçon joue dans le jardin.",
    acceptedAnswers: ["le", "un"],
  },

  {
    id: 37,
    section: "Les déterminants",
    level: "A2",
    instruction:
      "Complète avec le déterminant qui convient.",
    text: "J’ai acheté __________ pommes.",
    acceptedAnswers: ["des"],
  },

  {
    id: 38,
    section: "Les déterminants",
    level: "A2",
    instruction:
      "Complète avec le déterminant qui convient.",
    text: "__________ maison est très grande.",
    acceptedAnswers: ["la", "une"],
  },

  {
    id: 39,
    section: "Les déterminants",
    level: "A2",
    instruction:
      "Complète avec le déterminant qui convient.",
    text: "Il mange __________ pain.",
    acceptedAnswers: ["du", "le"],
  },

  {
    id: 40,
    section: "Les déterminants",
    level: "A2",
    instruction:
      "Complète avec le déterminant qui convient.",
    text: "Nous avons __________ voiture rouge.",
    acceptedAnswers: ["une", "la"],
  },

  /*
   * =======================================================
   * VII. CE, CET, CETTE, CES — QUESTIONS 41 À 44
   * =======================================================
   */

  {
    id: 41,
    section: "Ce, cet, cette, ces",
    level: "A2",
    instruction:
      "Complète avec ce, cet, cette ou ces.",
    text: "__________ garçon est mon frère.",
    acceptedAnswers: ["ce"],
  },

  {
    id: 42,
    section: "Ce, cet, cette, ces",
    level: "A2",
    instruction:
      "Complète avec ce, cet, cette ou ces.",
    text: "__________ arbre est très vieux.",
    acceptedAnswers: ["cet"],
  },

  {
    id: 43,
    section: "Ce, cet, cette, ces",
    level: "A2",
    instruction:
      "Complète avec ce, cet, cette ou ces.",
    text: "__________ fille est ma sœur.",
    acceptedAnswers: ["cette"],
  },

  {
    id: 44,
    section: "Ce, cet, cette, ces",
    level: "A2",
    instruction:
      "Complète avec ce, cet, cette ou ces.",
    text: "__________ livres sont intéressants.",
    acceptedAnswers: ["ces"],
  },

  /*
   * =======================================================
   * VIII. LES PRÉPOSITIONS — QUESTIONS 45 À 47
   * =======================================================
   */

  {
    id: 45,
    section: "Les prépositions",
    level: "A2",
    instruction:
      "Complète avec la préposition qui convient.",
    text: "Je vais __________ l’école.",
    acceptedAnswers: ["à", "a"],
  },

  {
    id: 46,
    section: "Les prépositions",
    level: "A2",
    instruction:
      "Complète avec la préposition qui convient.",
    text: "Le livre est __________ la table.",
    acceptedAnswers: ["sur"],
  },

  {
    id: 47,
    section: "Les prépositions",
    level: "A2",
    instruction:
      "Complète avec la préposition qui convient.",
    text: "Je vais au marché __________ ma mère.",
    acceptedAnswers: ["avec"],
  },

  /*
   * =======================================================
   * IX. LES CONJONCTIONS — QUESTIONS 48 À 50
   * =======================================================
   */

  {
    id: 48,
    section: "Les conjonctions",
    level: "A2",
    instruction:
      "Complète avec une conjonction qui convient.",
    text: "Je veux sortir __________ il pleut.",
    acceptedAnswers: ["mais"],
  },

  {
    id: 49,
    section: "Les conjonctions",
    level: "A2",
    instruction:
      "Complète avec une conjonction qui convient.",
    text: "Paul aime le thé __________ le café.",
    acceptedAnswers: ["et"],
  },

  {
    id: 50,
    section: "Les conjonctions",
    level: "A2",
    instruction:
      "Complète avec une conjonction qui convient.",
    text: "Je reste à la maison __________ je suis malade.",
    acceptedAnswers: ["parce que", "parceque"],
  },
];

const TEST_DURATION = 2 * 60 * 60;

/*
 * =========================================================
 * ANSWER NORMALIZATION
 * =========================================================
 */

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "");
}

function isAnswerCorrect(studentAnswer, acceptedAnswers) {
  const normalizedStudentAnswer =
    normalizeAnswer(studentAnswer);

  if (!normalizedStudentAnswer) {
    return false;
  }

  return acceptedAnswers.some(
    (answer) =>
      normalizeAnswer(answer) ===
      normalizedStudentAnswer
  );
}

export default function WrittenTest() {
  const navigate = useNavigate();

  /*
   * answers = answers that have been LOCKED
   * draftAnswer = answer currently being typed
   */
  const [answers, setAnswers] = useState({});
  const [draftAnswer, setDraftAnswer] = useState("");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(TEST_DURATION);

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
    useState(null);

  const [percentage, setPercentage] =
    useState(null);

  /*
   * Security states
   */

  const [tabSwitches, setTabSwitches] =
    useState(0);

  const [terminationReason, setTerminationReason] =
    useState(null);

  const [serverAttemptId, setServerAttemptId] =
    useState(null);

  /*
   * Security refs
   */

  const attemptRef =
    useRef(null);

  const tabSwitchProcessingRef =
    useRef(false);

  const accessCheckStartedRef =
    useRef(false);

  const submitStartedRef =
    useRef(false);

  const question =
    questions[currentQuestion];

  const answeredCount =
    useMemo(() => {
      return Object.keys(answers).length;
    }, [answers]);

  const isLastQuestion =
    currentQuestion ===
    questions.length - 1;

  /*
   * =======================================================
   * LOAD CURRENT QUESTION ANSWER
   * =======================================================
   */

  useEffect(() => {
    const savedAnswer =
      answers[question.id] || "";

    setDraftAnswer(savedAnswer);
    setAnswerMessage("");
  }, [currentQuestion]);

  /*
   * =======================================================
   * ACCESS CHECK
   * =======================================================
   */

  useEffect(() => {
    if (accessCheckStartedRef.current) {
      return;
    }

    accessCheckStartedRef.current = true;

    checkAccess();
  }, []);

  /*
   * =======================================================
   * TIMER
   * =======================================================
   */

  useEffect(() => {
    if (
      loading ||
      completed ||
      submitting
    ) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit(true, "time");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    loading,
    completed,
    submitting,
    timeLeft,
  ]);

  /*
   * =======================================================
   * TAB SWITCH SECURITY
   * =======================================================
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

      if (tabSwitchProcessingRef.current) {
        return;
      }

      const attempt =
        attemptRef.current;

      if (!attempt) {
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
   * =======================================================
   * CHECK ACCESS + SERVER ATTEMPT
   * =======================================================
   */

  async function checkAccess() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/student-login", {
          replace: true,
        });
        return;
      }

      const {
        data: student,
        error: studentError,
      } = await supabase
        .from("student_profiles")
        .select(
          "id, status, payment_status"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (studentError) {
        console.error(
          "STUDENT PROFILE ERROR:",
          studentError
        );

        setMessage(
          "Impossible de vérifier votre profil étudiant."
        );

        setLoading(false);
        return;
      }

      if (!student) {
        setMessage(
          "Profil étudiant introuvable."
        );

        setLoading(false);
        return;
      }

      if (
        student.status !==
        "approved"
      ) {
        setMessage(
          "Votre compte doit être approuvé par l'administration avant de passer ce test."
        );

        setLoading(false);
        return;
      }

      if (
        student.payment_status !==
        "paid"
      ) {
        setMessage(
          "Le paiement doit être confirmé par l'administration avant de passer ce test."
        );

        setLoading(false);
        return;
      }

      setStudentId(student.id);

      /*
       * ---------------------------------------------------
       * CHECK EXISTING RESULT
       * ---------------------------------------------------
       */

      const {
        data: existingResult,
        error: existingError,
      } = await supabase
        .from("test_results")
        .select(
          "id, score, total_questions, percentage"
        )
        .eq(
          "student_id",
          student.id
        )
        .eq(
          "test_type",
          "comprehension_ecrite"
        )
        .maybeSingle();

      if (existingError) {
        console.error(
          "CHECK WRITTEN TEST RESULT ERROR:",
          existingError
        );

        setMessage(
          "Impossible de vérifier votre tentative."
        );

        setLoading(false);
        return;
      }

      if (existingResult) {
        setScore(
          existingResult.score
        );

        setPercentage(
          existingResult.percentage
        );

        setCompleted(true);
        setLoading(false);
        return;
      }

      /*
       * ---------------------------------------------------
       * CHECK SERVER-SIDE ATTEMPT
       * ---------------------------------------------------
       */

      const {
        data: existingAttempt,
        error: attemptError,
      } = await supabase
        .from("written_test_attempts")
        .select(
          "id, status, started_at, finished_at, tab_switches, termination_reason"
        )
        .eq(
          "student_id",
          student.id
        )
        .maybeSingle();

      if (attemptError) {
        console.error(
          "CHECK WRITTEN ATTEMPT ERROR:",
          attemptError
        );

        setMessage(
          "Impossible de vérifier votre tentative de test."
        );

        setLoading(false);
        return;
      }

      /*
       * Finished attempt = no retake.
       */

      if (
        existingAttempt &&
        existingAttempt.status ===
          "finished"
      ) {
        setTabSwitches(
          existingAttempt.tab_switches ||
            0
        );

        setTerminationReason(
          existingAttempt.termination_reason ||
            null
        );

        setCompleted(true);
        setLoading(false);
        return;
      }

      let activeAttempt =
        existingAttempt;

      /*
       * ---------------------------------------------------
       * CREATE ATTEMPT IF NEEDED
       * ---------------------------------------------------
       */

      if (!activeAttempt) {
        const {
          data: newAttempt,
          error: createAttemptError,
        } = await supabase
          .from(
            "written_test_attempts"
          )
          .insert({
            student_id:
              student.id,
            status:
              "in_progress",
            tab_switches: 0,
          })
          .select(
            "id, status, started_at, finished_at, tab_switches, termination_reason"
          )
          .single();

        if (createAttemptError) {
          /*
           * Another request may have
           * created the unique attempt.
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
                "written_test_attempts"
              )
              .select(
                "id, status, started_at, finished_at, tab_switches, termination_reason"
              )
              .eq(
                "student_id",
                student.id
              )
              .maybeSingle();

            if (
              raceError ||
              !raceAttempt
            ) {
              console.error(
                "RACE ATTEMPT ERROR:",
                raceError
              );

              setMessage(
                "Impossible de récupérer votre tentative."
              );

              setLoading(false);
              return;
            }

            activeAttempt =
              raceAttempt;
          } else {
            console.error(
              "CREATE WRITTEN ATTEMPT ERROR:",
              createAttemptError
            );

            setMessage(
              "Impossible de démarrer votre tentative."
            );

            setLoading(false);
            return;
          }
        } else {
          activeAttempt =
            newAttempt;
        }
      }

      /*
       * ---------------------------------------------------
       * CHECK AGAIN IF FINISHED
       * ---------------------------------------------------
       */

      if (
        activeAttempt.status ===
        "finished"
      ) {
        setTabSwitches(
          activeAttempt.tab_switches ||
            0
        );

        setTerminationReason(
          activeAttempt.termination_reason ||
            null
        );

        setCompleted(true);
        setLoading(false);
        return;
      }

      /*
       * ---------------------------------------------------
       * SAVE ACTIVE ATTEMPT
       * ---------------------------------------------------
       */

      attemptRef.current =
        activeAttempt;

      setServerAttemptId(
        activeAttempt.id
      );

      setTabSwitches(
        activeAttempt.tab_switches ||
          0
      );

      /*
       * ---------------------------------------------------
       * SERVER-AUTHORITATIVE TIMER
       * ---------------------------------------------------
       */

      const {
        data: serverTime,
        error: serverTimeError,
      } = await supabase.rpc(
        "get_server_time"
      );

      if (serverTimeError) {
        console.error(
          "SERVER TIME ERROR:",
          serverTimeError
        );

        setMessage(
          "Impossible de vérifier l'heure du serveur."
        );

        setLoading(false);
        return;
      }

      const startedAt =
        new Date(
          activeAttempt.started_at
        ).getTime();

      const serverNow =
        new Date(
          serverTime
        ).getTime();

      const elapsedSeconds =
        Math.floor(
          (serverNow -
            startedAt) /
            1000
        );

      const remainingSeconds =
        Math.min(
          TEST_DURATION,
          Math.max(
            0,
            TEST_DURATION -
              elapsedSeconds
          )
        );

      /*
       * Brand-new attempt gets full 2 hours.
       * Resumed attempt uses server time.
       */

      const isBrandNewAttempt =
        !existingAttempt;

      setTimeLeft(
        isBrandNewAttempt
          ? TEST_DURATION
          : remainingSeconds
      );

      /*
       * Existing attempt already expired.
       */

      if (
        !isBrandNewAttempt &&
        remainingSeconds <= 0
      ) {
        setLoading(false);

        setTimeout(() => {
          handleSubmit(
            true,
            "time"
          );
        }, 0);

        return;
      }

      setLoading(false);
    } catch (error) {
      console.error(
        "WRITTEN TEST ACCESS ERROR:",
        error
      );

      setMessage(
        "Une erreur inattendue est survenue."
      );

      setLoading(false);
    }
  }

  /*
   * =======================================================
   * TAB SWITCH PROCESSING
   * =======================================================
   */

  async function processTabSwitch(
    attempt
  ) {
    const currentSwitches =
      attempt.tab_switches || 0;

    const newSwitchCount =
      currentSwitches + 1;

    /*
     * FIRST SWITCH = WARNING
     */

    if (
      newSwitchCount === 1
    ) {
      const {
        data: updatedAttempt,
        error: updateError,
      } = await supabase
        .from(
          "written_test_attempts"
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

      attemptRef.current =
        updatedAttempt;

      setTabSwitches(1);

      return;
    }

    /*
     * SECOND SWITCH = TERMINATE
     */

    setTabSwitches(2);

    setTerminationReason(
      "tab_switch"
    );

    /*
     * Save zero result.
     */

    const {
      error: resultError,
    } = await supabase
      .from("test_results")
      .insert({
        student_id:
          studentId,
        score: 0,
        total_questions:
          questions.length,
        percentage: 0,
        test_type:
          "comprehension_ecrite",
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
    }

    /*
     * Finish server attempt.
     */

    const {
      data: finishedAttempt,
      error: finishError,
    } = await supabase
      .from(
        "written_test_attempts"
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

    setScore(0);
    setPercentage(0);
    setAnswers({});
    setDraftAnswer("");
    setCompleted(true);
  }

  /*
   * =======================================================
   * TYPE ANSWER
   * =======================================================
   *
   * IMPORTANT:
   * The student can type the complete answer.
   * The answer is NOT locked while typing.
   */

  function handleDraftAnswer(value) {
    setDraftAnswer(value);
    setAnswerMessage("");
  }

  /*
   * =======================================================
   * SAVE CURRENT ANSWER AND GO NEXT
   * =======================================================
   */

  function goNext() {
    const trimmedAnswer =
      draftAnswer.trim();

    if (!trimmedAnswer) {
      setAnswerMessage(
        "Veuillez écrire une réponse avant de continuer."
      );

      return;
    }

    /*
     * Lock the current answer.
     */

    setAnswers((current) => ({
      ...current,
      [question.id]:
        trimmedAnswer,
    }));

    setAnswerMessage("");

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (current) =>
          current + 1
      );

      setDraftAnswer("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
   * =======================================================
   * TIMER FORMAT
   * =======================================================
   */

  function formatTime(seconds) {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      seconds % 60;

    return `${String(
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
   * =======================================================
   * NORMAL SUBMIT / TIMEOUT
   * =======================================================
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

    const currentDraft =
      draftAnswer.trim();

    /*
     * If this is the final question,
     * include the answer currently being typed.
     */

    const finalAnswers = {
      ...answers,
      ...(currentDraft
        ? {
            [question.id]:
              currentDraft,
          }
        : {}),
    };

    const finalAnsweredCount =
      Object.keys(
        finalAnswers
      ).length;

    if (!autoSubmit) {
      if (!currentDraft) {
        setAnswerMessage(
          "Veuillez écrire une réponse avant de terminer le test."
        );

        return;
      }

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
      if (!studentId) {
        setMessage(
          "Votre session étudiant est introuvable."
        );

        submitStartedRef.current =
          false;

        setSubmitting(false);

        return;
      }

      /*
       * ---------------------------------------------------
       * CALCUL DU SCORE
       * ---------------------------------------------------
       */

      let calculatedScore = 0;

      questions.forEach(
        (item) => {
          const studentAnswer =
            finalAnswers[item.id] ||
            "";

          if (
            isAnswerCorrect(
              studentAnswer,
              item.acceptedAnswers
            )
          ) {
            calculatedScore +=
              1;
          }
        }
      );

      const calculatedPercentage =
        Math.round(
          (calculatedScore /
            questions.length) *
            100
        );

      setScore(
        calculatedScore
      );

      setPercentage(
        calculatedPercentage
      );

      /*
       * ---------------------------------------------------
       * SAVE RESULT
       * ---------------------------------------------------
       */

      const {
        error: insertError,
      } = await supabase
        .from("test_results")
        .insert({
          student_id:
            studentId,
          score:
            calculatedScore,
          total_questions:
            questions.length,
          percentage:
            calculatedPercentage,
          test_type:
            "comprehension_ecrite",
        });

      if (insertError) {
        console.error(
          "WRITTEN TEST INSERT ERROR:",
          insertError
        );

        if (
          insertError.code ===
          "23505"
        ) {
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
       * ---------------------------------------------------
       * FINISH SERVER ATTEMPT
       * ---------------------------------------------------
       */

      if (serverAttemptId) {
        const {
          data: finishedAttempt,
          error: finishError,
        } = await supabase
          .from(
            "written_test_attempts"
          )
          .update({
            status:
              "finished",
            finished_at:
              new Date().toISOString(),
            termination_reason:
              reason === "time"
                ? "time"
                : "completed",
          })
          .eq(
            "id",
            serverAttemptId
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
            "FINISH WRITTEN ATTEMPT ERROR:",
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
      }

      setAnswers(finalAnswers);
      setDraftAnswer("");
      setCompleted(true);
    } catch (error) {
      console.error(
        "WRITTEN TEST SUBMIT ERROR:",
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

  /*
   * =======================================================
   * LOADING SCREEN
   * =======================================================
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
            Veuillez patienter.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =======================================================
   * COMPLETED SCREEN
   * =======================================================
   */

  if (completed) {
    /*
     * ---------------------------------------------------
     * TAB SWITCH TERMINATION
     * ---------------------------------------------------
     */

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
              Test terminé
            </h1>

            <p style={styles.errorText}>
              Le test a été
              automatiquement
              terminé après deux
              changements
              d'onglet.
            </p>

            <p style={styles.text}>
              Cette tentative a
              été enregistrée avec
              un score de 0 /{" "}
              {questions.length}.
            </p>

            <p style={styles.text}>
              Une seule tentative
              est autorisée pour
              la compréhension
              écrite.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/tests/results"
                )
              }
              style={styles.primaryButton}
            >
              Voir mes résultats →
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student-dashboard"
                )
              }
              style={styles.secondaryButton}
            >
              Retour à mon espace
            </button>
          </div>
        </div>
      );
    }

    /*
     * ---------------------------------------------------
     * TIME TERMINATION
     * ---------------------------------------------------
     */

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
              Le temps de
              2 heures est
              terminé.
            </p>

            <p style={styles.text}>
              Vos réponses ont
              été enregistrées
              automatiquement.
            </p>

            <p style={styles.text}>
              Votre résultat est :
              <strong>
                {" "}
                {score ?? 0} /{" "}
                {questions.length}
              </strong>
              {" "}
              ({percentage ?? 0}%).
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/tests/results"
                )
              }
              style={styles.primaryButton}
            >
              Voir mes résultats →
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/student-dashboard"
                )
              }
              style={styles.secondaryButton}
            >
              Retour à mon espace
            </button>
          </div>
        </div>
      );
    }

    /*
     * ---------------------------------------------------
     * NORMAL COMPLETION
     * ---------------------------------------------------
     */

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
            Test terminé
          </h1>

          <p style={styles.text}>
            Votre test de
            français a été
            enregistré avec
            succès.
          </p>

          {score !== null && (
            <div style={styles.scoreBox}>
              <div style={styles.scoreLabel}>
                VOTRE SCORE
              </div>

              <div style={styles.scoreValue}>
                {score} /{" "}
                {questions.length}
              </div>

              <div style={styles.percentage}>
                {percentage}%
              </div>
            </div>
          )}

          <p style={styles.text}>
            Une seule tentative
            est autorisée pour
            la compréhension
            écrite.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/tests/results"
              )
            }
            style={styles.primaryButton}
          >
            Voir mes résultats →
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
            style={styles.secondaryButton}
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  /*
   * =======================================================
   * ERROR SCREEN
   * =======================================================
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
            Accès au test
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
   * =======================================================
   * TEST SCREEN
   * =======================================================
   */

  const answerLocked =
    Object.prototype.hasOwnProperty.call(
      answers,
      question.id
    );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.subtitle}>
            Évaluation de positionnement
          </div>

          <h1 style={styles.title}>
            Examen de français
          </h1>

          <p style={styles.intro}>
            Répondez aux 50
            questions. Écrivez
            directement votre
            réponse dans le champ
            prévu.
          </p>
        </header>

        {tabSwitches === 1 && (
          <div style={styles.tabWarning}>
            <strong>
              ⚠️ Premier avertissement
            </strong>

            <div>
              Vous avez quitté
              l'onglet du test.
              Un deuxième
              changement d'onglet
              entraînera
              automatiquement la
              fin du test.
            </div>

            <div style={styles.tabWarningCount}>
              Changements d'onglet :
              1 / 2
            </div>
          </div>
        )}

        <div style={styles.topBar}>
          <div>
            <div style={styles.progressLabel}>
              QUESTION
            </div>

            <div style={styles.progressValue}>
              {currentQuestion + 1}{" "}
              / {questions.length}
            </div>
          </div>

          <div style={styles.timerBox}>
            <div style={styles.timerLabel}>
              TEMPS RESTANT
            </div>

            <div
              style={{
                ...styles.timer,
                color:
                  timeLeft <= 300
                    ? "#a33a3a"
                    : "#0d1b2a",
              }}
            >
              {formatTime(
                timeLeft
              )}
            </div>
          </div>

          <div>
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
              QUESTION{" "}
              {currentQuestion + 1}
            </div>

            <div style={styles.levelBadge}>
              {question.level}
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
                    draftAnswer.trim()
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
                ✓ Réponse enregistrée —
                cette réponse ne peut
                plus être modifiée.
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
                !draftAnswer.trim()
              }
              style={{
                ...styles.primaryButton,
                opacity:
                  answerLocked ||
                  !draftAnswer.trim()
                    ? 0.5
                    : 1,
                cursor:
                  answerLocked ||
                  !draftAnswer.trim()
                    ? "not-allowed"
                    : "pointer",
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
                !draftAnswer.trim()
              }
              style={{
                ...styles.submitButton,
                opacity:
                  submitting ||
                  answerLocked ||
                  !draftAnswer.trim()
                    ? 0.6
                    : 1,
                cursor:
                  submitting ||
                  answerLocked ||
                  !draftAnswer.trim()
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {submitting
                ? "Enregistrement..."
                : "Terminer le test ✓"}
            </button>
          )}
        </div>

        <div style={styles.warning}>
          ⚠️ Une seule tentative
          est autorisée. Après
          avoir enregistré une
          réponse et continué,
          cette réponse ne peut
          plus être modifiée.
        </div>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f4ee",
    padding: "35px 20px 60px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    color: "#0d1b2a",
  },

  container: {
    maxWidth: "900px",
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
    marginBottom: "28px",
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

  loadingTitle: {
    margin: "0 0 10px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "27px",
  },

  intro: {
    maxWidth: "650px",
    margin: "0 auto",
    color: "#667085",
    lineHeight: 1.6,
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
    padding: "14px 18px",
    marginBottom: "15px",
    color: "#6b5512",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  tabWarningCount: {
    marginTop: "5px",
    fontSize: "11px",
    fontWeight: "800",
  },

  topBar: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "15px",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "10px",
    boxShadow:
      "0 5px 18px rgba(13,27,42,0.04)",
  },

  progressLabel: {
    fontSize: "9px",
    fontWeight: "800",
    color: "#8a8f98",
    letterSpacing: "1px",
  },

  progressValue: {
    marginTop: "3px",
    fontSize: "15px",
    fontWeight: "800",
  },

  timerBox: {
    textAlign: "center",
  },

  timerLabel: {
    fontSize: "9px",
    fontWeight: "800",
    color: "#8a8f98",
    letterSpacing: "1px",
  },

  timer: {
    fontSize: "22px",
    fontWeight: "900",
    marginTop: "2px",
    fontVariantNumeric:
      "tabular-nums",
  },

  progressBarOuter: {
    height: "5px",
    background: "#e5dfd5",
    borderRadius: "5px",
    overflow: "hidden",
    marginBottom: "22px",
  },

  progressBarInner: {
    height: "100%",
    background: "#c9a84c",
    borderRadius: "5px",
    transition:
      "width 0.2s ease",
  },

  questionCard: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 8px 25px rgba(13,27,42,0.05)",
  },

  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  questionNumber: {
    color: "#c9a84c",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1.5px",
  },

  levelBadge: {
    background: "#f8f4ee",
    color: "#8a6d1d",
    borderRadius: "20px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: "800",
  },

  sectionName: {
    display: "inline-block",
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "7px",
    padding: "7px 11px",
    fontSize: "11px",
    fontWeight: "800",
    marginBottom: "16px",
  },

  instruction: {
    color: "#667085",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: 1.6,
    marginBottom: "15px",
  },

  questionText: {
    background: "#f8f4ee",
    borderLeft: "4px solid #c9a84c",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "25px",
    fontSize: "17px",
    lineHeight: 1.75,
    color: "#263445",
    fontWeight: "600",
  },

  answerArea: {
    marginTop: "10px",
  },

  answerLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "800",
    color: "#0d1b2a",
    marginBottom: "8px",
  },

  answerInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d8d1c5",
    borderRadius: "11px",
    padding: "15px 16px",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    fontSize: "16px",
    color: "#0d1b2a",
    background: "#ffffff",
    outline: "none",
  },

  answerInputLocked: {
    background: "#f1f8f3",
    border: "1px solid #b9d9c1",
    color: "#24713b",
    fontWeight: "700",
  },

  answerLockedMessage: {
    marginTop: "12px",
    padding: "10px 14px",
    background: "#f1f8f3",
    border: "1px solid #cce5d2",
    borderRadius: "8px",
    color: "#24713b",
    fontSize: "12px",
    fontWeight: "700",
  },

  answerErrorMessage: {
    marginTop: "10px",
    padding: "10px 14px",
    background: "#fdecec",
    border: "1px solid #efc4c4",
    borderRadius: "8px",
    color: "#a33a3a",
    fontSize: "12px",
    fontWeight: "700",
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
    padding: "13px 22px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  submitButton: {
    background: "#c9a84c",
    color: "#0d1b2a",
    border: "none",
    borderRadius: "10px",
    padding: "13px 22px",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  secondaryButton: {
    display: "block",
    margin: "12px auto 0",
    background: "transparent",
    color: "#667085",
    border: "none",
    padding: "10px 15px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  warning: {
    textAlign: "center",
    marginTop: "18px",
    color: "#667085",
    fontSize: "11px",
    lineHeight: 1.5,
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
    padding: "20px",
    background: "#f8f4ee",
    border: "1px solid #e8e2d8",
    borderRadius: "14px",
  },

  scoreLabel: {
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    color: "#8a8f98",
  },

  scoreValue: {
    fontSize: "34px",
    fontWeight: "900",
    color: "#0d1b2a",
    marginTop: "5px",
  },

  percentage: {
    fontSize: "16px",
    fontWeight: "800",
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