import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminProfile) {
      navigate("/admin-dashboard", { replace: true });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Login failed. Please try again.");
      }

      const { data: adminProfile, error: adminError } = await supabase
        .from("admin_profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!adminProfile) {
        await supabase.auth.signOut();
        setMessage("Access denied. This account is not an administrator.");
        setLoading(false);
        return;
      }

      navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);
      setMessage(error.message || "Unable to log in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f4ee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "DM Sans, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 12px 40px rgba(13, 27, 42, 0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              marginBottom: "18px",
            }}
          />

          <h1
            style={{
              margin: "0 0 8px",
              color: "#0d1b2a",
              fontFamily: "Georgia, serif",
              fontSize: "30px",
            }}
          >
            International French Academy
          </h1>

          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "15px",
            }}
          >
            Espace administrateur
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#0d1b2a",
              fontWeight: "600",
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoComplete="email"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              marginBottom: "20px",
              border: "1px solid #d8d3ca",
              borderRadius: "8px",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#0d1b2a",
              fontWeight: "600",
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              marginBottom: "20px",
              border: "1px solid #d8d3ca",
              borderRadius: "8px",
              fontSize: "15px",
              outline: "none",
            }}
          />

          {message && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                borderRadius: "8px",
                background: "#fff1f0",
                color: "#b42318",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#999" : "#0d1b2a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Admin Sign In"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/student-login")}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "12px",
            border: "none",
            background: "transparent",
            color: "#0d1b2a",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Student Login
        </button>
      </div>
    </div>
  );
}