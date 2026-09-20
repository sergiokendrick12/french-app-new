import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function StudentRegister() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();

    setMessage("");

    if (password.length < 6) {
      setMessage(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "Les mots de passe ne correspondent pas."
      );
      return;
    }

    setLoading(true);

    try {
      // Create the Supabase Auth account.
      // The database trigger automatically creates
      // the student_profiles record with status = pending.
      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          "Impossible de créer le compte."
        );
      }

      // The student profile is created automatically
      // by the Supabase database trigger.

      setSuccess(true);

      setMessage(
        "Votre compte a été créé avec succès. Votre demande est maintenant en attente de validation par International French Academy."
      );
    } catch (error) {
      console.error(
        "Erreur inscription :",
        error
      );

      setMessage(
        error.message ||
          "Une erreur est survenue lors de la création du compte."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f4ee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow:
            "0 10px 35px rgba(0,0,0,0.10)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <img
            src="/IFA logo.jpg"
            alt="International French Academy"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              borderRadius: "14px",
            }}
          />
        </div>

        {/* TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: "0 0 10px",
              color: "#0d1b2a",
              fontSize: "30px",
            }}
          >
            Créer un compte
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
              lineHeight: "1.6",
            }}
          >
            Créez votre espace étudiant à
            <br />
            International French Academy.
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              background: success
                ? "#ecfdf3"
                : "#fff1f0",
              border: success
                ? "1px solid #abefc6"
                : "1px solid #f5c2c0",
              color: success
                ? "#067647"
                : "#b42318",
              borderRadius: "10px",
              padding: "13px",
              marginBottom: "20px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {message}
          </div>
        )}

        {/* REGISTRATION FORM */}
        {!success && (
          <form onSubmit={handleRegister}>
            {/* FULL NAME */}
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0d1b2a",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Nom complet
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Votre nom complet"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "20px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            />

            {/* EMAIL */}
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0d1b2a",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Adresse e-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="exemple@email.com"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "20px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            />

            {/* PASSWORD */}
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0d1b2a",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Mot de passe
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Minimum 6 caractères"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "20px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            />

            {/* CONFIRM PASSWORD */}
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#0d1b2a",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Confirmer le mot de passe
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Répétez le mot de passe"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px",
                marginBottom: "25px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "10px",
                fontSize: "15px",
              }}
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "14px",
                background: "#0d1b2a",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Création du compte..."
                : "Créer mon compte"}
            </button>
          </form>
        )}

        {/* SUCCESS BUTTON */}
        {success && (
          <button
            type="button"
            onClick={() =>
              navigate("/student-login")
            }
            style={{
              width: "100%",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              background: "#0d1b2a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Retour à la connexion
          </button>
        )}

        {/* LOGIN LINK */}
        {!success && (
          <div
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop:
                "1px solid #eaecf0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Vous avez déjà un compte ?
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/student-login")
              }
              style={{
                marginTop: "8px",
                border: "none",
                background: "transparent",
                color: "#0d1b2a",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Se connecter →
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#667085",
            fontSize: "13px",
          }}
        >
          International French Academy — Kigali,
          Rwanda
        </div>
      </div>
    </div>
  );
}