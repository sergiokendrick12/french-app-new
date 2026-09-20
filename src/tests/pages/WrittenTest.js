import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const questions = [
  {
    id: 1,
    level: "A1",
    text: "Bonjour, je m'appelle Marie. J'habite à Kigali.",
    question: "Où habite Marie ?",
    choices: [
      "À Paris",
      "À Kigali",
      "À Nairobi",
      "À Bruxelles",
    ],
    correctAnswer: 1,
  },

  {
    id: 2,
    level: "A1",
    text: "Le cours commence à huit heures.",
    question: "À quelle heure commence le cours ?",
    choices: [
      "À sept heures",
      "À huit heures",
      "À neuf heures",
      "À dix heures",
    ],
    correctAnswer: 1,
  },

  {
    id: 3,
    level: "A1",
    text: "Paul aime le café, mais il n'aime pas le thé.",
    question: "Qu'est-ce que Paul n'aime pas ?",
    choices: [
      "Le café",
      "Le lait",
      "Le thé",
      "Le jus",
    ],
    correctAnswer: 2,
  },

  {
    id: 4,
    level: "A1",
    text: "La bibliothèque est ouverte du lundi au vendredi.",
    question: "Quand la bibliothèque est-elle ouverte ?",
    choices: [
      "Seulement le samedi",
      "Du lundi au vendredi",
      "Le dimanche uniquement",
      "Tous les jours",
    ],
    correctAnswer: 1,
  },

  {
    id: 5,
    level: "A1",
    text: "Sophie va au marché pour acheter des légumes.",
    question: "Pourquoi Sophie va-t-elle au marché ?",
    choices: [
      "Pour acheter des vêtements",
      "Pour rencontrer son professeur",
      "Pour acheter des légumes",
      "Pour prendre le bus",
    ],
    correctAnswer: 2,
  },

  {
    id: 6,
    level: "A2",
    text:
      "Cher Paul,\n\nJe t'invite à mon anniversaire samedi prochain. La fête commencera à 15 heures chez moi. Tu peux venir avec ton frère.\n\nÀ bientôt,\nJean",
    question: "À quelle heure commence la fête ?",
    choices: [
      "À 13 heures",
      "À 14 heures",
      "À 15 heures",
      "À 16 heures",
    ],
    correctAnswer: 2,
  },

  {
    id: 7,
    level: "A2",
    text:
      "Le bus pour le centre-ville part toutes les trente minutes. Le premier bus part à 6 h 30 et le dernier à 20 h.",
    question: "À quelle heure part le dernier bus ?",
    choices: [
      "18 h",
      "19 h",
      "20 h",
      "20 h 30",
    ],
    correctAnswer: 2,
  },

  {
    id: 8,
    level: "A2",
    text:
      "Nous avons prévu de faire une promenade dimanche matin, mais la météo annonce de fortes pluies. Nous allons donc rester à la maison et regarder un film.",
    question: "Pourquoi changent-ils leur programme ?",
    choices: [
      "Parce qu'ils sont fatigués",
      "Parce qu'il va beaucoup pleuvoir",
      "Parce qu'ils travaillent",
      "Parce que le cinéma est fermé",
    ],
    correctAnswer: 1,
  },

  {
    id: 9,
    level: "B1",
    text:
      "Depuis quelques mois, Aline travaille à distance trois jours par semaine. Elle apprécie cette organisation parce qu'elle passe moins de temps dans les transports. Cependant, elle trouve parfois difficile de séparer sa vie professionnelle de sa vie personnelle.",
    question:
      "Quel est l'un des avantages du travail à distance pour Aline ?",
    choices: [
      "Elle travaille moins d'heures.",
      "Elle gagne davantage d'argent.",
      "Elle passe moins de temps dans les transports.",
      "Elle rencontre davantage de collègues.",
    ],
    correctAnswer: 2,
  },

  {
    id: 10,
    level: "B1",
    text:
      "La ville souhaite encourager les habitants à utiliser davantage le vélo. Elle prévoit donc de construire de nouvelles pistes cyclables et d'installer plusieurs parkings sécurisés près des stations de transport public.",
    question:
      "Quel est l'objectif principal de la ville ?",
    choices: [
      "Réduire les transports publics",
      "Encourager l'utilisation du vélo",
      "Construire de nouvelles routes",
      "Fermer les stations de transport",
    ],
    correctAnswer: 1,
  },

  {
    id: 11,
    level: "B1",
    text:
      "Après son diplôme, Karim a choisi de faire un stage dans une petite entreprise plutôt que de chercher immédiatement un emploi dans une grande société. Il voulait découvrir plusieurs aspects du fonctionnement d'une entreprise et acquérir une expérience pratique.",
    question:
      "Pourquoi Karim a-t-il choisi cette petite entreprise ?",
    choices: [
      "Parce qu'elle était plus proche de chez lui",
      "Parce qu'il voulait gagner beaucoup d'argent",
      "Parce qu'il voulait acquérir une expérience variée",
      "Parce qu'il ne voulait pas travailler",
    ],
    correctAnswer: 2,
  },

  {
    id: 12,
    level: "B1",
    text:
      "De nombreux étudiants utilisent des applications pour organiser leur travail. Ces outils permettent de créer des listes de tâches, de programmer des rappels et de suivre les progrès réalisés. Toutefois, une application ne remplace pas une bonne organisation personnelle.",
    question:
      "Selon le texte, que permettent notamment ces applications ?",
    choices: [
      "De supprimer toutes les tâches",
      "De programmer des rappels",
      "De remplacer les enseignants",
      "De travailler sans planification",
    ],
    correctAnswer: 1,
  },

  {
    id: 13,
    level: "B2",
    text:
      "Le développement des espaces de coworking répond à une transformation du monde professionnel. Ces lieux permettent à des travailleurs indépendants, à des entrepreneurs et parfois à des salariés de partager un environnement de travail. Au-delà des économies liées aux infrastructures, ils favorisent les rencontres et les collaborations.",
    question:
      "Quel avantage supplémentaire des espaces de coworking est mentionné ?",
    choices: [
      "Ils garantissent un emploi à leurs utilisateurs.",
      "Ils favorisent les collaborations.",
      "Ils remplacent les universités.",
      "Ils réduisent automatiquement les horaires de travail.",
    ],
    correctAnswer: 1,
  },

  {
    id: 14,
    level: "B2",
    text:
      "Certaines entreprises mettent en place une semaine de quatre jours. L'objectif n'est pas nécessairement de réduire la quantité de travail, mais de réorganiser les horaires afin d'améliorer l'équilibre entre vie professionnelle et vie personnelle. Les premiers résultats observés dans certaines organisations montrent une satisfaction accrue des employés, même si cette organisation ne convient pas à tous les secteurs.",
    question:
      "Quelle idée principale ressort du texte ?",
    choices: [
      "La semaine de quatre jours convient à toutes les entreprises.",
      "Les employés doivent travailler moins.",
      "La semaine de quatre jours peut améliorer l'équilibre de vie, mais ses effets dépendent du contexte.",
      "Toutes les entreprises vont bientôt fermer.",
    ],
    correctAnswer: 2,
  },

  {
    id: 15,
    level: "B2",
    text:
      "Les réseaux sociaux ont profondément modifié la manière dont les informations circulent. Leur rapidité permet de suivre presque immédiatement un événement, mais cette même rapidité peut favoriser la diffusion de contenus inexacts. Vérifier l'origine d'une information et consulter plusieurs sources devient donc essentiel.",
    question:
      "Quelle précaution est recommandée dans le texte ?",
    choices: [
      "Partager rapidement toutes les informations",
      "Ne consulter qu'une seule source",
      "Vérifier l'origine et comparer plusieurs sources",
      "Éviter complètement Internet",
    ],
    correctAnswer: 2,
  },

  {
    id: 16,
    level: "C1",
    text:
      "La généralisation du télétravail ne constitue pas simplement une évolution technologique. Elle remet en question certaines habitudes organisationnelles, notamment la place accordée à la présence physique. Si les outils numériques permettent de maintenir une partie des échanges, ils ne reproduisent pas nécessairement toutes les interactions informelles qui contribuent à la cohésion d'une équipe.",
    question:
      "Quelle limite du télétravail est principalement soulignée ?",
    choices: [
      "L'impossibilité d'utiliser des outils numériques",
      "La disparition de toute communication professionnelle",
      "La difficulté à reproduire certaines interactions informelles",
      "L'augmentation obligatoire du temps de transport",
    ],
    correctAnswer: 2,
  },

  {
    id: 17,
    level: "C1",
    text:
      "Dans les débats sur l'intelligence artificielle, l'attention se concentre souvent sur ses capacités techniques. Pourtant, l'enjeu ne réside pas uniquement dans ce que ces systèmes peuvent accomplir, mais également dans les conditions de leur utilisation. La transparence des décisions automatisées, la protection des données et la responsabilité des utilisateurs constituent ainsi des questions centrales.",
    question:
      "Selon le texte, quels éléments sont également essentiels ?",
    choices: [
      "Uniquement la vitesse des systèmes",
      "Les conditions d'utilisation et les responsabilités associées",
      "La suppression des données personnelles",
      "La limitation de toutes les technologies",
    ],
    correctAnswer: 1,
  },

  {
    id: 18,
    level: "C1",
    text:
      "L'accès croissant à l'information ne garantit pas nécessairement une meilleure compréhension du monde. La multiplication des contenus peut au contraire rendre plus difficile la distinction entre une analyse argumentée, une opinion personnelle et une information vérifiée. Dans ce contexte, l'esprit critique devient une compétence indispensable.",
    question:
      "Quelle conclusion peut-on tirer du texte ?",
    choices: [
      "Plus d'informations signifie toujours une meilleure compréhension.",
      "L'information n'a aucune utilité.",
      "La capacité à évaluer les informations est devenue particulièrement importante.",
      "Les opinions personnelles doivent être interdites.",
    ],
    correctAnswer: 2,
  },

  {
    id: 19,
    level: "C2",
    text:
      "La transformation numérique des services publics est souvent présentée comme un moyen de simplifier les démarches administratives. Si elle peut effectivement réduire certains délais et faciliter l'accès à l'information, elle risque aussi d'accentuer les difficultés rencontrées par les personnes peu familières avec les outils numériques. Une politique de numérisation efficace doit donc s'accompagner de solutions permettant de maintenir un accès équitable aux services.",
    question:
      "Quelle position le texte défend-il principalement ?",
    choices: [
      "La numérisation doit remplacer tous les services physiques.",
      "La numérisation est toujours négative.",
      "La numérisation peut être utile, mais elle doit préserver l'accès équitable aux services.",
      "Les outils numériques doivent être interdits.",
    ],
    correctAnswer: 2,
  },

  {
    id: 20,
    level: "C2",
    text:
      "Face aux changements environnementaux, les politiques publiques sont parfois évaluées uniquement à partir de leurs résultats immédiats. Une telle approche peut cependant négliger les effets à long terme et les conséquences indirectes de certaines décisions. Une politique réellement durable suppose donc d'articuler les impératifs présents avec les intérêts des générations futures.",
    question:
      "Quelle idée centrale est exprimée ?",
    choices: [
      "Les résultats immédiats sont toujours les plus importants.",
      "Les politiques publiques doivent tenir compte des effets à long terme.",
      "Les générations futures ne doivent pas intervenir dans les décisions.",
      "Les politiques environnementales sont inutiles.",
    ],
    correctAnswer: 1,
  },
];

