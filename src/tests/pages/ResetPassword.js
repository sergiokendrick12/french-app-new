import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Password updated successfully.");

    setTimeout(() => {
      navigate("/admin-login");
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f4ee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            color: "#0d1b2a",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Reset Password
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter your new administrator password.
        </p>

        <form onSubmit={handleUpdatePassword}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#0d1b2a",
            }}
          >
            New Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#0d1b2a",
            }}
          >
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxSizing: "border-box",
            }}
          />

          {errorMessage && (
            <p style={{ color: "#b00020", marginBottom: "15px" }}>
              {errorMessage}
            </p>
          )}

          {message && (
            <p style={{ color: "green", marginBottom: "15px" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#0d1b2a",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/admin-login")}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
            background: "transparent",
            color: "#0d1b2a",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back to Admin Login
        </button>
      </div>
    </div>
  );
}
