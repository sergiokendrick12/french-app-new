
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EXAM_TYPE = "exam_yves_b1";
const EXAM_TABLE_ATTEMPTS = "exam_yves_b1_attempts";
const EXAM_DURATION_SECONDS = 2 * 60 * 60;
const TOTAL_POINTS = 100;
const ANSWERS_STORAGE_PREFIX = "ifa_exam_yves_b1_answers_";

const questions = [
  // PART I — LES PRÉPOSITIONS (10 points)
  {
    id: 1,
    section: "Les prépositions",
    points: 2,
    type: "text",
    question:
      "Malgré la pluie, les élèves sont arrivés ______ l'école avant huit heures.",
    acceptedAnswers: ["à"],
  },
  {
    id: 2,
    section: "Les prépositions",
    points: 2,
    type: "text",
    question:
      "Mon frère habite à Kigali ______ trois ans, mais il est né ______ France.",
    acceptedAnswers: ["depuis en"],
    note: "Réponds avec les deux prépositions dans l'ordre.",
  },
  {
    id: 3,
    section: "Les prépositions",
    points: 2,
    type: "text",
    question:
      "Le professeur a félicité les élèves ______ leurs excellents résultats.",
    acceptedAnswers: ["pour"],
  },
  {
    id: 4,
    section: "Les prépositions",
    points: 2,
    type: "choice",
    question:
      "Nous avons marché ______ la rivière avant d'arriver ______ un petit village.",
    options: [
      "A. le long de / dans",
      "B. sous / chez",
      "C. parmi / à",
      "D. envers / en",
    ],
    acceptedAnswers: ["a", "a. le long de / dans", "le long de / dans"],
  },
  {
    id: 5,
    section: "Les prépositions",
    points: 2,
    type: "text",
    question:
      "Je compte ______ toi pour m'aider ______ préparer cet examen.",
    acceptedAnswers: ["sur à"],
    note: "Réponds avec les deux prépositions dans l'ordre.",
  },

  // PART II — LA CONJUGAISON (20 points)
  {
    id: 6,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Bien que Paul soit fatigué, il ______ toujours ses devoirs avant de dormir. (faire — présent)",
    acceptedAnswers: ["fait"],
  },
  {
    id: 7,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Mes sœurs et moi, nous ______ souvent la bibliothèque après les cours. (fréquenter — présent)",
    acceptedAnswers: ["fréquentons"],
  },
  {
    id: 8,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Hier, les élèves ______ leurs exercices avant l'arrivée du professeur. (terminer — passé composé)",
    acceptedAnswers: ["ont terminé", "ont terminees", "ont terminées"],
  },
  {
    id: 9,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Marie et sa cousine ______ au marché pour acheter des fruits. (aller — passé composé)",
    acceptedAnswers: ["sont allées"],
  },
  {
    id: 10,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Quand j'étais petit, je ______ chaque soir des histoires à ma grand-mère. (raconter — imparfait)",
    acceptedAnswers: ["racontais"],
  },
  {
    id: 11,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Autrefois, les habitants de ce village ______ de l'eau à la rivière. (aller — imparfait)",
    acceptedAnswers: ["allaient"],
  },
  {
    id: 12,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Si tu travailles sérieusement, tu ______ de bons résultats. (obtenir — futur simple)",
    acceptedAnswers: ["obtiendras"],
  },
  {
    id: 13,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Lorsque nous serons adultes, nous ______ nos parents pour tous leurs sacrifices. (remercier — futur simple)",
    acceptedAnswers: ["remercierons"],
  },
  {
    id: 14,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Attention ! Le verre va tomber ! L'enfant ______ le verre. (casser — futur proche)",
    acceptedAnswers: ["va casser"],
  },
  {
    id: 15,
    section: "La conjugaison",
    points: 2,
    type: "text",
    question:
      "Nous avons déjà préparé nos valises. Nous ______ demain matin. (partir — futur proche)",
    acceptedAnswers: ["allons partir"],
  },

  // PART III — LES PHRASES ET LES PROPOSITIONS (10 points)
  {
    id: 16,
    section: "Les phrases et les propositions",
    points: 2,
    type: "manual",
    question:
      "Indique si cette phrase est simple ou complexe et justifie ta réponse : « Le garçon qui porte un sac rouge est mon meilleur ami. »",
  },
  {
    id: 17,
    section: "Les phrases et les propositions",
    points: 2,
    type: "manual",
    question:
      "Relève la proposition principale et la proposition subordonnée : « Je rentrerai à la maison lorsque la pluie s'arrêtera. »",
  },
  {
    id: 18,
    section: "Les phrases et les propositions",
    points: 2,
    type: "manual",
    question:
      "Transforme cette phrase en phrase interrogative en utilisant l'inversion du sujet : « Vous avez compris les instructions du professeur. »",
  },
  {
    id: 19,
    section: "Les phrases et les propositions",
    points: 2,
    type: "manual",
    question:
      "Réunis les deux phrases avec une proposition subordonnée de cause introduite par « parce que » : « Aline est restée à la maison. Elle était malade. »",
  },
  {
    id: 20,
    section: "Les phrases et les propositions",
    points: 2,
    type: "manual",
    question:
      "La proposition introduite par « que » est-elle complétive ou relative ? « Je pense que cet élève réussira son examen. »",
  },

  // PART IV — LES PRONOMS COD (10 points)
  {
    id: 21,
    section: "Les pronoms COD",
    points: 2,
    type: "manual",
    question:
      "Remplace « la leçon » par le pronom COD et réécris toute la phrase : « Le professeur explique la leçon aux élèves. »",
  },
  {
    id: 22,
    section: "Les pronoms COD",
    points: 2,
    type: "manual",
    question:
      "Remplace « nos anciens voisins » par le pronom COD et réécris toute la phrase : « Nous avons rencontré nos anciens voisins au marché. »",
  },
  {
    id: 23,
    section: "Les pronoms COD",
    points: 2,
    type: "manual",
    question:
      "Remplace « le repas » par le pronom COD et réécris toute la phrase : « Ma mère préparera le repas avant notre arrivée. »",
  },
  {
    id: 24,
    section: "Les pronoms COD",
    points: 2,
    type: "manual",
    question:
      "Remplace « ces lettres » par le pronom COD et réécris toute la phrase : « Est-ce que tu as lu ces lettres ? »",
  },
  {
    id: 25,
    section: "Les pronoms COD",
    points: 2,
    type: "manual",
    question:
      "Remplace « cette robe » par le pronom COD et réécris toute la phrase : « Je vais acheter cette robe demain. »",
  },

  // PART V — LES ADVERBES ET LES CONJONCTIONS (10 points)
  {
    id: 26,
    section: "Les adverbes et les conjonctions",
    points: 2,
    type: "text",
    question:
      "Le candidat a répondu ______ à toutes les questions. (précis — transforme en adverbe)",
    acceptedAnswers: ["précisément"],
  },
  {
    id: 27,
    section: "Les adverbes et les conjonctions",
    points: 2,
    type: "text",
    question:
      "Complète avec « déjà », « encore », « jamais » ou « bientôt » : Il est tard, mais mon frère n'est pas ______ rentré.",
    acceptedAnswers: ["encore"],
  },
  {
    id: 28,
    section: "Les adverbes et les conjonctions",
    points: 2,
    type: "manual",
    question:
      "Remplace le groupe de mots « d'une manière polie » par un adverbe : « Elle a répondu d'une manière polie au directeur. »",
  },
  {
    id: 29,
    section: "Les adverbes et les conjonctions",
    points: 2,
    type: "choice",
    question:
      "Complète avec la conjonction qui convient : « ______ le trajet soit long, nous continuerons notre voyage. »",
    options: [
      "A. Bien que",
      "B. Parce que",
      "C. Afin que",
    ],
    acceptedAnswers: ["a", "a. bien que", "bien que"],
  },
  {
    id: 30,
    section: "Les adverbes et les conjonctions",
    points: 2,
    type: "manual",
    question:
      "Relie les deux phrases en utilisant « pourtant » sans changer leur sens général : « Il avait beaucoup étudié. Il a échoué à l'examen. »",
  },

  // PART VI — LES ARTICLES ET LES DÉTERMINANTS (10 points)
  {
    id: 31,
    section: "Les articles et les déterminants",
    points: 2,
    type: "manual",
    question:
      "Complète : « Mon père est ______ médecin et ma mère est ______ enseignante. »",
  },
  {
    id: 32,
    section: "Les articles et les déterminants",
    points: 2,
    type: "text",
    question:
      "Nous avons visité ______ musée dont tu nous avais parlé.",
    acceptedAnswers: ["le"],
  },
  {
    id: 33,
    section: "Les articles et les déterminants",
    points: 2,
    type: "manual",
    question:
      "Complète : « Je n'ai pas ______ argent sur moi, mais j'ai ______ carte bancaire. »",
  },
  {
    id: 34,
    section: "Les articles et les déterminants",
    points: 2,
    type: "text",
    question:
      "Parmi toutes les candidates, ______ qui porte une robe verte est ma cousine.",
    acceptedAnswers: ["celle"],
  },
  {
    id: 35,
    section: "Les articles et les déterminants",
    points: 2,
    type: "manual",
    question:
      "Complète avec « ce », « cet », « cette » ou « ces » : « ______ élèves ont obtenu les meilleures notes, et ______ excellent résultat mérite d'être célébré. »",
  },

  // PART VII — LE VOCABULAIRE (10 points)
  {
    id: 36,
    section: "Le vocabulaire",
    points: 2,
    type: "choice",
    question: "Le mot « persévérant » signifie :",
    options: [
      "A. Qui abandonne facilement.",
      "B. Qui continue ses efforts malgré les difficultés.",
      "C. Qui parle sans réfléchir.",
      "D. Qui refuse d'apprendre.",
    ],
    acceptedAnswers: [
      "b",
      "b. qui continue ses efforts malgré les difficultés.",
      "qui continue ses efforts malgré les difficultés.",
    ],
  },
  {
    id: 37,
    section: "Le vocabulaire",
    points: 2,
    type: "choice",
    question: "Quel est le contraire du mot « augmenter » ?",
    options: [
      "A. Améliorer.",
      "B. Agrandir.",
      "C. Diminuer.",
      "D. Développer.",
    ],
    acceptedAnswers: ["c", "c. diminuer.", "diminuer"],
  },
  {
    id: 38,
    section: "Le vocabulaire",
    points: 2,
    type: "choice",
    question:
      "Après plusieurs années de travail, elle a enfin ______ son objectif.",
    options: [
      "A. atteint",
      "B. assisté",
      "C. attendu",
      "D. apparu",
    ],
    acceptedAnswers: ["a", "a. atteint", "atteint"],
  },
  {
    id: 39,
    section: "Le vocabulaire",
    points: 2,
    type: "choice",
    question: "Que signifie l'expression « avoir la tête dans les nuages » ?",
    options: [
      "A. Être très attentif.",
      "B. Être distrait ou rêveur.",
      "C. Être en colère.",
      "D. Être malade.",
    ],
    acceptedAnswers: [
      "b",
      "b. être distrait ou rêveur.",
      "être distrait ou rêveur.",
    ],
  },
  {
    id: 40,
    section: "Le vocabulaire",
    points: 2,
    type: "choice",
    question:
      "Un élève qui respecte les règles et accomplit ses devoirs avec sérieux est un élève ______.",
    options: [
      "A. négligent",
      "B. responsable",
      "C. imprudent",
      "D. paresseux",
    ],
    acceptedAnswers: ["b", "b. responsable", "responsable"],
  },

    // PART VIII — LA COMPRÉHENSION ÉCRITE (20 points)
  {
    id: 41,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Quel problème les habitants du village avaient-ils constaté l'année dernière ?",
  },
  {
    id: 42,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Pourquoi les enfants tombaient-ils souvent malades, selon le texte ?",
  },
  {
    id: 43,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Quel âge avait Amina lorsqu'elle a proposé une solution ?",
  },
  {
    id: 44,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Pourquoi certains élèves pensaient-ils que le projet ne servirait à rien ?",
  },
  {
    id: 45,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Avec l'aide de qui Amina a-t-elle organisé une réunion ?",
  },
  {
    id: 46,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Quelles sont les deux actions que les habitants ont décidé de réaliser ?",
  },
  {
    id: 47,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Vrai ou faux ? Justifie ta réponse : « Dès le début du projet, tous les habitants participaient aux activités. »",
  },
  {
    id: 48,
    section: "La compréhension écrite",
    points: 2,
    type: "choice",
    question: "Dans le texte, que signifie le mot « découragée » ?",
    options: [
      "A. Devenue plus courageuse.",
      "B. Ayant perdu l'espoir ou la motivation.",
      "C. Devenue plus célèbre.",
      "D. Ayant changé d'avis.",
    ],
    acceptedAnswers: [
      "b",
      "b. ayant perdu l'espoir ou la motivation.",
      "ayant perdu l'espoir ou la motivation.",
    ],
  },
  {
    id: 49,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "Relève dans le texte une phrase contenant un verbe à l'imparfait et recopie-la.",
  },
  {
    id: 50,
    section: "La compréhension écrite",
    points: 2,
    type: "manual",
    question:
      "À ton avis, pourquoi est-il important que les jeunes participent à l'amélioration de leur communauté ? Réponds en trois à quatre phrases.",
  },
];

