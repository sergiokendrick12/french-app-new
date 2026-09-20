import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function StudentResults() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setMessage("");

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!currentUser) {
          navigate("/student-login", { replace: true });
          return;
        }

        setUser(currentUser);

        const { data, error } = await supabase
          .from("test_results")
          .select(
            `
            id,
            score,
            total_questions,
            percentage,
            test_type,
            completed_at,
            grading_task1,
            grading_task2,
            grading_task3,
            grading_total,
            grading_status
            `
          )
          .eq("student_id", currentUser.id)
          .order("completed_at", { ascending: false });

        if (error) {
          throw error;
        }

        setResults(data || []);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des résultats :",
          error
        );

        setMessage(
          "Impossible de charger vos résultats pour le moment."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [navigate]);

  const formatTestType = (testType) => {
    if (testType === "comprehension_orale") {
      return "Compréhension orale";
    }

    if (testType === "comprehension_ecrite") {
      return "Compréhension écrite";
    }

    if (testType === "expression_ecrite") {
      return "Expression écrite";
    }

    return testType || "Test de niveau";
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getExpressionScore = (result) => {
    if (result.test_type !== "expression_ecrite") {
      return null;
    }

    if (result.grading_status !== "graded") {
      return null;
    }

    if (result.grading_total === null) {
      return null;
    }

    return result.grading_total;
  };

  const comprehensionSummary = useMemo(() => {
    const oral = results.find(
      (result) => result.test_type === "comprehension_orale"
    );

    const written = results.find(
      (result) => result.test_type === "comprehension_ecrite"
    );

    const completed = [oral, written].filter(Boolean);

    if (completed.length === 0) {
      return null;
    }

    const totalScore = completed.reduce(
      (sum, result) => sum + Number(result.score || 0),
      0
    );

    const totalQuestions = completed.reduce(
      (sum, result) => sum + Number(result.total_questions || 0),
      0
    );

    const percentage =
      totalQuestions > 0
        ? Math.round((totalScore / totalQuestions) * 100)
        : 0;

    let level = "A1";

    if (percentage >= 90) {
      level = "C2";
    } else if (percentage >= 80) {
      level = "C1";
    } else if (percentage >= 70) {
      level = "B2";
    } else if (percentage >= 55) {
      level = "B1";
    } else if (percentage >= 45) {
      level = "A2";
    }

    return {
      oral,
      written,
      totalScore,
      totalQuestions,
      percentage,
      level,
    };
  }, [results]);

  const expressionResult = useMemo(() => {
    return results.find(
      (result) => result.test_type === "expression_ecrite"
    );
  }, [results]);

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
          maxWidth: "900px",
          margin: "0 auto",
          background: "#f8f4ee",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "25px 30px",
            borderBottom: "1px solid #e5ded3",
          }}
        >
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
              marginTop: "18px",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              color: "#c9a84c",
            }}
          >
            ESPACE ÉTUDIANT
          </div>

          <h1
            style={{
              margin: "5px 0 0",
              color: "#0d1b2a",
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "32px",
            }}
          >
            Mes résultats
          </h1>

          {user && (
            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              {user.email}
            </p>
          )}
        </div>

        <div
          style={{
            padding: "35px 30px 45px",
          }}
        >
          {loading && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "30px",
                textAlign: "center",
                color: "#667085",
              }}
            >
              Chargement de vos résultats...
            </div>
          )}

          {!loading && message && (
            <div
              style={{
                background: "#fff1f0",
                border: "1px solid #f5c2c0",
                color: "#b42318",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              {message}
            </div>
          )}

          {!loading && !message && results.length === 0 && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "35px 25px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "15px",
                }}
              >
                📊
              </div>

              <h2
                style={{
                  color: "#0d1b2a",
                  marginBottom: "10px",
                  fontFamily:
                    "Playfair Display, Georgia, serif",
                }}
              >
                Aucun résultat
              </h2>

              <p
                style={{
                  color: "#667085",
                  lineHeight: "1.6",
                  marginBottom: "25px",
                }}
              >
                Vous n'avez pas encore terminé de test.
              </p>
            </div>
          )}

          {!loading &&
            !message &&
            results.length > 0 &&
            comprehensionSummary && (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "25px",
                  marginBottom: "22px",
                  border: "1px solid #e4ddd2",
                  boxShadow:
                    "0 6px 18px rgba(13,27,42,0.06)",
                }}
              >
                <div
                  style={{
                    color: "#c9a84c",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Performance globale
                </div>

                <h2
                  style={{
                    margin: "0 0 20px",
                    color: "#0d1b2a",
                    fontSize: "24px",
                    fontFamily:
                      "Playfair Display, Georgia, serif",
                  }}
                >
                  Votre progression
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      background: "#f8f4ee",
                      borderRadius: "12px",
                      padding: "18px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#667085",
                        fontSize: "13px",
                        marginBottom: "7px",
                      }}
                    >
                      Compréhension
                    </div>

                    <div
                      style={{
                        color: "#0d1b2a",
                        fontSize: "28px",
                        fontWeight: "700",
                      }}
                    >
                      {comprehensionSummary.percentage}%
                    </div>

                    <div
                      style={{
                        color: "#667085",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {comprehensionSummary.totalScore} /{" "}
                      {comprehensionSummary.totalQuestions}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fff8df",
                      borderRadius: "12px",
                      padding: "18px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#667085",
                        fontSize: "13px",
                        marginBottom: "7px",
                      }}
                    >
                      Niveau indicatif
                    </div>

                    <div
                      style={{
                        color: "#c9a84c",
                        fontSize: "32px",
                        fontWeight: "700",
                      }}
                    >
                      {comprehensionSummary.level}
                    </div>

                    <div
                      style={{
                        color: "#667085",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Basé sur la compréhension
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f0fdf4",
                      borderRadius: "12px",
                      padding: "18px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#667085",
                        fontSize: "13px",
                        marginBottom: "7px",
                      }}
                    >
                      Tests terminés
                    </div>

                    <div
                      style={{
                        color: "#16803c",
                        fontSize: "28px",
                        fontWeight: "700",
                      }}
                    >
                      {results.length}
                    </div>

                    <div
                      style={{
                        color: "#667085",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      résultat(s)
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "1px solid #e5ded3",
                  }}
                >
                  <div
                    style={{
                      color: "#0d1b2a",
                      fontSize: "14px",
                      fontWeight: "700",
                      marginBottom: "14px",
                    }}
                  >
                    Progression par épreuve
                  </div>

                  {[
                    {
                      label: "Compréhension orale",
                      result: comprehensionSummary.oral,
                    },
                    {
                      label: "Compréhension écrite",
                      result: comprehensionSummary.written,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        marginBottom: "13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          marginBottom: "6px",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            color: "#344054",
                            fontWeight: "600",
                          }}
                        >
                          {item.label}
                        </span>

                        <span
                          style={{
                            color: "#0d1b2a",
                            fontWeight: "700",
                          }}
                        >
                          {item.result
                            ? `${item.result.percentage}%`
                            : "Non terminé"}
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "9px",
                          background: "#e8e2d8",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${
                              item.result
                                ? Math.min(
                                    Number(
                                      item.result.percentage
                                    ),
                                    100
                                  )
                                : 0
                            }%`,
                            height: "100%",
                            background: "#c9a84c",
                            borderRadius: "999px",
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {expressionResult && (
                    <div
                      style={{
                        marginTop: "18px",
                        padding: "15px",
                        background: "#f8f4ee",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            color: "#344054",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          Expression écrite
                        </span>

                        {getExpressionScore(
                          expressionResult
                        ) !== null ? (
                          <strong
                            style={{
                              color: "#16803c",
                              fontSize: "14px",
                            }}
                          >
                            {getExpressionScore(
                              expressionResult
                            )}{" "}
                            / 3
                          </strong>
                        ) : (
                          <span
                            style={{
                              color: "#c9a84c",
                              fontSize: "13px",
                              fontWeight: "700",
                            }}
                          >
                            À corriger
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    color: "#667085",
                    fontSize: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  * Le niveau affiché est indicatif et basé
                  uniquement sur les résultats de compréhension.
                  Il ne constitue pas encore un niveau officiel
                  TCF ou TEF.
                </div>
              </div>
            )}

          {!loading &&
            !message &&
            results.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: "18px",
                }}
              >
                {results.map((result) => {
                  const expressionScore =
                    getExpressionScore(result);

                  return (
                    <div
                      key={result.id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e4ddd2",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow:
                          "0 6px 18px rgba(13,27,42,0.06)",
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
                        <div>
                          <div
                            style={{
                              color: "#c9a84c",
                              fontSize: "12px",
                              fontWeight: "700",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                            }}
                          >
                            Résultat du test
                          </div>

                          <h2
                            style={{
                              margin: "5px 0 0",
                              color: "#0d1b2a",
                              fontSize: "21px",
                              fontFamily:
                                "Playfair Display, Georgia, serif",
                            }}
                          >
                            {formatTestType(result.test_type)}
                          </h2>
                        </div>

                        <div
                          style={{
                            color: "#667085",
                            fontSize: "13px",
                          }}
                        >
                          {formatDate(result.completed_at)}
                        </div>
                      </div>

                      {result.test_type ===
                      "expression_ecrite" ? (
                        <div>
                          <div
                            style={{
                              background:
                                result.grading_status ===
                                "graded"
                                  ? "#f0fdf4"
                                  : "#fff8df",
                              borderRadius: "12px",
                              padding: "22px",
                              textAlign: "center",
                              border:
                                result.grading_status ===
                                "graded"
                                  ? "1px solid #bbf7d0"
                                  : "1px solid #ead9a7",
                            }}
                          >
                            <div
                              style={{
                                color: "#667085",
                                fontSize: "13px",
                                marginBottom: "8px",
                              }}
                            >
                              Note finale
                            </div>

                            {expressionScore !== null ? (
                              <>
                                <div
                                  style={{
                                    color: "#0d1b2a",
                                    fontSize: "32px",
                                    fontWeight: "700",
                                  }}
                                >
                                  {expressionScore} / 3
                                </div>

                                <div
                                  style={{
                                    marginTop: "8px",
                                    color: "#16803c",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                  }}
                                >
                                  ✓ Corrigé
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    color: "#c9a84c",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                  }}
                                >
                                  À corriger
                                </div>

                                <div
                                  style={{
                                    marginTop: "8px",
                                    color: "#667085",
                                    fontSize: "13px",
                                  }}
                                >
                                  Votre correction est en attente.
                                </div>
                              </>
                            )}
                          </div>

                          {expressionScore !== null && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(3, 1fr)",
                                gap: "10px",
                                marginTop: "12px",
                              }}
                            >
                              <div
                                style={{
                                  background: "#f8f4ee",
                                  borderRadius: "10px",
                                  padding: "12px",
                                  textAlign: "center",
                                }}
                              >
                                <div
                                  style={{
                                    color: "#667085",
                                    fontSize: "12px",
                                  }}
                                >
                                  Tâche 1
                                </div>

                                <strong
                                  style={{
                                    color: "#0d1b2a",
                                    fontSize: "18px",
                                  }}
                                >
                                  {result.grading_task1} / 1
                                </strong>
                              </div>

                              <div
                                style={{
                                  background: "#f8f4ee",
                                  borderRadius: "10px",
                                  padding: "12px",
                                  textAlign: "center",
                                }}
                              >
                                <div
                                  style={{
                                    color: "#667085",
                                    fontSize: "12px",
                                  }}
                                >
                                  Tâche 2
                                </div>

                                <strong
                                  style={{
                                    color: "#0d1b2a",
                                    fontSize: "18px",
                                  }}
                                >
                                  {result.grading_task2} / 1
                                </strong>
                              </div>

                              <div
                                style={{
                                  background: "#f8f4ee",
                                  borderRadius: "10px",
                                  padding: "12px",
                                  textAlign: "center",
                                }}
                              >
                                <div
                                  style={{
                                    color: "#667085",
                                    fontSize: "12px",
                                  }}
                                >
                                  Tâche 3
                                </div>

                                <strong
                                  style={{
                                    color: "#0d1b2a",
                                    fontSize: "18px",
                                  }}
                                >
                                  {result.grading_task3} / 1
                                </strong>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              background: "#f8f4ee",
                              borderRadius: "12px",
                              padding: "18px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#667085",
                                fontSize: "13px",
                                marginBottom: "6px",
                              }}
                            >
                              Score
                            </div>

                            <div
                              style={{
                                color: "#0d1b2a",
                                fontSize: "28px",
                                fontWeight: "700",
                              }}
                            >
                              {result.score} /{" "}
                              {result.total_questions}
                            </div>
                          </div>

                          <div
                            style={{
                              background: "#fff8df",
                              borderRadius: "12px",
                              padding: "18px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#667085",
                                fontSize: "13px",
                                marginBottom: "6px",
                              }}
                            >
                              Pourcentage
                            </div>

                            <div
                              style={{
                                color: "#c9a84c",
                                fontSize: "28px",
                                fontWeight: "700",
                              }}
                            >
                              {result.percentage}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#0d1b2a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ← Retour à mon espace étudiant
          </button>
        </div>
      </div>
    </div>
  );
}