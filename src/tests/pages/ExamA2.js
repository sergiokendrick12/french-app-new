import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

// Examen A2 — Eric, Queen et Christian
// Contenu basé sur les cours : passé composé, imparfait / futur proche,
// adjectifs possessifs et démonstratifs, adverbes en -ment, COD / COI,
// les jours, les mois et la date, se déplacer en ville, faire des achats,
// compréhension écrite.

const EXAM_TYPE = "exam_a2";
const EXAM_TABLE_ATTEMPTS = "exam_a2_attempts";
const EXAM_DURATION_SECONDS = 2 * 60 * 60;
const TOTAL_POINTS = 100;
const ANSWERS_STORAGE_PREFIX = "ifa_exam_a2_answers_";
const READING_SECTION = "La compréhension écrite";

// Multiple-choice helper: the stored answer is the full option text.
function choice(id, section, question, options, correctIndex, extra = {}) {
  return {
    id,
    section,
    points: 2,
    type: "choice",
    question,
    options,
    acceptedAnswers: [options[correctIndex]],
    ...extra,
  };
}

function text(id, section, question, acceptedAnswers, extra = {}) {
  return {
    id,
    section,
    points: 2,
    type: "text",
    question,
    acceptedAnswers,
    ...extra,
  };
}

function manual(id, section, question, extra = {}) {
  return {
    id,
    section,
    points: 2,
    type: "manual",
    question,
    ...extra,
  };
}

const PC = "Le passé composé";
const TEMPS = "Imparfait et futur proche";
const POSS = "Les adjectifs possessifs";
const DEM = "Les adjectifs démonstratifs";
const ADV = "Les adverbes en -ment";
const COMP = "Le complément d'objet (COD / COI)";
const DATE = "Les jours, les mois et la date";
const VILLE = "Se déplacer en ville";
const ACHATS = "Faire des achats";

