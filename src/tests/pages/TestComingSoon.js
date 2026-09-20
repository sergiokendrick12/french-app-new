import { Link } from "react-router-dom";
import TestNav from "../components/TestNav";
import { testT } from "../i18n/testTranslations";

// Placeholder destination for the "Commencer le test" button.
// The real test engine (questions, timer, scoring) is built in a later
// step — this just confirms the route works end-to-end for now instead
// of leaving the button pointing at a 404.
export default function TestComingSoon({ lang, setLang }) {
  const t = testT[lang];
  const msg =
    lang === "en"
      ? "The test engine isn't built yet — this page confirms the link works. It will be replaced with the actual Level Test in a later step."
      : "Le moteur du test n'est pas encore construit — cette page confirme que le lien fonctionne. Elle sera remplacée par le vrai Test de Niveau à une étape ultérieure.";

  return (
    <>
      <TestNav lang={lang} setLang={setLang} backLabel={t.backHome} />
      <main style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "3rem 1.5rem", fontFamily: "'DM Sans', sans-serif", background: "var(--cream)",
      }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: "1rem" }}>
          {lang === "en" ? "Coming soon" : "Bientôt disponible"}
        </h1>
        <p style={{ maxWidth: 480, color: "var(--text-mid)", lineHeight: 1.7, marginBottom: "1.6rem" }}>{msg}</p>
        <Link to="/tests" style={{ color: "var(--navy)", fontWeight: 700, textDecoration: "underline" }}>
          {lang === "en" ? "Back to Level Test overview" : "Retour à la présentation du Test de Niveau"}
        </Link>
      </main>
    </>
  );
}