const readingText = `Un projet qui a changé leur village

L'année dernière, les habitants d'un petit village ont constaté que leur environnement devenait de plus en plus sale. Les rues étaient couvertes de déchets, les caniveaux étaient bouchés et les enfants tombaient souvent malades. Malgré plusieurs plaintes adressées aux autorités, la situation ne s'améliorait pas.

Un jour, Amina, une élève de seize ans, a décidé de proposer une solution. Elle a réuni ses camarades afin de discuter des problèmes du village. Au début, certains élèves pensaient que leur initiative ne servirait à rien, car ils étaient trop jeunes pour changer les choses.

Cependant, Amina ne s'est pas découragée. Avec l'aide de son professeur, elle a organisé une réunion à laquelle les parents, les commerçants et les responsables locaux ont participé. Ensemble, ils ont décidé de nettoyer les rues chaque samedi et de sensibiliser les habitants à l'importance de protéger l'environnement.

Pendant les premières semaines, peu de personnes participaient aux activités. Les organisateurs continuaient pourtant leurs efforts. Peu à peu, de nouveaux volontaires les ont rejoints et les rues sont devenues plus propres. Les enfants tombaient moins souvent malades et les habitants ont commencé à être fiers de leur village.

Aujourd'hui, Amina souhaite étendre ce projet aux villages voisins. Elle est convaincue que chacun peut contribuer à améliorer la société, à condition de faire preuve de courage, de patience et de solidarité.`;

