import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EXAM_TYPE = "exam_kim";
const EXAM_TABLE_ATTEMPTS = "exam_kim_attempts";
const EXAM_DURATION_SECONDS = 2 * 60 * 60;
const STORAGE_PREFIX = "ifa_exam_kim_answers_";

const QUESTIONS = [
  {
    id: 1,
    section: "I. LES ADVERBES",
    type: "text",
    question:
      "Dans la phrase suivante, relève l’adverbe et indique ce qu’il exprime : Paul travaille soigneusement afin de terminer son devoir.",
  },
  {
    id: 2,
    section: "I. LES ADVERBES",
    type: "choice",
    question:
      "Choisis l’adverbe qui convient : Elle a __________ oublié son rendez-vous.",
    options: ["rapide", "complètement", "complétude", "complet"],
    answer: "complètement",
  },
  {
    id: 3,
    section: "I. LES ADVERBES",
    type: "text",
    question: "Transforme l’adjectif en adverbe : prudent →",
  },
  {
    id: 4,
    section: "I. LES ADVERBES",
    type: "text",
    question:
      "Dans la phrase suivante, remplace l’expression soulignée par un adverbe : Il répond avec politesse à ses professeurs. →",
  },
  {
    id: 5,
    section: "I. LES ADVERBES",
    type: "choice",
    question: "Quelle phrase contient un adverbe de temps ?",
    options: [
      "Il parle doucement.",
      "Nous partirons demain.",
      "Elle travaille beaucoup.",
      "Ils habitent ici.",
    ],
    answer: "Nous partirons demain.",
  },
  {
    id: 6,
    section: "II. LES PRÉPOSITIONS",
    type: "text",
    question:
      "Complète avec les prépositions qui conviennent : Nous allons ______ marché avant de rentrer ______ maison.",
  },
  {
    id: 7,
    section: "II. LES PRÉPOSITIONS",
    type: "choice",
    question: "Choisis la bonne préposition : Il s’intéresse beaucoup _____ histoire.",
    options: ["à l’", "de l’", "sur l’", "pour l’"],
    answer: "à l’",
  },
  {
    id: 8,
    section: "II. LES PRÉPOSITIONS",
    type: "text",
    question:
      "Complète avec à, de, en, pour ou avec : Elle voyage ______ ses parents ______ découvrir un nouveau pays.",
  },
  {
    id: 9,
    section: "II. LES PRÉPOSITIONS",
    type: "text",
    question:
      "Relève toutes les prépositions dans la phrase : Le chat s’est caché sous la table pendant l’orage.",
  },
  {
    id: 10,
    section: "II. LES PRÉPOSITIONS",
    type: "text",
    question:
      "Corrige la phrase si nécessaire : Je suis allé au Rwanda en voiture pour visiter mes cousins.",
  },
  {
    id: 11,
    section: "III. LES CONJONCTIONS",
    type: "text",
    question:
      "Complète avec une conjonction de coordination appropriée : Je voulais sortir, ______ il pleuvait fortement.",
  },
  {
    id: 12,
    section: "III. LES CONJONCTIONS",
    type: "choice",
    question:
      "Parmi les mots suivants, lequel est une conjonction de coordination ?",
    options: ["derrière", "mais", "rapidement", "pendant"],
    answer: "mais",
  },
  {
    id: 13,
    section: "III. LES CONJONCTIONS",
    type: "choice",
    question:
      "Complète avec parce que, lorsque, bien que ou afin que : ______ tu sois fatigué, tu dois terminer ton travail.",
    options: ["parce que", "lorsque", "bien que", "afin que"],
    answer: "bien que",
  },
  {
    id: 14,
    section: "III. LES CONJONCTIONS",
    type: "choice",
    question:
      "Indique si la conjonction soulignée est une conjonction de coordination ou de subordination : Je resterai ici parce que je dois attendre mon frère.",
    options: ["coordination", "subordination"],
    answer: "subordination",
  },
  {
    id: 15,
    section: "III. LES CONJONCTIONS",
    type: "text",
    question:
      "Relie les deux phrases avec une conjonction qui exprime la conséquence : Il a beaucoup travaillé. Il a réussi son examen. →",
  },
  {
    id: 16,
    section: "IV. LES PROPOSITIONS",
    type: "text",
    question:
      "Combien de propositions contient cette phrase ? Quand il arrivera, nous commencerons le repas.",
  },
  {
    id: 17,
    section: "IV. LES PROPOSITIONS",
    type: "text",
    question:
      "Dans la phrase suivante, relève la proposition subordonnée : Je pense que Marie viendra demain.",
  },
  {
    id: 18,
    section: "IV. LES PROPOSITIONS",
    type: "text",
    question:
      "Indique si la phrase contient une proposition indépendante, principale ou subordonnée : Lorsque le professeur entre, les élèves se taisent.",
  },
  {
    id: 19,
    section: "IV. LES PROPOSITIONS",
    type: "text",
    question:
      "Sépare les différentes propositions par une barre / : Il pleut mais nous sortirons parce que nous avons un rendez-vous.",
  },
  {
    id: 20,
    section: "IV. LES PROPOSITIONS",
    type: "text",
    question:
      "Transforme les deux phrases en une seule phrase contenant une proposition subordonnée : Il était malade. Il est allé à l’école.",
  },
  {
    id: 21,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Présent : Conjugue le verbe entre parenthèses : Nous ______ souvent nos grands-parents. (visiter)",
  },
  {
    id: 22,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Présent : Mets le verbe au présent : Tu ______ toujours la vérité. (dire)",
  },
  {
    id: 23,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Présent : Les enfants ______ leurs devoirs avant de jouer. (finir)",
  },
  {
    id: 24,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Passé composé : Hier, je ______ un excellent film. (regarder)",
  },
  {
    id: 25,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Passé composé : Elles ______ très tôt ce matin. (partir)",
  },
  {
    id: 26,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Transforme au passé composé : Nous mangeons au restaurant. →",
  },
  {
    id: 27,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Imparfait : Quand j’étais petit, je ______ souvent au football. (jouer)",
  },
  {
    id: 28,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Imparfait : Tous les dimanches, mes parents ______ chez mes grands-parents. (aller)",
  },
  {
    id: 29,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Mets la phrase à l’imparfait : Il fait froid et les enfants restent à la maison. →",
  },
  {
    id: 30,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Futur simple : Demain, nous ______ notre projet. (présenter)",
  },
  {
    id: 31,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Futur simple : Quand tu seras prêt, tu ______ avec nous. (venir)",
  },
  {
    id: 32,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Mets cette phrase au futur simple : Ils prennent le train à huit heures. →",
  },
  {
    id: 33,
    section: "V. LES VERBES – CONJUGAISON",
    type: "text",
    question:
      "Conjugue au futur simple : Je ______ mes vacances avec impatience. (attendre)",
  },
  {
    id: 34,
    section: "V. LES VERBES – CONJUGAISON",
    type: "choice",
    question:
      "Choisis le temps correct : Quand j’étais enfant, je ______ souvent chez ma tante.",
    options: ["suis allé", "irai", "allais", "vais"],
    answer: "allais",
  },
  {
    id: 35,
    section: "V. LES VERBES – CONJUGAISON",
    type: "choice",
    question:
      "Choisis le temps correct : Hier, nous ______ un match de football.",
    options: [
      "regardons",
      "regarderons",
      "avons regardé",
      "regardions",
    ],
    answer: "avons regardé",
  },
  {
    id: 36,
    section: "V. LES VERBES – CONJUGAISON",
    type: "choice",
    question:
      "Choisis le temps correct : L’année prochaine, ils ______ leurs études.",
    options: [
      "terminent",
      "terminaient",
      "ont terminé",
      "termineront",
    ],
    answer: "termineront",
  },
  {
    id: 37,
    section: "VI. LES PRONOMS",
    type: "text",
    question:
      "Remplace le groupe souligné par un pronom personnel : Aline et Sarah vont au marché. → ______ vont au marché.",
  },
  {
    id: 38,
    section: "VI. LES PRONOMS",
    type: "text",
    question:
      "Remplace le groupe souligné par un pronom : Je parle à mon professeur. → Je ______ parle.",
  },
  {
    id: 39,
    section: "VI. LES PRONOMS",
    type: "text",
    question:
      "Complète avec le, la, les, lui ou leur : J’ai acheté des cadeaux pour mes parents. Je ______ donnerai ce soir.",
  },
  {
    id: 40,
    section: "VI. LES PRONOMS",
    type: "text",
    question:
      "Évite la répétition en utilisant un pronom : Paul prend le livre. Paul lit le livre rapidement. →",
  },
  {
    id: 41,
    section: "VII. LES DÉTERMINANTS ET LES ARTICLES",
    type: "text",
    question:
      "Relève le déterminant dans la phrase : Cette jeune fille porte une jolie robe.",
  },
  {
    id: 42,
    section: "VII. LES DÉTERMINANTS ET LES ARTICLES",
    type: "text",
    question:
      "Complète avec un, une, des, le, la, les : J’ai acheté ______ livre et ______ stylos pour ______ cours de français.",
  },
  {
    id: 43,
    section: "VII. LES DÉTERMINANTS ET LES ARTICLES",
    type: "text",
    question:
      "Complète avec l’article contracté approprié : Nous allons ______ cinéma après les cours.",
  },
  {
    id: 44,
    section: "VII. LES DÉTERMINANTS ET LES ARTICLES",
    type: "text",
    question:
      "Complète avec du, de la, de l’ ou des : Elle boit ______ eau et mange ______ pain avec ______ confiture.",
  },
  {
    id: 45,
    section: "VII. LES DÉTERMINANTS ET LES ARTICLES",
    type: "text",
    question:
      "Indique la nature des déterminants : Mon frère a acheté deux cahiers et ce dictionnaire. — Mon : ______ — deux : ______ — ce : ______",
  },
  {
    id: 46,
    section: "VIII. SYNONYMES ET ANTONYMES",
    type: "text",
    question: "Donne un synonyme du mot « commencer ».",
  },
  {
    id: 47,
    section: "VIII. SYNONYMES ET ANTONYMES",
    type: "text",
    question: "Donne un synonyme de « difficile ».",
  },
  {
    id: 48,
    section: "VIII. SYNONYMES ET ANTONYMES",
    type: "text",
    question: "Donne l’antonyme de « généreux ».",
  },
  {
    id: 49,
    section: "VIII. SYNONYMES ET ANTONYMES",
    type: "text",
    question: "Donne l’antonyme de « augmenter ».",
  },
  {
    id: 50,
    section: "IX. PETIT TEXTE À EXPLOITER",
    type: "text",
    question: `Lis attentivement le texte suivant :

Une décision importante

Depuis plusieurs semaines, Amina préparait un concours qui devait avoir lieu à la fin du mois. Chaque soir, après ses cours, elle révisait soigneusement ses leçons. Au début, elle trouvait certains exercices particulièrement difficiles, mais elle refusait d’abandonner.

Un samedi matin, alors qu’elle travaillait à la bibliothèque, son amie Sarah lui proposa de sortir avec elle. Amina hésita quelques instants, puis elle répondit qu’elle préférait terminer ses révisions. Elle savait que, si elle travaillait régulièrement, elle pourrait réussir son concours.

Finalement, le jour du concours arriva. Amina entra dans la salle avec confiance. Elle avait beaucoup travaillé et, malgré quelques questions difficiles, elle répondit calmement à toutes les épreuves.

Réponds aux questions suivantes :

a) Depuis combien de temps Amina préparait-elle son concours ?

b) Où travaillait-elle lorsqu’elle reçut la proposition de Sarah ?

c) Pourquoi Amina a-t-elle refusé de sortir avec Sarah ?

d) Relève dans le texte deux adverbes.

e) Relève deux prépositions.

f) Relève une conjonction de subordination.

g) Relève dans le texte un verbe au plus-que-parfait et un verbe au passé composé.

h) Donne un synonyme de « difficile » dans le contexte du texte.

i) Donne l’antonyme de « abandonner ».

j) À ton avis, quelle qualité Amina démontre-t-elle principalement ? Justifie ta réponse en t’appuyant sur le texte.`,
  },
];

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:()[\]"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (value, answers) => {
  const normalized = normalize(value);

  return answers.some((answer) =>
    normalized.includes(normalize(answer))
  );
};