const TEST_DURATION = 30 * 60;

export default function WrittenTest() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const [studentId, setStudentId] = useState(null);

  const question = questions[currentQuestion];

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    if (loading || completed || submitting) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    loading,
    completed,
    submitting,
    timeLeft,
  ]);

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

      const { data: student, error: studentError } =
        await supabase
          .from("student_profiles")
          .select("id, status, payment_status")
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
        setMessage("Profil étudiant introuvable.");
        setLoading(false);
        return;
      }

      if (student.status !== "approved") {
        setMessage(
          "Votre compte doit être approuvé par l'administration avant de passer ce test."
        );
        setLoading(false);
        return;
      }

      if (student.payment_status !== "paid") {
        setMessage(
          "Le paiement doit être confirmé par l'administration avant de passer ce test."
        );
        setLoading(false);
        return;
      }

      setStudentId(student.id);

      const {
        data: existingResult,
        error: existingError,
      } = await supabase
        .from("test_results")
        .select("id, score, total_questions, percentage")
        .eq("student_id", student.id)
        .eq("test_type", "comprehension_ecrite")
        .maybeSingle();

      if (existingError) {
        console.error(
          "CHECK WRITTEN TEST ERROR:",
          existingError
        );

        setMessage(
          "Impossible de vérifier votre tentative."
        );

        setLoading(false);
        return;
      }

      if (existingResult) {
        setCompleted(true);
        setLoading(false);
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

  function handleAnswer(choiceIndex) {
    setAnswers((current) => ({
      ...current,
      [question.id]: choiceIndex,
    }));
  }

  function goNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((current) => current + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function goPrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((current) => current - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  async function handleSubmit(autoSubmit = false) {
    if (submitting || completed) {
      return;
    }

    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Êtes-vous certain de vouloir envoyer vos réponses ?\n\n" +
          `Vous avez répondu à ${answeredCount} question(s) sur ${questions.length}.\n\n` +
          "Cette partie ne pourra être envoyée qu'une seule fois."
      );

      if (!confirmed) {
        return;
      }
    }

    setSubmitting(true);
    setMessage("");

    try {
      if (!studentId) {
        setMessage(
          "Votre session étudiant est introuvable."
        );
        setSubmitting(false);
        return;
      }

      let score = 0;

      questions.forEach((item) => {
        if (answers[item.id] === item.correctAnswer) {
          score += 1;
        }
      });

      const percentage = Math.round(
        (score / questions.length) * 100
      );

      const { error: insertError } = await supabase
        .from("test_results")
        .insert({
          student_id: studentId,
          score,
          total_questions: questions.length,
          percentage,
          test_type: "comprehension_ecrite",
        });

      if (insertError) {
        console.error(
          "WRITTEN TEST INSERT ERROR:",
          insertError
        );

        if (insertError.code === "23505") {
          setCompleted(true);
          setSubmitting(false);
          return;
        }

        setMessage(
          "Impossible d'enregistrer votre résultat."
        );

        setSubmitting(false);
        return;
      }

      setCompleted(true);
    } catch (error) {
      console.error(
        "WRITTEN TEST SUBMIT ERROR:",
        error
      );

      setMessage(
        "Une erreur inattendue est survenue."
      );
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.spinner}>◌</div>

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

  if (completed) {
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
            Compréhension écrite terminée
          </h1>

          <p style={styles.text}>
            Cette partie du test a déjà été envoyée.
          </p>

          <p style={styles.text}>
            Une seule tentative est autorisée pour la
            compréhension écrite.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/tests/results")
            }
            style={styles.primaryButton}
          >
            Voir mes résultats →
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/student-dashboard")
            }
            style={styles.secondaryButton}
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

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
              navigate("/student-dashboard")
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
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoText}>
            INTERNATIONAL FRENCH ACADEMY
          </div>

          <div style={styles.subtitle}>
            Évaluation de positionnement
          </div>

          <h1 style={styles.title}>
            Compréhension écrite
          </h1>

          <p style={styles.intro}>
            Lisez chaque texte attentivement puis choisissez
            la bonne réponse.
          </p>
        </header>

        <div style={styles.topBar}>
          <div>
            <div style={styles.progressLabel}>
              QUESTION
            </div>

            <div style={styles.progressValue}>
              {currentQuestion + 1} / {questions.length}
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
              {formatTime(timeLeft)}
            </div>
          </div>

          <div>
            <div style={styles.progressLabel}>
              RÉPONDUES
            </div>

            <div style={styles.progressValue}>
              {answeredCount} / {questions.length}
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

            <div style={styles.levelBadge}>
              {question.level}
            </div>
          </div>

          <div style={styles.readingText}>
            {question.text.split("\n").map(
              (paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              )
            )}
          </div>

          <h2 style={styles.questionTitle}>
            {question.question}
          </h2>

          <div style={styles.choices}>
            {question.choices.map(
              (choice, index) => {
                const selected =
                  answers[question.id] === index;

                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() =>
                      handleAnswer(index)
                    }
                    style={{
                      ...styles.choice,
                      ...(selected
                        ? styles.choiceSelected
                        : {}),
                    }}
                  >
                    <span
                      style={{
                        ...styles.choiceLetter,
                        ...(selected
                          ? styles.choiceLetterSelected
                          : {}),
                      }}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span>
                      {choice}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div style={styles.navigation}>
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentQuestion === 0}
            style={{
              ...styles.navButton,
              opacity:
                currentQuestion === 0
                  ? 0.45
                  : 1,
            }}
          >
            ← Précédente
          </button>

          {currentQuestion <
          questions.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              style={styles.primaryButton}
            >
              Suivante →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              style={{
                ...styles.submitButton,
                opacity: submitting
                  ? 0.7
                  : 1,
              }}
            >
              {submitting
                ? "Enregistrement..."
                : "Terminer le test ✓"}
            </button>
          )}
        </div>

        <div style={styles.warning}>
          ⚠️ Une seule tentative est autorisée.
          Vérifiez vos réponses avant de terminer le test.
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f4ee",
    padding: "35px 20px 60px",
    fontFamily: '"DM Sans", Arial, sans-serif',
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
    boxShadow: "0 15px 45px rgba(13,27,42,0.10)",
  },

  successCard: {
    maxWidth: "650px",
    margin: "90px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow: "0 15px 45px rgba(13,27,42,0.10)",
  },

  errorCard: {
    maxWidth: "650px",
    margin: "90px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow: "0 15px 45px rgba(13,27,42,0.10)",
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
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: "38px",
  },

  loadingTitle: {
    margin: "0 0 10px",
    fontFamily: '"Playfair Display", Georgia, serif',
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
    boxShadow: "0 5px 18px rgba(13,27,42,0.04)",
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
    fontVariantNumeric: "tabular-nums",
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
    transition: "width 0.2s ease",
  },

  questionCard: {
    background: "#ffffff",
    border: "1px solid #e8e2d8",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 8px 25px rgba(13,27,42,0.05)",
  },

  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
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

  readingText: {
    background: "#f8f4ee",
    borderLeft: "4px solid #c9a84c",
    borderRadius: "8px",
    padding: "18px 20px",
    marginBottom: "25px",
    fontSize: "15px",
    lineHeight: 1.75,
    color: "#263445",
  },

  questionTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: "23px",
    lineHeight: 1.4,
    margin: "0 0 20px",
  },

  choices: {
    display: "grid",
    gap: "12px",
  },

  choice: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left",
    background: "#ffffff",
    border: "1px solid #d8d1c5",
    borderRadius: "11px",
    padding: "14px",
    cursor: "pointer",
    fontFamily: '"DM Sans", Arial, sans-serif',
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#0d1b2a",
  },

  choiceSelected: {
    border: "2px solid #c9a84c",
    background: "#fff9e8",
  },

  choiceLetter: {
    width: "30px",
    height: "30px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#f1ede5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "12px",
  },

  choiceLetterSelected: {
    background: "#c9a84c",
    color: "#ffffff",
  },

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "22px",
  },

  navButton: {
    background: "#ffffff",
    color: "#0d1b2a",
    border: "1px solid #d8d1c5",
    borderRadius: "10px",
    padding: "13px 22px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
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