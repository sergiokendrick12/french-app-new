import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2.95.0/cors";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";

// Supabase currently provides publishable keys in a JSON object.
// Older projects may also expose SUPABASE_ANON_KEY.
let SUPABASE_KEY =
  Deno.env.get("SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
  "";

if (!SUPABASE_KEY) {
  try {
    const keys = JSON.parse(
      Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}"
    );

    SUPABASE_KEY = keys.default ?? "";
  } catch {
    console.error("Could not read SUPABASE_PUBLISHABLE_KEYS");
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed",
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check required configuration
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("Supabase configuration is missing");

      return new Response(
        JSON.stringify({
          error: "Supabase configuration is missing",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");

      return new Response(
        JSON.stringify({
          error: "Email service is not configured",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ---------------------------------------------------------
    // 1. Read Authorization header
    // ---------------------------------------------------------

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing Authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          error: "Invalid Authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // ---------------------------------------------------------
    // 2. Create Supabase client with the user's JWT
    // ---------------------------------------------------------

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // ---------------------------------------------------------
    // 3. Verify the authenticated user
    // ---------------------------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Authentication error:", userError);

      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Authenticated student:", user.id);
    console.log("Authenticated email:", user.email);

    // ---------------------------------------------------------
    // 4. Get student profile
    // ---------------------------------------------------------

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("student_profiles")
      .select("full_name, email, status")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);

      return new Response(
        JSON.stringify({
          error: "Could not load student profile",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!profile) {
      return new Response(
        JSON.stringify({
          error: "Student profile not found",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ---------------------------------------------------------
    // 5. Verify student is approved
    // ---------------------------------------------------------

    if (profile.status !== "approved") {
      return new Response(
        JSON.stringify({
          error: "Student is not approved",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ---------------------------------------------------------
    // 6. Read result data
    // ---------------------------------------------------------

    const body = await req.json();

    const score = Number(body.score);
    const total = Number(body.total);

    if (
      !Number.isFinite(score) ||
      !Number.isFinite(total) ||
      total <= 0 ||
      score < 0 ||
      score > total
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid test result",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const percentage = Math.round((score / total) * 100);

    // IMPORTANT:
    // We use the authenticated Supabase user's email.
    // We do NOT trust an email supplied by the browser.
    const recipientEmail = user.email;

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({
          error: "Authenticated user has no email address",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const studentName = escapeHtml(
      profile.full_name || "Étudiant"
    );

    // ---------------------------------------------------------
    // 7. Send email through Resend
    // ---------------------------------------------------------

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "International French Academy <results@internationalfrenchacademy.org>",
          to: [recipientEmail],
          subject:
            "International French Academy — Résultat du test",

          html: `
            <!DOCTYPE html>
            <html lang="fr">
              <head>
                <meta charset="UTF-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0"
                />
                <title>Résultat du test - IFA</title>
              </head>

              <body style="
                margin: 0;
                padding: 0;
                background: #f8f4ee;
                font-family: Arial, Helvetica, sans-serif;
                color: #0d1b2a;
              ">

                <div style="
                  max-width: 650px;
                  margin: 40px auto;
                  background: #ffffff;
                  border-radius: 14px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                ">

                  <div style="
                    background: #0d1b2a;
                    padding: 30px;
                    text-align: center;
                  ">
                    <h1 style="
                      margin: 0;
                      color: #c9a84c;
                      font-size: 26px;
                    ">
                      International French Academy
                    </h1>

                    <p style="
                      margin: 8px 0 0;
                      color: #ffffff;
                      font-size: 15px;
                    ">
                      Résultat de votre test de niveau
                    </p>
                  </div>

                  <div style="padding: 35px 30px;">

                    <p style="font-size: 17px;">
                      Bonjour <strong>${studentName}</strong>,
                    </p>

                    <p style="
                      font-size: 15px;
                      line-height: 1.7;
                    ">
                      Merci d'avoir passé le test de compréhension orale
                      de l'International French Academy.
                    </p>

                    <div style="
                      margin: 30px 0;
                      padding: 25px;
                      background: #f8f4ee;
                      border-left: 5px solid #c9a84c;
                      border-radius: 8px;
                      text-align: center;
                    ">

                      <p style="
                        margin: 0 0 10px;
                        font-size: 15px;
                        color: #555555;
                      ">
                        Votre résultat
                      </p>

                      <div style="
                        font-size: 42px;
                        font-weight: bold;
                        color: #0d1b2a;
                      ">
                        ${score} / ${total}
                      </div>

                      <p style="
                        margin: 10px 0 0;
                        font-size: 18px;
                        font-weight: bold;
                        color: #c9a84c;
                      ">
                        Score : ${percentage}%
                      </p>

                    </div>

                    <p style="
                      font-size: 15px;
                      line-height: 1.7;
                    ">
                      Votre résultat a été enregistré dans votre
                      espace étudiant.
                    </p>

                    <p style="
                      font-size: 15px;
                      line-height: 1.7;
                    ">
                      Pour toute question concernant votre niveau
                      ou la prochaine étape de votre parcours,
                      veuillez contacter l'International French Academy.
                    </p>

                    <p style="
                      margin-top: 30px;
                      font-size: 15px;
                    ">
                      Cordialement,<br />
                      <strong>International French Academy</strong>
                    </p>

                  </div>

                  <div style="
                    background: #0d1b2a;
                    padding: 20px;
                    text-align: center;
                  ">
                    <p style="
                      margin: 0;
                      color: #ffffff;
                      font-size: 12px;
                    ">
                      International French Academy — Kigali, Rwanda
                    </p>
                  </div>

                </div>

              </body>
            </html>
          `,
        }),
      }
    );

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendResult);

      return new Response(
        JSON.stringify({
          error: "Resend could not send the email",
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(
      "Result email sent successfully:",
      resendResult.id
    );

    // ---------------------------------------------------------
    // 8. Success
    // ---------------------------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        message: "Result email sent successfully",
        emailId: resendResult.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Unexpected function error:", error);

    return new Response(
      JSON.stringify({
        error: "Unexpected server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});