function gradeQuestion(id, value) {
  const v = normalize(value);

  if (!v) return 0;

  switch (id) {
    case 1:
      return includesAny(v, [
        "soigneusement",
        "adverbe de maniere",
        "maniere",
      ])
        ? 1
        : 0;

    case 2:
      return v === "completement" ? 1 : 0;

    case 3:
      return includesAny(v, ["prudemment"]) ? 1 : 0;

    case 4:
      return includesAny(v, ["poliment"]) ? 1 : 0;

    case 5:
      return v === normalize("Nous partirons demain.") ? 1 : 0;

    case 6:
      return (
        includesAny(v, [
          "au marche a la maison",
          "au marche, a la maison",
        ]) ||
        (includesAny(v, ["au"]) &&
          includesAny(v, ["a la maison"]))
      )
        ? 1
        : 0;

    case 7:
      return v === "a l" ? 1 : 0;

    case 8:
      return includesAny(v, ["avec"]) &&
        includesAny(v, ["pour"])
        ? 1
        : 0;

    case 9:
      return includesAny(v, ["sous"]) &&
        includesAny(v, ["pendant"])
        ? 1
        : 0;

    case 10:
      return includesAny(v, [
        "je suis alle au rwanda en voiture pour visiter mes cousins",
        "correcte",
        "correct",
      ])
        ? 1
        : 0;

    case 11:
      return includesAny(v, ["mais"]) ? 1 : 0;

    case 12:
      return v === "mais" ? 1 : 0;

    case 13:
      return v === "bien que" ? 1 : 0;

    case 14:
      return v === "subordination" ? 1 : 0;

    case 15:
      return includesAny(v, [
        "donc",
        "il a beaucoup travaille donc il a reussi",
        "ainsi",
      ])
        ? 1
        : 0;

    case 16:
      return includesAny(v, ["2", "deux"]) ? 1 : 0;

    case 17:
      return includesAny(v, [
        "que marie viendra demain",
        "que marie viendra",
      ])
        ? 1
        : 0;

    case 18:
      return includesAny(v, ["subordonnee"]) ||
        includesAny(v, ["principale"])
        ? 1
        : 0;

    case 19:
      return (
        includesAny(v, ["il pleut"]) &&
        includesAny(v, ["nous sortirons"]) &&
        includesAny(v, ["nous avons un rendez vous"])
      )
        ? 1
        : 0;

    case 20:
      return includesAny(v, [
        "bien qu il soit malade",
        "bien qu il etait malade",
        "malgre qu il soit malade",
        "bien qu'il soit malade",
        "parce qu il etait malade",
        "meme s il etait malade",
      ])
        ? 1
        : 0;

    case 21:
      return v === "visitons" ? 1 : 0;

    case 22:
      return v === "dis" ? 1 : 0;

    case 23:
      return v === "finissent" ? 1 : 0;

    case 24:
      return v === "ai regarde" ? 1 : 0;

    case 25:
      return v === "sont parties" ? 1 : 0;

    case 26:
      return includesAny(v, [
        "nous avons mange au restaurant",
      ])
        ? 1
        : 0;

    case 27:
      return v === "jouais" ? 1 : 0;

    case 28:
      return v === "allaient" ? 1 : 0;

    case 29:
      return includesAny(v, [
        "il faisait froid et les enfants restaient a la maison",
      ])
        ? 1
        : 0;

    case 30:
      return v === "presenterons" ? 1 : 0;

    case 31:
      return v === "viendras" ? 1 : 0;

    case 32:
      return includesAny(v, [
        "ils prendront le train a huit heures",
      ])
        ? 1
        : 0;

    case 33:
      return v === "attendrai" ? 1 : 0;

    case 34:
      return v === "allais" ? 1 : 0;

    case 35:
      return v === "avons regarde" ? 1 : 0;

    case 36:
      return v === "termineront" ? 1 : 0;

    case 37:
      return v === "elles" ? 1 : 0;

    case 38:
      return v === "lui" ? 1 : 0;

    case 39:
      return v === "leur" ? 1 : 0;

    case 40:
      return includesAny(v, [
        "paul prend le livre et le lit rapidement",
        "paul prend le livre il le lit rapidement",
        "il le lit rapidement",
      ])
        ? 1
        : 0;

    case 41:
      return includesAny(v, ["cette", "une"]) ? 1 : 0;

    case 42:
      return (
        includesAny(v, ["un"]) &&
        includesAny(v, ["des"]) &&
        includesAny(v, ["le"])
      )
        ? 1
        : 0;

    case 43:
      return includesAny(v, ["au cinema", "au"]) ? 1 : 0;

    case 44:
      return (
        includesAny(v, ["de l eau"]) &&
        includesAny(v, ["du pain"]) &&
        includesAny(v, ["de la confiture"])
      )
        ? 1
        : 0;

    case 45:
      return (
        includesAny(v, ["possessif"]) &&
        includesAny(v, ["numeral", "cardinal"]) &&
        includesAny(v, ["demonstratif"])
      )
        ? 1
        : 0;

    case 46:
      return includesAny(v, [
        "debuter",
        "demarrer",
        "commencer",
        "entamer",
      ])
        ? 1
        : 0;

    case 47:
      return includesAny(v, [
        "dur",
        "complexe",
        "complique",
        "ardu",
        "ardue",
      ])
        ? 1
        : 0;

    case 48:
      return includesAny(v, [
        "egoiste",
        "avare",
        "radin",
      ])
        ? 1
        : 0;

    case 49:
      return includesAny(v, [
        "diminuer",
        "baisser",
        "reduire",
      ])
        ? 1
        : 0;

    default:
      return 0;
  }
}

