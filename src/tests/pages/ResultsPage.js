import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";

const IFA = {
  navy: "#0d1b2a",
  gold: "#c9a84c",
  cream: "#f8f4ee",
  white: "#ffffff",
  muted: "#6b7280",
  green: "#166534",
  red: "#991b1b",
};

function formatDate(value) {
  if (!value) return "Date indisponible";

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getLevel(percentage) {
  if (percentage >= 90) return "C2";
  if (percentage >= 80) return "C1";
  if (percentage >= 70) return "B2";
  if (percentage >= 60) return "B1";
  if (percentage >= 45) return "A2";
  return "A1";
}

function TestResultCard({
  title,
  icon,
  result,
  description,
}) {
  if (!result) {
    return (
      <div
        style={{
          background: IFA.white,
          borderRadius: 18,
          padding: 24,
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 25px rgba(13, 27, 42, 0.06)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: IFA.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 25,
            marginBottom: 16,
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: "0 0 8px",
            color: IFA.navy,
            fontFamily: "Playfair Display, serif",
            fontSize: 22,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: IFA.muted,
            lineHeight: 1.6,
            marginBottom: 0,
          }}
        >
          {description}
        </p>

        <div
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            background: "#f9fafb",
            color: IFA.muted,
            fontSize: 14,
          }}
        >
          Aucun résultat disponible pour le moment.
        </div>
      </div>
    );
  }

  const percentage = Number(result.percentage) || 0;

  return (
    <div
      style={{
        background: IFA.white,
        borderRadius: 18,
        padding: 24,
        border: `1px solid ${IFA.gold}55`,
        boxShadow: "0 8px 25px rgba(13, 27, 42, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 15,
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: IFA.cream,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 25,
              marginBottom: 16,
            }}
          >
            {icon}
          </div>

          <h3
            style={{
              margin: 0,
              color: IFA.navy,
              fontFamily: "Playfair Display, serif",
              fontSize: 22,
            }}
          >
            {title}
          </h3>
        </div>

        <div
          style={{
            background: IFA.navy,
            color: IFA.white,
            borderRadius: 12,
            padding: "9px 13px",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {percentage}%
        </div>
      </div>

      <p
        style={{
          color: IFA.muted,
          lineHeight: 1.6,
          marginTop: 0,
        }}
      >
        {description}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 20,
        }}
      >
        <div
          style={{
            background: IFA.cream,
            borderRadius: 12,
            padding: 15,
          }}
        >
          <div
            style={{
              color: IFA.muted,
              fontSize: 13,
              marginBottom: 5,
            }}
          >
            Résultat
          </div>

          <strong
            style={{
              color: IFA.navy,
              fontSize: 20,
            }}
          >
            {result.score} / {result.total_questions}
          </strong>
        </div>

        <div
          style={{
            background: IFA.cream,
            borderRadius: 12,
            padding: 15,
          }}
        >
          <div
            style={{
              color: IFA.muted,
              fontSize: 13,
              marginBottom: 5,
            }}
          >
            Date
          </div>

          <strong
            style={{
              color: IFA.navy,
              fontSize: 14,
            }}
          >
            {formatDate(result.completed_at)}
          </strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 12,
          background: "#f0fdf4",
          color: IFA.green,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        ✓ Résultat enregistré avec succès
      </div>
    </div>
  );
}