const questions = [
  // PARTIE I — LE PASSÉ COMPOSÉ (16 points)
  text(
    1,
    PC,
    "Hier soir, nous ______ un film au cinéma. (voir — passé composé)",
    ["avons vu"]
  ),
  text(
    2,
    PC,
    "Ce matin, Marie ______ au marché. (aller — passé composé)",
    ["est allée"]
  ),
  choice(
    3,
    PC,
    "Ils ______ le bus pour aller à l'école.",
    ["ont pris", "sont pris", "ont prendu", "avons pris"],
    0
  ),
  text(
    4,
    PC,
    "Tu ______ tes devoirs hier ? (faire — passé composé)",
    ["as fait"]
  ),
  choice(
    5,
    PC,
    "Mes sœurs ______ à la maison tout le week-end.",
    ["ont resté", "sont restés", "sont restées", "est restée"],
    2
  ),
  choice(
    6,
    PC,
    "Quelle phrase négative est correcte ?",
    [
      "Je ne suis pas mangé.",
      "Je n'ai pas mangé.",
      "Je n'ai mangé pas.",
      "Je ne pas ai mangé.",
    ],
    1
  ),
  text(
    7,
    PC,
    "Elle ______ une lettre à sa grand-mère. (écrire — passé composé)",
    ["a écrit"]
  ),
  manual(
    8,
    PC,
    "Qu'est-ce que tu as fait le week-end dernier ? Écris trois phrases au passé composé.",
    { multiline: true }
  ),

  // PARTIE II — IMPARFAIT ET FUTUR PROCHE (12 points)
  text(
    9,
    TEMPS,
    "Quand j'étais petit, je ______ souvent au foot avec mon frère. (jouer — imparfait)",
    ["jouais"]
  ),
  text(
    10,
    TEMPS,
    "Hier, il ______ très beau. (faire — imparfait)",
    ["faisait"]
  ),
  text(
    11,
    TEMPS,
    "Demain, nous ______ nos grands-parents. (visiter — futur proche)",
    ["allons visiter"]
  ),
  choice(
    12,
    TEMPS,
    "Il pleuvait quand je ______ de la maison.",
    ["sortais", "suis sorti", "vais sortir", "sors"],
    1
  ),
  choice(
    13,
    TEMPS,
    "Ce soir, elle ______ un film à la télévision.",
    ["va regarder", "va regardé", "vais regarder", "allait regardé"],
    0
  ),
  choice(
    14,
    TEMPS,
    "Autrefois, mes parents ______ à la campagne.",
    ["habitent", "habitaient", "vont habiter", "sont habités"],
    1
  ),

  // PARTIE III — LES ADJECTIFS POSSESSIFS (10 points)
  choice(
    15,
    POSS,
    "(je) ______ amie s'appelle Inès.",
    ["Ma", "Mon", "Mes", "Ta"],
    1
  ),
  text(
    16,
    POSS,
    "(nous) Nous aimons beaucoup ______ professeurs.",
    ["nos"]
  ),
  choice(
    17,
    POSS,
    "(elles) Elles adorent ______ nouvelle maison.",
    ["leurs", "sa", "leur", "ses"],
    2
  ),
  text(
    18,
    POSS,
    "(il) Paul a perdu ______ clés ce matin.",
    ["ses"]
  ),
  choice(
    19,
    POSS,
    "(vous) Vous avez apporté ______ cahier ?",
    ["vos", "votre", "notre", "ton"],
    1
  ),

  // PARTIE IV — LES ADJECTIFS DÉMONSTRATIFS (10 points)
  choice(
    20,
    DEM,
    "______ hôtel est très confortable.",
    ["Ce", "Cet", "Cette", "Ces"],
    1
  ),
  text(
    21,
    DEM,
    "______ fille chante très bien. (ce / cet / cette / ces)",
    ["cette"]
  ),
  choice(
    22,
    DEM,
    "Regarde ______ fleurs, elles sont magnifiques !",
    ["ce", "cet", "cette", "ces"],
    3
  ),
  text(
    23,
    DEM,
    "Mets au pluriel : cet ami → ______ amis",
    ["ces"]
  ),
  choice(
    24,
    DEM,
    "Je préfère ce livre-ci, pas ce livre-______.",
    ["là", "ci", "ce", "cet"],
    0
  ),

  // PARTIE V — LES ADVERBES EN -MENT (10 points)
  text(
    25,
    ADV,
    "Forme l'adverbe : rapide → ______",
    ["rapidement"]
  ),
  text(
    26,
    ADV,
    "Forme l'adverbe : heureux → ______",
    ["heureusement"]
  ),
  text(
    27,
    ADV,
    "Forme l'adverbe : prudent → ______",
    ["prudemment"]
  ),
  choice(
    28,
    ADV,
    "Il parle toujours très ______ à ses parents.",
    ["poli", "poliment", "polie", "polément"],
    1
  ),
  choice(
    29,
    ADV,
    "Quel est l'adverbe de « constant » ?",
    ["constantement", "constamment", "constemment", "constantment"],
    1
  ),

  // PARTIE VI — LE COMPLÉMENT D'OBJET (8 points)
  choice(
    30,
    COMP,
    "« Je regarde la télévision. » — « la télévision » est :",
    ["un COD", "un COI", "le sujet", "un complément du nom"],
    0
  ),
  choice(
    31,
    COMP,
    "« Divine téléphone à son père. » — « à son père » est :",
    ["un COD", "un COI", "le sujet", "un complément du nom"],
    1
  ),
  choice(
    32,
    COMP,
    "« J'ai besoin de repos. » — Quelle question permet de trouver le complément ?",
    ["Qui ?", "Quoi ?", "À qui ?", "De quoi ?"],
    3
  ),
  choice(
    33,
    COMP,
    "« Je parle à ma mère. » → Je ______ parle.",
    ["la", "le", "lui", "les"],
    2
  ),

  // PARTIE VII — LES JOURS, LES MOIS ET LA DATE (10 points)
  choice(
    34,
    DATE,
    "Le 25 décembre est un jour ______ : on ne travaille pas.",
    ["ouvrable", "férié", "scolaire", "tardif"],
    1
  ),
  choice(
    35,
    DATE,
    "J'habite ici ______ trois ans.",
    ["pendant", "il y a", "depuis", "dans"],
    2
  ),
  choice(
    36,
    DATE,
    "Le cours commence ______ dix minutes.",
    ["il y a", "dans", "depuis", "pendant"],
    1
  ),
  choice(
    37,
    DATE,
    "Il est arrivé ______ une semaine.",
    ["dans", "depuis", "il y a", "en"],
    2
  ),
  choice(
    38,
    DATE,
    "Un trimestre est une période de :",
    ["six mois", "trois mois", "quinze jours", "cent ans"],
    1
  ),

  // PARTIE VIII — SE DÉPLACER EN VILLE (8 points)
  choice(
    39,
    VILLE,
    "Je vais au travail ______ vélo.",
    ["en", "à", "au", "par"],
    1
  ),
  choice(
    40,
    VILLE,
    "Le musée est près ______ parc.",
    ["de le", "du", "de la", "des"],
    1
  ),
  text(
    41,
    VILLE,
    "Nous ______ le métro chaque matin. (prendre — présent)",
    ["prenons"]
  ),
  choice(
    42,
    VILLE,
    "— Pour aller à la gare, s'il vous plaît ? — Allez tout droit, puis ______ à gauche.",
    ["tournez", "montez", "descendez", "prenez"],
    0
  ),

  // PARTIE IX — FAIRE DES ACHATS (8 points)
  choice(
    43,
    ACHATS,
    "Je voudrais un kilo ______ tomates, s'il vous plaît.",
    ["des", "de", "du", "les"],
    1
  ),
  choice(
    44,
    ACHATS,
    "Une douzaine d'œufs, c'est combien d'œufs ?",
    ["10", "12", "15", "20"],
    1
  ),
  choice(
    45,
    ACHATS,
    "Je donne 20 €. Le total est 11,45 €. Combien de monnaie est-ce que je reçois ?",
    ["9,55 €", "8,55 €", "8,45 €", "9,45 €"],
    1
  ),
  choice(
    46,
    ACHATS,
    "Comment écrit-on 80 € en lettres ?",
    [
      "quatre-vingt euros",
      "quatre-vingts euros",
      "huitante euros",
      "quatre-vingts euro",
    ],
    1
  ),

  // PARTIE X — LA COMPRÉHENSION ÉCRITE (8 points)
  manual(
    47,
    READING_SECTION,
    "Depuis quand Aline habite-t-elle à Lyon ? À quelle heure s'est-elle levée samedi dernier ?"
  ),
  manual(
    48,
    READING_SECTION,
    "Qu'est-ce qu'Aline et Grâce ont acheté au marché ? Combien ont-elles payé ?"
  ),
  manual(
    49,
    READING_SECTION,
    "Comment les deux sœurs sont-elles rentrées à la maison ? Pourquoi ?"
  ),
  manual(
    50,
    READING_SECTION,
    "Que va faire Aline samedi prochain ? Pourquoi est-elle contente ?"
  ),
];