function gradeQuestion50(value) {
  const text = value || {};
  let score = 0;

  if (
    includesAny(text.a, [
      "plusieurs semaines",
      "plusieurs semaine",
    ])
  ) {
    score += 0.1;
  }

  if (includesAny(text.b, ["bibliotheque"])) {
    score += 0.1;
  }

  if (
    includesAny(text.c, [
      "terminer ses revisions",
      "terminer ses revision",
      "elle preferait terminer",
    ])
  ) {
    score += 0.1;
  }

  if (
    includesAny(text.d, [
      "soigneusement",
      "particulierement",
      "finalement",
      "calmement",
      "beaucoup",
      "regulierement",
    ])
  ) {
    score += 0.1;
  }

  if (
    includesAny(text.e, [
      "apres",
      "a",
      "dans",
      "avec",
      "depuis",
      "malgre",
      "pour",
    ])
  ) {
    score += 0.1;
  }

  if (
    includesAny(text.f, [
      "alors que",
      "parce que",
      "si",
      "malgre",
    ])
  ) {
    score += 0.1;
  }

  if (
    includesAny(text.g, [
      "avait travaille",
      "a beaucoup travaille",
      "arriva",
      "repondit",
    ])
  ) {
    score += 0.1;
  }

  if (
    includesAny(text.h, [
      "difficile",
      "dur",
      "complexe",
      "complique",
    ])
  ) {
    score += 0.1;
  }

  if (
    includesAny(text.i, [
      "continuer",
      "perseverer",
      "poursuivre",
      "persister",
    ])
  ) {
    score += 0.1;
  }

  if (String(text.j || "").trim().length >= 15) {
    score += 0.1;
  }

  return Number(score.toFixed(1));
}

