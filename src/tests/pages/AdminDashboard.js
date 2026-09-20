import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [savingGrade, setSavingGrade] = useState(false);

  const [gradeTask1, setGradeTask1] = useState("");
  const [gradeTask2, setGradeTask2] = useState("");
  const [gradeTask3, setGradeTask3] = useState("");

  // =========================================================
  // INITIAL ADMIN CHECK + INITIAL DATA LOAD
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const initializeAdmin = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

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

        // IMPORTANT:
        // admin_profiles has ONLY:
        // id, email, created_at
        //
        // There is NO user_id column.
        const { data: adminProfile, error: adminError } =
          await supabase
            .from("admin_profiles")
            .select("id, email, created_at")
            .eq("id", user.id)
            .maybeSingle();

        if (adminError) {
          throw adminError;
        }

        if (!adminProfile) {
          if (mounted) {
            setErrorMessage(
              "Accès refusé. Vous n'avez pas les droits d'administration."
            );
            setLoading(false);
          }
          return;
        }

        const { data: studentData, error: studentsError } =
          await supabase
            .from("student_profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (studentsError) {
          throw studentsError;
        }

        const { data: resultData, error: resultsError } =
          await supabase
            .from("test_results")
            .select("*")
            .order("completed_at", { ascending: false });

        if (resultsError) {
          throw resultsError;
        }

        if (mounted) {
          setStudents(studentData || []);
          setResults(resultData || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur initialisation administration :", error);

        if (mounted) {
          setErrorMessage(
            error?.message ||
              "Impossible de charger l'espace administration."
          );
          setLoading(false);
        }
      }
    };

    initializeAdmin();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // =========================================================
  // LOAD ALL DATA
  // =========================================================

  const loadStudents = async () => {
    try {
      setErrorMessage("");

      const { data: studentData, error: studentsError } =
        await supabase
          .from("student_profiles")
          .select("*")
          .order("created_at", { ascending: false });

      if (studentsError) {
        throw studentsError;
      }

      const { data: resultData, error: resultsError } =
        await supabase
          .from("test_results")
          .select("*")
          .order("completed_at", { ascending: false });

      if (resultsError) {
        throw resultsError;
      }

      setStudents(studentData || []);
      setResults(resultData || []);
    } catch (error) {
      console.error("Erreur chargement :", error);

      setErrorMessage(
        error?.message ||
          "Impossible de charger les données des étudiants."
      );
    }
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setErrorMessage("");
      setSuccessMessage("");

      await loadStudents();

      if (selectedStudent) {
        await loadStudentResults(selectedStudent);
      }

      setSuccessMessage("Données actualisées.");
    } catch (error) {
      console.error("Erreur actualisation :", error);

      setErrorMessage(
        error?.message ||
          "Impossible d'actualiser les données."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =========================================================
  // LOAD SELECTED STUDENT RESULTS
  // =========================================================

  const loadStudentResults = async (student) => {
    try {
      setStudentLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // student_profiles.id is the authenticated student's UUID.
      const studentId = student?.user_id || student?.id;

      if (!studentId) {
        throw new Error(
          "Impossible d'identifier cet étudiant."
        );
      }

      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("student_id", studentId)
        .order("completed_at", { ascending: false });

      if (error) {
        throw error;
      }

      const loadedResults = data || [];

      setStudentResults(loadedResults);

      const expressionResult = loadedResults.find(
        (result) =>
          result.test_type === "expression_ecrite"
      );

      if (expressionResult) {
        setGradeTask1(
          expressionResult.grading_task1 === null ||
            expressionResult.grading_task1 === undefined
            ? ""
            : String(expressionResult.grading_task1)
        );

        setGradeTask2(
          expressionResult.grading_task2 === null ||
            expressionResult.grading_task2 === undefined
            ? ""
            : String(expressionResult.grading_task2)
        );

        setGradeTask3(
          expressionResult.grading_task3 === null ||
            expressionResult.grading_task3 === undefined
            ? ""
            : String(expressionResult.grading_task3)
        );
      } else {
        setGradeTask1("");
        setGradeTask2("");
        setGradeTask3("");
      }
    } catch (error) {
      console.error(
        "Erreur chargement résultats étudiant :",
        error
      );

      setErrorMessage(
        error?.message ||
          "Impossible de charger les résultats de cet étudiant."
      );

      setStudentResults([]);
    } finally {
      setStudentLoading(false);
    }
  };

  // =========================================================
  // OPEN STUDENT
  // =========================================================

  const openStudent = async (student) => {
    setSelectedStudent(student);
    await loadStudentResults(student);
  };

  // =========================================================
  // CLOSE STUDENT
  // =========================================================

  const closeStudent = () => {
    setSelectedStudent(null);
    setStudentResults([]);

    setGradeTask1("");
    setGradeTask2("");
    setGradeTask3("");

    setErrorMessage("");
    setSuccessMessage("");
  };

  // =========================================================
  // UPDATE ACCOUNT STATUS
  // =========================================================

  const updateStudentStatus = async (student, newStatus) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const { error } = await supabase
        .from("student_profiles")
        .update({
          status: newStatus,
        })
        .eq("id", student.id);

      if (error) {
        throw error;
      }

      const updatedStudent = {
        ...student,
        status: newStatus,
      };

      setStudents((current) =>
        current.map((item) =>
          item.id === student.id
            ? updatedStudent
            : item
        )
      );

      if (
        selectedStudent &&
        selectedStudent.id === student.id
      ) {
        setSelectedStudent(updatedStudent);
      }

      setSuccessMessage(
        `Statut du compte mis à jour : ${newStatus}.`
      );
    } catch (error) {
      console.error(
        "Erreur mise à jour statut :",
        error
      );

      setErrorMessage(
        error?.message ||
          "Impossible de modifier le statut de l'étudiant."
      );
    }
  };

  // =========================================================
  // UPDATE PAYMENT STATUS
  // =========================================================

  const updatePaymentStatus = async (
    student,
    newPaymentStatus
  ) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const { error } = await supabase
        .from("student_profiles")
        .update({
          payment_status: newPaymentStatus,
        })
        .eq("id", student.id);

      if (error) {
        throw error;
      }

      const updatedStudent = {
        ...student,
        payment_status: newPaymentStatus,
      };

      setStudents((current) =>
        current.map((item) =>
          item.id === student.id
            ? updatedStudent
            : item
        )
      );

      if (
        selectedStudent &&
        selectedStudent.id === student.id
      ) {
        setSelectedStudent(updatedStudent);
      }

      setSuccessMessage(
        `Statut de paiement mis à jour : ${newPaymentStatus}.`
      );
    } catch (error) {
      console.error(
        "Erreur mise à jour paiement :",
        error
      );

      setErrorMessage(
        error?.message ||
          "Impossible de modifier le statut de paiement."
      );
    }
  };

  // =========================================================
  // SAVE EXPRESSION GRADE
  // =========================================================

  const saveExpressionGrade = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (!selectedStudent) {
        setErrorMessage("Aucun étudiant sélectionné.");
        return;
      }

      if (
        gradeTask1 === "" ||
        gradeTask2 === "" ||
        gradeTask3 === ""
      ) {
        setErrorMessage(
          "Veuillez attribuer une note aux trois tâches."
        );
        return;
      }

      const task1 = Number(gradeTask1);
      const task2 = Number(gradeTask2);
      const task3 = Number(gradeTask3);

      if (
        ![0, 1].includes(task1) ||
        ![0, 1].includes(task2) ||
        ![0, 1].includes(task3)
      ) {
        setErrorMessage(
          "Chaque tâche doit recevoir une note de 0 ou 1."
        );
        return;
      }

      const expressionResult = studentResults.find(
        (result) =>
          result.test_type === "expression_ecrite"
      );

      if (!expressionResult) {
        setErrorMessage(
          "Aucune réponse d'expression écrite trouvée."
        );
        return;
      }

      const total = task1 + task2 + task3;

      setSavingGrade(true);

      const { data: updatedResult, error } =
        await supabase
          .from("test_results")
          .update({
            grading_task1: task1,
            grading_task2: task2,
            grading_task3: task3,
            grading_total: total,
            grading_status: "graded",
            graded_at: new Date().toISOString(),
          })
          .eq("id", expressionResult.id)
          .select("*")
          .single();

      if (error) {
        throw error;
      }

      setStudentResults((current) =>
        current.map((result) =>
          result.id === expressionResult.id
            ? updatedResult
            : result
        )
      );

      setResults((current) =>
        current.map((result) =>
          result.id === expressionResult.id
            ? updatedResult
            : result
        )
      );

      setSuccessMessage(
        `Expression écrite corrigée : ${total}/3.`
      );
    } catch (error) {
      console.error(
        "Erreur correction expression écrite :",
        error
      );

      setErrorMessage(
        error?.message ||
          "Impossible d'enregistrer la correction."
      );
    } finally {
      setSavingGrade(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      navigate("/student-login", {
        replace: true,
      });
    } catch (error) {
      console.error("Erreur déconnexion :", error);

      setErrorMessage(
        error?.message ||
          "Impossible de vous déconnecter."
      );
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStudentName = (student) =>
    student?.full_name ||
    student?.name ||
    student?.email ||
    "Étudiant";

  const getStudentPayment = (student) =>
    student?.payment_status || "pending";

  const getStudentStatus = (student) =>
    student?.status || "pending";

  const getStatusLabel = (status) => {
    if (status === "approved") return "Approuvé";
    if (status === "rejected") return "Refusé";
    return "En attente";
  };

  const getPaymentLabel = (payment) => {
    if (payment === "paid") return "💳 Payé";
    if (payment === "unpaid") return "💳 Non payé";
    return "💳 En attente";
  };

  const getStudentId = (student) =>
    student?.user_id || student?.id;

  const getLatestResult = (student, testType) => {
    const studentId = getStudentId(student);

    return (
      results.find(
        (result) =>
          result.student_id === studentId &&
          result.test_type === testType
      ) || null
    );
  };

  const getStudentTestCount = (student) => {
    const studentId = getStudentId(student);

    return results.filter(
      (result) =>
        result.student_id === studentId
    ).length;
  };

  const isStudentCompleted = (student) => {
    const oral = getLatestResult(
      student,
      "comprehension_orale"
    );

    const written = getLatestResult(
      student,
      "comprehension_ecrite"
    );

    const expression = getLatestResult(
      student,
      "expression_ecrite"
    );

    return Boolean(
      oral &&
        written &&
        expression &&
        expression.grading_status === "graded"
    );
  };

  // =========================================================
  // FILTERED STUDENTS
  // =========================================================

  const filteredStudents = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return students.filter((student) => {
      const name = (
        student.full_name ||
        student.name ||
        ""
      ).toLowerCase();

      const email = (
        student.email || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        getStudentStatus(student) === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        getStudentPayment(student) === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    students,
    searchQuery,
    statusFilter,
    paymentFilter,
  ]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics = useMemo(() => {
    const total = students.length;

    const approved = students.filter(
      (student) =>
        getStudentStatus(student) === "approved"
    ).length;

    const pending = students.filter(
      (student) =>
        getStudentStatus(student) === "pending"
    ).length;

    const rejected = students.filter(
      (student) =>
        getStudentStatus(student) === "rejected"
    ).length;

    const paid = students.filter(
      (student) =>
        getStudentPayment(student) === "paid"
    ).length;

    const unpaid = students.filter(
      (student) =>
        getStudentPayment(student) !== "paid"
    ).length;

    const completed = students.filter(
      (student) => isStudentCompleted(student)
    ).length;

    return {
      total,
      approved,
      pending,
      rejected,
      paid,
      unpaid,
      completed,
    };
  }, [students, results]);

  // =========================================================
  // SELECTED STUDENT RESULTS
  // =========================================================

  const selectedOralResult = useMemo(
    () =>
      studentResults.find(
        (result) =>
          result.test_type ===
          "comprehension_orale"
      ) || null,
    [studentResults]
  );

  const selectedWrittenResult = useMemo(
    () =>
      studentResults.find(
        (result) =>
          result.test_type ===
          "comprehension_ecrite"
      ) || null,
    [studentResults]
  );

  const selectedExpressionResult = useMemo(
    () =>
      studentResults.find(
        (result) =>
          result.test_type ===
          "expression_ecrite"
      ) || null,
    [studentResults]
  );

  const selectedComprehensionSummary =
    useMemo(() => {
      const completed = [
        selectedOralResult,
        selectedWrittenResult,
      ].filter(Boolean);

      if (completed.length === 0) {
        return null;
      }

      const totalScore = completed.reduce(
        (sum, result) =>
          sum + Number(result.score || 0),
        0
      );

      const totalQuestions = completed.reduce(
        (sum, result) =>
          sum +
          Number(result.total_questions || 0),
        0
      );

      const percentage =
        totalQuestions > 0
          ? Math.round(
              (totalScore / totalQuestions) * 100
            )
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
        totalScore,
        totalQuestions,
        percentage,
        level,
      };
    }, [
      selectedOralResult,
      selectedWrittenResult,
    ]);

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={styles.loadingLogo}
          />

          <h1 style={styles.loadingTitle}>
            International French Academy
          </h1>

          <p style={styles.loadingText}>
            Vérification des accès administration...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ACCESS DENIED / INITIAL ERROR
  // =========================================================

  if (
    errorMessage &&
    students.length === 0 &&
    !selectedStudent
  ) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.errorCard}>
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={styles.loadingLogo}
          />

          <h1 style={styles.loadingTitle}>
            International French Academy
          </h1>

          <div style={styles.adminAccessTitle}>
            Accès administration
          </div>

          <div style={styles.errorBox}>
            {errorMessage}
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.primaryButton}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN INTERFACE
  // =========================================================
    return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header style={styles.header}>
          <div style={styles.brandArea}>
            <img
              src="/IFA logo.jpg"
              alt="International French Academy"
              style={styles.headerLogo}
            />

            <div>
              <div style={styles.brandName}>
                International French Academy
              </div>

              <div style={styles.brandSubtitle}>
                Administration
              </div>
            </div>
          </div>

          <div style={styles.headerActions}>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              style={styles.secondaryButton}
            >
              {refreshing
                ? "↻ Actualisation..."
                : "↻ Actualiser"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* =====================================================
            MESSAGES
        ===================================================== */}

        {errorMessage && (
          <div style={styles.errorBanner}>
            <span>⚠</span>
            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              style={styles.messageClose}
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div style={styles.successBanner}>
            <span>✓</span>
            <span>{successMessage}</span>

            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              style={styles.messageClose}
            >
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            STUDENT DETAIL
        ===================================================== */}

        {selectedStudent ? (
          <section style={styles.detailSection}>

            <button
              type="button"
              onClick={closeStudent}
              style={styles.backButton}
            >
              ← Retour aux étudiants
            </button>

            {/* STUDENT HEADER */}

            <div style={styles.detailHeader}>
              <div>
                <div style={styles.detailEyebrow}>
                  DOSSIER ÉTUDIANT
                </div>

                <h1 style={styles.detailName}>
                  {getStudentName(selectedStudent)}
                </h1>

                <div style={styles.detailEmail}>
                  {selectedStudent.email || "—"}
                </div>

                <div style={styles.detailDate}>
                  Inscrit le{" "}
                  {formatDate(
                    selectedStudent.created_at
                  )}
                </div>
              </div>

              <div style={styles.detailBadges}>
                <span
                  style={{
                    ...styles.badge,
                    ...(getStudentStatus(
                      selectedStudent
                    ) === "approved"
                      ? styles.badgeApproved
                      : getStudentStatus(
                          selectedStudent
                        ) === "rejected"
                      ? styles.badgeRejected
                      : styles.badgePending),
                  }}
                >
                  {getStatusLabel(
                    getStudentStatus(selectedStudent)
                  )}
                </span>

                <span
                  style={{
                    ...styles.badge,
                    ...(getStudentPayment(
                      selectedStudent
                    ) === "paid"
                      ? styles.badgePaid
                      : styles.badgePending),
                  }}
                >
                  {getPaymentLabel(
                    getStudentPayment(selectedStudent)
                  )}
                </span>
              </div>
            </div>

            {/* =================================================
                ADMINISTRATION
            ================================================= */}

            <div style={styles.adminCard}>
              <div style={styles.sectionTitle}>
                ADMINISTRATION
              </div>

              <div style={styles.controlGrid}>

                <div style={styles.controlBlock}>
                  <label style={styles.label}>
                    Statut du compte
                  </label>

                  <select
                    value={getStudentStatus(
                      selectedStudent
                    )}
                    onChange={(event) =>
                      updateStudentStatus(
                        selectedStudent,
                        event.target.value
                      )
                    }
                    style={styles.select}
                  >
                    <option value="pending">
                      En attente
                    </option>

                    <option value="approved">
                      Approuvé
                    </option>

                    <option value="rejected">
                      Refusé
                    </option>
                  </select>
                </div>

                <div style={styles.controlBlock}>
                  <label style={styles.label}>
                    Statut du paiement
                  </label>

                  <select
                    value={getStudentPayment(
                      selectedStudent
                    )}
                    onChange={(event) =>
                      updatePaymentStatus(
                        selectedStudent,
                        event.target.value
                      )
                    }
                    style={styles.select}
                  >
                    <option value="pending">
                      En attente
                    </option>

                    <option value="paid">
                      Payé
                    </option>

                    <option value="unpaid">
                      Non payé
                    </option>
                  </select>
                </div>
              </div>

              <div style={styles.accessNotice}>
                <strong>Accès aux tests :</strong>{" "}
                l'étudiant doit être{" "}
                <strong>approuvé</strong> et{" "}
                <strong>payé</strong>.
              </div>
            </div>

            {/* =================================================
                RESULTS
            ================================================= */}

            {studentLoading ? (
              <div style={styles.loadingCardSmall}>
                <div style={styles.spinner}>
                  ↻
                </div>

                <p>
                  Chargement des résultats...
                </p>
              </div>
            ) : (
              <>
                <div style={styles.sectionHeading}>
                  Résultats des tests
                </div>

                {/* COMPREHENSION SUMMARY */}

                {selectedComprehensionSummary && (
                  <div style={styles.summaryCard}>
                    <div>
                      <div style={styles.summaryLabel}>
                        PERFORMANCE EN COMPRÉHENSION
                      </div>

                      <div style={styles.summaryScore}>
                        {
                          selectedComprehensionSummary.totalScore
                        }
                        /
                        {
                          selectedComprehensionSummary.totalQuestions
                        }
                      </div>
                    </div>

                    <div style={styles.summaryRight}>
                      <div style={styles.summaryPercentage}>
                        {
                          selectedComprehensionSummary.percentage
                        }%
                      </div>

                      <div style={styles.summaryLevel}>
                        Niveau indicatif{" "}
                        <strong>
                          {
                            selectedComprehensionSummary.level
                          }
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* RESULT CARDS */}

                <div style={styles.resultsGrid}>

                  {/* ORAL */}

                  <div style={styles.resultCard}>
                    <div style={styles.resultCardHeader}>
                      <div>
                        <div style={styles.resultIcon}>
                          🎧
                        </div>

                        <h3 style={styles.resultTitle}>
                          Compréhension orale
                        </h3>
                      </div>

                      {selectedOralResult && (
                        <span
                          style={styles.completedBadge}
                        >
                          ✓ Terminé
                        </span>
                      )}
                    </div>

                    {selectedOralResult ? (
                      <>
                        <div style={styles.bigScore}>
                          {selectedOralResult.score}
                          <span>
                            /
                            {
                              selectedOralResult.total_questions
                            }
                          </span>
                        </div>

                        <div style={styles.percentage}>
                          {
                            selectedOralResult.percentage
                          }%
                        </div>

                        <div style={styles.resultDate}>
                          {formatDateTime(
                            selectedOralResult.completed_at
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={styles.notCompleted}>
                        Test non terminé
                      </div>
                    )}
                  </div>

                  {/* WRITTEN */}

                  <div style={styles.resultCard}>
                    <div style={styles.resultCardHeader}>
                      <div>
                        <div style={styles.resultIcon}>
                          📖
                        </div>

                        <h3 style={styles.resultTitle}>
                          Compréhension écrite
                        </h3>
                      </div>

                      {selectedWrittenResult && (
                        <span
                          style={styles.completedBadge}
                        >
                          ✓ Terminé
                        </span>
                      )}
                    </div>

                    {selectedWrittenResult ? (
                      <>
                        <div style={styles.bigScore}>
                          {selectedWrittenResult.score}
                          <span>
                            /
                            {
                              selectedWrittenResult.total_questions
                            }
                          </span>
                        </div>

                        <div style={styles.percentage}>
                          {
                            selectedWrittenResult.percentage
                          }%
                        </div>

                        <div style={styles.resultDate}>
                          {formatDateTime(
                            selectedWrittenResult.completed_at
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={styles.notCompleted}>
                        Test non terminé
                      </div>
                    )}
                  </div>

                  {/* EXPRESSION */}

                  <div style={styles.resultCard}>
                    <div style={styles.resultCardHeader}>
                      <div>
                        <div style={styles.resultIcon}>
                          ✍️
                        </div>

                        <h3 style={styles.resultTitle}>
                          Expression écrite
                        </h3>
                      </div>

                      {selectedExpressionResult?.grading_status ===
                        "graded" && (
                        <span
                          style={styles.completedBadge}
                        >
                          ✓ Corrigé
                        </span>
                      )}
                    </div>

                    {selectedExpressionResult ? (
                      <>
                        <div style={styles.bigScore}>
                          {
                            selectedExpressionResult.grading_total ??
                            "—"
                          }
                          <span>/3</span>
                        </div>

                        <div style={styles.resultDate}>
                          {selectedExpressionResult.grading_status ===
                          "graded"
                            ? `Corrigé le ${formatDate(
                                selectedExpressionResult.graded_at
                              )}`
                            : "Correction en attente"}
                        </div>
                      </>
                    ) : (
                      <div style={styles.notCompleted}>
                        Test non terminé
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================================
                    EXPRESSION ANSWERS + GRADING
                ================================================= */}

                {selectedExpressionResult && (
                  <div style={styles.expressionSection}>

                    <div style={styles.sectionHeading}>
                      Expression écrite — Correction
                    </div>

                    <div style={styles.expressionCard}>

                      {/* TASK 1 */}

                      <div style={styles.taskCard}>
                        <div style={styles.taskHeader}>
                          <span style={styles.taskNumber}>
                            1
                          </span>

                          <div>
                            <div style={styles.taskTitle}>
                              Tâche 1
                            </div>

                            <div
                              style={
                                styles.taskInstruction
                              }
                            >
                              Production écrite
                            </div>
                          </div>
                        </div>

                        <div style={styles.answerBox}>
                          {selectedExpressionResult.task1_answer ||
                            "Aucune réponse."}
                        </div>

                        <div style={styles.gradeRow}>
                          <label style={styles.gradeLabel}>
                            Note
                          </label>

                          <select
                            value={gradeTask1}
                            onChange={(event) =>
                              setGradeTask1(
                                event.target.value
                              )
                            }
                            style={styles.gradeSelect}
                          >
                            <option value="">
                              Choisir
                            </option>

                            <option value="0">
                              0 / 1
                            </option>

                            <option value="1">
                              1 / 1
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* TASK 2 */}

                      <div style={styles.taskCard}>
                        <div style={styles.taskHeader}>
                          <span style={styles.taskNumber}>
                            2
                          </span>

                          <div>
                            <div style={styles.taskTitle}>
                              Tâche 2
                            </div>

                            <div
                              style={
                                styles.taskInstruction
                              }
                            >
                              Production écrite
                            </div>
                          </div>
                        </div>

                        <div style={styles.answerBox}>
                          {selectedExpressionResult.task2_answer ||
                            "Aucune réponse."}
                        </div>

                        <div style={styles.gradeRow}>
                          <label style={styles.gradeLabel}>
                            Note
                          </label>

                          <select
                            value={gradeTask2}
                            onChange={(event) =>
                              setGradeTask2(
                                event.target.value
                              )
                            }
                            style={styles.gradeSelect}
                          >
                            <option value="">
                              Choisir
                            </option>

                            <option value="0">
                              0 / 1
                            </option>

                            <option value="1">
                              1 / 1
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* TASK 3 */}

                      <div style={styles.taskCard}>
                        <div style={styles.taskHeader}>
                          <span style={styles.taskNumber}>
                            3
                          </span>

                          <div>
                            <div style={styles.taskTitle}>
                              Tâche 3
                            </div>

                            <div
                              style={
                                styles.taskInstruction
                              }
                            >
                              Production écrite
                            </div>
                          </div>
                        </div>

                        <div style={styles.answerBox}>
                          {selectedExpressionResult.task3_answer ||
                            "Aucune réponse."}
                        </div>

                        <div style={styles.gradeRow}>
                          <label style={styles.gradeLabel}>
                            Note
                          </label>

                          <select
                            value={gradeTask3}
                            onChange={(event) =>
                              setGradeTask3(
                                event.target.value
                              )
                            }
                            style={styles.gradeSelect}
                          >
                            <option value="">
                              Choisir
                            </option>

                            <option value="0">
                              0 / 1
                            </option>

                            <option value="1">
                              1 / 1
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* GRADING TOTAL */}

                      <div style={styles.gradingFooter}>
                        <div>
                          <div
                            style={
                              styles.gradingTotalLabel
                            }
                          >
                            NOTE FINALE
                          </div>

                          <div
                            style={styles.gradingTotal}
                          >
                            {(Number(gradeTask1) || 0) +
                              (Number(gradeTask2) || 0) +
                              (Number(gradeTask3) || 0)}
                            <span>/3</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={saveExpressionGrade}
                          disabled={
                            savingGrade ||
                            gradeTask1 === "" ||
                            gradeTask2 === "" ||
                            gradeTask3 === ""
                          }
                          style={{
                            ...styles.saveButton,
                            opacity:
                              savingGrade ||
                              gradeTask1 === "" ||
                              gradeTask2 === "" ||
                              gradeTask3 === ""
                                ? 0.55
                                : 1,
                            cursor:
                              savingGrade ||
                              gradeTask1 === "" ||
                              gradeTask2 === "" ||
                              gradeTask3 === ""
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {savingGrade
                            ? "Enregistrement..."
                            : "✓ Enregistrer la correction"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedOralResult &&
                  !selectedWrittenResult &&
                  !selectedExpressionResult && (
                    <div style={styles.emptyResults}>
                      <div style={styles.emptyIcon}>
                        📋
                      </div>

                      <h3 style={styles.emptyTitle}>
                        Aucun résultat
                      </h3>

                      <p style={styles.emptyText}>
                        Cet étudiant n'a encore terminé
                        aucun test.
                      </p>
                    </div>
                  )}

                {selectedComprehensionSummary && (
                  <div style={styles.disclaimer}>
                    <strong>
                      Note administrative :
                    </strong>{" "}
                    le niveau affiché est indicatif et
                    basé sur les résultats de
                    compréhension. Il ne constitue pas
                    un niveau officiel TCF ou TEF.
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <>
            {/* =================================================
                DASHBOARD
            ================================================= */}

            <section style={styles.hero}>
              <div>
                <div style={styles.heroEyebrow}>
                  ESPACE ADMINISTRATEUR
                </div>

                <h1 style={styles.heroTitle}>
                  Gestion des étudiants
                </h1>

                <p style={styles.heroText}>
                  Consultez les inscriptions, gérez les
                  approbations et suivez les résultats des
                  tests de niveau.
                </p>
              </div>

              <div style={styles.heroMark}>
                IFA
              </div>
            </section>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <section style={styles.statsGrid}>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  👥
                </div>

                <div>
                  <div style={styles.statLabel}>
                    ÉTUDIANTS
                  </div>

                  <div style={styles.statValue}>
                    {statistics.total}
                  </div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  ✓
                </div>

                <div>
                  <div style={styles.statLabel}>
                    APPROUVÉS
                  </div>

                  <div style={styles.statValue}>
                    {statistics.approved}
                  </div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  ⏳
                </div>

                <div>
                  <div style={styles.statLabel}>
                    EN ATTENTE
                  </div>

                  <div style={styles.statValue}>
                    {statistics.pending}
                  </div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  💳
                </div>

                <div>
                  <div style={styles.statLabel}>
                    PAYÉS
                  </div>

                  <div style={styles.statValue}>
                    {statistics.paid}
                  </div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  🎓
                </div>

                <div>
                  <div style={styles.statLabel}>
                    TESTS COMPLETS
                  </div>

                  <div style={styles.statValue}>
                    {statistics.completed}
                  </div>
                </div>
              </div>

            </section>

            {/* =================================================
                FILTERS
            ================================================= */}

            <section style={styles.filterCard}>
              <div style={styles.filterTop}>
                <div>
                  <div style={styles.sectionTitle}>
                    ÉTUDIANTS
                  </div>

                  <div style={styles.filterCount}>
                    {filteredStudents.length} étudiant
                    {filteredStudents.length !== 1
                      ? "s"
                      : ""}
                  </div>
                </div>

                <div style={styles.filterActions}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Rechercher un étudiant..."
                    style={styles.searchInput}
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    style={styles.filterSelect}
                  >
                    <option value="all">
                      Tous les statuts
                    </option>

                    <option value="pending">
                      En attente
                    </option>

                    <option value="approved">
                      Approuvés
                    </option>

                    <option value="rejected">
                      Refusés
                    </option>
                  </select>

                  <select
                    value={paymentFilter}
                    onChange={(event) =>
                      setPaymentFilter(
                        event.target.value
                      )
                    }
                    style={styles.filterSelect}
                  >
                    <option value="all">
                      Tous les paiements
                    </option>

                    <option value="paid">
                      Payés
                    </option>

                    <option value="pending">
                      Paiement en attente
                    </option>

                    <option value="unpaid">
                      Non payés
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* =================================================
                STUDENT TABLE
            ================================================= */}

            <section style={styles.tableCard}>
              {filteredStudents.length === 0 ? (
                <div style={styles.emptyStudents}>
                  <div style={styles.emptyIcon}>
                    🔎
                  </div>

                  <h3 style={styles.emptyTitle}>
                    Aucun étudiant trouvé
                  </h3>

                  <p style={styles.emptyText}>
                    Essayez de modifier votre recherche
                    ou vos filtres.
                  </p>
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>
                          ÉTUDIANT
                        </th>

                        <th style={styles.th}>
                          INSCRIPTION
                        </th>

                        <th style={styles.th}>
                          STATUT
                        </th>

                        <th style={styles.th}>
                          PAIEMENT
                        </th>

                        <th style={styles.th}>
                          TESTS
                        </th>

                        <th style={styles.th}>
                          ACTION
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudents.map(
                        (student) => {
                          const testCount =
                            getStudentTestCount(
                              student
                            );

                          const completed =
                            isStudentCompleted(
                              student
                            );

                          return (
                            <tr
                              key={student.id}
                              style={styles.tr}
                            >
                              <td style={styles.td}>
                                <div
                                  style={
                                    styles.studentCell
                                  }
                                >
                                  <div
                                    style={
                                      styles.avatar
                                    }
                                  >
                                    {(
                                      student.full_name ||
                                      student.name ||
                                      student.email ||
                                      "E"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <div
                                      style={
                                        styles.studentName
                                      }
                                    >
                                      {getStudentName(
                                        student
                                      )}
                                    </div>

                                    <div
                                      style={
                                        styles.studentEmail
                                      }
                                    >
                                      {student.email ||
                                        "—"}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td style={styles.td}>
                                <span
                                  style={
                                    styles.dateText
                                  }
                                >
                                  {formatDate(
                                    student.created_at
                                  )}
                                </span>
                              </td>

                              <td style={styles.td}>
                                <span
                                  style={{
                                    ...styles.badge,
                                    ...(getStudentStatus(
                                      student
                                    ) === "approved"
                                      ? styles.badgeApproved
                                      : getStudentStatus(
                                          student
                                        ) === "rejected"
                                      ? styles.badgeRejected
                                      : styles.badgePending),
                                  }}
                                >
                                  {getStatusLabel(
                                    getStudentStatus(
                                      student
                                    )
                                  )}
                                </span>
                              </td>

                              <td style={styles.td}>
                                <span
                                  style={{
                                    ...styles.badge,
                                    ...(getStudentPayment(
                                      student
                                    ) === "paid"
                                      ? styles.badgePaid
                                      : styles.badgePending),
                                  }}
                                >
                                  {getPaymentLabel(
                                    getStudentPayment(
                                      student
                                    )
                                  )}
                                </span>
                              </td>

                              <td style={styles.td}>
                                <div
                                  style={
                                    styles.testsCell
                                  }
                                >
                                  <span
                                    style={
                                      styles.testsNumber
                                    }
                                  >
                                    {testCount}
                                  </span>

                                  {completed ? (
                                    <span
                                      style={
                                        styles.completeText
                                      }
                                    >
                                      ✓ Complet
                                    </span>
                                  ) : (
                                    <span
                                      style={
                                        styles.incompleteText
                                      }
                                    >
                                      En cours
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td style={styles.td}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openStudent(
                                      student
                                    )
                                  }
                                  style={
                                    styles.viewButton
                                  }
                                >
                                  Voir le dossier →
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer style={styles.footer}>
              <div>
                <strong>
                  International French Academy
                </strong>

                <span>
                  {" "}
                  — Kigali, Rwanda
                </span>
              </div>

              <div style={styles.footerSmall}>
                Administration • Test de niveau
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

// =============================================================
// STYLES
// =============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8f4ee 0%, #f4efe7 50%, #eee7dc 100%)",
    color: "#0d1b2a",
    fontFamily:
      '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "0 20px 50px",
  },

  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  header: {
    minHeight: "82px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    borderBottom:
      "1px solid rgba(13, 27, 42, 0.12)",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  headerLogo: {
    width: "48px",
    height: "48px",
    objectFit: "contain",
    borderRadius: "8px",
  },

  brandName: {
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "20px",
    fontWeight: 700,
  },

  brandSubtitle: {
    marginTop: "2px",
    fontSize: "12px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#8a7444",
    fontWeight: 700,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  secondaryButton: {
    border:
      "1px solid rgba(13, 27, 42, 0.2)",
    background: "#ffffff",
    color: "#0d1b2a",
    borderRadius: "8px",
    padding: "10px 15px",
    fontWeight: 700,
    cursor: "pointer",
  },

  logoutButton: {
    border:
      "1px solid rgba(13, 27, 42, 0.18)",
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 15px",
    fontWeight: 700,
    cursor: "pointer",
  },

  hero: {
    marginTop: "30px",
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    boxShadow:
      "0 12px 35px rgba(13, 27, 42, 0.12)",
  },

  heroEyebrow: {
    color: "#c9a84c",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.2em",
    marginBottom: "9px",
  },

  heroTitle: {
    margin: 0,
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "34px",
    lineHeight: 1.15,
  },

  heroText: {
    margin: "12px 0 0",
    maxWidth: "700px",
    color: "rgba(255,255,255,0.76)",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  heroMark: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    border:
      "1px solid rgba(201,168,76,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#c9a84c",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontWeight: 700,
    fontSize: "22px",
    flexShrink: 0,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "20px",
  },

  statCard: {
    background: "#ffffff",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  statIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#f8f4ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  statLabel: {
    fontSize: "9px",
    letterSpacing: "0.14em",
    fontWeight: 800,
    color: "#7d7d7d",
    marginBottom: "4px",
  },

  statValue: {
    fontSize: "25px",
    fontWeight: 800,
    color: "#0d1b2a",
  },

  filterCard: {
    marginTop: "20px",
    background: "#ffffff",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    borderRadius: "12px",
    padding: "20px",
  },

  filterTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  sectionTitle: {
    fontSize: "10px",
    letterSpacing: "0.18em",
    fontWeight: 800,
    color: "#8a7444",
  },

  filterCount: {
    marginTop: "5px",
    color: "#66707a",
    fontSize: "13px",
  },

  filterActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  searchInput: {
    minWidth: "230px",
    border: "1px solid #d8d3ca",
    background: "#fff",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "13px",
    outline: "none",
  },

  filterSelect: {
    border: "1px solid #d8d3ca",
    background: "#fff",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#0d1b2a",
  },

  tableCard: {
    marginTop: "14px",
    background: "#ffffff",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "920px",
  },

  th: {
    textAlign: "left",
    padding: "14px 18px",
    background: "#f8f4ee",
    borderBottom: "1px solid #e4ded4",
    fontSize: "9px",
    letterSpacing: "0.12em",
    color: "#777",
    fontWeight: 800,
  },

  tr: {
    borderBottom: "1px solid #eeeae4",
  },

  td: {
    padding: "16px 18px",
    verticalAlign: "middle",
    fontSize: "13px",
  },

  studentCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#0d1b2a",
    color: "#c9a84c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },

  studentName: {
    fontWeight: 800,
    color: "#0d1b2a",
  },

  studentEmail: {
    marginTop: "3px",
    color: "#777",
    fontSize: "11px",
  },

  dateText: {
    color: "#59636d",
    fontSize: "12px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px 9px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  badgeApproved: {
    background: "#e5f4ea",
    color: "#176b35",
  },

  badgeRejected: {
    background: "#f8e5e5",
    color: "#9b2c2c",
  },

  badgePending: {
    background: "#f3eee2",
    color: "#80652a",
  },

  badgePaid: {
    background: "#e5f4ea",
    color: "#176b35",
  },

  testsCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  testsNumber: {
    fontWeight: 800,
  },

  completeText: {
    fontSize: "10px",
    color: "#176b35",
    fontWeight: 700,
  },

  incompleteText: {
    fontSize: "10px",
    color: "#8a7444",
    fontWeight: 700,
  },

  viewButton: {
    border: "1px solid #d6c69e",
    background: "#fffaf0",
    color: "#80652a",
    borderRadius: "7px",
    padding: "8px 11px",
    fontWeight: 800,
    fontSize: "11px",
    cursor: "pointer",
  },

  // =========================================================
  // DETAIL
  // =========================================================

  detailSection: {
    paddingTop: "28px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    color: "#80652a",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "13px",
  },

  detailHeader: {
    marginTop: "20px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "28px",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  detailEyebrow: {
    fontSize: "10px",
    letterSpacing: "0.18em",
    fontWeight: 800,
    color: "#8a7444",
    marginBottom: "7px",
  },

  detailName: {
    margin: 0,
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "31px",
  },

  detailEmail: {
    marginTop: "6px",
    color: "#59636d",
    fontSize: "13px",
  },

  detailDate: {
    marginTop: "4px",
    color: "#888",
    fontSize: "11px",
  },

  detailBadges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  adminCard: {
    marginTop: "14px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
  },

  controlGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    marginTop: "15px",
  },

  controlBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "11px",
    fontWeight: 800,
    color: "#59636d",
  },

  select: {
    width: "100%",
    border: "1px solid #d8d3ca",
    background: "#ffffff",
    borderRadius: "8px",
    padding: "11px 12px",
    fontSize: "13px",
    color: "#0d1b2a",
  },

  accessNotice: {
    marginTop: "16px",
    background: "#f8f4ee",
    borderLeft: "3px solid #c9a84c",
    padding: "12px 14px",
    fontSize: "12px",
    color: "#59636d",
    lineHeight: 1.6,
  },

  sectionHeading: {
    marginTop: "28px",
    marginBottom: "12px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "23px",
    fontWeight: 700,
  },

  summaryCard: {
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  summaryLabel: {
    color: "#c9a84c",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.16em",
  },

  summaryScore: {
    marginTop: "6px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "30px",
    fontWeight: 700,
  },

  summaryRight: {
    textAlign: "right",
  },

  summaryPercentage: {
    fontSize: "30px",
    fontWeight: 800,
  },

  summaryLevel: {
    marginTop: "4px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "11px",
  },

  resultsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "14px",
  },

  resultCard: {
    background: "#ffffff",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    borderRadius: "14px",
    padding: "22px",
    minHeight: "190px",
  },

  resultCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
  },

  resultIcon: {
    fontSize: "20px",
    marginBottom: "6px",
  },

  resultTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 800,
  },

  completedBadge: {
    fontSize: "9px",
    fontWeight: 800,
    color: "#176b35",
    background: "#e5f4ea",
    padding: "5px 7px",
    borderRadius: "999px",
    whiteSpace: "nowrap",
  },

  bigScore: {
    marginTop: "24px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "38px",
    fontWeight: 700,
  },

  percentage: {
    marginTop: "-4px",
    color: "#8a7444",
    fontWeight: 800,
    fontSize: "13px",
  },

  resultDate: {
    marginTop: "12px",
    color: "#888",
    fontSize: "10px",
  },

  notCompleted: {
    marginTop: "34px",
    color: "#999",
    fontSize: "12px",
    fontStyle: "italic",
  },

  expressionSection: {
    marginTop: "5px",
  },

  expressionCard: {
    background: "#ffffff",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    borderRadius: "14px",
    padding: "20px",
  },

  taskCard: {
    borderBottom: "1px solid #eeeae4",
    paddingBottom: "22px",
    marginBottom: "22px",
  },

  taskHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  taskNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#0d1b2a",
    color: "#c9a84c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },

  taskTitle: {
    fontWeight: 800,
    fontSize: "14px",
  },

  taskInstruction: {
    marginTop: "2px",
    color: "#888",
    fontSize: "10px",
  },

  answerBox: {
    marginTop: "14px",
    padding: "16px",
    background: "#faf8f4",
    border: "1px solid #e8e2d8",
    borderRadius: "9px",
    color: "#333",
    fontSize: "13px",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    minHeight: "75px",
  },

  gradeRow: {
    marginTop: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
  },

  gradeLabel: {
    fontSize: "11px",
    fontWeight: 800,
    color: "#59636d",
  },

  gradeSelect: {
    border: "1px solid #d8d3ca",
    borderRadius: "7px",
    background: "#ffffff",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  gradingFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingTop: "4px",
  },

  gradingTotalLabel: {
    fontSize: "9px",
    letterSpacing: "0.15em",
    color: "#8a7444",
    fontWeight: 800,
  },

  gradingTotal: {
    marginTop: "2px",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "32px",
    fontWeight: 700,
  },

  saveButton: {
    border: "none",
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px 18px",
    fontWeight: 800,
  },

  disclaimer: {
    marginTop: "18px",
    padding: "14px 16px",
    background: "#fffaf0",
    border: "1px solid #e6d6ad",
    borderRadius: "9px",
    color: "#705b29",
    fontSize: "11px",
    lineHeight: 1.6,
  },

  emptyResults: {
    background: "#ffffff",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    borderRadius: "14px",
    padding: "45px 20px",
    textAlign: "center",
  },

  emptyStudents: {
    padding: "55px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "30px",
    marginBottom: "10px",
  },

  emptyTitle: {
    margin: 0,
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "20px",
  },

  emptyText: {
    margin: "8px 0 0",
    color: "#777",
    fontSize: "12px",
  },

  footer: {
    marginTop: "35px",
    paddingTop: "20px",
    borderTop:
      "1px solid rgba(13, 27, 42, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    color: "#59636d",
    fontSize: "11px",
  },

  footerSmall: {
    color: "#888",
  },

  // =========================================================
  // LOADING / ACCESS
  // =========================================================

  loadingPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8f4ee 0%, #f4efe7 50%, #eee7dc 100%)",
    color: "#0d1b2a",
    fontFamily:
      '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
  },

  loadingCard: {
    width: "100%",
    maxWidth: "520px",
    textAlign: "center",
  },

  loadingLogo: {
    width: "78px",
    height: "78px",
    objectFit: "contain",
    borderRadius: "10px",
  },

  loadingTitle: {
    margin: "14px 0 0",
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "25px",
  },

  loadingText: {
    margin: "8px 0 0",
    color: "#777",
    fontSize: "13px",
  },

  errorCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "42px 35px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(13, 27, 42, 0.10)",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
  },

  adminAccessTitle: {
    margin: "10px 0 20px",
    fontSize: "14px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8a7444",
  },

  errorBox: {
    background: "#fff0f0",
    border: "1px solid #efcaca",
    color: "#8d2d2d",
    borderRadius: "9px",
    padding: "14px 16px",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "20px",
  },

  primaryButton: {
    border: "none",
    background: "#0d1b2a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },

  loadingCardSmall: {
    background: "#ffffff",
    border:
      "1px solid rgba(13, 27, 42, 0.08)",
    borderRadius: "14px",
    padding: "50px 20px",
    marginTop: "15px",
    textAlign: "center",
    color: "#59636d",
  },

  spinner: {
    fontSize: "28px",
    color: "#c9a84c",
  },

  errorBanner: {
    marginTop: "15px",
    padding: "12px 14px",
    background: "#fff0f0",
    border: "1px solid #efcaca",
    color: "#8d2d2d",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "12px",
  },

  successBanner: {
    marginTop: "15px",
    padding: "12px 14px",
    background: "#edf8f0",
    border: "1px solid #c8e8d0",
    color: "#176b35",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "12px",
  },

  messageClose: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "inherit",
    fontSize: "18px",
    cursor: "pointer",
    lineHeight: 1,
  },
};