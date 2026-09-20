import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const STORAGE_KEY = "ifa_listening_test_attempt";

const questions = [
  {
    id: 1,
    level: "A1",
    audio: "/audio/q1_marie.mp3",
    question: "Comment s'appelle la personne ?",
    choices: ["Marie", "Sophie", "Claire", "Julie"],
    correctAnswer: 0,
  },
  {
    id: 2,
    level: "A1",
    audio: "/audio/q2_enfants.mp3",
    question: "Combien d'enfants a la personne ?",
    choices: [
      "Un enfant",
      "Deux enfants",
      "Trois enfants",
      "Quatre enfants",
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    level: "A1",
    audio: "/audio/q3_magasin.mp3",
    question: "À quelle heure ouvre le magasin ?",
    choices: ["8 heures", "9 heures", "10 heures", "11 heures"],
    correctAnswer: 1,
  },
  {
    id: 4,
    level: "A1",
    audio: "/audio/q4_pommes.mp3",
    question: "Qu'est-ce que la sœur aime ?",
    choices: ["Les bananes", "Les pommes", "Les oranges", "Les fraises"],
    correctAnswer: 1,
  },
  {
    id: 5,
    level: "A1",
    audio: "/audio/q5_marche.mp3",
    question: "Quand va-t-elle au marché ?",
    choices: ["Le lundi", "Le samedi", "Le dimanche", "Le vendredi"],
    correctAnswer: 1,
  },
  {
    id: 6,
    level: "A2",
    audio: "/audio/q6_hopital.mp3",
    question:
      "Depuis combien de temps le frère travaille-t-il dans cet hôpital ?",
    choices: [
      "Depuis un an",
      "Depuis deux ans",
      "Depuis trois ans",
      "Depuis cinq ans",
    ],
    correctAnswer: 2,
  },
  {
    id: 7,
    level: "A2",
    audio: "/audio/q7_pluie.mp3",
    question: "Pourquoi la personne prend-elle son parapluie ?",
    choices: [
      "Parce qu'il fait froid",
      "Parce qu'il va pleuvoir",
      "Parce qu'il fait chaud",
      "Parce qu'il y a du soleil",
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    level: "A2",
    audio: "/audio/q8_voyage.mp3",
    question: "Quand vont-ils finalement partir en voyage ?",
    choices: [
      "Demain matin",
      "Vendredi soir",
      "Samedi matin",
      "Dimanche soir",
    ],
    correctAnswer: 2,
  },
  {
    id: 9,
    level: "B1",
    audio: "/audio/q9_emploi.mp3",
    question: "Pourquoi souhaite-t-elle travailler dans une entreprise ?",
    choices: [
      "Pour gagner plus d'argent",
      "Pour acquérir de l'expérience",
      "Pour rencontrer ses amis",
      "Pour voyager",
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    level: "B1",
    audio: "/audio/q10_transport.mp3",
    question: "Pourquoi préfère-t-elle prendre le bus ?",
    choices: [
      "Parce qu'il est plus rapide",
      "Parce qu'il est moins cher",
      "Parce qu'il est plus confortable",
      "Parce qu'il est plus moderne",
    ],
    correctAnswer: 1,
  },
  {
    id: 11,
    level: "B1",
    audio: "/audio/q11_reunion.mp3",
    question: "Quel est l'objectif principal de la réunion ?",
    choices: [
      "Organiser une fête",
      "Présenter un nouveau projet",
      "Recruter des employés",
      "Changer les horaires",
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    level: "B1",
    audio: "/audio/q12_meteo.mp3",
    question: "Quelle recommandation est donnée aux habitants ?",
    choices: [
      "De rester chez eux",
      "De fermer les fenêtres",
      "D'éviter les déplacements inutiles",
      "De prendre leur voiture",
    ],
    correctAnswer: 2,
  },
  {
    id: 13,
    level: "B2",
    audio: "/audio/q13_entreprise.mp3",
    question: "Quelle conclusion peut-on tirer de cette situation ?",
    choices: [
      "L'entreprise va fermer",
      "L'entreprise doit s'adapter",
      "L'entreprise recrute davantage",
      "L'entreprise change de pays",
    ],
    correctAnswer: 1,
  },
  {
    id: 14,
    level: "B2",
    audio: "/audio/q14_opinion.mp3",
    question: "Quelle est l'opinion exprimée ?",
    choices: [
      "La situation est parfaite",
      "Des changements sont nécessaires",
      "Le problème est terminé",
      "Personne n'est concerné",
    ],
    correctAnswer: 1,
  },
  {
    id: 15,
    level: "B2",
    audio: "/audio/q15_actualite.mp3",
    question: "Que rapporte le journal ?",
    choices: [
      "Une nouvelle économique",
      "Une nouvelle sportive",
      "Une nouvelle politique",
      "Une nouvelle culturelle",
    ],
    correctAnswer: 1,
  },
  {
    id: 16,
    level: "C1",
    audio: "/audio/q16_numerique.mp3",
    question: "Qu'est-ce qui a été bouleversé ?",
    choices: [
      "Le système éducatif",
      "Les habitudes professionnelles",
      "Les transports publics",
      "Le commerce international",
    ],
    correctAnswer: 1,
  },
  {
    id: 17,
    level: "C1",
    audio: "/audio/q17_regret.mp3",
    question: "Que suggère cette phrase ?",
    choices: [
      "Une satisfaction",
      "Un regret",
      "Une certitude",
      "Une invitation",
    ],
    correctAnswer: 1,
  },
  {
    id: 18,
    level: "C1",
    audio: "/audio/q18_projet.mp3",
    question: "Comment le projet a-t-il été approuvé ?",
    choices: [
      "Par vote",
      "À l'unanimité",
      "Par le directeur seul",
      "Après plusieurs modifications",
    ],
    correctAnswer: 1,
  },
  {
    id: 19,
    level: "C2",
    audio: "/audio/q19_clause.mp3",
    question: "Qu'est-ce qui a suscité une controverse ?",
    choices: [
      "Le financement",
      "Une clause du contrat",
      "Le calendrier",
      "La décision finale",
    ],
    correctAnswer: 1,
  },
  {
    id: 20,
    level: "C2",
    audio: "/audio/q20_effort.mp3",
    question: "Quelle est l'attitude de la personne face à la tâche ?",
    choices: [
      "Elle refuse de la faire",
      "Elle accepte malgré les difficultés",
      "Elle demande de l'aide",
      "Elle abandonne immédiatement",
    ],
    correctAnswer: 1,
  },
];

function createNewAttempt() {
  return {
    current: 0,
    selected: null,
    score: 0,
    finished: false,
    endTime: Date.now() + 30 * 60 * 1000,
    resultSaved: false,
    resultEmailSent: false,
  };
}

function getInitialAttempt() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === "object") {
        return {
          ...createNewAttempt(),
          ...parsed,
          resultSaved: parsed.resultSaved === true,
          resultEmailSent: parsed.resultEmailSent === true,
        };
      }
    }
  } catch (error) {
    console.error("Erreur localStorage :", error);
  }

  return createNewAttempt();
}