function ExpressionResultCard({ result }) {
  if (!result) {
    return (
      <div
        style={{
          background: IFA.white,
          borderRadius: 18,
          padding: 24,
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 25px rgba(13, 27, 42, 0.06)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: IFA.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 25,
            marginBottom: 16,
          }}
        >
          ✍️
        </div>

        <h3
          style={{
            margin: "0 0 8px",
            color: IFA.navy,
            fontFamily: "Playfair Display, serif",
            fontSize: 22,
          }}
        >
          Expression écrite
        </h3>

        <p
          style={{
            color: IFA.muted,
            lineHeight: 1.6,
            marginBottom: 0,
          }}
        >
          Résultat de votre test d'expression écrite.
        </p>

        <div
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            background: "#f9fafb",
            color: IFA.muted,
            fontSize: 14,
          }}
        >
          Aucun résultat disponible pour le moment.
        </div>
      </div>
    );
  }

  const isGraded = result.grading_status === "graded";

  return (
    <div
      style={{
        background: IFA.white,
        borderRadius: 18,
        padding: 24,
        border: `1px solid ${IFA.gold}55`,
        boxShadow: "0 8px 25px rgba(13, 27, 42, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 15,
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: IFA.cream,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 25,
              marginBottom: 16,
            }}
          >
            ✍️
          </div>

          <h3
            style={{
              margin: 0,
              color: IFA.navy,
              fontFamily: "Playfair Display, serif",
              fontSize: 22,
            }}
          >
            Expression écrite
          </h3>
        </div>

        <div
          style={{
            background: isGraded ? IFA.navy : "#fff8df",
            color: isGraded ? IFA.white : IFA.gold,
            borderRadius: 12,
            padding: "9px 13px",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {isGraded ? "Corrigé" : "En attente"}
        </div>
      </div>

      <p
        style={{
          color: IFA.muted,
          lineHeight: 1.6,
          marginTop: 0,
        }}
      >
        Résultat de votre test d'expression écrite.
      </p>

      {isGraded ? (
        <>
          <div
            style={{
              background: IFA.cream,
              borderRadius: 14,
              padding: 20,
              marginTop: 20,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: IFA.muted,
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              Note finale
            </div>

            <div
              style={{
                color: IFA.navy,
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              {result.grading_total} / 3
            </div>

            <div
              style={{
                marginTop: 8,
                color: IFA.green,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              ✓ Correction terminée
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: 10,
              marginTop: 14,
            }}
          >
            <div
              style={{
                background: "#f9fafb",
                borderRadius: 12,
                padding: 13,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: IFA.muted,
                  fontSize: 12,
                  marginBottom: 5,
                }}
              >
                Tâche 1
              </div>

              <strong
                style={{
                  color: IFA.navy,
                  fontSize: 18,
                }}
              >
                {result.task1_score} / 1
              </strong>
            </div>

            <div
              style={{
                background: "#f9fafb",
                borderRadius: 12,
                padding: 13,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: IFA.muted,
                  fontSize: 12,
                  marginBottom: 5,
                }}
              >
                Tâche 2
              </div>

              <strong
                style={{
                  color: IFA.navy,
                  fontSize: 18,
                }}
              >
                {result.task2_score} / 1
              </strong>
            </div>

            <div
              style={{
                background: "#f9fafb",
                borderRadius: 12,
                padding: 13,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: IFA.muted,
                  fontSize: 12,
                  marginBottom: 5,
                }}
              >
                Tâche 3
              </div>

              <strong
                style={{
                  color: IFA.navy,
                  fontSize: 18,
                }}
              >
                {result.task3_score} / 1
              </strong>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            marginTop: 20,
            padding: 18,
            borderRadius: 12,
            background: "#fff8df",
            color: "#8a6d1d",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Votre expression écrite a bien été enregistrée.
          <br />
          <strong>La correction est en attente.</strong>
        </div>
      )}

      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 12,
          background: "#f9fafb",
          color: IFA.muted,
          fontSize: 13,
        }}
      >
        Date : {formatDate(result.completed_at)}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  const [oralResult, setOralResult] = useState(null);
  const [writtenResult, setWrittenResult] = useState(null);
  const [expressionResult, setExpressionResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadResults() {
      setLoading(true);
      setErrorMessage("");

      try {
        // 1. Get logged-in user
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!currentUser) {
          throw new Error("Utilisateur non connecté.");
        }

        if (!mounted) return;

        setUser(currentUser);

        // 2. Get student profile
        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("student_profiles")
          .select("id, full_name, email, status")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profileError) {
          console.warn("PROFILE ERROR:", profileError);
        }

        if (mounted) {
          setStudentProfile(profile || null);
        }

        // 3. Get oral result
        const {
          data: oral,
          error: oralError,
        } = await supabase
          .from("test_results")
          .select(
            "id, score, total_questions, percentage, test_type, completed_at"
          )
          .eq("student_id", currentUser.id)
          .eq("test_type", "comprehension_orale")
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (oralError) {
          console.error("ORAL RESULT ERROR:", oralError);
        } else if (mounted) {
          setOralResult(oral || null);
        }

        // 4. Get written result
        const {
          data: written,
          error: writtenError,
        } = await supabase
          .from("test_results")
          .select(
            "id, score, total_questions, percentage, test_type, completed_at"
          )
          .eq("student_id", currentUser.id)
          .eq("test_type", "comprehension_ecrite")
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (writtenError) {
          console.error("WRITTEN RESULT ERROR:", writtenError);
        } else if (mounted) {
          setWrittenResult(written || null);
        }

        // 5. Get expression écrite result
        const {
          data: expression,
          error: expressionError,
        } = await supabase
          .from("test_results")
          .select(
            `
            id,
            score,
            total_questions,
            percentage,
            test_type,
            completed_at,
            task1_score,
            task2_score,
            task3_score,
            grading_total,
            grading_status
            `
          )
          .eq("student_id", currentUser.id)
          .eq("test_type", "expression_ecrite")
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (expressionError) {
          console.error(
            "EXPRESSION RESULT ERROR:",
            expressionError
          );
        } else if (mounted) {
          setExpressionResult(expression || null);
        }

        // General error only if all three result queries fail.
        if (
          oralError &&
          writtenError &&
          expressionError
        ) {
          setErrorMessage(
            "Impossible de charger vos résultats pour le moment."
          );
        }
      } catch (error) {
        console.error("RESULTS PAGE ERROR:", error);

        if (mounted) {
          setErrorMessage(
            "Impossible de charger vos résultats pour le moment."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadResults();

    return () => {
      mounted = false;
    };
  }, []);

  // Only automatically scored comprehension tests are used
  // for the current global score.
  const completedResults = useMemo(() => {
    return [oralResult, writtenResult].filter(Boolean);
  }, [oralResult, writtenResult]);

  const overallPercentage = useMemo(() => {
    if (completedResults.length === 0) return 0;

    const total = completedResults.reduce(
      (sum, result) => sum + Number(result.percentage || 0),
      0
    );

    return Math.round(
      total / completedResults.length
    );
  }, [completedResults]);

  const overallLevel = useMemo(() => {
    return getLevel(overallPercentage);
  }, [overallPercentage]);

  const totalScore = useMemo(() => {
    return completedResults.reduce(
      (sum, result) => sum + Number(result.score || 0),
      0
    );
  }, [completedResults]);

  const totalQuestions = useMemo(() => {
    return completedResults.reduce(
      (sum, result) =>
        sum + Number(result.total_questions || 0),
      0
    );
  }, [completedResults]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: IFA.cream,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: IFA.navy,
          }}
        >
          <div
            style={{
              fontSize: 42,
              marginBottom: 15,
            }}
          >
            📊
          </div>

          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              marginBottom: 8,
            }}
          >
            Chargement de vos résultats...
          </h2>

          <p style={{ color: IFA.muted }}>
            Veuillez patienter un instant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: IFA.cream,
        color: IFA.navy,
      }}
    >
      {/* Header */}
      <header
        style={{
          background: IFA.navy,
          color: IFA.white,
          padding: "18px 24px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <img
              src="/IFA logo.jpg"
              alt="International French Academy"
              style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                borderRadius: 10,
                background: IFA.white,
              }}
            />

            <div>
              <div
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                International French Academy
              </div>

              <div
                style={{
                  fontSize: 13,
                  opacity: 0.8,
                  marginTop: 3,
                }}
              >
                Espace étudiant
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href =
                "/student-dashboard";
            }}
            style={{
              background: "transparent",
              border: `1px solid ${IFA.gold}`,
              color: IFA.white,
              borderRadius: 10,
              padding: "10px 15px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Mon espace
          </button>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "45px 20px 60px",
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <div
            style={{
              color: IFA.gold,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            Résultats
          </div>

          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(32px, 5vw, 46px)",
              margin: 0,
              color: IFA.navy,
            }}
          >
            Mes résultats
          </h1>

          <p
            style={{
              color: IFA.muted,
              fontSize: 16,
              marginTop: 10,
              lineHeight: 1.6,
            }}
          >
            Retrouvez ici les résultats de vos tests
            de compréhension et d'expression.
          </p>

          {studentProfile?.full_name && (
            <p
              style={{
                color: IFA.navy,
                fontWeight: 600,
                marginTop: 5,
              }}
            >
              Bonjour {studentProfile.full_name} 👋
            </p>
          )}
        </div>

        {errorMessage && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: IFA.red,
              padding: 16,
              borderRadius: 12,
              marginBottom: 25,
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Overall summary */}
        <section
          style={{
            background: IFA.navy,
            color: IFA.white,
            borderRadius: 22,
            padding: "30px 28px",
            marginBottom: 30,
            boxShadow:
              "0 12px 30px rgba(13, 27, 42, 0.15)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.75,
                  marginBottom: 8,
                }}
              >
                Performance globale
              </div>

              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                }}
              >
                {overallPercentage}%
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.75,
                  marginBottom: 8,
                }}
              >
                Score total
              </div>

              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                {totalScore} / {totalQuestions}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.75,
                  marginBottom: 8,
                }}
              >
                Niveau indicatif
              </div>

              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: IFA.gold,
                }}
              >
                {overallLevel}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.75,
                  marginBottom: 8,
                }}
              >
                Tests terminés
              </div>

              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                {completedResults.length} / 2
              </div>
            </div>
          </div>
        </section>

        {/* Comprehension results */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 22,
          }}
        >
          <TestResultCard
            title="Compréhension orale"
            icon="🎧"
            result={oralResult}
            description="Résultat de votre test de compréhension orale."
          />

          <TestResultCard
            title="Compréhension écrite"
            icon="📖"
            result={writtenResult}
            description="Résultat de votre test de compréhension écrite."
          />
        </section>

        {/* Expression écrite */}
        <section
          style={{
            marginTop: 22,
          }}
        >
          <ExpressionResultCard
            result={expressionResult}
          />
        </section>

        {/* Footer note */}
        <div
          style={{
            textAlign: "center",
            marginTop: 35,
            color: IFA.muted,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: 0 }}>
            Les résultats affichés correspondent aux
            tests enregistrés dans votre espace étudiant.
          </p>

          <p style={{ marginTop: 6 }}>
            International French Academy — Kigali, Rwanda
          </p>
        </div>
      </main>
    </div>
  );
}