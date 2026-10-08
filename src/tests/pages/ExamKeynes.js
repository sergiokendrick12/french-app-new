import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EXAM_TYPE = "exam_keynes";
const EXAM_TABLE_ATTEMPTS = "exam_keynes_attempts";
const TEST_DURATION = 90 * 60;
const ANSWERS_STORAGE_PREFIX = "ifa_exam_keynes_answers_";

/*
 * ============================================================
 * KEYNES EXAM
 * ============================================================
 * Level: B1
 * Duration: 1h30
 * Activities: 50
 * Total: 100 points
 *
 * Parts 1–8:
 *   46 language questions = 75 points
 *
 * Part 9:
 *   4 writing tasks = 25 points
 *   Manually graded by administration
 *
 * Final score:
 *   Language 75 + Writing 25 = 100
 * ============================================================
 */

const questions = [
  // ============================================================
  // PART 1 — PRONOMS
  // ============================================================

  {
    id: 1,
    part: 1,
    title: "Pronoms",
    question: "Je téléphone à mes parents tous les dimanches.",
    prompt: "Je ______ téléphone tous les dimanches.",
    options: ["les", "leur", "lui", "y"],
    answer: "leur",
    points: 2,
  },
  {
    id: 2,
    part: 1,
    title: "Pronoms",
    question: "Marie a acheté les fleurs hier.",
    prompt: "Marie ______ a achetées hier.",
    options: ["leur", "les", "lui", "en"],
    answer: "les",
    points: 2,
  },
  {
    id: 3,
    part: 1,
    title: "Pronoms",
    question: "Nous pensons souvent à notre avenir.",
    prompt: "Nous ______ pensons souvent.",
    options: ["en", "leur", "y", "lui"],
    answer: "y",
    points: 2,
  },
  {
    id: 4,
    part: 1,
    title: "Pronoms",
    question: "Paul donne un cadeau à sa sœur.",
    prompt: "Paul ______ donne un cadeau.",
    options: ["la", "lui", "leur", "en"],
    answer: "lui",
    points: 2,
  },
  {
    id: 5,
    part: 1,
    title: "Pronoms",
    question: "J’ai parlé de ce problème à mes amis.",
    prompt: "Je ______ ai parlé de ce problème.",
    options: ["les", "leur", "lui", "y"],
    answer: "leur",
    points: 1,
  },
  {
    id: 6,
    part: 1,
    title: "Pronoms",
    question: "Cette voiture appartient à Paul.",
    prompt: "Cette voiture est ______.",
    options: ["le sien", "la sienne", "les siens", "la leur"],
    answer: "la sienne",
    points: 1,
  },

  // ============================================================
  // PART 2 — PROPOSITIONS / CONJONCTIONS
  // ============================================================

  {
    id: 7,
    part: 2,
    title: "Propositions",
    question: "Je resterai à la maison parce qu’il pleuvra.",
    prompt: "Quelle est la proposition subordonnée ?",
    options: [
      "Je resterai à la maison",
      "parce qu’il pleuvra",
      "à la maison",
      "Je resterai",
    ],
    answer: "parce qu’il pleuvra",
    points: 2,
  },
  {
    id: 8,
    part: 2,
    title: "Propositions",
    question: "Quand tu arriveras, nous commencerons le repas.",
    options: [
      "nous commencerons le repas",
      "le repas",
      "Quand tu arriveras",
      "tu arriveras",
    ],
    answer: "Quand tu arriveras",
    points: 2,
  },
  {
    id: 9,
    part: 2,
    title: "Conjonctions",
    question: "Je suis rentré tôt ______ j’étais très fatigué.",
    options: ["parce que", "lorsque", "mais", "donc", "puisque"],
    answer: "parce que",
    points: 2,
  },
  {
    id: 10,
    part: 2,
    title: "Conjonctions",
    question: "______ tu auras terminé, tu pourras sortir.",
    options: ["parce que", "lorsque", "mais", "donc", "puisque"],
    answer: "lorsque",
    points: 2,
  },
  {
    id: 11,
    part: 2,
    title: "Conjonctions",
    question: "Il pleuvait beaucoup, ______ nous sommes restés à la maison.",
    options: ["parce que", "lorsque", "mais", "donc", "puisque"],
    answer: "donc",
    points: 1,
  },
  {
    id: 12,
    part: 2,
    title: "Conjonctions",
    question: "Elle voulait sortir, ______ elle était malade.",
    options: ["parce que", "lorsque", "mais", "donc", "puisque"],
    answer: "mais",
    points: 1,
  },

  // ============================================================
  // PART 3 — ADVERBES
  // ============================================================

  {
    id: 13,
    part: 3,
    title: "Adverbes",
    question: "Il répond poliment à ses professeurs.",
    prompt: "Quel est l’adverbe ?",
    answer: "poliment",
    points: 2,
  },
  {
    id: 14,
    part: 3,
    title: "Adverbes",
    question: "Nous arriverons probablement demain matin.",
    prompt: "Quel est l’adverbe ?",
    answer: "probablement",
    points: 2,
  },
  {
    id: 15,
    part: 3,
    title: "Adverbes",
    question: "Elle travaille sérieusement pour réussir son examen.",
    prompt: "Quel est l’adverbe ?",
    answer: "sérieusement",
    points: 2,
  },
  {
    id: 16,
    part: 3,
    title: "Adverbes",
    question: "heureux → ______",
    prompt: "Formez l’adverbe.",
    answer: "heureusement",
    points: 1,
  },
  {
    id: 17,
    part: 3,
    title: "Adverbes",
    question: "prudent → ______",
    prompt: "Formez l’adverbe.",
    answer: "prudemment",
    points: 1,
  },

  // ============================================================
  // PART 4 — PRÉPOSITIONS
  // ============================================================

  {
    id: 18,
    part: 4,
    title: "Prépositions",
    question: "Il habite ______ une petite maison près de l’école.",
    options: ["à", "de", "en", "chez", "pour", "avec", "dans", "sur"],
    answer: "dans",
    points: 2,
  },
  {
    id: 19,
    part: 4,
    title: "Prépositions",
    question: "Nous partirons ______ France l’année prochaine.",
    options: ["à", "de", "en", "chez", "pour", "avec", "dans", "sur"],
    answer: "en",
    points: 2,
  },
  {
    id: 20,
    part: 4,
    title: "Prépositions",
    question: "Je vais ______ mon médecin demain matin.",
    options: ["à", "de", "en", "chez", "pour", "avec", "dans", "sur"],
    answer: "chez",
    points: 2,
  },
  {
    id: 21,
    part: 4,
    title: "Prépositions",
    question: "Elle travaille ______ ses collègues depuis trois ans.",
    options: ["à", "de", "en", "chez", "pour", "avec", "dans", "sur"],
    answer: "avec",
    points: 1,
  },
  {
    id: 22,
    part: 4,
    title: "Prépositions",
    question: "Ce cadeau est ______ toi.",
    options: ["à", "de", "en", "chez", "pour", "avec", "dans", "sur"],
    answer: "pour",
    points: 1,
  },

  // ============================================================
  // PART 5 — TEMPS VERBAUX
  // ============================================================

  {
    id: 23,
    part: 5,
    title: "Temps verbaux",
    question: "Quand j’étais enfant, je ______ souvent au football. (jouer)",
    answer: "jouais",
    points: 2,
  },
  {
    id: 24,
    part: 5,
    title: "Temps verbaux",
    question: "Nous ______ toujours ensemble après les cours. (sortir)",
    answer: "sortions",
    points: 2,
  },
  {
    id: 25,
    part: 5,
    title: "Temps verbaux",
    question: "Elle ______ très timide quand elle était petite. (être)",
    answer: "était",
    points: 2,
  },
  {
    id: 26,
    part: 5,
    title: "Temps verbaux",
    question: "Hier, nous ______ un excellent film. (regarder)",
    answer: "avons regardé",
    points: 2,
  },
  {
    id: 27,
    part: 5,
    title: "Temps verbaux",
    question: "Elle ______ très tôt ce matin. (se lever)",
    answer: "s’est levée",
    points: 2,
  },
  {
    id: 28,
    part: 5,
    title: "Temps verbaux",
    question: "Ils ______ leurs devoirs avant de sortir. (finir)",
    answer: "ont fini",
    points: 1,
  },
  {
    id: 29,
    part: 5,
    title: "Temps verbaux",
    question: "Demain, je ______ mes grands-parents. (visiter)",
    answer: "visiterai",
    points: 1,
  },
  {
    id: 30,
    part: 5,
    title: "Temps verbaux",
    question: "Nous ______ beaucoup de choses pendant ce voyage. (découvrir)",
    answer: "découvrirons",
    points: 1,
  },
  {
    id: 31,
    part: 5,
    title: "Temps verbaux",
    question:
      "Quand tu seras plus âgé, tu ______ mieux cette situation. (comprendre)",
    answer: "comprendras",
    points: 2,
  },

  // ============================================================
  // PART 6 — TYPES DE PHRASES
  // ============================================================

  {
    id: 32,
    part: 6,
    title: "Types de phrases",
    question: "Quelle magnifique journée !",
    prompt: "Quel est le type de phrase ?",
    options: ["déclarative", "interrogative", "impérative", "exclamative"],
    answer: "exclamative",
    points: 2,
  },
  {
    id: 33,
    part: 6,
    title: "Types de phrases",
    question: "Est-ce que tu as terminé ton travail ?",
    prompt: "Quel est le type de phrase ?",
    options: ["déclarative", "interrogative", "impérative", "exclamative"],
    answer: "interrogative",
    points: 2,
  },
  {
    id: 34,
    part: 6,
    title: "Types de phrases",
    question: "Fermez la porte immédiatement.",
    prompt: "Quel est le type de phrase ?",
    options: ["déclarative", "interrogative", "impérative", "exclamative"],
    answer: "impérative",
    points: 2,
  },
  {
    id: 35,
    part: 6,
    title: "Transformation",
    question: "Tout le monde connaît cette histoire.",
    prompt: "Transformez la phrase.",
    answer: "Personne ne connaît cette histoire.",
    points: 1,
  },
  {
    id: 36,
    part: 6,
    title: "Transformation",
    question: "Elle viendra demain matin.",
    prompt: "Transformez la phrase en question.",
    answer: "Est-ce qu’elle viendra demain matin ?",
    alternatives: [
      "Viendra-t-elle demain matin ?",
      "Est ce qu’elle viendra demain matin ?",
    ],
    points: 1,
  },

  // ============================================================
  // PART 7 — DÉTERMINANTS
  // ============================================================

  {
    id: 37,
    part: 7,
    title: "Déterminants",
    question: "______ étudiant doit apporter son livre.",
    options: ["chaque", "plusieurs", "aucun", "certaines", "tous"],
    answer: "chaque",
    points: 2,
  },
  {
    id: 38,
    part: 7,
    title: "Déterminants",
    question: "______ personnes préfèrent travailler le matin.",
    options: ["chaque", "plusieurs", "aucun", "certaines", "tous"],
    answer: "plusieurs",
    points: 2,
  },
  {
    id: 39,
    part: 7,
    title: "Déterminants",
    question: "______ les enfants jouent dans le jardin.",
    options: ["chaque", "plusieurs", "aucun", "certaines", "tous"],
    answer: "tous",
    points: 2,
  },
  {
    id: 40,
    part: 7,
    title: "Déterminants",
    question: "Il n’y a ______ solution facile à ce problème.",
    options: ["aucune", "plusieurs", "certaines", "chaque"],
    answer: "aucune",
    points: 1,
  },
  {
    id: 41,
    part: 7,
    title: "Déterminants",
    question: "______ jours, je fais de la lecture.",
    options: ["chaque", "plusieurs", "aucun", "certaines", "tous"],
    answer: "chaque",
    points: 1,
  },

  // ============================================================
  // PART 8 — VOCABULAIRE
  // ============================================================

  {
    id: 42,
    part: 8,
    title: "Vocabulaire",
    question: "merveilleux → ______",
    options: ["magnifique", "splendide", "formidable", "extraordinaire"],
    answer: ["magnifique", "splendide", "formidable", "extraordinaire"],
    points: 2,
  },
  {
    id: 43,
    part: 8,
    title: "Vocabulaire",
    question: "commencer → ______",
    options: ["débuter", "entamer"],
    answer: ["débuter", "entamer"],
    points: 2,
  },
  {
    id: 44,
    part: 8,
    title: "Vocabulaire",
    question: "tôt → ______",
    answer: "tard",
    points: 1,
  },
  {
    id: 45,
    part: 8,
    title: "Vocabulaire",
    question: "difficile → ______",
    answer: "facile",
    points: 1,
  },
  {
    id: 46,
    part: 8,
    title: "Vocabulaire",
    question:
      "Je suis arrivé en ______ parce que le bus avait trente minutes de retard.",
    options: ["avance", "retard", "départ"],
    answer: "retard",
    points: 2,
  },
];

