import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Home";

import TestLandingPage from "./tests/pages/TestLandingPage";
import ListeningTest from "./tests/pages/ListeningTest";
import WrittenTest from "./tests/pages/WrittenTest";
import WrittenExpressionTest from "./tests/pages/WrittenExpressionTest";
import ExamLeonille from "./tests/pages/ExamLeonille";
import ExamIdriss from "./tests/pages/ExamIdriss";
import ExamJoan from "./tests/pages/ExamJoan";
import ExamKim from "./tests/pages/ExamKim";

import StudentLogin from "./tests/pages/StudentLogin";
import StudentRegister from "./tests/pages/StudentRegister";
import StudentResults from "./tests/pages/StudentResults";
import StudentDashboard from "./tests/pages/StudentDashboard";

import AdminLogin from "./tests/pages/AdminLogin";
import AdminDashboard from "./tests/pages/AdminDashboard";
import ResetPassword from "./tests/pages/ResetPassword";

export default function App() {
  const [lang, setLang] = useState("en");

  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            HOME
        ========================= */}
        <Route
          path="/"
          element={
            <Home
              lang={lang}
              setLang={setLang}
            />
          }
        />

        {/* =========================
            TESTS
        ========================= */}
        <Route
          path="/tests"
          element={
            <TestLandingPage
              lang={lang}
              setLang={setLang}
            />
          }
        />

        {/* =========================
            STUDENT AUTH
        ========================= */}
        <Route
          path="/student-login"
          element={<StudentLogin />}
        />

        <Route
          path="/student-register"
          element={<StudentRegister />}
        />

        {/* =========================
            STUDENT DASHBOARD
        ========================= */}
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* =========================
            STANDARD TESTS
        ========================= */}
        <Route
          path="/tests/level-test"
          element={<ListeningTest />}
        />

        <Route
          path="/tests/written-test"
          element={<WrittenTest />}
        />

        <Route
          path="/tests/expression-ecrite"
          element={<WrittenExpressionTest />}
        />

        {/* =========================
            INDIVIDUAL EXAMS
        ========================= */}

        {/* LEONILLE EXAM */}
        <Route
          path="/tests/exam-leonille"
          element={<ExamLeonille />}
        />

        {/* IDRISS EXAM */}
        <Route
          path="/tests/exam-idriss"
          element={<ExamIdriss />}
        />

        {/* JOAN EXAM */}
        <Route
          path="/tests/exam-joan"
          element={<ExamJoan />}
        />

        {/* Also accept a trailing slash */}
        <Route
          path="/tests/exam-joan/"
          element={<ExamJoan />}
        />

        {/* KIM EXAM */}
        <Route
          path="/tests/exam-kim"
          element={<ExamKim />}
        />

        {/* Also accept a trailing slash */}
        <Route
          path="/tests/exam-kim/"
          element={<ExamKim />}
        />

        {/* =========================
            RESULTS
        ========================= */}
        <Route
          path="/tests/results"
          element={<StudentResults />}
        />

        {/* =========================
            ADMIN
        ========================= */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* =========================
            PASSWORD RESET
        ========================= */}
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =========================
            FALLBACK
        ========================= */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}