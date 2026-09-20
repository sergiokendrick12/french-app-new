import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [hasCompletedOralTest, setHasCompletedOralTest] = useState(false);
  const [hasCompletedWrittenTest, setHasCompletedWrittenTest] =
    useState(false);
  const [hasCompletedExpressionTest, setHasCompletedExpressionTest] =
    useState(false);

  useEffect(() => {
    const checkStudent = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (!user) {
          navigate("/student-login");
          return;
        }

        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from("student_profiles")
          .select("id, full_name, email, status, payment_status")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error(
            "Erreur lors du chargement du profil :",
            profileError
          );
        }

        setStudentProfile(profile);

        // Check compréhension orale
        const { data: oralResult, error: oralError } = await supabase
          .from("test_results")
          .select("id")
          .eq("student_id", user.id)
          .eq("test_type", "comprehension_orale")
          .limit(1)
          .maybeSingle();

        if (oralError) {
          console.error(
            "Erreur lors de la vérification du résultat oral :",
            oralError
          );
        }

        setHasCompletedOralTest(!!oralResult);

        // Check compréhension écrite
        const { data: writtenResult, error: writtenError } = await supabase
          .from("test_results")
          .select("id")
          .eq("student_id", user.id)
          .eq("test_type", "comprehension_ecrite")
          .limit(1)
          .maybeSingle();

        if (writtenError) {
          console.error(
            "Erreur lors de la vérification du résultat écrit :",
            writtenError
          );
        }

        setHasCompletedWrittenTest(!!writtenResult);

        // Check expression écrite
        const { data: expressionResult, error: expressionError } =
          await supabase
            .from("test_results")
            .select("id")
            .eq("student_id", user.id)
            .eq("test_type", "expression_ecrite")
            .limit(1)
            .maybeSingle();

        if (expressionError) {
          console.error(
            "Erreur lors de la vérification du résultat d'expression écrite :",
            expressionError
          );
        }

        setHasCompletedExpressionTest(!!expressionResult);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'étudiant :",
          error
        );

        navigate("/student-login");
      } finally {
        setLoading(false);
      }
    };

    checkStudent();
  }, [navigate]);

  // STUDENT LOGOUT
  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear local test attempt data after logout.
      localStorage.removeItem("ifa_listening_test_attempt");
      localStorage.removeItem("ifa_listening_test_result_saved");
      localStorage.removeItem("ifa_written_test_attempt");

      // Force a clean navigation to the STUDENT login page.
      window.location.href = "/student-login";
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      setLoggingOut(false);
    }
  };

  // START COMPRÉHENSION ORALE
  const handleStartOralTest = () => {
    if (
      studentProfile?.status !== "approved" ||
      studentProfile?.payment_status !== "paid"
    ) {
      return;
    }

    if (hasCompletedOralTest) {
      return;
    }

    localStorage.removeItem("ifa_listening_test_attempt");

    navigate("/tests/level-test");
  };

  // START COMPRÉHENSION ÉCRITE
  const handleStartWrittenTest = () => {
    if (
      studentProfile?.status !== "approved" ||
      studentProfile?.payment_status !== "paid"
    ) {
      return;
    }

    if (hasCompletedWrittenTest) {
      return;
    }

    localStorage.removeItem("ifa_written_test_attempt");

    navigate("/tests/written-test");
  };

  // EXPRESSION ÉCRITE
  const handleStartExpressionTest = () => {
    if (
      studentProfile?.status !== "approved" ||
      studentProfile?.payment_status !== "paid"
    ) {
      return;
    }

    if (hasCompletedExpressionTest) {
      return;
    }

    navigate("/tests/expression-ecrite");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7fb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p
          style={{
            color: "#0d1b2a",
            fontSize: "18px",
          }}
        >
          Chargement...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const status = studentProfile?.status || "pending";
  const paymentStatus = studentProfile?.payment_status || "unpaid";

  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isPending = status === "pending";

  const isPaid = paymentStatus === "paid";

  const isApprovedAndPaid = isApproved && isPaid;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#0d1b2a",
          color: "white",
          padding: "20px 30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <img
              src="/IFA logo.jpg"
              alt="International French Academy"
              style={{
                width: "55px",
                height: "55px",
                objectFit: "contain",
                background: "white",
                borderRadius: "10px",
                padding: "4px",
              }}
            />

            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                International French Academy
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#d9e2ec",
                }}
              >
                Espace étudiant
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: loggingOut ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: loggingOut ? 0.7 : 1,
            }}
          >
            {loggingOut ? "Déconnexion..." : "🚪 Déconnexion"}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "45px 20px",
        }}
      >
        {/* WELCOME */}
        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <p
            style={{
              color: "#c9a84c",
              fontWeight: "bold",
              marginBottom: "8px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            International French Academy
          </p>

          <h1
            style={{
              margin: "0 0 10px",
              color: "#0d1b2a",
              fontSize: "34px",
            }}
          >
            Bienvenue dans votre espace étudiant 👋
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
              fontSize: "16px",
            }}
          >
            {user.email}
          </p>
        </div>

        {/* ACCESS STATUS */}
        <div
          style={{
            marginBottom: "30px",
            background: isRejected
              ? "#fff1f0"
              : isApprovedAndPaid
              ? "#ecfdf3"
              : "#fff8e7",
            border: isRejected
              ? "1px solid #f5c2c0"
              : isApprovedAndPaid
              ? "1px solid #abefc6"
              : "1px solid #f5d98b",
            borderRadius: "16px",
            padding: "20px 22px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "6px",
              color: "#667085",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Statut du compte
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: isRejected
                ? "#b42318"
                : isApprovedAndPaid
                ? "#067647"
                : "#a15c00",
            }}
          >
            {isApprovedAndPaid && "✓ Compte approuvé et paiement confirmé"}
            {isApproved && !isPaid && "✓ Compte approuvé — paiement en attente"}
            {isPending && "⏳ En attente de validation"}
            {isRejected && "✕ Demande rejetée"}
          </div>

          <p
            style={{
              margin: "8px 0 0",
              color: "#667085",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            {isApprovedAndPaid &&
              "Votre compte est validé et votre paiement est confirmé. Vous pouvez maintenant passer les tests disponibles."}

            {isApproved &&
              !isPaid &&
              "Votre compte a été validé par International French Academy. L'accès aux tests sera disponible après confirmation de votre paiement."}

            {isPending &&
              "Votre compte est en cours de vérification par International French Academy. L'accès aux tests sera disponible après validation."}

            {isRejected &&
              "Votre demande d'accès n'a pas été approuvée. Veuillez contacter International French Academy pour plus d'informations."}
          </p>
        </div>

        {/* TESTS */}
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              color: "#0d1b2a",
              fontSize: "24px",
            }}
          >
            Vos tests
          </h2>

          <p
            style={{
              margin: 0,
              color: "#667085",
              fontSize: "15px",
            }}
          >
            Complétez les différentes parties de votre test de niveau.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          {/* COMPRÉHENSION ORALE */}
          <button
            onClick={handleStartOralTest}
            disabled={!isApprovedAndPaid || hasCompletedOralTest}
            style={{
              background:
                isApprovedAndPaid && !hasCompletedOralTest
                  ? "white"
                  : "#f8f9fa",
              border: "none",
              borderRadius: "18px",
              padding: "30px",
              textAlign: "left",
              cursor:
                isApprovedAndPaid && !hasCompletedOralTest
                  ? "pointer"
                  : "not-allowed",
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
              borderTop: "5px solid #c9a84c",
              opacity:
                isApprovedAndPaid && !hasCompletedOralTest
                  ? 1
                  : 0.65,
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                background: "#f8f4ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                marginBottom: "20px",
              }}
            >
              {hasCompletedOralTest ? "🔒" : "🎧"}
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#0d1b2a",
                fontSize: "21px",
              }}
            >
              {hasCompletedOralTest
                ? "Compréhension orale terminée"
                : "Compréhension orale"}
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#667085",
                lineHeight: "1.6",
              }}
            >
              {!isApproved &&
                "L'accès sera disponible après validation de votre compte."}

              {isApproved &&
                !isPaid &&
                "Votre compte est approuvé. L'accès sera disponible après confirmation du paiement."}

              {isApprovedAndPaid &&
                !hasCompletedOralTest &&
                "Écoutez les documents audio et répondez aux questions."}

              {isApprovedAndPaid &&
                hasCompletedOralTest &&
                "Vous avez déjà terminé cette partie. Une seule tentative est autorisée."}
            </p>

            <span
              style={{
                color: "#0d1b2a",
                fontWeight: "bold",
              }}
            >
              {!isApproved && "Accès verrouillé 🔒"}

              {isApproved &&
                !isPaid &&
                "Paiement requis 🔒"}

              {isApprovedAndPaid &&
                !hasCompletedOralTest &&
                "Commencer →"}

              {isApprovedAndPaid &&
                hasCompletedOralTest &&
                "Terminé ✓"}
            </span>
          </button>

          {/* COMPRÉHENSION ÉCRITE */}
          <button
            onClick={handleStartWrittenTest}
            disabled={!isApprovedAndPaid || hasCompletedWrittenTest}
            style={{
              background:
                isApprovedAndPaid && !hasCompletedWrittenTest
                  ? "white"
                  : "#f8f9fa",
              border: "none",
              borderRadius: "18px",
              padding: "30px",
              textAlign: "left",
              cursor:
                isApprovedAndPaid && !hasCompletedWrittenTest
                  ? "pointer"
                  : "not-allowed",
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
              borderTop: "5px solid #0d1b2a",
              opacity:
                isApprovedAndPaid && !hasCompletedWrittenTest
                  ? 1
                  : 0.65,
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                background: "#eef3f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                marginBottom: "20px",
              }}
            >
              {hasCompletedWrittenTest ? "🔒" : "📖"}
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#0d1b2a",
                fontSize: "21px",
              }}
            >
              {hasCompletedWrittenTest
                ? "Compréhension écrite terminée"
                : "Compréhension écrite"}
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#667085",
                lineHeight: "1.6",
              }}
            >
              {!isApproved &&
                "L'accès sera disponible après validation de votre compte."}

              {isApproved &&
                !isPaid &&
                "Votre compte est approuvé. L'accès sera disponible après confirmation du paiement."}

              {isApprovedAndPaid &&
                !hasCompletedWrittenTest &&
                "Lisez les textes et répondez aux questions de compréhension."}

              {isApprovedAndPaid &&
                hasCompletedWrittenTest &&
                "Vous avez déjà terminé cette partie. Une seule tentative est autorisée."}
            </p>

            <span
              style={{
                color: "#0d1b2a",
                fontWeight: "bold",
              }}
            >
              {!isApproved && "Accès verrouillé 🔒"}

              {isApproved &&
                !isPaid &&
                "Paiement requis 🔒"}

              {isApprovedAndPaid &&
                !hasCompletedWrittenTest &&
                "Commencer →"}

              {isApprovedAndPaid &&
                hasCompletedWrittenTest &&
                "Terminé ✓"}
            </span>
          </button>

          {/* EXPRESSION ÉCRITE */}
          <button
            onClick={handleStartExpressionTest}
            disabled={!isApprovedAndPaid || hasCompletedExpressionTest}
            style={{
              background:
                isApprovedAndPaid && !hasCompletedExpressionTest
                  ? "white"
                  : "#f8f9fa",
              border: "none",
              borderRadius: "18px",
              padding: "30px",
              textAlign: "left",
              cursor:
                isApprovedAndPaid && !hasCompletedExpressionTest
                  ? "pointer"
                  : "not-allowed",
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
              borderTop: "5px solid #c9a84c",
              opacity:
                isApprovedAndPaid && !hasCompletedExpressionTest
                  ? 1
                  : 0.65,
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                background: "#f8f4ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                marginBottom: "20px",
              }}
            >
              {hasCompletedExpressionTest ? "🔒" : "✍️"}
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#0d1b2a",
                fontSize: "21px",
              }}
            >
              {hasCompletedExpressionTest
                ? "Expression écrite terminée"
                : "Expression écrite"}
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#667085",
                lineHeight: "1.6",
              }}
            >
              {!isApproved
                ? "L'accès sera disponible après validation de votre compte."
                : !isPaid
                ? "Votre compte est approuvé. L'accès sera disponible après confirmation du paiement."
                : hasCompletedExpressionTest
                ? "Vous avez déjà envoyé vos réponses. Une seule tentative est autorisée."
                : "Rédigez vos réponses aux trois tâches d'expression écrite."}
            </p>

            <span
              style={{
                color: "#0d1b2a",
                fontWeight: "bold",
              }}
            >
              {!isApproved && "Accès verrouillé 🔒"}

              {isApproved &&
                !isPaid &&
                "Paiement requis 🔒"}

              {isApprovedAndPaid &&
                !hasCompletedExpressionTest &&
                "Commencer →"}

              {isApprovedAndPaid &&
                hasCompletedExpressionTest &&
                "Terminé ✓"}
            </span>
          </button>

          {/* RESULTS */}
          <button
            onClick={() => navigate("/tests/results")}
            style={{
              background: "white",
              border: "none",
              borderRadius: "18px",
              padding: "30px",
              textAlign: "left",
              cursor: "pointer",
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
              borderTop: "5px solid #0d1b2a",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                background: "#eef3f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                marginBottom: "20px",
              }}
            >
              📊
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#0d1b2a",
                fontSize: "21px",
              }}
            >
              Mes résultats
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#667085",
                lineHeight: "1.6",
              }}
            >
              Consultez vos résultats et l'historique de vos tests.
            </p>

            <span
              style={{
                color: "#0d1b2a",
                fontWeight: "bold",
              }}
            >
              Voir mes résultats →
            </span>
          </button>
        </div>

        {/* ACCOUNT INFORMATION */}
        <div
          style={{
            marginTop: "35px",
            background: "white",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 6px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              color: "#0d1b2a",
              fontSize: "20px",
            }}
          >
            Informations du compte
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "15px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 5px",
                  color: "#667085",
                  fontSize: "13px",
                }}
              >
                Adresse e-mail
              </p>

              <p
                style={{
                  margin: 0,
                  color: "#0d1b2a",
                  fontWeight: "bold",
                }}
              >
                {user.email}
              </p>
            </div>

            <div>
              <p
                style={{
                  margin: "0 0 5px",
                  color: "#667085",
                  fontSize: "13px",
                }}
              >
                Statut
              </p>

              <p
                style={{
                  margin: 0,
                  color: isRejected
                    ? "#b42318"
                    : isApprovedAndPaid
                    ? "#18794e"
                    : "#a15c00",
                  fontWeight: "bold",
                }}
              >
                {isApprovedAndPaid && "✓ APPROUVÉ — PAYÉ"}

                {isApproved && !isPaid && "✓ APPROUVÉ — PAIEMENT EN ATTENTE"}

                {isPending && "⏳ EN ATTENTE"}

                {isRejected && "✕ REJETÉ"}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#667085",
            fontSize: "13px",
          }}
        >
          International French Academy — Kigali, Rwanda
        </div>
      </main>
    </div>
  );
}