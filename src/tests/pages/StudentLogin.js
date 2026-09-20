import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const cleanEmail = email.trim();

      if (!cleanEmail || !password) {
        throw new Error("Veuillez remplir tous les champs.");
      }

      // Sign in with Supabase
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Connexion impossible.");
      }

      /*
       * Check whether this authenticated user is an admin.
       *
       * IMPORTANT:
       * Only users that actually exist in admin_profiles
       * are sent to the admin dashboard.
       *
       * All other authenticated users go to the student dashboard.
       */
      const { data: adminProfile, error: adminError } =
        await supabase
          .from("admin_profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

      if (adminError) {
        console.error(
          "Erreur lors de la vérification admin :",
          adminError
        );
      }

      // ADMIN
      if (adminProfile) {
        navigate("/admin-dashboard", {
          replace: true,
        });
        return;
      }

      // STUDENT
      navigate("/student-dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Erreur de connexion :", error);

      setMessage(
        "Adresse e-mail ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)",
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
          maxWidth: "450px",
        }}
      >
        <div
          style={{
            background: "white",
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
                background: "white",
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
              Espace étudiant
            </h1>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              Connectez-vous pour accéder à votre
              <br />
              espace étudiant.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                htmlFor="email"
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
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="exemple@email.com"
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 14px",
                  border: "1px solid #d0d5dd",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* PASSWORD */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                htmlFor="password"
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
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Votre mot de passe"
                required
                autoComplete="current-password"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 14px",
                  border: "1px solid #d0d5dd",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* ERROR MESSAGE */}
            {message && (
              <div
                style={{
                  background: "#fff1f0",
                  border: "1px solid #f5c2c0",
                  color: "#b42318",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                {message}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "14px",
                background: "#0d1b2a",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Connexion..."
                : "Se connecter"}
            </button>
          </form>

          {/* REGISTER */}
          <div
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #eaecf0",
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
              Vous n'avez pas encore de compte ?
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/student-register")
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
              Créer un compte →
            </button>
          </div>

          {/* ACCESS INFORMATION */}
          <div
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #eaecf0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              Accès réservé aux étudiants de
              <br />
              <strong
                style={{
                  color: "#0d1b2a",
                }}
              >
                International French Academy
              </strong>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
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