const writingTasks = [
  {
    id: "task1",
    title: "Tâche 1",
    points: 3,
    question: "Pourquoi la personne est-elle partie très tôt de chez elle ?",
  },
  {
    id: "task2",
    title: "Tâche 2",
    points: 3,
    question: "Que contenait le portefeuille ?",
  },
  {
    id: "task3",
    title: "Tâche 3",
    points: 4,
    question: "Qu’aurais-tu fait si tu avais trouvé ce portefeuille ?",
  },
  {
    id: "task4",
    title: "Tâche 4",
    points: 15,
    question:
      "Développez cette histoire en 6 à 8 phrases. Utilisez plusieurs temps verbaux, des connecteurs logiques et des expressions permettant de raconter clairement les événements.",
  },
];

const writingText = `Hier matin, je suis parti de chez moi très tôt pour aller au marché. Il faisait encore froid et les rues étaient presque vides. Soudain, j’ai trouvé un petit portefeuille par terre. À l’intérieur, il y avait de l’argent et une carte d’identité. J’ai décidé de chercher la personne à qui appartenait le portefeuille. Après plusieurs minutes, j’ai finalement rencontré son propriétaire.`;

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
}

function isQuestionCorrect(question, value) {
  const normalized = normalizeAnswer(value);

  if (!normalized) {
    return false;
  }

  if (Array.isArray(question.answer)) {
    return question.answer.some(
      (answer) => normalizeAnswer(answer) === normalized
    );
  }

  if (Array.isArray(question.alternatives)) {
    if (normalizeAnswer(question.answer) === normalized) {
      return true;
    }

    return question.alternatives.some(
      (answer) => normalizeAnswer(answer) === normalized
    );
  }

  return normalizeAnswer(question.answer) === normalized;
}