export default function ListeningTest() {
  const navigate = useNavigate();

  const [accessChecking, setAccessChecking] = useState(true);
  const [accessAllowed, setAccessAllowed] = useState(false);

  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // Payment gate
  const [paymentRequired, setPaymentRequired] = useState(false);

  const [attempt, setAttempt] = useState(getInitialAttempt);

  const current = attempt.current;
  const selected = attempt.selected;
  const score = attempt.score;
  const finished = attempt.finished;

  const resultSaved = attempt.resultSaved === true;
  const resultEmailSent = attempt.resultEmailSent === true;

  const saveStartedRef = useRef(false);
  const emailStartedRef = useRef(false);

  const [timeLeft, setTimeLeft] = useState(() => {
    const initialAttempt = getInitialAttempt();

    if (initialAttempt.finished) {
      return 0;
    }

    return Math.max(
      0,
      Math.ceil((initialAttempt.endTime - Date.now()) / 1000)
    );
  });

  const [savingResult, setSavingResult] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const question = questions[current];

  /*
   * STEP 1
   * Check:
   * 1. Student is logged in.
   * 2. Student account is approved.
   * 3. Student payment status is paid.
   * 4. Student has NOT already completed the oral test.
   */
  useEffect(() => {
    const checkTestAccess = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          navigate("/student-login", { replace: true });
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("student_profiles")
            .select("status, payment_status")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile || profile.status !== "approved") {
          navigate("/student-dashboard", { replace: true });
          return;
        }

        /*
         * PAYMENT GATE
         *
         * Only students whose payment_status is "paid"
         * can access the official test.
         */
        if (profile.payment_status !== "paid") {
          setPaymentRequired(true);
          setAccessAllowed(false);
          setAlreadyCompleted(false);
          return;
        }

        /*
         * SECURITY CHECK
         *
         * Look for an existing completed
         * comprehension_orale result.
         */
        const { data: existingResult, error: resultError } =
          await supabase
            .from("test_results")
            .select("id, completed_at")
            .eq("student_id", user.id)
            .eq("test_type", "comprehension_orale")
            .limit(1)
            .maybeSingle();

        if (resultError) {
          throw resultError;
        }

        if (existingResult) {
          setAlreadyCompleted(true);
          setAccessAllowed(false);
          return;
        }

        setAlreadyCompleted(false);
        setPaymentRequired(false);
        setAccessAllowed(true);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'accès au test :",
          error
        );

        navigate("/student-dashboard", { replace: true });
      } finally {
        setAccessChecking(false);
      }
    };

    checkTestAccess();
  }, [navigate]);
    /*
   * STEP 2
   * Save the complete current test attempt locally.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
  }, [attempt]);

  /*
   * STEP 3
   * Test timer.
   */
  useEffect(() => {
    if (finished) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((attempt.endTime - Date.now()) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        setAttempt((prev) => ({
          ...prev,
          finished: true,
          selected: null,
        }));
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [attempt.endTime, finished]);

  /*
   * STEP 4
   * Save the student's result in Supabase.
   *
   * This happens only once for THIS test attempt.
   */
  useEffect(() => {
    if (
      !accessAllowed ||
      !finished ||
      resultSaved ||
      saveStartedRef.current
    ) {
      return;
    }

    saveStartedRef.current = true;

    const saveResult = async () => {
      setSavingResult(true);
      setSaveMessage("");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error(
            "Aucun étudiant connecté. Impossible d'enregistrer le résultat."
          );
        }

        const percentage = Math.round(
          (score / questions.length) * 100
        );

        const { error } = await supabase
          .from("test_results")
          .insert([
            {
              student_id: user.id,
              score: score,
              total_questions: questions.length,
              percentage: percentage,
              test_type: "comprehension_orale",
            },
          ]);

        if (error) {
          throw error;
        }

        setAttempt((prev) => ({
          ...prev,
          resultSaved: true,
        }));

        setSaveMessage(
          "Votre résultat a été enregistré avec succès."
        );

        console.log("Résultat enregistré dans Supabase.");
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement du résultat :",
          error
        );

        saveStartedRef.current = false;

        setSaveMessage(
          "Le test est terminé, mais le résultat n'a pas pu être enregistré."
        );
      } finally {
        setSavingResult(false);
      }
    };

    saveResult();
  }, [accessAllowed, finished, resultSaved, score]);

  /*
   * STEP 5
   * Send the result automatically by email.
   *
   * The email is sent to the authenticated student's email.
   */
  useEffect(() => {
    if (
      !accessAllowed ||
      !finished ||
      !resultSaved ||
      resultEmailSent ||
      emailStartedRef.current
    ) {
      return;
    }

    emailStartedRef.current = true;

    const sendResultEmail = async () => {
      setSendingEmail(true);
      setEmailMessage("");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error(
            "Aucun étudiant connecté. Impossible d'envoyer le résultat."
          );
        }

        if (!user.email) {
          throw new Error(
            "L'adresse email du compte étudiant est introuvable."
          );
        }

        let studentName = "étudiant(e)";

        try {
          const { data: profile } = await supabase
            .from("student_profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.full_name) {
            studentName = profile.full_name;
          }
        } catch (profileError) {
          console.warn(
            "Impossible de récupérer le nom de l'étudiant :",
            profileError
          );
        }

        const { data, error } = await supabase.functions.invoke(
          "send-test-result",
          {
            body: {
              email: user.email,
              studentName: studentName,
              score: score,
              total: questions.length,
            },
          }
        );

        if (error) {
          throw error;
        }

        if (!data?.success) {
          throw new Error(
            data?.error ||
              "L'envoi de l'email a échoué."
          );
        }

        setAttempt((prev) => ({
          ...prev,
          resultEmailSent: true,
        }));

        setEmailMessage(
          `Votre résultat a été envoyé à ${user.email}.`
        );

        console.log(
          "Email de résultat envoyé à :",
          user.email
        );
      } catch (error) {
        console.error(
          "Erreur lors de l'envoi de l'email :",
          error
        );

        emailStartedRef.current = false;

        setEmailMessage(
          "Votre résultat est enregistré, mais l'email n'a pas pu être envoyé pour le moment."
        );
      } finally {
        setSendingEmail(false);
      }
    };

    sendResultEmail();
  }, [
    accessAllowed,
    finished,
    resultSaved,
    resultEmailSent,
    score,
  ]);

  /*
   * Play current audio.
   */
  const playAudio = () => {
    if (!question || finished || !accessAllowed) {
      return;
    }

    const audio = new Audio(question.audio);

    audio.play().catch((error) => {
      console.error("Impossible de lire l'audio :", error);
    });
  };

  /*
   * Select an answer.
   */
  const chooseAnswer = (index) => {
    if (
      selected !== null ||
      finished ||
      !accessAllowed
    ) {
      return;
    }

    const isCorrect = index === question.correctAnswer;

    setAttempt((prev) => ({
      ...prev,
      selected: index,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  /*
   * Move to the next question.
   */
  const nextQuestion = () => {
    if (
      selected === null ||
      finished ||
      !accessAllowed
    ) {
      return;
    }

    if (current === questions.length - 1) {
      setAttempt((prev) => ({
        ...prev,
        finished: true,
      }));

      return;
    }

    setAttempt((prev) => ({
      ...prev,
      current: prev.current + 1,
      selected: null,
    }));
  };

  /*
   * Format timer.
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  /*
   * Access checking screen.
   */
  if (accessChecking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0d1b2a 0%, #132b40 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px 20px",
          fontFamily: "DM Sans, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "#f8f4ee",
            borderRadius: "22px",
            padding: "45px 30px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={{
              width: "150px",
              maxWidth: "70%",
              marginBottom: "25px",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              fontSize: "40px",
              marginBottom: "15px",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              color: "#0d1b2a",
              fontSize: "28px",
              marginBottom: "12px",
              fontFamily:
                "Playfair Display, Georgia, serif",
            }}
          >
            Vérification de l'accès
          </h1>

          <p
            style={{
              color: "#667085",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Vérification de votre autorisation
            d'accès au test...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Payment required screen.
   *
   * The student must be approved AND paid
   * before accessing the official test.
   */
  if (paymentRequired) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0d1b2a 0%, #132b40 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px 20px",
          fontFamily: "DM Sans, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "#f8f4ee",
            borderRadius: "22px",
            padding: "45px 30px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={{
              width: "170px",
              maxWidth: "70%",
              marginBottom: "25px",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              fontSize: "52px",
              marginBottom: "15px",
            }}
          >
            💳
          </div>

          <h1
            style={{
              color: "#0d1b2a",
              fontSize: "30px",
              marginBottom: "15px",
              fontFamily:
                "Playfair Display, Georgia, serif",
            }}
          >
            Paiement requis
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "16px",
              lineHeight: "1.7",
              marginBottom: "20px",
            }}
          >
            Votre compte étudiant est approuvé,
            mais votre paiement n'a pas encore été
            confirmé.
          </p>

          <div
            style={{
              background: "#fff8df",
              border: "1px solid #e5d08a",
              borderRadius: "12px",
              padding: "18px",
              marginBottom: "25px",
              color: "#6b5715",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <strong>Accès au test bloqué</strong>
            <br />
            Le test de niveau sera accessible
            après confirmation de votre paiement
            par l'administration de l'International
            French Academy.
          </div>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              background: "#c9a84c",
              color: "#0d1b2a",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ← Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }
    /*
   * If the student already completed the oral test,
   * block direct access to /tests/level-test.
   */
  if (alreadyCompleted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0d1b2a 0%, #132b40 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px 20px",
          fontFamily: "DM Sans, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "#f8f4ee",
            borderRadius: "22px",
            padding: "45px 30px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={{
              width: "170px",
              maxWidth: "70%",
              marginBottom: "25px",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              fontSize: "52px",
              marginBottom: "15px",
            }}
          >
            🔒
          </div>

          <h1
            style={{
              color: "#0d1b2a",
              fontSize: "30px",
              marginBottom: "15px",
              fontFamily:
                "Playfair Display, Georgia, serif",
            }}
          >
            Test déjà effectué
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "16px",
              lineHeight: "1.7",
              marginBottom: "25px",
            }}
          >
            Vous avez déjà effectué votre test de
            compréhension orale.
          </p>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4ddd2",
              borderRadius: "12px",
              padding: "18px",
              marginBottom: "25px",
              color: "#555",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Une seule tentative est autorisée pour
            cette partie du test de niveau.
          </div>

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              background: "#c9a84c",
              color: "#0d1b2a",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ← Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }

  /*
   * Final result screen.
   */
  if (finished) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0d1b2a 0%, #132b40 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px 20px",
          fontFamily: "DM Sans, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "650px",
            background: "#f8f4ee",
            borderRadius: "22px",
            padding: "45px 30px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={{
              width: "180px",
              maxWidth: "70%",
              marginBottom: "25px",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              fontSize: "50px",
              marginBottom: "10px",
            }}
          >
            🎉
          </div>

          <h1
            style={{
              color: "#0d1b2a",
              fontSize: "34px",
              marginBottom: "15px",
              fontFamily:
                "Playfair Display, Georgia, serif",
            }}
          >
            Test terminé !
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "17px",
              marginBottom: "10px",
            }}
          >
            Vous avez obtenu
          </p>

          <div
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#c9a84c",
              marginBottom: "5px",
            }}
          >
            {score} / {questions.length}
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#0d1b2a",
              marginBottom: "20px",
            }}
          >
            Score : {percentage}%
          </div>

          <p
            style={{
              color: "#555",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            Merci d'avoir passé le test de compréhension
            orale de l'International French Academy.
          </p>

          {savingResult && (
            <div
              style={{
                background: "#fff8df",
                border: "1px solid #e5d08a",
                color: "#8a6d1d",
                padding: "14px 16px",
                borderRadius: "10px",
                marginBottom: "15px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ⏳ Enregistrement de votre résultat...
            </div>
          )}

          {saveMessage && !savingResult && (
            <div
              style={{
                background: resultSaved
                  ? "#e8f5e9"
                  : "#fff3cd",
                color: resultSaved
                  ? "#2e7d32"
                  : "#856404",
                padding: "12px 15px",
                borderRadius: "10px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {saveMessage}
            </div>
          )}

          {sendingEmail && (
            <div
              style={{
                background: "#fff8df",
                border: "1px solid #e5d08a",
                color: "#8a6d1d",
                padding: "14px 16px",
                borderRadius: "10px",
                marginBottom: "15px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              📧 Envoi de votre résultat par email...
            </div>
          )}

          {emailMessage && !sendingEmail && (
            <div
              style={{
                background: resultEmailSent
                  ? "#e8f5e9"
                  : "#fff3cd",
                color: resultEmailSent
                  ? "#2e7d32"
                  : "#856404",
                padding: "12px 15px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {emailMessage}
            </div>
          )}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4ddd2",
              borderRadius: "12px",
              padding: "15px",
              color: "#555",
              fontSize: "14px",
            }}
          >
            Cette tentative est terminée. Vous ne pouvez
            pas recommencer le test depuis cette page.
          </div>
        </div>
      </div>
    );
  }

  const progress =
    ((current + 1) / questions.length) * 100;

  /*
   * Main test screen - beginning.
   */
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d1b2a 0%, #132b40 100%)",
        padding: "30px 20px",
        fontFamily: "DM Sans, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          margin: "0 auto",
          background: "#f8f4ee",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: "25px 30px",
            borderBottom: "1px solid #e5ded3",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <img
                src="/IFA logo.jpg"
                alt="International French Academy"
                style={{
                  width: "150px",
                  maxWidth: "100%",
                  borderRadius: "8px",
                }}
              />

              <div
                style={{
                  marginTop: "15px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  color: "#c9a84c",
                }}
              >
                COMPRÉHENSION ORALE
              </div>

              <h1
                style={{
                  margin: "5px 0 0",
                  color: "#0d1b2a",
                  fontFamily:
                    "Playfair Display, Georgia, serif",
                  fontSize: "30px",
                }}
              >
                Test de niveau
              </h1>
            </div>

            <div
              style={{
                background:
                  timeLeft <= 300
                    ? "#fff0f0"
                    : "#f8f4ee",
                border:
                  timeLeft <= 300
                    ? "1px solid #e6aaaa"
                    : "1px solid #e5ded3",
                borderRadius: "12px",
                padding: "12px 18px",
                textAlign: "center",
                minWidth: "115px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#777",
                  marginBottom: "4px",
                }}
              >
                TEMPS RESTANT
              </div>

              <strong
                style={{
                  fontSize: "22px",
                  color:
                    timeLeft <= 300
                      ? "#b42318"
                      : "#0d1b2a",
                }}
              >
                {formatTime(timeLeft)}
              </strong>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "20px 30px 0",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            <span>
              Question {current + 1} sur {questions.length}
            </span>

            <span>
              Niveau {question.level}
            </span>
          </div>

          <div
            style={{
              height: "8px",
              background: "#e5ded3",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#c9a84c",
                borderRadius: "10px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
                <div
          style={{
            padding: "30px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5ded3",
              borderRadius: "16px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#0d1b2a",
                  fontSize: "21px",
                  fontFamily:
                    "Playfair Display, Georgia, serif",
                  lineHeight: "1.4",
                }}
              >
                {question.question}
              </h2>

              <span
                style={{
                  background: "#0d1b2a",
                  color: "#ffffff",
                  borderRadius: "20px",
                  padding: "7px 13px",
                  fontSize: "12px",
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                }}
              >
                {question.level}
              </span>
            </div>

            <button
              type="button"
              onClick={playAudio}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "14px",
                padding: "18px",
                background: "#0d1b2a",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                marginBottom: "25px",
              }}
            >
              🔊 Écouter l'audio
            </button>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              {question.choices.map((choice, index) => {
                const isSelected = selected === index;
                const isCorrect =
                  index === question.correctAnswer;

                let background = "#ffffff";
                let border = "1px solid #d8d2c8";
                let textColor = "#333";

                if (selected !== null) {
                  if (isSelected && isCorrect) {
                    background = "#e8f5e9";
                    border = "2px solid #43a047";
                    textColor = "#2e7d32";
                  } else if (isSelected && !isCorrect) {
                    background = "#ffebee";
                    border = "2px solid #e53935";
                    textColor = "#c62828";
                  } else if (isCorrect) {
                    background = "#f1f8e9";
                    border = "2px solid #81c784";
                    textColor = "#388e3c";
                  }
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => chooseAnswer(index)}
                    disabled={selected !== null}
                    style={{
                      textAlign: "left",
                      border,
                      borderRadius: "12px",
                      padding: "16px",
                      background,
                      color: textColor,
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor:
                        selected !== null
                          ? "default"
                          : "pointer",
                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background:
                          selected !== null &&
                          index === question.correctAnswer
                            ? "#c9a84c"
                            : "#f0ebe3",
                        color: "#0d1b2a",
                        fontWeight: "700",
                        marginRight: "10px",
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>

                    {choice}
                  </button>
                );
              })}
            </div>
          </div>

          {selected !== null && (
            <div
              style={{
                background:
                  selected === question.correctAnswer
                    ? "#e8f5e9"
                    : "#fff3cd",
                border:
                  selected === question.correctAnswer
                    ? "1px solid #a5d6a7"
                    : "1px solid #e5d08a",
                borderRadius: "12px",
                padding: "15px 18px",
                marginBottom: "20px",
                color:
                  selected === question.correctAnswer
                    ? "#2e7d32"
                    : "#856404",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {selected === question.correctAnswer ? (
                <strong>✓ Bonne réponse !</strong>
              ) : (
                <>
                  <strong>Réponse incorrecte.</strong>
                  <br />
                  La bonne réponse est :{" "}
                  {question.choices[question.correctAnswer]}
                </>
              )}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={nextQuestion}
              disabled={selected === null}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "15px 28px",
                background:
                  selected === null
                    ? "#d7d1c8"
                    : "#c9a84c",
                color:
                  selected === null
                    ? "#888"
                    : "#0d1b2a",
                fontSize: "15px",
                fontWeight: "700",
                cursor:
                  selected === null
                    ? "not-allowed"
                    : "pointer",
                minWidth: "180px",
              }}
            >
              {current === questions.length - 1
                ? "Terminer le test"
                : "Question suivante →"}
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "18px 30px",
            background: "#0d1b2a",
            color: "#ffffff",
            textAlign: "center",
            fontSize: "12px",
            lineHeight: "1.5",
          }}
        >
          International French Academy — Kigali, Rwanda
        </div>
      </div>
    </div>
  );
}