const readingText = `Le samedi d'Aline

Aline a vingt-deux ans. Elle habite à Lyon depuis deux ans. Samedi dernier, elle s'est levée tôt, à sept heures. D'abord, elle a pris son petit-déjeuner, puis elle est allée au marché en bus avec sa sœur Grâce.

Au marché, les deux sœurs ont acheté un kilo de tomates, une douzaine d'œufs et deux bouteilles de jus d'orange. Ça a coûté douze euros cinquante. Aline a payé en espèces.

Ensuite, elles sont rentrées à pied, parce qu'il faisait très beau. L'après-midi, Aline a lu un livre pendant deux heures. Le soir, ses amis sont venus dîner à la maison.

Samedi prochain, Aline va prendre le train pour rendre visite à ses grands-parents. Elle est très contente, parce qu'elle ne les a pas vus depuis trois mois.`;

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

// Shuffle the A/B/C/D options per student so neighbours in the same room
// don't see the correct answer under the same letter. The order is fixed
// for a given student + question (same order after a reload). Grading is
// unaffected: the stored answer is the option text, not its letter.
function seededRandom(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getShuffledOptions(question, studentId) {
  const options = [...(question.options || [])];
  if (!studentId) return options;

  const random = seededRandom(`${studentId}:${question.id}`);
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
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

export default function ExamA2() {
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

        // Not signed in (or session expired): send the student to login.
        if (!user || authError?.name === "AuthSessionMissingError") {
          navigate("/student-login");
          return;
        }

        if (authError) throw authError;

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
            Examen de français — A1 & A2
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
              Examen de français — Niveau A1 & A2
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
                Niveau {currentQuestion.level || "A1 & A2"}
              </span>
            </div>

            {currentQuestion.section === READING_SECTION &&
              (
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
                {getShuffledOptions(
                  currentQuestion,
                  currentUser?.id
                ).map((option, index) => {
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