function calculateLanguageScore(answers) {
  return questions.reduce((total, question) => {
    if (isQuestionCorrect(question, answers[question.id])) {
      return total + question.points;
    }

    return total;
  }, 0);
}

// ============================================================
// FULL BREAKDOWN SAVED WITH THE RESULT
// ============================================================

function buildAnswerDetails(answers) {
  return questions.map((q) => {
    const correct = isQuestionCorrect(q, answers[q.id]);

    return {
      id: q.id,
      part: q.part,
      title: q.title,
      question: q.question,
      prompt: q.prompt || null,
      student_answer: answers[q.id] ?? "",
      correct_answer: q.answer,
      alternatives: q.alternatives || null,
      correct,
      points_possible: q.points,
      points_awarded: correct ? q.points : 0,
    };
  });
}

function calculateAnsweredCount(answers) {
  return questions.filter((question) => {
    const value = answers[question.id];

    return value !== undefined && String(value).trim() !== "";
  }).length;
}

function countWords(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function getStorageKey(attemptId) {
  return `${ANSWERS_STORAGE_PREFIX}${attemptId}`;
}

function normalizeWritingAnswers(value) {
  return {
    task1: value?.task1 || "",
    task2: value?.task2 || "",
    task3: value?.task3 || "",
    task4: value?.task4 || "",
  };
}

// ============================================================
// NEW: SAVE COMPLETE ANSWER SNAPSHOT IN THE ATTEMPT
// ============================================================
// This allows administration to retrieve:
//   - every language answer
//   - every writing answer
// from exam_keynes_attempts.answers
//
// Example:
// {
//   language: {
//     "1": "leur",
//     "2": "les"
//   },
//   writing: {
//     task1: "...",
//     task2: "...",
//     task3: "...",
//     task4: "..."
//   }
// }
// ============================================================

function buildAttemptAnswerSnapshot(answers, writingAnswers) {
  return {
    language: {
      ...answers,
    },
    writing: normalizeWritingAnswers(writingAnswers),
  };
}

function restoreStoredState(attemptId, setAnswers, setWritingAnswers) {
  if (!attemptId) {
    return;
  }

  try {
    const raw = localStorage.getItem(getStorageKey(attemptId));

    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);

    if (
      parsed &&
      typeof parsed === "object" &&
      ("answers" in parsed || "writingAnswers" in parsed)
    ) {
      setAnswers(parsed.answers || {});
      setWritingAnswers(normalizeWritingAnswers(parsed.writingAnswers));
    } else {
      // Backward compatibility with the previous storage format.
      setAnswers(parsed || {});
    }
  } catch (error) {
    console.error("Unable to restore saved exam state:", error);
  }
}

