import { Link } from "react-router-dom";
import TestNav from "../components/TestNav";
import { testT } from "../i18n/testTranslations";

export default function TestLandingPage({ lang, setLang }) {
  const t = testT[lang];

  return (
    <>
      <style>{styles}</style>
      <TestNav lang={lang} setLang={setLang} backLabel={t.backHome} />

      <main className="tdn-page">
        {/* HERO */}
        <section className="tdn-hero">
          <span className="tdn-badge">{t.badge}</span>
          <h1>{t.titleFr}</h1>
          <p className="tdn-subtitle">{t.subtitle}</p>
          <p className="tdn-intro">{t.intro}</p>

          <div className="tdn-stats">
            <div className="tdn-stat">
              <strong>{t.stats.durationValue}</strong>
              <span>{t.stats.duration}</span>
            </div>
            <div className="tdn-stat">
              <strong>{t.stats.questionsValue}</strong>
              <span>{t.stats.questions}</span>
            </div>
            <div className="tdn-stat">
              <strong>{t.stats.sectionsValue}</strong>
              <span>{t.stats.sections}</span>
            </div>
            <div className="tdn-stat">
              <strong>{t.stats.levelsValue}</strong>
              <span>{t.stats.levels}</span>
            </div>
          </div>

          <Link to="/tests/level-test" className="tdn-cta">{t.cta}</Link>
          <p className="tdn-cta-hint">{t.ctaHint}</p>
        </section>

        {/* WHO IT'S FOR + HOW IT WORKS */}
        <section className="tdn-info-grid">
          <div className="tdn-info-card">
            <h2>{t.forWhoTitle}</h2>
            <p>{t.forWhoText}</p>
          </div>
          <div className="tdn-info-card">
            <h2>{t.howTitle}</h2>
            <p>{t.howText}</p>
          </div>
        </section>

        {/* SECTIONS */}
        <section className="tdn-sections">
          <h2 className="tdn-section-heading">{t.skillsTitle}</h2>
          <div className="tdn-section-grid">
            {t.sections.map((s, i) => (
              <div className="tdn-section-card" key={i}>
                <div className="tdn-section-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NOTES / DISCLAIMER */}
        <section className="tdn-note">
          <h3>{t.noteTitle}</h3>
          <ul>
            <li>{t.note1}</li>
            <li>{t.note2}</li>
            <li>{t.note3}</li>
          </ul>
        </section>

        <div className="tdn-bottom-cta">
          <Link to="/tests/level-test" className="tdn-cta">{t.cta}</Link>
        </div>
      </main>

      <footer className="tdn-footer">
        © 2026 International French Academy · Kigali, Rwanda.
      </footer>
    </>
  );
}

const styles = `
  .tdn-nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.9rem 2rem;
    background: rgba(13,27,42,0.97);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(201,168,76,0.18);
  }
  .tdn-nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .tdn-nav-logo img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold); }
  .tdn-nav-logo span {
    font-family: 'Playfair Display', serif; font-size: 0.9rem; font-weight: 700; color: #fff; line-height: 1.1;
  }
  .tdn-nav-logo small {
    color: var(--gold); display: block; font-size: 0.6rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Sans', sans-serif;
  }
  .tdn-lang-toggle { display: flex; border: 1.5px solid rgba(201,168,76,0.35); border-radius: 20px; overflow: hidden; }
  .tdn-lang-toggle button {
    background: none; border: none; padding: 0.3rem 0.75rem; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; cursor: pointer; color: rgba(255,255,255,0.5); font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .tdn-lang-toggle button.active { background: var(--gold); color: var(--navy); }

  .tdn-page {
    font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text-dark);
    overflow-x: hidden;
  }

  .tdn-hero {
    text-align: center; padding: 4.5rem 1.5rem 3rem;
    background: linear-gradient(180deg, var(--navy) 0%, var(--deep-blue) 100%);
    color: #fff;
  }
  .tdn-badge {
    display: inline-block; padding: 0.4rem 1rem; border: 1px solid rgba(201,168,76,0.4);
    border-radius: 20px; color: var(--gold-light); font-size: 0.72rem; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 1.4rem;
  }
  .tdn-hero h1 {
    font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(2.2rem, 6vw, 3.6rem);
    margin-bottom: 0.6rem;
  }
  .tdn-subtitle {
    font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(1.1rem, 2.6vw, 1.5rem);
    color: var(--gold-light); margin-bottom: 1.6rem;
  }
  .tdn-intro {
    max-width: 640px; margin: 0 auto 2.4rem; font-size: 1rem; line-height: 1.7; color: rgba(255,255,255,0.82);
  }

  .tdn-stats {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 1.2rem; margin-bottom: 2.4rem;
  }
  .tdn-stat {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(201,168,76,0.25);
    border-radius: 10px; padding: 1rem 1.4rem; min-width: 130px;
  }
  .tdn-stat strong {
    display: block; font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--gold-light); margin-bottom: 0.2rem;
  }
  .tdn-stat span { font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.6); }

  .tdn-cta {
    display: inline-block; background: var(--gold); color: var(--navy); text-decoration: none;
    font-weight: 700; letter-spacing: 0.04em; padding: 0.95rem 2.6rem; border-radius: 4px;
    font-size: 0.95rem; transition: background 0.25s, transform 0.2s;
  }
  .tdn-cta:hover { background: var(--gold-light); transform: translateY(-2px); }
  .tdn-cta-hint { margin-top: 0.9rem; font-size: 0.8rem; color: rgba(255,255,255,0.55); }

  .tdn-info-grid {
    max-width: 1000px; margin: 3.2rem auto; padding: 0 1.5rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.8rem;
  }
  .tdn-info-card {
    background: var(--white); border-radius: 10px; padding: 1.8rem;
    box-shadow: 0 4px 24px rgba(13,27,42,0.06);
  }
  .tdn-info-card h2 {
    font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 0.7rem; color: var(--navy);
  }
  .tdn-info-card p { font-size: 0.92rem; line-height: 1.7; color: var(--text-mid); }

  .tdn-sections { max-width: 1000px; margin: 0 auto 3.2rem; padding: 0 1.5rem; }
  .tdn-section-heading {
    text-align: center; font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--navy); margin-bottom: 1.8rem;
  }
  .tdn-section-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem; }
  .tdn-section-card {
    background: var(--white); border-radius: 10px; padding: 1.8rem 1.4rem; text-align: center;
    box-shadow: 0 4px 24px rgba(13,27,42,0.06); transition: transform 0.25s;
  }
  .tdn-section-card:hover { transform: translateY(-4px); }
  .tdn-section-icon { font-size: 2.1rem; margin-bottom: 0.7rem; }
  .tdn-section-card h3 {
    font-family: 'Playfair Display', serif; font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--navy);
  }
  .tdn-section-card p { font-size: 0.86rem; line-height: 1.6; color: var(--text-mid); }

  .tdn-note {
    max-width: 800px; margin: 0 auto 3rem; padding: 1.6rem 1.8rem;
    background: var(--cream-dark); border-left: 4px solid var(--gold); border-radius: 6px;
  }
  .tdn-note h3 {
    font-family: 'Playfair Display', serif; font-size: 1.02rem; margin-bottom: 0.6rem; color: var(--navy);
  }
  .tdn-note ul { padding-left: 1.2rem; }
  .tdn-note li { font-size: 0.86rem; line-height: 1.7; color: var(--text-mid); margin-bottom: 0.3rem; }

  .tdn-bottom-cta { text-align: center; padding: 0 1.5rem 4rem; }

  .tdn-footer {
    text-align: center; padding: 1.6rem; background: var(--navy); color: rgba(255,255,255,0.5); font-size: 0.78rem;
  }

  @media (max-width: 760px) {
    .tdn-info-grid, .tdn-section-grid { grid-template-columns: 1fr; }
    .tdn-nav { padding: 0.8rem 1.2rem; }
    .tdn-hero { padding: 3.2rem 1.2rem 2.4rem; }
  }
`;