function normalizeAnswer(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:"«»()[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isQuestionCorrect(question, value) {
  const normalized = normalizeAnswer(value);

  if (!normalized || !question.acceptedAnswers) {
    return false;
  }

  return question.acceptedAnswers.some(
    (answer) => normalizeAnswer(answer) === normalized
  );
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function ExamYvesB1() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] =
    useState(EXAM_DURATION_SECONDS);
  const [examStarted, setExamStarted] = useState(false);
  const [warning, setWarning] = useState("");
  const [tabSwitches, setTabSwitches] = useState(0);

  const startedAtRef = useRef(null);
  const attemptIdRef = useRef(null);
  const answersRef = useRef({});
  const submittingRef = useRef(false);
  const tabSwitchesRef = useRef(0);
  const finishExamRef = useRef(null);

  const saveAnswers = useCallback(
    async (nextAnswers) => {
      const activeAttemptId = attemptIdRef.current;

      if (!activeAttemptId || !currentUser?.id) return;

      const { error: saveError } = await supabase
        .from(EXAM_TABLE_ATTEMPTS)
        .update({ answers: nextAnswers })
        .eq("id", activeAttemptId)
        .eq("student_id", currentUser.id)
        .eq("status", "in_progress");

      if (saveError) {
        console.error(
          "Erreur de sauvegarde des réponses :",
          saveError
        );
      }
    },
    [currentUser]
  );

  const finishExam = useCallback(
    async (reason = "submitted") => {
      if (
        submittingRef.current ||
        !currentUser?.id ||
        !attemptIdRef.current
      ) {
        return;
      }

      submittingRef.current = true;
      setSubmitting(true);
      setError("");

      try {
        const finalAnswers = { ...answersRef.current };

try {
  const localData = localStorage.getItem(
    `${ANSWERS_STORAGE_PREFIX}${currentUser.id}`
  );

  if (localData) {
    const localAnswers = JSON.parse(localData);

    Object.entries(localAnswers).forEach(([questionId, value]) => {
      const currentValue = finalAnswers[questionId];

      if (
        String(currentValue ?? "").trim() === "" &&
        String(value ?? "").trim() !== ""
      ) {
        finalAnswers[questionId] = value;
      }
    });
  }
} catch (storageError) {
  console.error(
    "Impossible de récupérer les réponses locales :",
    storageError
  );
}

answersRef.current = finalAnswers;

const allAnswered = questions.every(
  (question) =>
    String(finalAnswers[question.id] ?? "").trim().length > 0
);

if (reason === "submitted" && !allAnswered) {
  setError(
    "Veuillez répondre à toutes les questions avant de soumettre l'examen."
  );
  return;
}

        if (reason === "submitted" && !allAnswered) {
          setError(
            "Veuillez répondre à toutes les questions avant de soumettre l'examen."
          );
          return;
        }

        const { data: existingAttempt, error: attemptCheckError } =
          await supabase
            .from(EXAM_TABLE_ATTEMPTS)
            .select("id, status")
            .eq("id", attemptIdRef.current)
            .eq("student_id", currentUser.id)
            .maybeSingle();

        if (attemptCheckError) throw attemptCheckError;

        if (
          !existingAttempt ||
          existingAttempt.status !== "in_progress"
        ) {
          setError(
            "Cette tentative n'est plus active. Consultez votre espace étudiant."
          );
          setExamStarted(false);
          return;
        }

        const { data: existingResult, error: existingError } =
          await supabase
            .from("test_results")
            .select("id")
            .eq("student_id", currentUser.id)
            .eq("test_type", EXAM_TYPE)
            .maybeSingle();

        if (existingError) throw existingError;

        if (existingResult) {
          setError("Un résultat existe déjà pour cet examen.");
          setExamStarted(false);
          navigate("/student-dashboard");
          return;
        }

        const automaticallyMarked = questions.filter(
          (question) => question.acceptedAnswers
        );

        const automaticScore = automaticallyMarked.reduce(
          (score, question) =>
            score +
            (isQuestionCorrect(question, finalAnswers[question.id])
              ? question.points
              : 0),
          0
        );

        const answersDetail = questions.map((question) => ({
          question_id: question.id,
          section: question.section,
          question: question.question,
          answer: finalAnswers[question.id] ?? "",
          points: question.points,
          automatically_marked: Boolean(question.acceptedAnswers),
          correct: question.acceptedAnswers
            ? isQuestionCorrect(question, finalAnswers[question.id])
            : null,
        }));

        const terminationReason =
          reason === "tab_switch"
            ? "tab_switch"
            : reason === "time_expired"
              ? "time_expired"
              : null;

        const { error: resultError } = await supabase
          .from("test_results")
          .insert({
            student_id: currentUser.id,
            test_type: EXAM_TYPE,
            score: automaticScore,
            total_questions: TOTAL_POINTS,
            percentage: automaticScore,
            grading_status: "pending",
            answers_detail: answersDetail,
            termination_reason: terminationReason,
          });

        if (resultError) throw resultError;

        const { error: updateAttemptError } = await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .update({
            status: "finished",
            answers: finalAnswers,
            finished_at: new Date().toISOString(),
            termination_reason: terminationReason,
            tab_switches: tabSwitchesRef.current,
          })
          .eq("id", attemptIdRef.current)
          .eq("student_id", currentUser.id)
          .eq("status", "in_progress");

        if (updateAttemptError) {
          console.error(
            "Erreur de clôture de la tentative :",
            updateAttemptError
          );
        }

        localStorage.removeItem(
          `${ANSWERS_STORAGE_PREFIX}${currentUser.id}`
        );

        setExamStarted(false);
        setWarning(
          reason === "tab_switch"
            ? "Votre tentative a été interrompue pour vérification. Votre résultat est en attente de correction."
            : reason === "time_expired"
              ? "Le temps est écoulé. Votre résultat a été enregistré et les réponses écrites sont en attente de correction."
              : "Votre examen a été soumis. Les réponses écrites sont en attente de correction."
        );
      } catch (submissionError) {
        console.error(
          "Erreur lors de la soumission :",
          submissionError
        );

        setError(
          "Impossible de soumettre l'examen pour le moment. Vérifiez votre connexion et réessayez."
        );
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [currentUser, navigate]
  );

  useEffect(() => {
    finishExamRef.current = finishExam;
  }, [finishExam]);

  useEffect(() => {
    let cancelled = false;

    async function initializeExam() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          navigate("/student-login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("student_profiles")
          .select("id, full_name, email, status, payment_status")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          throw new Error("Profil étudiant introuvable.");
        }

        if (
          profile.status !== "approved" ||
          profile.payment_status !== "paid"
        ) {
          throw new Error(
            "Votre compte doit être approuvé et votre paiement confirmé pour accéder à cet examen."
          );
        }
        
        // No hardcoded student-name restriction.

        const { data: assignment, error: assignmentError } =
          await supabase
            .from("exam_assignments")
            .select("exam_type, status")
            .eq("student_id", user.id)
            .eq("exam_type", EXAM_TYPE)
            .maybeSingle();

        if (assignmentError) throw assignmentError;

        if (
          !assignment ||
          !["assigned", "released"].includes(assignment.status)
        ) {
          throw new Error(
            "Cet examen ne vous a pas encore été attribué ou n'est pas disponible."
          );
        }

        const { data: existingResult, error: resultCheckError } =
          await supabase
            .from("test_results")
            .select("id")
            .eq("student_id", user.id)
            .eq("test_type", EXAM_TYPE)
            .maybeSingle();

        if (resultCheckError) throw resultCheckError;

        if (existingResult) {
          throw new Error(
            "Vous avez déjà terminé ou soumis cet examen. Une nouvelle tentative n'est pas autorisée."
          );
        }

        const { data: attempts, error: attemptCheckError } =
          await supabase
            .from(EXAM_TABLE_ATTEMPTS)
            .select("*")
            .eq("student_id", user.id)
            .eq("status", "in_progress")
            .order("started_at", { ascending: false })
            .limit(1);

        if (attemptCheckError) throw attemptCheckError;

        // Stop an obsolete initialization before it can create an attempt.
        if (cancelled) return;

        let activeAttempt = attempts?.[0] ?? null;

        if (!activeAttempt) {
          if (assignment.status !== "released") {
            throw new Error(
              "L'examen est attribué, mais il n'a pas encore été ouvert par l'administration."
            );
          }

          const now = new Date().toISOString();
          if (cancelled) return;

          const { data: newAttempt, error: createError } =
            await supabase
              .from(EXAM_TABLE_ATTEMPTS)
              .insert({
                student_id: user.id,
                status: "in_progress",
                started_at: now,
                tab_switches: 0,
                answers: {},
              })
              .select("*")
              .single();

          if (createError) throw createError;

          activeAttempt = newAttempt;
        }

        if (cancelled) return;

        const savedAnswers = activeAttempt.answers || {};

        let localAnswers = {};

        try {
          const localData = localStorage.getItem(
            `${ANSWERS_STORAGE_PREFIX}${user.id}`
          );

          if (localData) {
            localAnswers = JSON.parse(localData);
          }
        } catch (storageError) {
          console.warn(
            "Impossible de lire les réponses locales :",
            storageError
          );
        }

        const restoredAnswers = {
          ...savedAnswers,
          ...localAnswers,
        };

        setCurrentUser(user);
        setStudentProfile(profile);
        setAttemptId(activeAttempt.id);

        attemptIdRef.current = activeAttempt.id;
        startedAtRef.current = activeAttempt.started_at;

        setAnswers(restoredAnswers);
        answersRef.current = restoredAnswers;

        const elapsedSeconds = Math.floor(
          (Date.now() -
            new Date(activeAttempt.started_at).getTime()) /
            1000
        );

        setRemainingSeconds(
          Math.max(0, EXAM_DURATION_SECONDS - elapsedSeconds)
        );

        const savedSwitches = activeAttempt.tab_switches || 0;

        setTabSwitches(savedSwitches);
        tabSwitchesRef.current = savedSwitches;

        setExamStarted(true);
      } catch (initializationError) {
        console.error(
          "Erreur d'initialisation de l'examen :",
          initializationError
        );

        if (!cancelled) {
          setError(
            initializationError.message ||
              "Impossible de charger l'examen."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initializeExam();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // --------------------------------------------------
  // ANSWER HANDLING
  // --------------------------------------------------

  const handleAnswerChange = useCallback(
    (questionId, value) => {
      const updatedAnswers = {
        ...answersRef.current,
        [questionId]: value,
      };

      answersRef.current = updatedAnswers;
      console.log("IFA DEBUG — answers updated:", updatedAnswers);
      setAnswers(updatedAnswers);

      if (currentUser?.id) {
        try {
          localStorage.setItem(
            `${ANSWERS_STORAGE_PREFIX}${currentUser.id}`,
            JSON.stringify(updatedAnswers)
          );
        } catch (storageError) {
          console.error(
            "Impossible de sauvegarder localement :",
            storageError
          );
        }
      }

      saveAnswers(updatedAnswers);
    },
    [currentUser, saveAnswers]
  );

  // --------------------------------------------------
  // COUNTDOWN TIMER
  // --------------------------------------------------

  useEffect(() => {
    if (!examStarted || !attemptId) return undefined;

    const timer = window.setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [examStarted, attemptId]);

  useEffect(() => {
    if (
      examStarted &&
      remainingSeconds === 0 &&
      !submittingRef.current
    ) {
      finishExamRef.current?.("time_expired");
    }
  }, [examStarted, remainingSeconds]);

  // --------------------------------------------------
  // TAB-SWITCH SECURITY
  // --------------------------------------------------

  useEffect(() => {
    if (!examStarted || !currentUser?.id) return undefined;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      if (submittingRef.current) return;

      const nextCount = tabSwitchesRef.current + 1;

      tabSwitchesRef.current = nextCount;
      setTabSwitches(nextCount);

      supabase
        .from(EXAM_TABLE_ATTEMPTS)
        .update({ tab_switches: nextCount })
        .eq("id", attemptIdRef.current)
        .eq("student_id", currentUser.id)
        .eq("status", "in_progress")
        .then(({ error: updateError }) => {
          if (updateError) {
            console.error(
              "Impossible d'enregistrer le changement d'onglet :",
              updateError
            );
          }
        });

      if (nextCount === 1) {
        setWarning(
          "Attention : vous avez quitté la page de l'examen. Un deuxième changement d'onglet interrompra votre tentative."
        );
      } else {
        setWarning(
          "Votre tentative est interrompue pour vérification."
        );
        finishExamRef.current?.("tab_switch");
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
  }, [examStarted, currentUser]);

  // --------------------------------------------------
  // LOADING / ERROR STATES
  // --------------------------------------------------

  if (loading) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.loadingSpinner} />
        <p>Chargement de votre examen...</p>
      </div>
    );
  }

  if (error && !examStarted) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.messageCard}>
          <div style={styles.logoMark}>IFA</div>
          <h1 style={styles.messageTitle}>
            Examen de français — B1
          </h1>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/student-dashboard")}
          >
            Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.messageCard}>
          <div style={styles.logoMark}>IFA</div>
          <h1 style={styles.messageTitle}>Examen soumis</h1>
          <p>{warning || "Votre tentative est terminée."}</p>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/student-dashboard")}
          >
            Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }

  // The interface and navigation are added in Part 3.

  const currentQuestion = questions[currentQuestionIndex];

  const answeredCount = questions.filter(
    (question) =>
      String(answers[question.id] ?? "").trim().length > 0
  ).length;

  const progressPercentage =
    (answeredCount / questions.length) * 100;

  const handleSubmit = () => {
    const unanswered = questions.filter(
      (question) =>
        String(answersRef.current[question.id] ?? "").trim()
          .length === 0
    );

    if (unanswered.length > 0) {
      const shouldSubmit = window.confirm(
        `Il reste ${unanswered.length} question(s) sans réponse. Voulez-vous vraiment soumettre l'examen ?`
      );

      if (!shouldSubmit) {
        const firstUnansweredIndex = questions.findIndex(
          (question) =>
            String(
              answersRef.current[question.id] ?? ""
            ).trim().length === 0
        );

        setCurrentQuestionIndex(firstUnansweredIndex);
        return;
      }
    }

    finishExam("submitted");
  };

  const goToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerBrand}>
          <div style={styles.logoMark}>IFA</div>
          <div>
            <div style={styles.brandName}>
              International French Academy
            </div>
            <div style={styles.brandLocation}>
              Kigali, Rwanda
            </div>
          </div>
        </div>

        <button
          type="button"
          style={styles.exitButton}
          onClick={() => {
            const leave = window.confirm(
              "Voulez-vous quitter l'examen ? Votre progression est sauvegardée, mais quitter la page ne termine pas votre tentative."
            );

            if (leave) navigate("/student-dashboard");
          }}
        >
          Quitter
        </button>
      </header>

      <main style={styles.main}>
        <section style={styles.examIntro}>
          <div>
            <div style={styles.eyebrow}>EXAMEN INDIVIDUEL</div>
            <h1 style={styles.pageTitle}>
              Examen de français — Niveau B1
            </h1>
            <p style={styles.introText}>
              Répondez attentivement aux questions. Vos réponses
              sont sauvegardées automatiquement.
            </p>
          </div>

          <div style={styles.timerCard}>
            <span style={styles.timerLabel}>
              <span style={styles.timerDot} />
              TEMPS RESTANT
            </span>
            <strong
              style={{
                ...styles.timerValue,
                ...(remainingSeconds <= 300
                  ? styles.timerDanger
                  : {}),
              }}
            >
              {formatTime(remainingSeconds)}
            </strong>
            <span style={styles.timerCaption}>
              Durée maximale : 2 heures
            </span>
          </div>
        </section>

        {warning && (
          <div style={styles.warningBanner}>
            <span style={styles.warningIcon}>!</span>
            <span>{warning}</span>
          </div>
        )}

        {error && (
          <div style={styles.errorBanner}>
            {error}
          </div>
        )}

        <section style={styles.progressCard}>
          <div style={styles.progressTop}>
            <div>
              <strong style={styles.progressTitle}>
                Votre progression
              </strong>
              <p style={styles.progressSubtitle}>
                {answeredCount} sur {questions.length} questions
                répondues
              </p>
            </div>
            <strong style={styles.progressPercent}>
              {Math.round(progressPercentage)}%
            </strong>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </section>

        <div style={styles.examLayout}>
          <section style={styles.questionPanel}>
            <div style={styles.questionMeta}>
              <span style={styles.sectionBadge}>
                {currentQuestion.section}
              </span>
              <span style={styles.levelBadge}>
                Niveau {currentQuestion.level || "B1"}
              </span>
            </div>

            {currentQuestion.id >= 41 &&
              currentQuestion.id <= 50 && (
                <article style={styles.readingCard}>
                  <h2 style={styles.readingTitle}>
                    Texte de compréhension
                  </h2>
                  <div style={styles.readingContent}>
                    {readingText}
                  </div>
                </article>
              )}

            <div style={styles.questionNumber}>
              QUESTION {currentQuestionIndex + 1} /{" "}
              {questions.length}
            </div>

            <h2 style={styles.questionTitle}>
              {currentQuestion.question}
            </h2>

            {currentQuestion.instruction && (
              <p style={styles.questionInstruction}>
                {currentQuestion.instruction}
              </p>
            )}

            {currentQuestion.options &&
            currentQuestion.options.length > 0 ? (
              <div style={styles.optionsList}>
                {currentQuestion.options.map((option, index) => {
                  const optionValue =
                    typeof option === "string"
                      ? option
                      : option.value;

                  const optionLabel =
                    typeof option === "string"
                      ? option
                      : option.label;

                  const selected =
                    String(answers[currentQuestion.id] ?? "") ===
                    String(optionValue);

                  return (
                    <button
                      key={`${currentQuestion.id}-${index}`}
                      type="button"
                      style={{
                        ...styles.optionButton,
                        ...(selected
                          ? styles.optionSelected
                          : {}),
                      }}
                      onClick={() =>
                        handleAnswerChange(
                          currentQuestion.id,
                          optionValue
                        )
                      }
                    >
                      <span
                        style={{
                          ...styles.optionLetter,
                          ...(selected
                            ? styles.optionLetterSelected
                            : {}),
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span style={styles.optionText}>
                        {optionLabel}
                      </span>
                      <span style={styles.optionRadio}>
                        {selected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={styles.textAnswerWrap}>
                <label
                  htmlFor={`answer-${currentQuestion.id}`}
                  style={styles.answerLabel}
                >
                  Votre réponse
                </label>
                <textarea
                  id={`answer-${currentQuestion.id}`}
                  style={styles.answerTextarea}
                  value={answers[currentQuestion.id] ?? ""}
                  onChange={(event) =>
                    handleAnswerChange(
                      currentQuestion.id,
                      event.target.value
                    )
                  }
                  placeholder="Écrivez votre réponse ici..."
                  rows={currentQuestion.multiline ? 7 : 3}
                />
                <p style={styles.answerHint}>
                  {currentQuestion.acceptedAnswers
                    ? "Relisez votre réponse avant de continuer."
                    : "Cette réponse sera évaluée par l'équipe pédagogique."}
                </p>
              </div>
            )}

            <div style={styles.questionNavigation}>
              <button
                type="button"
                style={{
                  ...styles.secondaryButton,
                  ...(currentQuestionIndex === 0
                    ? styles.disabledButton
                    : {}),
                }}
                disabled={currentQuestionIndex === 0}
                onClick={() =>
                  goToQuestion(currentQuestionIndex - 1)
                }
              >
                ← Précédent
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={() =>
                    goToQuestion(currentQuestionIndex + 1)
                  }
                >
                  Suivant →
                </button>
              ) : (
                <button
                  type="button"
                  style={styles.submitButton}
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting
                    ? "Soumission..."
                    : "Soumettre l'examen"}
                </button>
              )}
            </div>
          </section>

          <aside style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>
                Navigation rapide
              </h3>
              <p style={styles.sidebarText}>
                Cliquez sur un numéro pour accéder à une question.
              </p>

              <div style={styles.questionGrid}>
                {questions.map((question, index) => {
                  const isAnswered =
                    String(answers[question.id] ?? "").trim()
                      .length > 0;

                  const isCurrent =
                    index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      type="button"
                      title={`Question ${index + 1}${
                        isAnswered ? " — répondue" : " — non répondue"
                      }`}
                      style={{
                        ...styles.questionGridButton,
                        ...(isAnswered
                          ? styles.questionGridAnswered
                          : {}),
                        ...(isCurrent
                          ? styles.questionGridCurrent
                          : {}),
                      }}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div style={styles.legend}>
                <div style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendDot,
                      ...styles.legendAnswered,
                    }}
                  />
                  Répondue
                </div>
                <div style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendDot,
                      ...styles.legendUnanswered,
                    }}
                  />
                  À compléter
                </div>
              </div>
            </div>

            <div style={styles.sidebarInfo}>
              <div style={styles.infoIcon}>i</div>
              <div>
                <strong style={styles.infoTitle}>
                  Important
                </strong>
                <p style={styles.infoText}>
                  Ne quittez pas l'examen et ne changez pas d'onglet.
                  Un deuxième changement d'onglet interrompra votre
                  tentative pour vérification.
                </p>
              </div>
            </div>

            <div style={styles.sidebarCard}>
              <div style={styles.summaryRow}>
                <span>Questions totales</span>
                <strong>{questions.length}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Réponses données</span>
                <strong>{answeredCount}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Non répondues</span>
                <strong>
                  {questions.length - answeredCount}
                </strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Barème</span>
                <strong>{TOTAL_POINTS} points</strong>
              </div>
            </div>
          </aside>
        </div>

        <footer style={styles.footer}>
          <span>
            International French Academy · Kigali, Rwanda
          </span>
          <span>Le savoir d'aujourd'hui construit le succès de demain</span>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f3ef",
    color: "#182633",
    fontFamily: "'DM Sans', Arial, sans-serif",
  },

  header: {
    background: "#0d1b2a",
    color: "#ffffff",
    padding: "16px 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "3px solid #c9a84c",
  },

  headerBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoMark: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#c9a84c",
    color: "#0d1b2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800,
    fontSize: "18px",
    letterSpacing: "1px",
    flexShrink: 0,
  },

  brandName: {
    fontWeight: 700,
    fontSize: "15px",
    letterSpacing: "0.2px",
  },

  brandLocation: {
    color: "#d1d8df",
    fontSize: "12px",
    marginTop: "4px",
  },

  exitButton: {
    border: "1px solid rgba(255,255,255,0.35)",
    background: "transparent",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "13px",
  },

  main: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "32px 24px 20px",
    boxSizing: "border-box",
  },

  examIntro: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  eyebrow: {
    color: "#a27d25",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
    marginBottom: "10px",
  },

  pageTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "#0d1b2a",
    fontSize: "clamp(25px, 4vw, 36px)",
    lineHeight: 1.25,
    margin: "0 0 10px",
  },

  introText: {
    color: "#64717d",
    fontSize: "14px",
    lineHeight: 1.7,
    maxWidth: "650px",
    margin: 0,
  },

  timerCard: {
    background: "#ffffff",
    border: "1px solid #e5dfd3",
    borderRadius: "14px",
    padding: "16px 22px",
    minWidth: "205px",
    boxSizing: "border-box",
    boxShadow: "0 4px 16px rgba(13,27,42,0.04)",
  },

  timerLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#64717d",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.4px",
  },

  timerDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#c9a84c",
    display: "inline-block",
  },

  timerValue: {
    display: "block",
    color: "#0d1b2a",
    fontSize: "30px",
    fontWeight: 800,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "1px",
    margin: "8px 0 4px",
  },

  timerDanger: {
    color: "#b42318",
  },

  timerCaption: {
    color: "#7b8791",
    fontSize: "11px",
  },

  warningBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#fff8e6",
    color: "#805b13",
    border: "1px solid #ead49b",
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "18px",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  warningIcon: {
    width: "22px",
    height: "22px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#f0dfac",
    fontWeight: 800,
  },

  errorBanner: {
    background: "#fff0ef",
    color: "#a12622",
    border: "1px solid #f0c5c2",
    borderRadius: "10px",
    padding: "13px 16px",
    marginBottom: "18px",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  progressCard: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "12px",
    padding: "18px 22px",
    marginBottom: "22px",
  },

  progressTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "13px",
  },

  progressTitle: {
    fontSize: "14px",
    color: "#0d1b2a",
  },

  progressSubtitle: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#75808a",
  },

  progressPercent: {
    fontSize: "20px",
    color: "#a27d25",
    fontVariantNumeric: "tabular-nums",
  },

  progressTrack: {
    height: "7px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#ece8e0",
  },

  progressFill: {
    height: "100%",
    borderRadius: "20px",
    background: "linear-gradient(90deg, #a27d25, #d9bd70)",
    transition: "width 0.25s ease",
  },

  examLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 290px",
    alignItems: "start",
    gap: "22px",
  },

  questionPanel: {
    minWidth: 0,
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "14px",
    padding: "clamp(18px, 3vw, 32px)",
    boxShadow: "0 5px 22px rgba(13,27,42,0.035)",
  },

  questionMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "25px",
  },

  sectionBadge: {
    display: "inline-flex",
    background: "#f6f0df",
    color: "#795b17",
    borderRadius: "6px",
    padding: "7px 10px",
    fontSize: "11px",
    fontWeight: 700,
  },

  levelBadge: {
    display: "inline-flex",
    background: "#edf2f6",
    color: "#30495e",
    borderRadius: "6px",
    padding: "7px 10px",
    fontSize: "11px",
    fontWeight: 700,
  },

  questionNumber: {
    color: "#a27d25",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    marginBottom: "12px",
  },

  questionTitle: {
    color: "#0d1b2a",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(20px, 3vw, 27px)",
    lineHeight: 1.45,
    margin: "0 0 12px",
    overflowWrap: "anywhere",
  },

  questionInstruction: {
    color: "#64717d",
    fontSize: "13px",
    lineHeight: 1.7,
    margin: "0 0 22px",
  },

  optionsList: {
    display: "grid",
    gap: "11px",
    marginTop: "24px",
  },

  optionButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left",
    border: "1px solid #e4e1da",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "15px",
    cursor: "pointer",
    color: "#243442",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: 1.6,
    transition: "border-color 0.15s ease, background 0.15s ease",
    boxSizing: "border-box",
  },

  optionSelected: {
    border: "1px solid #b59644",
    background: "#fbf7eb",
  },

  optionLetter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    flexShrink: 0,
    border: "1px solid #dedbd3",
    borderRadius: "8px",
    color: "#5d6974",
    fontWeight: 800,
    fontSize: "12px",
  },

  optionLetterSelected: {
    background: "#0d1b2a",
    borderColor: "#0d1b2a",
    color: "#ffffff",
  },

  optionText: {
    flex: 1,
    minWidth: 0,
    overflowWrap: "anywhere",
  },

  optionRadio: {
    color: "#9a7829",
    fontWeight: 800,
    fontSize: "17px",
    width: "20px",
    textAlign: "center",
    flexShrink: 0,
  },

  textAnswerWrap: {
    marginTop: "24px",
  },

  answerLabel: {
    display: "block",
    color: "#263744",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "10px",
  },

  answerTextarea: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dcd8cf",
    borderRadius: "10px",
    padding: "15px",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: 1.8,
    color: "#182633",
    background: "#fffefa",
    outlineColor: "#c9a84c",
    resize: "vertical",
  },

  answerHint: {
    color: "#78838c",
    fontSize: "11px",
    lineHeight: 1.6,
    marginTop: "8px",
  },

  readingCard: {
    background: "#f8f6f1",
    border: "1px solid #e7dfce",
    borderLeft: "4px solid #c9a84c",
    borderRadius: "8px",
    padding: "18px",
    marginBottom: "25px",
  },

  readingTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "18px",
    color: "#0d1b2a",
    margin: "0 0 12px",
  },

  readingContent: {
    whiteSpace: "pre-wrap",
    color: "#3f4c57",
    fontSize: "13px",
    lineHeight: 1.9,
    overflowWrap: "anywhere",
  },

  questionNavigation: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    borderTop: "1px solid #eee9e0",
    paddingTop: "22px",
    marginTop: "30px",
  },

  primaryButton: {
    border: "1px solid #0d1b2a",
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px 19px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  secondaryButton: {
    border: "1px solid #d9d4ca",
    background: "#ffffff",
    color: "#253847",
    borderRadius: "8px",
    padding: "12px 19px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  disabledButton: {
    opacity: 0.4,
    cursor: "not-allowed",
  },

  submitButton: {
    border: "1px solid #a27d25",
    background: "#c9a84c",
    color: "#0d1b2a",
    borderRadius: "8px",
    padding: "12px 19px",
    fontWeight: 800,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  sidebar: {
    display: "grid",
    gap: "16px",
    minWidth: 0,
  },

  sidebarCard: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "12px",
    padding: "19px",
  },

  sidebarTitle: {
    fontSize: "15px",
    color: "#0d1b2a",
    margin: "0 0 8px",
  },

  sidebarText: {
    fontSize: "12px",
    color: "#78838c",
    lineHeight: 1.6,
    margin: "0 0 16px",
  },

  questionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "7px",
  },

  questionGridButton: {
    minWidth: 0,
    aspectRatio: "1 / 1",
    border: "1px solid #e2ded5",
    background: "#ffffff",
    color: "#52616d",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  questionGridAnswered: {
    background: "#edf4ee",
    color: "#2f6840",
    borderColor: "#c9dfce",
  },

  questionGridCurrent: {
    outline: "2px solid #c9a84c",
    outlineOffset: "1px",
    borderColor: "#c9a84c",
    color: "#0d1b2a",
    fontWeight: 900,
  },

  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "13px",
    marginTop: "18px",
    paddingTop: "14px",
    borderTop: "1px solid #eee9e0",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    color: "#687680",
  },

  legendDot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    borderRadius: "3px",
  },

  legendAnswered: {
    background: "#d5e8d9",
    border: "1px solid #a9cdb1",
  },

  legendUnanswered: {
    background: "#ffffff",
    border: "1px solid #d8d3c9",
  },

  sidebarInfo: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    background: "#f7f1df",
    border: "1px solid #e8d9ad",
    borderRadius: "10px",
    padding: "15px",
  },

  infoIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "#e9d7a0",
    color: "#604b16",
    fontWeight: 800,
    fontSize: "12px",
  },

  infoTitle: {
    display: "block",
    color: "#624d19",
    fontSize: "12px",
    marginBottom: "6px",
  },

  infoText: {
    color: "#756331",
    fontSize: "11px",
    lineHeight: 1.8,
    margin: 0,
  },

  summaryRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "10px 0",
    borderBottom: "1px solid #f0ede7",
    fontSize: "12px",
    color: "#65727d",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
    padding: "25px 0 10px",
    marginTop: "18px",
    color: "#818a91",
    fontSize: "10px",
    lineHeight: 1.7,
  },

  centerPage: {
    minHeight: "100vh",
    background: "#f5f3ef",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', Arial, sans-serif",
    color: "#182633",
  },

  loadingSpinner: {
    width: "38px",
    height: "38px",
    border: "4px solid #e6dfd1",
    borderTopColor: "#c9a84c",
    borderRadius: "50%",
    animation: "ifaExamSpin 0.8s linear infinite",
  },

  messageCard: {
    width: "100%",
    maxWidth: "480px",
    boxSizing: "border-box",
    padding: "35px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "16px",
    boxShadow: "0 10px 35px rgba(13,27,42,0.07)",
  },

  messageTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "#0d1b2a",
    fontSize: "25px",
    lineHeight: 1.4,
    margin: "20px 0 12px",
  },

  errorText: {
    color: "#a12622",
    fontSize: "14px",
    lineHeight: 1.8,
    marginBottom: "24px",
  },
};