export default function ExamKeynes() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [answers, setAnswers] = useState({});
  const [writingAnswers, setWritingAnswers] = useState({
    task1: "",
    task2: "",
    task3: "",
    task4: "",
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [attemptId, setAttemptId] = useState(null);
  const [startedAt, setStartedAt] = useState(null);

  const [remainingSeconds, setRemainingSeconds] = useState(TEST_DURATION);

  const [tabSwitches, setTabSwitches] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [terminatedByTabSwitch, setTerminatedByTabSwitch] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [writingSection, setWritingSection] = useState(false);

  const timeoutRef = useRef(false);
  const submittingRef = useRef(false);
  const visibilityHandledRef = useRef(false);

  const allActivities = useMemo(() => [...questions], []);

  const languageScore = useMemo(
    () => calculateLanguageScore(answers),
    [answers]
  );

  const answeredCount = useMemo(
    () => calculateAnsweredCount(answers),
    [answers]
  );

  const answeredPercentage =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const current = allActivities[currentQuestion];

  const currentPartQuestions = useMemo(() => {
    if (!current) {
      return [];
    }

    return questions.filter((question) => question.part === current.part);
  }, [current]);

  const currentPartNumber = current?.part || 1;

  const formattedTime = useMemo(() => {
    const safeSeconds = Math.max(0, remainingSeconds);

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }, [remainingSeconds]);

  const isLastLanguageQuestion = currentQuestion === allActivities.length - 1;

  const canGoPrevious = currentQuestion > 0;

  const canGoNext = currentQuestion < allActivities.length - 1;

  const isWritingComplete = writingTasks.every(
    (task) => String(writingAnswers[task.id] || "").trim() !== ""
  );

  // ============================================================
  // SAVE COMPLETE EXAM STATE
  // ============================================================

  const saveExamState = (nextAnswers, nextWritingAnswers = writingAnswers) => {
    try {
      if (!attemptId) {
        return;
      }

      localStorage.setItem(
        getStorageKey(attemptId),
        JSON.stringify({
          answers: nextAnswers,
          writingAnswers: normalizeWritingAnswers(nextWritingAnswers),
        })
      );
    } catch (error) {
      console.error("Unable to save exam state:", error);
    }
  };

  // ============================================================
  // INITIALIZE EXAM
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function initializeExam() {
      try {
        setLoading(true);
        setErrorMessage("");

        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!currentUser) {
          navigate("/student-login", { replace: true });
          return;
        }

        if (cancelled) {
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
          setErrorMessage("Votre profil étudiant est introuvable.");
          return;
        }

        setStudent(profile);

        if (
          profile.status !== "approved" ||
          profile.payment_status !== "paid"
        ) {
          setErrorMessage(
            "Vous devez être approuvé et avoir un paiement confirmé pour accéder à cet examen."
          );
          return;
        }

        // --------------------------------------------------------
        // CHECK IF EXAM WAS ALREADY COMPLETED
        // --------------------------------------------------------

        const { data: existingResult, error: resultError } = await supabase
          .from("test_results")
          .select("id, completed_at, score, percentage")
          .eq("student_id", currentUser.id)
          .eq("test_type", EXAM_TYPE)
          .maybeSingle();

        if (resultError && resultError.code !== "PGRST116") {
          throw resultError;
        }

        if (existingResult) {
          setAlreadySubmitted(true);
          return;
        }

        // --------------------------------------------------------
        // CHECK EXISTING ATTEMPT
        // --------------------------------------------------------

        const { data: existingAttempt, error: attemptError } = await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .select("*")
          .eq("student_id", currentUser.id)
          .eq("status", "in_progress")
          .maybeSingle();

        if (attemptError && attemptError.code !== "PGRST116") {
          throw attemptError;
        }

        let activeAttempt = existingAttempt;

        // --------------------------------------------------------
        // RESUME EXISTING ATTEMPT
        // --------------------------------------------------------

        if (activeAttempt) {
          setAttemptId(activeAttempt.id);

          const startDate = new Date(activeAttempt.started_at);

          setStartedAt(startDate.toISOString());

          setTabSwitches(activeAttempt.tab_switches || 0);

          restoreStoredState(
            activeAttempt.id,
            setAnswers,
            setWritingAnswers
          );

          const elapsedSeconds = Math.floor(
            (Date.now() - startDate.getTime()) / 1000
          );

          const remaining = Math.max(0, TEST_DURATION - elapsedSeconds);

          setRemainingSeconds(remaining);

          if (remaining <= 0) {
            setTimeout(() => {
              if (!cancelled) {
                handleTimeout();
              }
            }, 0);
          }

          return;
        }

        // --------------------------------------------------------
        // CREATE NEW ATTEMPT
        // --------------------------------------------------------

        const now = new Date().toISOString();

        const { data: newAttempt, error: createError } = await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .insert({
            student_id: currentUser.id,
            status: "in_progress",
            started_at: now,
            tab_switches: 0,
          })
          .select("*")
          .single();

        if (createError) {
          throw createError;
        }

        if (cancelled) {
          return;
        }

        activeAttempt = newAttempt;

        setAttemptId(newAttempt.id);

        setStartedAt(now);

        setRemainingSeconds(TEST_DURATION);

        setTabSwitches(0);

        restoreStoredState(
          newAttempt.id,
          setAnswers,
          setWritingAnswers
        );
      } catch (error) {
        console.error("Exam initialization error:", error);

        if (!cancelled) {
          setErrorMessage(
            error?.message ||
              "Une erreur est survenue lors du chargement de l’examen."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeExam();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ============================================================
  // TIMER
  // ============================================================

  useEffect(() => {
    if (!startedAt || submitted || terminatedByTabSwitch) {
      return undefined;
    }

    let cancelled = false;

    const updateTimer = async () => {
      try {
        const { data: serverTime, error } = await supabase.rpc(
          "get_server_time"
        );

        if (error) {
          throw error;
        }

        const serverNow = new Date(serverTime);

        const start = new Date(startedAt);

        const elapsed = Math.floor(
          (serverNow.getTime() - start.getTime()) / 1000
        );

        const remaining = Math.max(0, TEST_DURATION - elapsed);

        if (cancelled) {
          return;
        }

        setRemainingSeconds(remaining);

        if (remaining <= 0 && !timeoutRef.current) {
          timeoutRef.current = true;
          await handleTimeout();
        }
      } catch (error) {
        console.error("Timer error:", error);

        // Fallback to local time if server RPC is temporarily unavailable.
        const start = new Date(startedAt);

        const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);

        const remaining = Math.max(0, TEST_DURATION - elapsed);

        if (!cancelled) {
          setRemainingSeconds(remaining);

          if (remaining <= 0 && !timeoutRef.current) {
            timeoutRef.current = true;
            await handleTimeout();
          }
        }
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [startedAt, submitted, terminatedByTabSwitch]);

  // ============================================================
  // VISIBILITY / TAB SWITCH SECURITY
  // ============================================================

  useEffect(() => {
    if (!attemptId || submitted || terminatedByTabSwitch) {
      return undefined;
    }

    const handleVisibilityChange = async () => {
      if (document.visibilityState !== "hidden") {
        return;
      }

      if (visibilityHandledRef.current) {
        return;
      }

      visibilityHandledRef.current = true;

      const newCount = tabSwitches + 1;

      setTabSwitches(newCount);

      try {
        await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .update({
            tab_switches: newCount,
          })
          .eq("id", attemptId);
      } catch (error) {
        console.error("Unable to update tab switch count:", error);
      }

      if (newCount === 1) {
        setShowTabWarning(true);
      } else if (newCount >= 2) {
        await terminateExamByTabSwitch();
      }

      setTimeout(() => {
        visibilityHandledRef.current = false;
      }, 1000);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [attemptId, tabSwitches, submitted, terminatedByTabSwitch]);

  // ============================================================
  // ANSWER HANDLERS
  // ============================================================

  const handleAnswerChange = (questionId, value) => {
    const nextAnswers = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(nextAnswers);

    saveExamState(nextAnswers, writingAnswers);
  };

  const handleWritingChange = (taskId, value) => {
    const nextWritingAnswers = {
      ...writingAnswers,
      [taskId]: value,
    };

    setWritingAnswers(nextWritingAnswers);

    saveExamState(answers, nextWritingAnswers);
  };

  // ============================================================
  // TAB SWITCH TERMINATION
  // ============================================================

  async function terminateExamByTabSwitch() {
    if (submittingRef.current || submitted) {
      return;
    }

    submittingRef.current = true;
    setSaving(true);
    setShowTabWarning(false);

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error("Session utilisateur introuvable.");
      }

      const partialLanguageScore = calculateLanguageScore(answers);

      const { error: resultError } = await supabase
        .from("test_results")
        .insert({
          student_id: currentUser.id,
          score: partialLanguageScore,
          total_questions: 100,
          percentage: partialLanguageScore,
          test_type: EXAM_TYPE,
          task1_answer: writingAnswers.task1.trim(),
          task2_answer: writingAnswers.task2.trim(),
          task3_answer: writingAnswers.task3.trim(),
          task4_answer: writingAnswers.task4.trim(),
          grading_status: "pending",
          answers_detail: buildAnswerDetails(answers),
        });

      if (resultError && resultError.code !== "23505") {
        throw resultError;
      }

      // --------------------------------------------------------
      // NEW:
      // Save ALL answers into exam_keynes_attempts.answers
      // --------------------------------------------------------

      if (attemptId) {
        const answerSnapshot = buildAttemptAnswerSnapshot(
          answers,
          writingAnswers
        );

        const { error: updateAttemptError } = await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .update({
            status: "finished",
            finished_at: new Date().toISOString(),
            termination_reason: "tab_switch",
            tab_switches: Math.max(2, tabSwitches),
            answers: answerSnapshot,
          })
          .eq("id", attemptId);

        if (updateAttemptError) {
          console.error(
            "Unable to save tab-switch attempt answers:",
            updateAttemptError
          );
        }
      }

      if (attemptId) {
        localStorage.removeItem(getStorageKey(attemptId));
      }

      setTerminatedByTabSwitch(true);
    } catch (error) {
      console.error("Tab switch termination error:", error);

      setErrorMessage(
        error?.message ||
          "L’examen a rencontré un problème lors de sa clôture."
      );
    } finally {
      submittingRef.current = false;

      setSaving(false);
    }
  }

  // ============================================================
  // SUBMIT EXAM
  // ============================================================

  async function submitExam(reason = "manual") {
    if (submittingRef.current || submitted) {
      return;
    }

    const isTimeout = reason === "time";

    // ----------------------------------------------------------
    // MANUAL SUBMISSION VALIDATION
    // ----------------------------------------------------------

    if (!isTimeout) {
      const unansweredQuestions = questions.filter((question) => {
        const value = answers[question.id];

        return value === undefined || String(value).trim() === "";
      });

      if (unansweredQuestions.length > 0) {
        setErrorMessage(
          `Veuillez répondre à toutes les questions de langue. Il reste ${unansweredQuestions.length} question(s).`
        );

        setWritingSection(false);

        setCurrentQuestion(
          questions.findIndex(
            (question) =>
              answers[question.id] === undefined ||
              String(answers[question.id]).trim() === ""
          )
        );

        return;
      }

      const missingWritingTasks = writingTasks.filter(
        (task) => String(writingAnswers[task.id] || "").trim() === ""
      );

      if (missingWritingTasks.length > 0) {
        setErrorMessage(
          `Veuillez répondre à toutes les tâches d’expression écrite. Il reste ${missingWritingTasks.length} tâche(s).`
        );

        setWritingSection(true);

        return;
      }

      const confirmed = window.confirm(
        "Êtes-vous certain de vouloir terminer l’examen ? Vous ne pourrez plus modifier vos réponses."
      );

      if (!confirmed) {
        return;
      }
    }

    submittingRef.current = true;

    setSaving(true);
    setErrorMessage("");

    try {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!currentUser) {
        throw new Error("Session utilisateur introuvable.");
      }

      // --------------------------------------------------------
      // RECHECK PROFILE
      // --------------------------------------------------------

      const { data: profile, error: profileError } = await supabase
        .from("student_profiles")
        .select("id, full_name, email, status, payment_status")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error("Votre profil étudiant est introuvable.");
      }

      if (
        profile.status !== "approved" ||
        profile.payment_status !== "paid"
      ) {
        throw new Error("Votre accès à cet examen n’est plus autorisé.");
      }

      // --------------------------------------------------------
      // PREVENT DUPLICATE RESULT
      // --------------------------------------------------------

      const { data: existingResult, error: existingResultError } =
        await supabase
          .from("test_results")
          .select("id")
          .eq("student_id", currentUser.id)
          .eq("test_type", EXAM_TYPE)
          .maybeSingle();

      if (
        existingResultError &&
        existingResultError.code !== "PGRST116"
      ) {
        throw existingResultError;
      }

      if (existingResult) {
        setAlreadySubmitted(true);
        return;
      }

      // --------------------------------------------------------
      // CALCULATE LANGUAGE SCORE
      // --------------------------------------------------------

      const finalLanguageScore = calculateLanguageScore(answers);

      // --------------------------------------------------------
      // INSERT RESULT
      //
      // score / percentage represent the automatically graded
      // language section for now.
      //
      // Writing is manually graded later.
      // answers_detail keeps every question, the student's answer,
      // the correct answer and the points awarded.
      // --------------------------------------------------------

      const { error: insertError } = await supabase
        .from("test_results")
        .insert({
          student_id: currentUser.id,
          score: finalLanguageScore,
          total_questions: 100,
          percentage: finalLanguageScore,
          test_type: EXAM_TYPE,
          task1_answer: writingAnswers.task1.trim(),
          task2_answer: writingAnswers.task2.trim(),
          task3_answer: writingAnswers.task3.trim(),
          task4_answer: writingAnswers.task4.trim(),
          grading_status: "pending",
          answers_detail: buildAnswerDetails(answers),
        });

      if (insertError && insertError.code !== "23505") {
        throw insertError;
      }

      // --------------------------------------------------------
      // FINISH ATTEMPT
      //
      // NEW:
      // Save the complete language + writing answers in the
      // exam_keynes_attempts.answers JSONB column.
      // --------------------------------------------------------

      if (attemptId) {
        const terminationReason =
          reason === "time" ? "timeout" : "manual";

        const answerSnapshot = buildAttemptAnswerSnapshot(
          answers,
          writingAnswers
        );

        const { error: updateAttemptError } = await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .update({
            status: "finished",
            finished_at: new Date().toISOString(),
            termination_reason: terminationReason,
            tab_switches: tabSwitches,
            answers: answerSnapshot,
          })
          .eq("id", attemptId);

        if (updateAttemptError) {
          console.error(
            "Unable to finish attempt and save answers:",
            updateAttemptError
          );
        }

        localStorage.removeItem(getStorageKey(attemptId));
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Submit exam error:", error);

      setErrorMessage(
        error?.message ||
          "Une erreur est survenue lors de l’enregistrement de votre examen."
      );
    } finally {
      submittingRef.current = false;

      setSaving(false);
    }
  }

  // ============================================================
  // TIMEOUT
  // ============================================================

  async function handleTimeout() {
    if (submitted || terminatedByTabSwitch) {
      return;
    }

    await submitExam("time");
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goToQuestion = (index) => {
    if (index < 0 || index >= allActivities.length) {
      return;
    }

    setWritingSection(false);
    setCurrentQuestion(index);
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goNext = () => {
    if (!canGoNext) {
      setWritingSection(true);
      setErrorMessage("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    goToQuestion(currentQuestion + 1);
  };

  const goPrevious = () => {
    if (!canGoPrevious) {
      return;
    }

    goToQuestion(currentQuestion - 1);
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.spinner} />

          <h2 style={styles.centerTitle}>Chargement de l’examen</h2>

          <p style={styles.centerText}>
            Veuillez patienter quelques secondes...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ACCESS ERROR
  // ============================================================

  if (errorMessage && !student && !alreadySubmitted) {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.errorIcon}>!</div>

          <h2 style={styles.centerTitle}>Accès impossible</h2>

          <p style={styles.centerText}>{errorMessage}</p>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={styles.primaryButton}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // ALREADY SUBMITTED
  // ============================================================

  if (alreadySubmitted) {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.successIcon}>✓</div>

          <h2 style={styles.centerTitle}>Examen déjà terminé</h2>

          <p style={styles.centerText}>
            Vous avez déjà soumis cet examen. Une deuxième tentative n’est pas
            autorisée.
          </p>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={styles.primaryButton}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // TAB SWITCH TERMINATED
  // ============================================================

  if (terminatedByTabSwitch) {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.dangerIcon}>!</div>

          <h2 style={styles.centerTitle}>Examen terminé</h2>

          <p style={styles.centerText}>
            L’examen a été automatiquement terminé après plusieurs changements
            d’onglet ou de fenêtre.
          </p>

          <p style={styles.smallText}>
            Votre résultat automatique a été enregistré. L’expression écrite
            reste en attente de correction.
          </p>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={styles.primaryButton}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // SUBMITTED
  // ============================================================

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.centerCard}>
          <div style={styles.successIcon}>✓</div>

          <h2 style={styles.centerTitle}>
            Examen terminé avec succès
          </h2>

          <p style={styles.centerText}>
            Votre examen a bien été enregistré.
          </p>

          <div style={styles.scoreBox}>
            <div style={styles.scoreLabel}>Partie automatique</div>

            <div style={styles.scoreValue}>{languageScore} / 75</div>

            <div style={styles.scoreSubtext}>
              Expression écrite : correction en attente
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={styles.primaryButton}
          >
            Voir mon tableau de bord
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN EXAM
  // ============================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header style={styles.header}>
          <div>
            <div style={styles.brand}>
              International French Academy
            </div>

            <h1 style={styles.title}>
              Examen de français — B1
            </h1>

            <p style={styles.subtitle}>
              Évaluation de grammaire, vocabulaire et expression écrite
            </p>
          </div>

          <div style={styles.headerMeta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Durée</span>

              <strong>1h30</strong>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Activités</span>

              <strong>50</strong>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Total</span>

              <strong>100 pts</strong>
            </div>
          </div>
        </header>

        {/* ======================================================
            WARNING
        ====================================================== */}

        {showTabWarning && (
          <div style={styles.warningBox}>
            <div style={styles.warningIcon}>⚠</div>

            <div>
              <strong>
                Attention : changement d’onglet détecté
              </strong>

              <p style={styles.warningText}>
                Ne quittez pas la page de l’examen. Après ce premier
                avertissement, un nouveau changement d’onglet entraînera
                automatiquement la fin de votre examen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTabWarning(false)}
              style={styles.warningButton}
            >
              J’ai compris
            </button>
          </div>
        )}

        {/* ======================================================
            TOP BAR
        ====================================================== */}

        <div style={styles.topBar}>
          <div>
            <div style={styles.studentName}>
              {student?.full_name || user?.email}
            </div>

            <div style={styles.progressText}>
              Questions de langue : {answeredCount} / {questions.length}
            </div>
          </div>

          <div
            style={{
              ...styles.timer,
              ...(remainingSeconds <= 300
                ? styles.timerDanger
                : {}),
            }}
          >
            <span style={styles.timerLabel}>
              Temps restant
            </span>

            <strong>{formattedTime}</strong>
          </div>
        </div>

        {/* ======================================================
            PROGRESS
        ====================================================== */}

        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${answeredPercentage}%`,
              }}
            />
          </div>

          <div style={styles.progressFooter}>
            <span>
              Progression : {answeredPercentage}%
            </span>

            <span>
              Partie {currentPartNumber} / 8
            </span>
          </div>
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {errorMessage && (
          <div style={styles.errorBox}>
            <strong>Attention</strong>

            <p style={styles.errorText}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* ======================================================
            EXAM LAYOUT
        ====================================================== */}

        <div style={styles.examLayout}>
          {/* ====================================================
              SIDEBAR
          ==================================================== */}

          <aside style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>
                Navigation
              </h3>

              {[1, 2, 3, 4, 5, 6, 7, 8].map((part) => {
                const partQuestions = questions.filter(
                  (question) => question.part === part
                );

                const partAnswered = partQuestions.filter(
                  (question) =>
                    answers[question.id] !== undefined &&
                    String(answers[question.id]).trim() !== ""
                ).length;

                return (
                  <div key={part} style={styles.partGroup}>
                    <div style={styles.partHeader}>
                      <span>Partie {part}</span>

                      <span style={styles.partCount}>
                        — {partAnswered} / {partQuestions.length}
                      </span>
                    </div>

                    <div style={styles.questionGrid}>
                      {partQuestions.map((question) => {
                        const isAnswered =
                          answers[question.id] !== undefined &&
                          String(answers[question.id]).trim() !== "";

                        const isCurrent =
                          current?.id === question.id;

                        return (
                          <button
                            key={question.id}
                            type="button"
                            onClick={() =>
                              goToQuestion(
                                allActivities.findIndex(
                                  (item) =>
                                    item.id === question.id
                                )
                              )
                            }
                            style={{
                              ...styles.questionNumber,
                              ...(isAnswered
                                ? styles.questionAnswered
                                : {}),
                              ...(isCurrent
                                ? styles.questionCurrent
                                : {}),
                            }}
                          >
                            {question.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setWritingSection(true);

                  setErrorMessage("");

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                style={{
                  ...styles.writingNavButton,
                  ...(writingSection
                    ? styles.writingNavButtonActive
                    : {}),
                }}
              >
                <span>Partie 9</span>

                <span>Expression</span>
              </button>
            </div>

            <div style={styles.securityCard}>
              <div style={styles.securityTitle}>
                Sécurité
              </div>

              <div style={styles.securityItem}>
                Changements d’onglet :{" "}
                <strong>{tabSwitches}</strong>
              </div>

              <div style={styles.securityItem}>
                Après un premier changement d’onglet, un deuxième
                changement termine automatiquement l’examen.
              </div>
            </div>
          </aside>

          {/* ====================================================
              CONTENT
          ==================================================== */}

          <main style={styles.mainContent}>
            {!writingSection ? (
              <>
                {/* ----------------------------------------------
                    QUESTION CARD
                ---------------------------------------------- */}

                <section style={styles.questionCard}>
                  <div style={styles.questionHeader}>
                    <div>
                      <div style={styles.partBadge}>
                        Partie {current.part}
                      </div>

                      <div style={styles.questionTitle}>
                        Question {current.id}
                      </div>
                    </div>

                    <div style={styles.pointsBadge}>
                      {current.points} pt
                      {current.points > 1 ? "s" : ""}
                    </div>
                  </div>

                  <div style={styles.questionBody}>
                    <p style={styles.questionText}>
                      {current.question}
                    </p>

                    {current.prompt && (
                      <p style={styles.promptText}>
                        {current.prompt}
                      </p>
                    )}

                    {current.options ? (
                      <div style={styles.options}>
                        {current.options.map((option) => {
                          const selected =
                            answers[current.id] === option;

                          return (
                            <button
                              key={option}
                              type="button"
                              disabled={
                                Boolean(answers[current.id]) ||
                                saving
                              }
                              onClick={() =>
                                handleAnswerChange(
                                  current.id,
                                  option
                                )
                              }
                              style={{
                                ...styles.optionButton,
                                ...(selected
                                  ? styles.optionSelected
                                  : {}),
                                ...(answers[current.id]
                                  ? styles.optionLocked
                                  : {}),
                              }}
                            >
                              <span
                                style={styles.optionLetter}
                              >
                                {String.fromCharCode(
                                  65 +
                                    current.options.indexOf(
                                      option
                                    )
                                )}
                              </span>

                              <span>{option}</span>

                              {selected && (
                                <span
                                  style={
                                    styles.selectedCheck
                                  }
                                >
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={styles.textAnswerBox}>
                        <input
                          type="text"
                          value={answers[current.id] || ""}
                          disabled={saving}
                          onChange={(event) =>
                            handleAnswerChange(
                              current.id,
                              event.target.value
                            )
                          }
                          placeholder="Écrivez votre réponse..."
                          style={styles.textInput}
                          autoComplete="off"
                        />

                        <div style={styles.inputHint}>
                          Votre réponse sera enregistrée
                          automatiquement.
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* ----------------------------------------------
                    PART QUESTIONS MINI NAV
                ---------------------------------------------- */}

                <section style={styles.partNavigator}>
                  <div>
                    <strong>
                      Partie {current.part}
                    </strong>

                    <span
                      style={styles.partNavigatorText}
                    >
                      {" "}
                      — {current.title}
                    </span>
                  </div>

                  <div style={styles.partQuestionList}>
                    {currentPartQuestions.map(
                      (question) => {
                        const index =
                          allActivities.findIndex(
                            (item) =>
                              item.id === question.id
                          );

                        const answered =
                          answers[question.id] !==
                            undefined &&
                          String(
                            answers[question.id]
                          ).trim() !== "";

                        return (
                          <button
                            key={question.id}
                            type="button"
                            onClick={() =>
                              goToQuestion(index)
                            }
                            style={{
                              ...styles.miniQuestion,
                              ...(answered
                                ? styles.miniQuestionAnswered
                                : {}),
                              ...(current.id ===
                              question.id
                                ? styles.miniQuestionCurrent
                                : {}),
                            }}
                          >
                            {question.id}
                          </button>
                        );
                      }
                    )}
                  </div>
                </section>

                {/* ----------------------------------------------
                    NAVIGATION BUTTONS
                ---------------------------------------------- */}

                <div style={styles.navigation}>
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={!canGoPrevious || saving}
                    style={{
                      ...styles.secondaryButton,
                      ...((!canGoPrevious || saving) &&
                        styles.disabledButton),
                    }}
                  >
                    ← Précédent
                  </button>

                  <div style={styles.navigationCenter}>
                    <span>
                      Question {currentQuestion + 1} /{" "}
                      {allActivities.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={saving}
                    style={styles.primaryButton}
                  >
                    {isLastLanguageQuestion
                      ? "Continuer vers l’expression →"
                      : "Suivant →"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* ==================================================
                    WRITING SECTION
                ================================================== */}

                <section style={styles.writingIntro}>
                  <div style={styles.partBadge}>
                    Partie 9
                  </div>

                  <h2 style={styles.writingTitle}>
                    Expression écrite
                  </h2>

                  <p style={styles.writingDescription}>
                    Cette partie comporte 4 tâches pour un total
                    de <strong>25 points</strong>. Vos réponses
                    seront corrigées manuellement par
                    l’administration.
                  </p>

                  <div style={styles.storyBox}>
                    <div style={styles.storyLabel}>
                      Texte support
                    </div>

                    <p style={styles.storyText}>
                      {writingText}
                    </p>
                  </div>
                </section>

                <div style={styles.writingTasks}>
                  {writingTasks.map((task) => {
                    const value =
                      writingAnswers[task.id] || "";

                    return (
                      <section
                        key={task.id}
                        style={styles.writingCard}
                      >
                        <div
                          style={
                            styles.writingCardHeader
                          }
                        >
                          <div>
                            <div
                              style={styles.taskBadge}
                            >
                              {task.title}
                            </div>

                            <h3
                              style={
                                styles.writingQuestion
                              }
                            >
                              {task.question}
                            </h3>
                          </div>

                          <div
                            style={styles.pointsBadge}
                          >
                            {task.points} pts
                          </div>
                        </div>

                        <textarea
                          value={value}
                          onChange={(event) =>
                            handleWritingChange(
                              task.id,
                              event.target.value
                            )
                          }
                          disabled={saving}
                          rows={
                            task.id === "task4"
                              ? 10
                              : 5
                          }
                          placeholder="Écrivez votre réponse ici..."
                          style={
                            styles.writingTextarea
                          }
                        />

                        <div
                          style={styles.writingFooter}
                        >
                          <span>
                            {countWords(value)} mot
                            {countWords(value) !== 1
                              ? "s"
                              : ""}
                          </span>

                          {task.id === "task4" && (
                            <span>
                              Recommandé : 6 à 8 phrases
                            </span>
                          )}
                        </div>
                      </section>
                    );
                  })}
                </div>

                {/* ----------------------------------------------
                    WRITING NAVIGATION
                ---------------------------------------------- */}

                <div style={styles.navigation}>
                  <button
                    type="button"
                    onClick={() => {
                      setWritingSection(false);

                      setCurrentQuestion(
                        allActivities.length - 1
                      );

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    disabled={saving}
                    style={styles.secondaryButton}
                  >
                    ← Retour aux questions
                  </button>

                  <div
                    style={styles.navigationCenter}
                  >
                    <span>
                      Expression écrite :{" "}
                      {
                        writingTasks.filter(
                          (task) =>
                            String(
                              writingAnswers[
                                task.id
                              ] || ""
                            ).trim() !== ""
                        ).length
                      }{" "}
                      / {writingTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      submitExam("manual")
                    }
                    disabled={saving}
                    style={{
                      ...styles.submitButton,
                      ...(saving
                        ? styles.disabledButton
                        : {}),
                    }}
                  >
                    {saving
                      ? "Enregistrement..."
                      : "Terminer l’examen"}
                  </button>
                </div>

                {!isWritingComplete && (
                  <div style={styles.finalWarning}>
                    <strong>
                      Avant de terminer
                    </strong>

                    <p
                      style={
                        styles.finalWarningText
                      }
                    >
                      Toutes les tâches d’expression
                      écrite doivent être complétées
                      avant la soumission.
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <footer style={styles.footer}>
          <div>
            International French Academy — Kigali, Rwanda
          </div>

          <div>
            Examen B1 · 50 activités · 100 points
          </div>
        </footer>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8f4ee 0%, #f4efe6 100%)",
    color: "#0d1b2a",
    fontFamily:
      '"DM Sans", Arial, Helvetica, sans-serif',
    padding: "24px 16px 50px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "1440px",
    margin: "0 auto",
  },

  header: {
    background: "#0d1b2a",
    color: "#fff",
    borderRadius: "18px",
    padding: "28px 30px",
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "center",
    boxShadow:
      "0 12px 35px rgba(13, 27, 42, 0.15)",
  },

  brand: {
    color: "#c9a84c",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "32px",
    lineHeight: 1.15,
  },

  subtitle: {
    margin: "10px 0 0",
    color: "rgba(255,255,255,0.75)",
    fontSize: "14px",
  },

  headerMeta: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  metaItem: {
    minWidth: "85px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },

  metaLabel: {
    display: "block",
    fontSize: "11px",
    color: "rgba(255,255,255,0.65)",
    marginBottom: "4px",
  },

  topBar: {
    marginTop: "18px",
    background: "#fff",
    borderRadius: "14px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    boxShadow:
      "0 5px 20px rgba(13,27,42,0.06)",
  },

  studentName: {
    fontWeight: 700,
    fontSize: "15px",
  },

  progressText: {
    marginTop: "4px",
    color: "#667085",
    fontSize: "13px",
  },

  timer: {
    background: "#0d1b2a",
    color: "#fff",
    borderRadius: "12px",
    padding: "10px 18px",
    minWidth: "145px",
    textAlign: "center",
  },

  timerDanger: {
    background: "#a61b1b",
  },

  timerLabel: {
    display: "block",
    fontSize: "11px",
    opacity: 0.75,
    marginBottom: "3px",
  },

  progressContainer: {
    background: "#fff",
    marginTop: "12px",
    padding: "14px 18px",
    borderRadius: "12px",
  },

  progressTrack: {
    height: "8px",
    borderRadius: "999px",
    background: "#e7e0d5",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#c9a84c",
    borderRadius: "999px",
    transition: "width 0.25s ease",
  },

  progressFooter: {
    marginTop: "8px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#667085",
  },

  warningBox: {
    marginTop: "14px",
    background: "#fff7dc",
    border: "1px solid #e3c766",
    borderRadius: "12px",
    padding: "15px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  warningIcon: {
    fontSize: "22px",
  },

  warningText: {
    margin: "6px 0 0",
    color: "#6d5a1c",
    fontSize: "13px",
  },

  warningButton: {
    marginLeft: "auto",
    border: "none",
    background: "#0d1b2a",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  errorBox: {
    marginTop: "14px",
    background: "#fff0f0",
    border: "1px solid #e2a4a4",
    color: "#8c1d1d",
    borderRadius: "12px",
    padding: "14px 18px",
  },

  errorText: {
    margin: "5px 0 0",
  },

  examLayout: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns:
      "270px minmax(0, 1fr)",
    gap: "18px",
    alignItems: "start",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    position: "sticky",
    top: "15px",
  },

  sidebarCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow:
      "0 5px 20px rgba(13,27,42,0.06)",
  },

  sidebarTitle: {
    margin: "0 0 14px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "20px",
  },

  partGroup: {
    borderTop: "1px solid #eee7dc",
    paddingTop: "10px",
    marginTop: "10px",
  },

  partHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "7px",
  },

  partCount: {
    color: "#667085",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  questionGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },

  questionNumber: {
    width: "31px",
    height: "31px",
    borderRadius: "7px",
    border: "1px solid #ddd5c8",
    background: "#fff",
    color: "#0d1b2a",
    fontWeight: 700,
    fontSize: "11px",
    cursor: "pointer",
  },

  questionAnswered: {
    background: "#e9f5ee",
    borderColor: "#73b58c",
  },

  questionCurrent: {
    border: "2px solid #c9a84c",
  },

  writingNavButton: {
    width: "100%",
    marginTop: "16px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #c9a84c",
    background: "#fffaf0",
    color: "#0d1b2a",
    cursor: "pointer",
    fontWeight: 700,
    display: "flex",
    justifyContent: "space-between",
  },

  writingNavButtonActive: {
    background: "#c9a84c",
    color: "#0d1b2a",
  },

  securityCard: {
    background: "#0d1b2a",
    color: "#fff",
    borderRadius: "14px",
    padding: "15px",
    fontSize: "12px",
  },

  securityTitle: {
    color: "#c9a84c",
    fontWeight: 700,
    marginBottom: "8px",
  },

  securityItem: {
    marginTop: "6px",
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.45,
  },

  mainContent: {
    minWidth: 0,
  },

  questionCard: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow:
      "0 8px 28px rgba(13,27,42,0.07)",
    overflow: "hidden",
  },

  questionHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #eee7dc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  partBadge: {
    display: "inline-block",
    background: "#f0e5c6",
    color: "#6d5519",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  questionTitle: {
    marginTop: "7px",
    fontSize: "18px",
    fontWeight: 800,
  },

  pointsBadge: {
    background: "#0d1b2a",
    color: "#fff",
    borderRadius: "999px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  questionBody: {
    padding: "28px 24px 32px",
  },

  questionText: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.65,
    fontWeight: 600,
  },

  promptText: {
    margin: "16px 0 0",
    fontSize: "19px",
    lineHeight: 1.6,
    fontWeight: 700,
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "5px",
  },

  options: {
    marginTop: "25px",
    display: "grid",
    gap: "10px",
  },

  optionButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left",
    padding: "14px 15px",
    borderRadius: "11px",
    border: "1px solid #ddd5c8",
    background: "#fff",
    color: "#0d1b2a",
    cursor: "pointer",
    fontSize: "15px",
    transition: "all 0.15s ease",
  },

  optionSelected: {
    borderColor: "#c9a84c",
    background: "#fff9e8",
    boxShadow:
      "0 0 0 2px rgba(201,168,76,0.12)",
  },

  optionLocked: {
    cursor: "default",
  },

  optionLetter: {
    width: "29px",
    height: "29px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#f1ede5",
    fontWeight: 800,
    fontSize: "12px",
    flexShrink: 0,
  },

  selectedCheck: {
    marginLeft: "auto",
    color: "#2c7a4b",
    fontWeight: 900,
  },

  textAnswerBox: {
    marginTop: "24px",
  },

  textInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cfc6b8",
    borderRadius: "10px",
    padding: "14px 15px",
    fontSize: "16px",
    outline: "none",
    color: "#0d1b2a",
  },

  inputHint: {
    marginTop: "7px",
    color: "#7a746a",
    fontSize: "12px",
  },

  partNavigator: {
    marginTop: "14px",
    background: "#fff",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  partNavigatorText: {
    color: "#667085",
  },

  partQuestionList: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  },

  miniQuestion: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    border: "1px solid #ddd5c8",
    background: "#fff",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },

  miniQuestionAnswered: {
    background: "#e9f5ee",
    borderColor: "#73b58c",
  },

  miniQuestionCurrent: {
    border: "2px solid #c9a84c",
  },

  navigation: {
    marginTop: "16px",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    gap: "12px",
    alignItems: "center",
  },

  navigationCenter: {
    color: "#667085",
    fontSize: "13px",
    textAlign: "center",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    background: "#0d1b2a",
    color: "#fff",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #cfc6b8",
    borderRadius: "10px",
    background: "#fff",
    color: "#0d1b2a",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },

  submitButton: {
    border: "none",
    borderRadius: "10px",
    background: "#9b2424",
    color: "#fff",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  writingIntro: {
    background: "#fff",
    borderRadius: "16px",
    padding: "26px",
    boxShadow:
      "0 8px 28px rgba(13,27,42,0.07)",
  },

  writingTitle: {
    margin: "12px 0 8px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "30px",
  },

  writingDescription: {
    margin: 0,
    color: "#59636e",
    lineHeight: 1.6,
  },

  storyBox: {
    marginTop: "22px",
    background: "#f8f4ee",
    borderLeft: "4px solid #c9a84c",
    borderRadius: "8px",
    padding: "16px 18px",
  },

  storyLabel: {
    color: "#6d5519",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    marginBottom: "8px",
  },

  storyText: {
    margin: 0,
    lineHeight: 1.7,
    fontSize: "15px",
  },

  writingTasks: {
    marginTop: "16px",
    display: "grid",
    gap: "16px",
  },

  writingCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "22px",
    boxShadow:
      "0 7px 24px rgba(13,27,42,0.06)",
  },

  writingCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "flex-start",
  },

  taskBadge: {
    display: "inline-block",
    color: "#6d5519",
    background: "#f0e5c6",
    padding: "5px 9px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
  },

  writingQuestion: {
    margin: "11px 0 18px",
    fontSize: "18px",
    lineHeight: 1.5,
  },

  writingTextarea: {
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "110px",
    border: "1px solid #cfc6b8",
    borderRadius: "10px",
    padding: "14px",
    fontFamily:
      '"DM Sans", Arial, Helvetica, sans-serif',
    fontSize: "15px",
    lineHeight: 1.6,
    outline: "none",
  },

  writingFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "7px",
    color: "#7a746a",
    fontSize: "12px",
  },

  finalWarning: {
    marginTop: "14px",
    padding: "14px 17px",
    borderRadius: "10px",
    background: "#fff7dc",
    border: "1px solid #e3c766",
    color: "#6d5a1c",
  },

  finalWarningText: {
    margin: "6px 0 0",
  },

  footer: {
    marginTop: "25px",
    padding: "16px 5px",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    color: "#77716a",
    fontSize: "12px",
    flexWrap: "wrap",
  },

  centerCard: {
    width: "min(520px, 100%)",
    boxSizing: "border-box",
    margin: "10vh auto",
    background: "#fff",
    borderRadius: "18px",
    padding: "38px 30px",
    textAlign: "center",
    boxShadow:
      "0 12px 40px rgba(13,27,42,0.1)",
  },

  spinner: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "4px solid #e7e0d5",
    borderTopColor: "#c9a84c",
    margin: "0 auto 20px",
    animation:
      "ifaSpin 1s linear infinite",
  },

  centerTitle: {
    margin: 0,
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "27px",
  },

  centerText: {
    margin: "13px 0 0",
    color: "#667085",
    lineHeight: 1.6,
  },

  smallText: {
    margin: "14px 0",
    color: "#77716a",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  errorIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#fff0f0",
    color: "#9b2424",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    fontSize: "25px",
    fontWeight: 900,
  },

  dangerIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#fff0f0",
    color: "#9b2424",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    fontSize: "25px",
    fontWeight: 900,
  },

  successIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#e9f5ee",
    color: "#2c7a4b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    fontSize: "28px",
    fontWeight: 900,
  },

  scoreBox: {
    margin: "22px auto",
    maxWidth: "260px",
    background: "#f8f4ee",
    borderRadius: "13px",
    padding: "18px",
  },

  scoreLabel: {
    fontSize: "12px",
    color: "#77716a",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  scoreValue: {
    marginTop: "5px",
    fontSize: "30px",
    fontWeight: 900,
    color: "#0d1b2a",
  },

  scoreSubtext: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#77716a",
  },
};
