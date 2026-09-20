import { Link } from "react-router-dom";

// Small header shared by the Test de Niveau pages. Visually consistent
// with the main site nav (same colors/fonts via the shared theme tokens
// in src/styles/theme.css) but intentionally simpler: this module doesn't
// need the full scroll-anchor navigation from the homepage.
export default function TestNav({ lang, setLang, backLabel }) {
  return (
    <nav className="tdn-nav">
      <Link to="/" className="tdn-nav-logo">
        <img src="/logo.png" alt="IFA Logo" />
        <span>
          {lang === "en" ? "International French Academy" : "Académie Française Internationale"}
          <small>{backLabel}</small>
        </span>
      </Link>
      <div className="tdn-lang-toggle">
        <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
      </div>
    </nav>
  );
}