export default function ExamKim() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [remainingSeconds, setRemainingSeconds] = useState(
    EXAM_DURATION_SECONDS
  );
  const [tabSwitches, setTabSwitches] = useState(0);
  const [warning, setWarning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [finalPercentage, setFinalPercentage] = useState(null);

  const storageKey = useMemo(() => {
    if (!user?.id) return null;
    return `${STORAGE_PREFIX}${user.id}`;
  }, [user]);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        setLoading(true);
        setAccessGranted(false);
        setMessage("");
        setUser(null);
        setAttemptId(null);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          if (!mounted) return;

          setMessage(
            "Vous devez être connecté pour accéder à cet examen."
          );
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!currentUser) {
          if (!mounted) return;

          setMessage(
            "Vous devez être connecté pour accéder à cet examen."
          );
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        if (
          currentUser.is_anonymous === true ||
          session.user.is_anonymous === true
        ) {
          if (!mounted) return;

          setMessage(
            "Vous devez utiliser un compte étudiant pour accéder à cet examen."
          );
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("student_profiles")
          .select("id, status, payment_status")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          if (!mounted) return;

          setMessage("Votre profil étudiant est introuvable.");
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        if (profile.status !== "approved") {
          if (!mounted) return;

          setMessage(
            "Votre profil étudiant n'est pas encore approuvé."
          );
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        if (profile.payment_status !== "paid") {
          if (!mounted) return;

          setMessage(
            "Votre paiement doit être confirmé avant de passer cet examen."
          );
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        if (!mounted) return;

        setUser(currentUser);

        const {
          data: existingResult,
          error: resultError,
        } = await supabase
          .from("test_results")
          .select(
            "id, score, total_questions, percentage, completed_at"
          )
          .eq("student_id", currentUser.id)
          .eq("test_type", EXAM_TYPE)
          .maybeSingle();

        if (resultError) throw resultError;

        if (existingResult) {
          if (!mounted) return;

          setMessage(
            "Une seule tentative est autorisée pour cet examen."
          );
          setFinalScore(existingResult.score);
          setFinalPercentage(existingResult.percentage);
          setFinished(true);
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        const {
          data: existingAttempt,
          error: attemptError,
        } = await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .select(
            "id, status, started_at, finished_at, tab_switches, termination_reason"
          )
          .eq("student_id", currentUser.id)
          .maybeSingle();

        if (attemptError) throw attemptError;

        let attempt = existingAttempt;

        if (attempt?.status === "finished") {
          if (!mounted) return;

          setMessage(
            "Une seule tentative est autorisée pour cet examen."
          );
          setFinished(true);
          setAccessGranted(false);
          setLoading(false);
          return;
        }

        if (!attempt) {
          const {
            data: newAttempt,
            error: createError,
          } = await supabase
            .from(EXAM_TABLE_ATTEMPTS)
            .insert({
              student_id: currentUser.id,
              status: "in_progress",
              tab_switches: 0,
            })
            .select()
            .single();

          if (createError) throw createError;

          attempt = newAttempt;
        }

        if (!mounted) return;

        setAttemptId(attempt.id);
        setTabSwitches(attempt.tab_switches || 0);

        const {
          data: serverTime,
          error: serverTimeError,
        } = await supabase.rpc("get_server_time");

        if (serverTimeError) throw serverTimeError;

        const startedAt = new Date(attempt.started_at);
        const now = new Date(serverTime);

        const elapsedSeconds = Math.floor(
          (now.getTime() - startedAt.getTime()) / 1000
        );

        const remaining = Math.max(
          0,
          EXAM_DURATION_SECONDS - elapsedSeconds
        );

        if (!mounted) return;

        setRemainingSeconds(remaining);

        if (remaining <= 0) {
          setAccessGranted(true);
          setLoading(false);
          return;
        }

        setAccessGranted(true);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur préparation examen KIM:",
          error
        );

        if (!mounted) return;

        setAccessGranted(false);
        setUser(null);
        setAttemptId(null);
        setMessage(
          "Une erreur est survenue lors de la préparation de votre examen."
        );
        setLoading(false);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageKey || !accessGranted) return;

    try {
      const saved = localStorage.getItem(storageKey);

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (parsed.answers) {
        setAnswers(parsed.answers);
      }

      if (parsed.currentQuestion) {
        setCurrentQuestion(parsed.currentQuestion);
      }
    } catch (error) {
      console.error(
        "Erreur récupération réponses:",
        error
      );
    }
  }, [storageKey, accessGranted]);

  useEffect(() => {
    if (
      !storageKey ||
      !attemptId ||
      !accessGranted ||
      finished
    ) {
      return;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers,
        currentQuestion,
      })
    );
  }, [
    answers,
    currentQuestion,
    storageKey,
    attemptId,
    accessGranted,
    finished,
  ]);

  useEffect(() => {
    if (
      !attemptId ||
      !accessGranted ||
      finished
    ) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          clearInterval(interval);
          finishExam("time_expired");
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptId, accessGranted, finished]);

  useEffect(() => {
    if (
      !attemptId ||
      !accessGranted ||
      finished
    ) {
      return;
    }

    const handleVisibility = async () => {
      if (!document.hidden) return;

      const nextCount = tabSwitches + 1;

      setTabSwitches(nextCount);

      if (nextCount === 1) {
        setWarning(true);

        await supabase
          .from(EXAM_TABLE_ATTEMPTS)
          .update({
            tab_switches: nextCount,
          })
          .eq("id", attemptId);
      }

      if (nextCount >= 2) {
        await finishExam("tab_switch");
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [
    attemptId,
    accessGranted,
    tabSwitches,
    finished,
  ]);

  function updateAnswer(questionId, value) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  function updateQuestion50(field, value) {
    setAnswers((previous) => ({
      ...previous,
      50: {
        ...(previous[50] || {}),
        [field]: value,
      },
    }));
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  }

  function calculateScore() {
    let score = 0;

    for (let i = 1; i <= 49; i += 1) {
      const question = QUESTIONS.find(
        (item) => item.id === i
      );

      if (!question) continue;

      if (question.type === "choice") {
        if (
          normalize(answers[i]) ===
          normalize(question.answer)
        ) {
          score += 1;
        }
      } else {
        score += gradeQuestion(
          i,
          answers[i]
        );
      }
    }

    score += gradeQuestion50(answers[50]);

    return Number(score.toFixed(1));
  }

  async function finishExam(reason = "finished") {
    if (finished) return;

    try {
      setFinished(true);

      const score = calculateScore();

      const percentage = Number(
        ((score / 50) * 100).toFixed(2)
      );

      setFinalScore(score);
      setFinalPercentage(percentage);

      if (!attemptId || !user?.id) {
        return;
      }

      const {
        error: attemptUpdateError,
      } = await supabase
        .from(EXAM_TABLE_ATTEMPTS)
        .update({
          status: "finished",
          finished_at: new Date().toISOString(),
          tab_switches: tabSwitches,
          termination_reason: reason,
        })
        .eq("id", attemptId);

      if (attemptUpdateError) {
        console.error(
          "Erreur mise à jour tentative:",
          attemptUpdateError
        );
      }

      const {
        error: resultInsertError,
      } = await supabase
        .from("test_results")
        .insert({
          student_id: user.id,
          test_type: EXAM_TYPE,
          score,
          total_questions: 50,
          percentage,
          completed_at: new Date().toISOString(),
        });

      if (resultInsertError) {
        console.error(
          "Erreur sauvegarde résultat:",
          resultInsertError
        );
      }

      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error(
        "Erreur finalisation examen:",
        error
      );
    }
  }

  function goToQuestion(number) {
    setCurrentQuestion(number);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.brand}>
            INTERNATIONAL FRENCH ACADEMY
          </h1>

          <p style={styles.loading}>
            Vérification de votre accès...
          </p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.brand}>
            INTERNATIONAL FRENCH ACADEMY
          </h1>

          <div style={styles.finishedBox}>
            <h2 style={styles.finishedTitle}>
              Examen terminé
            </h2>

            {tabSwitches >= 2 && (
              <p style={styles.warningText}>
                L'examen a été automatiquement terminé
                après deux changements d'onglet.
              </p>
            )}

            <div style={styles.scoreCircle}>
              <strong>
                {finalScore ?? 0}
              </strong>

              <span>/ 50</span>
            </div>

            <p style={styles.percentage}>
              {finalPercentage ?? 0}%
            </p>

            <p style={styles.finishedMessage}>
              Une seule tentative est autorisée.
            </p>
          </div>

          <button
            style={styles.primaryButton}
            onClick={() =>
              navigate("/student-dashboard")
            }
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.brand}>
            INTERNATIONAL FRENCH ACADEMY
          </h1>

          <div style={styles.errorBox}>
            <h2 style={styles.errorTitle}>
              Accès à l'examen
            </h2>

            <p style={styles.errorText}>
              {message ||
                "Vous n'êtes pas autorisé à accéder à cet examen."}
            </p>
          </div>

          <button
            style={styles.primaryButton}
            onClick={() =>
              navigate("/student-login")
            }
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (!user || !attemptId) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.brand}>
            INTERNATIONAL FRENCH ACADEMY
          </h1>

          <div style={styles.errorBox}>
            <h2 style={styles.errorTitle}>
              Accès refusé
            </h2>

            <p style={styles.errorText}>
              Votre session d'examen n'est pas valide.
            </p>
          </div>

          <button
            style={styles.primaryButton}
            onClick={() =>
              navigate("/student-login")
            }
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS.find(
    (item) => item.id === currentQuestion
  );

  const isQuestion50 = currentQuestion === 50;

  const progressPercentage =
    Math.round(
      (currentQuestion / 50) * 100
    );

  return (
    <div style={styles.page}>
      <div style={styles.examContainer}>

        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.brandSmall}>
              INTERNATIONAL FRENCH ACADEMY
            </div>

            <h1 style={styles.examTitle}>
              EXAMEN DE FRANÇAIS
            </h1>

            <p style={styles.subtitle}>
              Niveau : intermédiaire avancé
            </p>
          </div>

          <div style={styles.timer}>
            <span style={styles.timerLabel}>
              TEMPS RESTANT
            </span>

            <strong style={styles.timerValue}>
              {formatTime(remainingSeconds)}
            </strong>
          </div>
        </header>

        {/* EXAM INFORMATION */}
        <div style={styles.infoBar}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>
              ✓
            </span>

            <div>
              <strong style={styles.infoValue}>
                50
              </strong>

              <span style={styles.infoLabel}>
                questions
              </span>
            </div>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>
              ★
            </span>

            <div>
              <strong style={styles.infoValue}>
                50
              </strong>

              <span style={styles.infoLabel}>
                points
              </span>
            </div>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>
              ⏱
            </span>

            <div>
              <strong style={styles.infoValue}>
                2h
              </strong>

              <span style={styles.infoLabel}>
                durée
              </span>
            </div>
          </div>
        </div>

        {/* WARNING */}
        {warning && (
          <div style={styles.warningBox}>
            <div style={styles.warningIcon}>
              !
            </div>

            <div>
              <strong>
                Attention
              </strong>

              <p style={styles.warningDescription}>
                Vous avez changé d'onglet.
                Un deuxième changement d'onglet
                terminera automatiquement l'examen.
              </p>
            </div>
          </div>
        )}

        {/* PROGRESS */}
        <div style={styles.progressArea}>
          <div style={styles.progressTop}>
            <span style={styles.progressQuestion}>
              Question{" "}
              <strong>{currentQuestion}</strong>{" "}
              <span style={styles.progressMuted}>
                sur 50
              </span>
            </span>

            <span style={styles.progressPercent}>
              {progressPercentage} %
            </span>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* QUESTION */}
        <main style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <div style={styles.sectionLabel}>
              {question.section}
            </div>

            <div style={styles.questionBadge}>
              {currentQuestion}/50
            </div>
          </div>

          <h2 style={styles.questionNumber}>
            Question {currentQuestion}
          </h2>

          <div style={styles.questionText}>
            {question.question
              .split("\n")
              .map((line, index) => (
                <p
                  key={index}
                  style={styles.questionParagraph}
                >
                  {line}
                </p>
              ))}
          </div>

          {/* CHOICE */}
          {!isQuestion50 &&
            question.type === "choice" && (
              <div style={styles.options}>
                {question.options.map(
                  (option, index) => (
                    <label
                      key={option}
                      style={{
                        ...styles.option,
                        ...(normalize(
                          answers[question.id]
                        ) === normalize(option)
                          ? styles.optionSelected
                          : {}),
                      }}
                    >
                      <span style={styles.optionNumber}>
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={
                          normalize(
                            answers[question.id]
                          ) === normalize(option)
                        }
                        onChange={(event) =>
                          updateAnswer(
                            question.id,
                            event.target.value
                          )
                        }
                      />

                      <span style={styles.optionText}>
                        {option}
                      </span>
                    </label>
                  )
                )}
              </div>
            )}

          {/* TEXT */}
          {!isQuestion50 &&
            question.type === "text" && (
              <textarea
                value={answers[question.id] || ""}
                onChange={(event) =>
                  updateAnswer(
                    question.id,
                    event.target.value
                  )
                }
                placeholder="Écrivez votre réponse ici..."
                style={styles.textarea}
                rows={
                  question.id >= 19 ? 4 : 2
                }
              />
            )}

          {/* QUESTION 50 */}
          {isQuestion50 && (
            <div style={styles.subQuestions}>
              {[
                [
                  "a",
                  "Depuis combien de temps Amina préparait-elle son concours ?",
                ],
                [
                  "b",
                  "Où travaillait-elle lorsqu’elle reçut la proposition de Sarah ?",
                ],
                [
                  "c",
                  "Pourquoi Amina a-t-elle refusé de sortir avec Sarah ?",
                ],
                [
                  "d",
                  "Relève dans le texte deux adverbes.",
                ],
                [
                  "e",
                  "Relève deux prépositions.",
                ],
                [
                  "f",
                  "Relève une conjonction de subordination.",
                ],
                [
                  "g",
                  "Relève dans le texte un verbe au plus-que-parfait et un verbe au passé composé.",
                ],
                [
                  "h",
                  "Donne un synonyme de « difficile » dans le contexte du texte.",
                ],
                [
                  "i",
                  "Donne l’antonyme de « abandonner ».",
                ],
                [
                  "j",
                  "À ton avis, quelle qualité Amina démontre-t-elle principalement ? Justifie ta réponse en t’appuyant sur le texte.",
                ],
              ].map(([letter, prompt]) => (
                <div
                  key={letter}
                  style={styles.subQuestion}
                >
                  <div style={styles.subQuestionHeader}>
                    <span style={styles.subQuestionLetter}>
                      {letter.toUpperCase()}
                    </span>

                    <label
                      style={styles.subQuestionLabel}
                    >
                      {prompt}
                    </label>
                  </div>

                  <textarea
                    value={
                      answers[50]?.[letter] || ""
                    }
                    onChange={(event) =>
                      updateQuestion50(
                        letter,
                        event.target.value
                      )
                    }
                    placeholder="Écrivez votre réponse ici..."
                    style={styles.textarea}
                    rows={
                      letter === "j" ? 4 : 2
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* NAVIGATION */}
        <div style={styles.navigation}>
          <button
            style={{
              ...styles.secondaryButton,
              ...(currentQuestion === 1
                ? styles.disabledButton
                : {}),
            }}
            disabled={currentQuestion === 1}
            onClick={() =>
              goToQuestion(
                currentQuestion - 1
              )
            }
          >
            <span>←</span>
            <span>Précédent</span>
          </button>

          {currentQuestion < 50 ? (
            <button
              style={styles.primaryButton}
              onClick={() =>
                goToQuestion(
                  currentQuestion + 1
                )
              }
            >
              <span>Suivant</span>
              <span>→</span>
            </button>
          ) : (
            <button
              style={styles.finishButton}
              onClick={() =>
                finishExam("finished")
              }
            >
              <span>Terminer l'examen</span>
              <span>✓</span>
            </button>
          )}
        </div>

        {/* QUESTION NAVIGATOR */}
        <div style={styles.questionNavigator}>
          <div style={styles.navigatorHeader}>
            <div>
              <h3 style={styles.navigatorTitle}>
                Navigation
              </h3>

              <p style={styles.navigatorDescription}>
                Cliquez sur une question pour y accéder.
              </p>
            </div>

            <div style={styles.navigatorLegend}>
              <span style={styles.legendItem}>
                <span
                  style={{
                    ...styles.legendDot,
                    background: "#0d1b2a",
                  }}
                />
                Actuelle
              </span>

              <span style={styles.legendItem}>
                <span
                  style={{
                    ...styles.legendDot,
                    background: "#e9dfc4",
                    border: "1px solid #c9a84c",
                  }}
                />
                Répondue
              </span>
            </div>
          </div>

          <div style={styles.questionGrid}>
            {QUESTIONS.map((item) => {
              const answered =
                item.id === 50
                  ? Object.values(
                      answers[50] || {}
                    ).some((value) =>
                      String(value || "").trim()
                    )
                  : String(
                      answers[item.id] || ""
                    ).trim();

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    goToQuestion(item.id)
                  }
                  aria-label={`Question ${item.id}`}
                  style={{
                    ...styles.questionButton,
                    ...(item.id === currentQuestion
                      ? styles.questionButtonCurrent
                      : {}),
                    ...(answered
                      ? styles.questionButtonAnswered
                      : {}),
                  }}
                >
                  {item.id}
                </button>
              );
            })}
          </div>
        </div>

        <footer style={styles.footer}>
          International French Academy — Kigali, Rwanda
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f5f1ea 0%, #eee9df 100%)",
    padding: "28px 16px 45px",
    fontFamily:
      "DM Sans, Arial, Helvetica, sans-serif",
    color: "#17202a",
  },

  examContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  card: {
    maxWidth: "650px",
    margin: "70px auto",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08)",
  },

  brand: {
    color: "#0d1b2a",
    fontSize: "22px",
    letterSpacing: "1px",
    marginBottom: "35px",
  },

  brandSmall: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#c9a84c",
    marginBottom: "10px",
  },

  header: {
    background:
      "linear-gradient(135deg, #0d1b2a 0%, #172c40 100%)",
    color: "#ffffff",
    borderRadius: "18px",
    padding: "30px 32px",
    display: "flex",
    justifyContent: "space-between",
    gap: "30px",
    alignItems: "center",
    boxShadow:
      "0 15px 40px rgba(13,27,42,0.16)",
  },

  headerContent: {
    minWidth: 0,
  },

  examTitle: {
    margin: 0,
    fontSize: "30px",
    lineHeight: "1.2",
    fontFamily: "Georgia, serif",
    letterSpacing: "0.3px",
  },

  subtitle: {
    margin: "9px 0 0",
    opacity: 0.78,
    fontSize: "14px",
  },

  timer: {
    minWidth: "165px",
    textAlign: "center",
    background: "#c9a84c",
    color: "#0d1b2a",
    borderRadius: "14px",
    padding: "14px 20px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.15)",
    flexShrink: 0,
  },

  timerLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "6px",
  },

  timerValue: {
    display: "block",
    fontSize: "22px",
    letterSpacing: "1px",
  },

  infoBar: {
    background: "#ffffff",
    marginTop: "15px",
    padding: "15px 18px",
    borderRadius: "14px",
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
    border:
      "1px solid rgba(13,27,42,0.05)",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "5px 10px",
    minWidth: 0,
  },

  infoIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#f3ead3",
    color: "#7b6221",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "800",
    flexShrink: 0,
  },

  infoValue: {
    fontSize: "16px",
    marginRight: "4px",
    color: "#0d1b2a",
  },

  infoLabel: {
    fontSize: "13px",
    color: "#777",
  },

  warningBox: {
    marginTop: "15px",
    padding: "15px 18px",
    background: "#fff8df",
    border:
      "1px solid #e0bd55",
    borderRadius: "12px",
    color: "#6b5200",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },

  warningIcon: {
    width: "27px",
    height: "27px",
    borderRadius: "50%",
    background: "#e0bd55",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  warningDescription: {
    margin: "4px 0 0",
    lineHeight: "1.5",
    fontSize: "14px",
  },

  progressArea: {
    margin: "22px 0 18px",
  },

  progressTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "9px",
    fontSize: "14px",
    fontWeight: "700",
  },

  progressQuestion: {
    whiteSpace: "nowrap",
  },

  progressMuted: {
    color: "#777",
    fontWeight: "500",
  },

  progressPercent: {
    color: "#7b6221",
    fontWeight: "800",
    whiteSpace: "nowrap",
    marginLeft: "auto",
  },

  progressTrack: {
    height: "9px",
    background: "#ddd8cf",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #c9a84c, #e0bd55)",
    borderRadius: "20px",
    transition: "width 0.2s ease",
  },

  questionCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "35px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.06)",
    border:
      "1px solid rgba(13,27,42,0.05)",
  },

  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "18px",
  },

  sectionLabel: {
    display: "inline-block",
    background: "#f3ead3",
    color: "#7b6221",
    borderRadius: "20px",
    padding: "8px 14px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    margin: 0,
  },

  questionBadge: {
    background: "#f6f4ef",
    color: "#777",
    borderRadius: "20px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  questionNumber: {
    fontSize: "21px",
    lineHeight: "1.3",
    color: "#0d1b2a",
    margin: "0 0 20px",
  },

  questionText: {
    fontSize: "17px",
    lineHeight: "1.8",
    marginBottom: "26px",
    color: "#252d34",
  },

  questionParagraph: {
    margin: "0 0 13px",
    whiteSpace: "pre-wrap",
  },

  options: {
    display: "grid",
    gap: "12px",
  },

  option: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 16px",
    border:
      "1px solid #ddd8cf",
    borderRadius: "11px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.15s ease",
    background: "#ffffff",
  },

  optionSelected: {
    border:
      "2px solid #c9a84c",
    background: "#fffaf0",
  },

  optionNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#f3ead3",
    color: "#7b6221",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    flexShrink: 0,
  },

  optionText: {
    lineHeight: "1.5",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #cfc8bd",
    borderRadius: "11px",
    padding: "14px 15px",
    fontSize: "16px",
    lineHeight: "1.65",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    color: "#17202a",
    background: "#fff",
    minHeight: "62px",
  },

  subQuestions: {
    display: "grid",
    gap: "18px",
  },

  subQuestion: {
    padding: "19px",
    background: "#faf8f4",
    borderRadius: "13px",
    border:
      "1px solid #e4ded4",
  },

  subQuestionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    marginBottom: "12px",
  },

  subQuestionLetter: {
    width: "29px",
    height: "29px",
    borderRadius: "50%",
    background: "#0d1b2a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    flexShrink: 0,
  },

  subQuestionLabel: {
    display: "block",
    fontWeight: "700",
    lineHeight: "1.55",
    fontSize: "15px",
  },

  navigation: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginTop: "20px",
    width: "100%",
  },

  primaryButton: {
    background: "#0d1b2a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "13px 22px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    minWidth: "125px",
    whiteSpace: "nowrap",
  },

  secondaryButton: {
    background: "#ffffff",
    color: "#0d1b2a",
    border:
      "1px solid #cfc8bd",
    borderRadius: "10px",
    padding: "13px 22px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    minWidth: "125px",
    whiteSpace: "nowrap",
  },

  disabledButton: {
    cursor: "not-allowed",
    opacity: 0.45,
  },

  finishButton: {
    background: "#8b2020",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "13px 22px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    minWidth: "180px",
    whiteSpace: "nowrap",
  },

  questionNavigator: {
    marginTop: "25px",
    background: "#ffffff",
    borderRadius: "15px",
    padding: "21px",
    boxShadow:
      "0 6px 22px rgba(0,0,0,0.05)",
    border:
      "1px solid rgba(13,27,42,0.05)",
  },

  navigatorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "17px",
  },

  navigatorTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#0d1b2a",
  },

  navigatorDescription: {
    margin: "4px 0 0",
    color: "#777",
    fontSize: "12px",
  },

  navigatorLegend: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  legendItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "#777",
    whiteSpace: "nowrap",
  },

  legendDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    display: "inline-block",
  },

  questionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(10, minmax(40px, 1fr))",
    gap: "9px",
  },

  questionButton: {
    width: "100%",
    height: "42px",
    borderRadius: "9px",
    border:
      "1px solid #d5cec3",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    color: "#17202a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
  },

  questionButtonCurrent: {
    background: "#0d1b2a",
    color: "#ffffff",
    borderColor: "#0d1b2a",
    boxShadow:
      "0 3px 8px rgba(13,27,42,0.2)",
  },

  questionButtonAnswered: {
    background: "#e9dfc4",
    borderColor: "#c9a84c",
  },

  errorBox: {
    background: "#fff1f1",
    border:
      "1px solid #e0b2b2",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
  },

  errorTitle: {
    color: "#8b2020",
    marginTop: 0,
  },

  errorText: {
    lineHeight: "1.6",
  },

  finishedBox: {
    padding: "10px 0 25px",
  },

  finishedTitle: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  warningText: {
    color: "#8b2020",
    fontWeight: "700",
    lineHeight: "1.5",
  },

  scoreCircle: {
    margin: "25px auto 10px",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "#f3ead3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#0d1b2a",
    fontSize: "22px",
  },

  percentage: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#c9a84c",
  },

  finishedMessage: {
    color: "#666",
  },

  loading: {
    fontSize: "17px",
    color: "#666",
  },

  footer: {
    textAlign: "center",
    margin: "30px 0 10px",
    color: "#777",
    fontSize: "13px",
  },
};

