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

import StudentLogin from "./tests/pages/StudentLogin";
import StudentRegister from "./tests/pages/StudentRegister";
import StudentResults from "./tests/pages/StudentResults";
import StudentDashboard from "./tests/pages/StudentDashboard";

import AdminLogin from "./tests/pages/AdminLogin";
import AdminDashboard from "./tests/pages/AdminDashboard";

export default function App() {
  const [lang, setLang] = useState("en");

  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================================
            HOMEPAGE
        ========================================================= */}

        <Route
          path="/"
          element={
            <Home
              lang={lang}
              setLang={setLang}
            />
          }
        />

        {/* =========================================================
            TEST LANDING PAGE
        ========================================================= */}

        <Route
          path="/tests"
          element={
            <TestLandingPage
              lang={lang}
              setLang={setLang}
            />
          }
        />

        {/* =========================================================
            STUDENT AUTHENTICATION
        ========================================================= */}

        <Route
          path="/student-login"
          element={<StudentLogin />}
        />

        <Route
          path="/student-register"
          element={<StudentRegister />}
        />

        {/* =========================================================
            STUDENT DASHBOARD
        ========================================================= */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* =========================================================
            STUDENT TESTS
        ========================================================= */}

        {/* Compréhension orale */}

        <Route
          path="/tests/level-test"
          element={<ListeningTest />}
        />

        {/* Compréhension écrite */}

        <Route
          path="/tests/written-test"
          element={<WrittenTest />}
        />

        {/* Expression écrite */}

        <Route
          path="/tests/expression-ecrite"
          element={<WrittenExpressionTest />}
        />

        {/* =========================================================
            STUDENT RESULTS
        ========================================================= */}

        <Route
          path="/tests/results"
          element={<StudentResults />}
        />

        {/* =========================================================
            ADMIN AUTHENTICATION
        ========================================================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* =========================================================
            ADMIN DASHBOARD
        ========================================================= */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* =========================================================
            FALLBACK
        ========================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}