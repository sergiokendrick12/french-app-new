import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    level: "A1",
    question: "Bonjour ! Comment ___ vous ?",
    options: ["allez", "allez-vous", "va", "être"],
    answer: "allez",
  },
  {
    level: "A1",
    question: "Je ___ étudiant à Kigali.",
    options: ["suis", "es", "est", "être"],
    answer: "suis",
  },
  {
    level: "A2",
    question: "Hier, nous ___ au restaurant avec nos amis.",
    options: ["allons", "sommes allés", "irons", "allions"],
    answer: "sommes allés",
  },
  {
    level: "A2",
    question: "Quand j'étais enfant, je ___ beaucoup au football.",
    options: ["joue", "jouerai", "jouais", "ai joué"],
    answer: "jouais",
  },
  {
    level: "B1",
    question: "Si j'avais plus de temps, je ___ le français tous les jours.",
    options: ["étudie", "étudierai", "étudierais", "étudiais"],
    answer: "étudierais",
  },
  {
    level: "B1",
    question: "Elle travaille ici ___ trois ans.",
    options: ["depuis", "pendant", "il y a", "dans"],
    answer: "depuis",
  },
  {
    level: "B2",
    question: "Bien qu'il ___ très fatigué, il a continué à travailler.",
    options: ["est", "soit", "sera", "était"],
    answer: "soit",
  },
  {
    level: "B2",
    question: "Cette décision pourrait avoir de graves ___ sur l'économie.",
    options: ["conséquences", "réalisations", "conditions", "productions"],
    answer: "conséquences",
  },
  {
    level: "C1",
    question: "Il est essentiel que les étudiants ___ conscients de leurs responsabilités.",
    options: ["sont", "seront", "soient", "étaient"],
    answer: "soient",
  },
  {
    level: "C2",
    question: "Cette mesure, loin de résoudre le problème, risque de l'___ davantage.",
    options: ["aggraver", "améliorer", "atténuer", "éviter"],
    answer: "aggraver",
  },
];

const LEVELS = [
  { name: "A1", label: "Débutant" },
  { name: "A2", label: "Élémentaire" },
  { name: "B1", label: "Intermédiaire" },
  { name: "B2", label: "Intermédiaire supérieur" },
  { name: "C1", label: "Avancé" },
  { name: "C2", label: "Maîtrise" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --navy: #0d1b2a;
    --deep-blue: #132942;
    --blue: #1e3a5f;
    --gold: #c9a84c;
    --gold-light: #e4c97e;
    --cream: #f8f4ee;
    --white: #ffffff;
    --text: #182536;
    --muted: #687586;
    --border: #e7e0d5;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    font-family: "DM Sans", sans-serif;
    background: var(--cream);
    color: var(--text);
  }

  body {
    min-height: 100vh;
  }

  .free-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at 10% 10%, rgba(201,168,76,0.08), transparent 28%),
      radial-gradient(circle at 90% 80%, rgba(30,58,95,0.08), transparent 30%),
      var(--cream);
  }

  /* HEADER */

  .free-header {
    height: 74px;
    background: rgba(13,27,42,0.98);
    border-bottom: 1px solid rgba(201,168,76,0.22);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5%;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
  }

  .free-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
  }

  .free-logo {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--gold);
  }

  .free-brand-name {
    color: white;
    font-family: "Playfair Display", serif;
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.1;
  }

  .free-brand-name small {
    display: block;
    color: var(--gold);
    font-family: "DM Sans", sans-serif;
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 3px;
  }

  .free-home {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: color 0.2s;
  }

  .free-home:hover {
    color: var(--gold-light);
  }

  /* INTRO */

  .free-intro {
    max-width: 900px;
    margin: 0 auto;
    padding: 5rem 1.5rem 2rem;
    text-align: center;
  }

  .free-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.45rem 1rem;
    border: 1px solid rgba(201,168,76,0.45);
    background: rgba(201,168,76,0.09);
    color: #9a7b2e;
    border-radius: 30px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    margin-bottom: 1.3rem;
  }

  .free-kicker-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #32a852;
    box-shadow: 0 0 0 4px rgba(50,168,82,0.12);
  }

  .free-intro h1 {
    font-family: "Playfair Display", serif;
    font-size: clamp(2.2rem, 6vw, 4.2rem);
    line-height: 1.05;
    margin: 0 0 1rem;
    color: var(--navy);
  }

  .free-intro h1 span {
    color: var(--gold);
    font-style: italic;
  }

  .free-intro p {
    max-width: 650px;
    margin: 0 auto;
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.8;
  }

  .free-features {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 1.6rem;
  }

  .free-feature {
    font-size: 0.78rem;
    color: #596575;
    font-weight: 600;
  }

  .free-feature strong {
    color: var(--gold);
    margin-right: 4px;
  }

  /* TEST CARD */

  .free-test-shell {
    max-width: 820px;
    margin: 1.5rem auto 5rem;
    padding: 0 1.5rem;
  }

  .free-card {
    background: white;
    border-radius: 18px;
    border: 1px solid var(--border);
    box-shadow: 0 25px 70px rgba(13,27,42,0.12);
    overflow: hidden;
  }

  .free-card-top {
    background: linear-gradient(135deg, var(--navy), var(--deep-blue));
    padding: 1.25rem 1.5rem;
    color: white;
  }

  .free-progress-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
  }

  .free-progress-text {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.65);
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .free-question-level {
    background: rgba(201,168,76,0.16);
    border: 1px solid rgba(201,168,76,0.4);
    color: var(--gold-light);
    padding: 0.28rem 0.7rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .free-progress {
    width: 100%;
    height: 5px;
    border-radius: 10px;
    background: rgba(255,255,255,0.12);
    overflow: hidden;
  }

  .free-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    transition: width 0.35s ease;
  }

  .free-card-body {
    padding: 2.8rem;
  }

  .free-question-number {
    color: var(--gold);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 0.7rem;
  }

  .free-question {
    font-family: "Playfair Display", serif;
    font-size: clamp(1.35rem, 3vw, 2rem);
    line-height: 1.35;
    color: var(--navy);
    margin: 0 0 2rem;
  }

  .free-options {
    display: grid;
    gap: 0.8rem;
  }

  .free-option {
    width: 100%;
    text-align: left;
    background: #fff;
    border: 1.5px solid #ded8ce;
    border-radius: 10px;
    padding: 1rem 1.1rem;
    font-family: "DM Sans", sans-serif;
    font-size: 0.92rem;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .free-option:hover {
    border-color: var(--gold);
    background: #fffdf8;
    transform: translateX(3px);
  }

  .free-option.selected {
    border-color: var(--gold);
    background: rgba(201,168,76,0.09);
    box-shadow: 0 5px 18px rgba(201,168,76,0.12);
  }

  .free-option-letter {
    width: 31px;
    height: 31px;
    border-radius: 50%;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--navy);
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .free-option.selected .free-option-letter {
    background: var(--gold);
  }

  .free-next {
    margin-top: 1.8rem;
    width: 100%;
    border: none;
    border-radius: 8px;
    padding: 1rem;
    background: var(--navy);
    color: white;
    font-family: "DM Sans", sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
  }

  .free-next:hover:not(:disabled) {
    background: var(--blue);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(13,27,42,0.2);
  }

  .free-next:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* RESULT */

  .free-result {
    max-width: 820px;
    margin: 1.5rem auto 5rem;
    padding: 0 1.5rem;
  }

  .result-card {
    background: white;
    border-radius: 18px;
    border: 1px solid var(--border);
    box-shadow: 0 25px 70px rgba(13,27,42,0.12);
    overflow: hidden;
    text-align: center;
  }

  .result-top {
    background: linear-gradient(135deg, var(--navy), var(--deep-blue));
    padding: 3rem 1.5rem 2.7rem;
    color: white;
  }

  .result-small {
    color: var(--gold-light);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 0.7rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }

  .result-title {
    font-family: "Playfair Display", serif;
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    margin: 0;
  }

  .result-level {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    margin: 1.8rem auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gold);
    color: var(--navy);
    font-family: "Playfair Display", serif;
    font-size: 3rem;
    font-weight: 900;
    box-shadow: 0 0 0 9px rgba(201,168,76,0.14);
  }

  .result-body {
    padding: 2.5rem 2rem 2.8rem;
  }

  .result-score {
    font-family: "Playfair Display", serif;
    color: var(--navy);
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
  }

  .result-description {
    color: var(--muted);
    line-height: 1.7;
    max-width: 590px;
    margin: 0 auto 1.8rem;
    font-size: 0.9rem;
  }

  .result-notice {
    max-width: 620px;
    margin: 0 auto 2rem;
    padding: 0.9rem 1rem;
    border-radius: 8px;
    background: #f7f3ea;
    border: 1px solid #e9dfca;
    color: #6b5a35;
    font-size: 0.75rem;
    line-height: 1.6;
  }

  .result-actions {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    flex-wrap: wrap;
  }

  .result-btn {
    display: inline-block;
    text-decoration: none;
    border-radius: 7px;
    padding: 0.9rem 1.5rem;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    border: none;
  }

  .result-btn-primary {
    background: var(--navy);
    color: white;
  }

  .result-btn-primary:hover {
    background: var(--blue);
  }

  .result-btn-secondary {
    background: transparent;
    color: var(--navy);
    border: 1px solid #cfc7bb;
  }

  .result-btn-secondary:hover {
    border-color: var(--gold);
  }

  /* FOOTER */

  .free-footer {
    text-align: center;
    padding: 0 1.5rem 2.5rem;
    color: #8a919b;
    font-size: 0.7rem;
  }

  .free-footer strong {
    color: var(--gold);
  }


  /* ANALYZING + WOW RESULT */

  .analyzing-wrap {
    max-width: 620px;
    margin: 5rem auto;
    padding: 0 1.5rem;
    text-align: center;
  }

  .analyzing-card {
    background: linear-gradient(135deg, var(--navy), var(--deep-blue));
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 18px;
    padding: 3.5rem 2rem;
    color: white;
    box-shadow: 0 25px 70px rgba(13,27,42,0.2);
  }

  .analyzing-spin {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 4px solid rgba(255,255,255,0.1);
    border-top-color: var(--gold);
    margin: 0 auto 1.6rem;
    animation: ifaSpin 1s linear infinite;
  }

  .analyzing-card h2 {
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    margin: 0 0 1.2rem;
  }

  .analyzing-skills {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.6rem 1rem;
  }

  .analyzing-skills span {
    color: var(--gold-light);
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0;
    animation: ifaFadeUp 0.5s ease forwards;
  }

  .result-level.pop {
    animation: ifaPop 0.6s ease;
  }

  .result-ladder {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 1.4rem;
  }

  .result-ladder span {
    width: 34px;
    height: 5px;
    border-radius: 4px;
    background: rgba(255,255,255,0.15);
    transition: background 0.3s;
  }

  .result-ladder span.on {
    background: var(--gold);
  }

  .result-reveal {
    animation: ifaFadeUp 0.7s ease both;
  }

  .result-congrats {
    font-family: "Playfair Display", serif;
    color: var(--navy);
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }

  .result-levelname {
    color: var(--gold);
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .welcome-block {
    margin-top: 2.4rem;
    padding: 2.4rem 1.6rem;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--navy), var(--deep-blue));
    border: 1px solid rgba(201,168,76,0.25);
    color: white;
    animation: ifaFadeUp 0.8s 0.3s ease both;
  }

  .welcome-block h2 {
    font-family: "Playfair Display", serif;
    font-size: clamp(1.4rem, 4vw, 2rem);
    margin: 0 0 0.8rem;
  }

  .welcome-block h2 span {
    color: var(--gold);
    font-style: italic;
  }

  .welcome-block p {
    color: rgba(255,255,255,0.65);
    font-size: 0.9rem;
    line-height: 1.75;
    max-width: 520px;
    margin: 0 auto;
  }

  .welcome-why-title {
    color: var(--gold-light);
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 1.8rem 0 0.9rem;
  }

  .welcome-why {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.7rem;
    margin-bottom: 1.8rem;
  }

  .welcome-why div {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: 10px;
    padding: 0.9rem 0.5rem;
    font-size: 0.74rem;
    color: rgba(255,255,255,0.85);
    transition: all 0.25s;
  }

  .welcome-why div:hover {
    border-color: var(--gold);
    transform: translateY(-3px);
  }

  .welcome-why b {
    display: block;
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }

  .welcome-ready {
    font-family: "Playfair Display", serif;
    font-size: 1.15rem;
    margin-bottom: 1.2rem;
  }

  .result-btn-enroll {
    background: var(--gold);
    color: var(--navy);
    padding: 1.05rem 2rem;
    font-size: 0.85rem;
    animation: ifaPulse 2.2s infinite;
  }

  .result-btn-enroll:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
  }

  .result-btn-ghost {
    background: transparent;
    color: white;
    border: 1.5px solid rgba(255,255,255,0.3);
  }

  .result-btn-ghost:hover {
    border-color: var(--gold);
    color: var(--gold-light);
  }

  .welcome-links {
    margin-top: 1.4rem;
    display: flex;
    justify-content: center;
    gap: 1.4rem;
    flex-wrap: wrap;
  }

  .welcome-links a,
  .welcome-links button {
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
    text-decoration: underline;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
  }

  .welcome-links a:hover,
  .welcome-links button:hover {
    color: var(--gold-light);
  }

  .confetti-piece {
    position: fixed;
    top: -20px;
    width: 9px;
    height: 14px;
    z-index: 200;
    pointer-events: none;
    animation: ifaFall linear forwards;
  }

  @keyframes ifaSpin { to { transform: rotate(360deg); } }
  @keyframes ifaFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  @keyframes ifaPop { 0% { transform: scale(0.7); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
  @keyframes ifaPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); } 50% { box-shadow: 0 0 0 14px rgba(201,168,76,0); } }
  @keyframes ifaFall { to { transform: translateY(110vh) rotate(720deg); opacity: 0.9; } }

  @media (max-width: 600px) {
    .free-header {
      height: 66px;
      padding: 0 1rem;
    }

    .free-logo {
      width: 38px;
      height: 38px;
    }

    .free-brand-name {
      font-size: 0.82rem;
    }

    .free-home {
      font-size: 0.68rem;
    }

    .free-intro {
      padding-top: 3.2rem;
    }

    .free-card-body {
      padding: 1.7rem 1.2rem 1.5rem;
    }

    .free-question {
      font-size: 1.3rem;
    }

    .free-option {
      padding: 0.85rem;
    }

    .result-body {
      padding: 2rem 1.2rem;
    }
  }
`;

function getLevel(score) {
  if (score <= 1) return "A1";
  if (score <= 3) return "A2";
  if (score <= 5) return "B1";
  if (score <= 7) return "B2";
  if (score === 8) return "C1";
  return "C2";
}

function getLevelDescription(level, lang) {
  const descriptions = {
    en: {
      A1: "You are at an introductory level. You can understand and use very basic French expressions.",
      A2: "You have elementary French skills and can handle simple everyday communication.",
      B1: "You have an intermediate level and can communicate in familiar situations with reasonable independence.",
      B2: "You have a strong intermediate level and can communicate effectively in many professional and social situations.",
      C1: "You have an advanced level and can express yourself fluently and precisely in complex situations.",
      C2: "Your result suggests a very advanced command of French, close to full professional and academic proficiency.",
    },
    fr: {
      A1: "Vous êtes au niveau débutant. Vous pouvez comprendre et utiliser des expressions françaises très simples.",
      A2: "Vous avez un niveau élémentaire et pouvez communiquer dans des situations quotidiennes simples.",
      B1: "Vous avez un niveau intermédiaire et pouvez communiquer avec une certaine autonomie dans des situations familières.",
      B2: "Vous avez un bon niveau intermédiaire et pouvez communiquer efficacement dans de nombreuses situations professionnelles et sociales.",
      C1: "Vous avez un niveau avancé et pouvez vous exprimer avec aisance et précision dans des situations complexes.",
      C2: "Votre résultat indique une très bonne maîtrise du français, proche d'une compétence professionnelle et académique complète.",
    },
  };

  return descriptions[lang][level];
}

const WELCOME_MSG = {
  en: {
    A1: "Every great journey starts with a first step. Let's take it together.",
    A2: "You already know the basics. Let's build real confidence.",
    B1: "You have a solid foundation in French. Now let's help you go further.",
    B2: "Impressive! You are close to fluency. Let's refine and certify it.",
    C1: "Excellent command of French. Let's polish it to perfection.",
    C2: "Outstanding. You are at the top of the scale. Let's certify it.",
  },
  fr: {
    A1: "Tout grand voyage commence par un premier pas. Faisons-le ensemble.",
    A2: "Vous connaissez déjà les bases. Construisons une vraie confiance.",
    B1: "Vous avez une base solide en français. Allons plus loin ensemble.",
    B2: "Impressionnant ! Vous êtes proche de l'aisance. Affinons et certifions.",
    C1: "Excellente maîtrise du français. Peaufinons-la à la perfection.",
    C2: "Remarquable. Vous êtes au sommet de l'échelle. Certifions-le.",
  },
};

export default function FreeFrenchTest({ lang = "en", setLang }) {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current, finished]);

  const handleNext = () => {
    if (!selected) return;

    const newScore = score + (selected === q.answer ? 1 : 0);

    if (current === QUESTIONS.length - 1) {
      setScore(newScore);
      setAnalyzing(true);
      return;
    }

    setScore(newScore);
    setCurrent((prev) => prev + 1);
    setSelected("");
  };

  useEffect(() => {
    if (!analyzing) return;
    const timer = setTimeout(() => {
      setAnalyzing(false);
      setShown(0);
      setDone(false);
      setFinished(true);
    }, 3200);
    return () => clearTimeout(timer);
  }, [analyzing]);

  const level = getLevel(score);
  const finalIdx = LEVELS.findIndex((l) => l.name === level);

  useEffect(() => {
    if (!finished) return;
    if (shown >= finalIdx) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => setShown((n) => n + 1), 450);
    return () => clearTimeout(timer);
  }, [finished, shown, finalIdx]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        dur: 3 + Math.random() * 2.5,
        color: ["#c9a84c", "#e4c97e", "#ffffff", "#002395", "#ED2939"][i % 5],
      })),
    [finished]
  );

  const goTo = (id) => navigate("/#" + id);

  const restart = () => {
    setAnalyzing(false);
    setShown(0);
    setDone(false);
    setCurrent(0);
    setSelected("");
    setScore(0);
    setFinished(false);
  };

  const labels =
    lang === "fr"
      ? {
          home: "Accueil",
          kicker: "Test en ligne gratuit",
          title1: "Découvrez votre",
          title2: "niveau de français",
          intro:
            "Répondez à quelques questions et obtenez une indication rapide de votre niveau de français, de A1 à C2.",
          free: "100 % Gratuit",
          online: "En ligne",
          levels: "A1 → C2",
          question: "Question",
          next: current === QUESTIONS.length - 1 ? "Voir mon résultat" : "Question suivante",
          resultKicker: "Votre résultat",
          resultTitle: "Votre niveau estimé",
          score: "Score",
          official:
            "Ce test gratuit donne une indication rapide de votre niveau. Pour une évaluation complète et officielle, nous vous recommandons de passer notre test de niveau IFA.",
          officialBtn: "Passer le test officiel",
          retry: "Recommencer",
          analyzing: "Analyse de votre français…",
          skills: ["Grammaire", "Vocabulaire", "Compréhension", "Niveau de français"],
          congrats: "Félicitations !",
          welcomeTitle1: "Bienvenue à l'",
          welcomeTitle2: "Académie Française Internationale",
          welcomeText: "Votre résultat n'est qu'un début. À l'IFA, nous croyons que chacun peut apprendre le français avec le bon accompagnement. Apprendre. Pratiquer. Progresser. Certifier.",
          whyTitle: "Pourquoi apprendre avec l'IFA ?",
          why: [["🇫🇷", "Apprentissage expert"], ["📚", "Programmes A1 → C2"], ["🎓", "Certification"], ["💻", "Plateforme moderne"], ["👨‍🏫", "Apprentissage structuré"]],
          ready: "Prêt(e) à passer au niveau supérieur ?",
          enroll: "🚀 Je suis prêt(e) — M'inscrire à l'IFA",
          courses: "Découvrir nos cours",
          footer: "International French Academy · Kigali, Rwanda",
        }
      : {
          home: "Home",
          kicker: "Free Online Test",
          title1: "Discover your",
          title2: "French level",
          intro:
            "Answer a few questions and get a quick indication of your French level, from A1 to C2.",
          free: "100% Free",
          online: "Online",
          levels: "A1 → C2",
          question: "Question",
          next: current === QUESTIONS.length - 1 ? "See My Result" : "Next Question",
          resultKicker: "Your Result",
          resultTitle: "Your Estimated Level",
          score: "Score",
          official:
            "This free test gives you a quick indication of your level. For a complete and official assessment, we recommend taking the IFA official level test.",
          officialBtn: "Take Official Level Test",
          retry: "Try Again",
          analyzing: "Analyzing your French skills…",
          skills: ["Grammar", "Vocabulary", "Comprehension", "French level"],
          congrats: "Congratulations!",
          welcomeTitle1: "Welcome to ",
          welcomeTitle2: "International French Academy",
          welcomeText: "Your result is only the beginning. At IFA we believe everyone can learn French with the right guidance, practice and support. Learn. Practice. Progress. Certify.",
          whyTitle: "Why learn with IFA?",
          why: [["🇫🇷", "Expert French Learning"], ["📚", "A1 → C2 Programs"], ["🎓", "Certification"], ["💻", "Modern Student Platform"], ["👨‍🏫", "Structured Learning"]],
          ready: "Ready to take your French to the next level?",
          enroll: "🚀 I'm Ready — Enroll at IFA",
          courses: "Explore Our French Courses",
          footer: "International French Academy · Kigali, Rwanda",
        };

  return (
    <div className="free-page">
      <style>{styles}</style>

      <header className="free-header">
        <Link to="/" className="free-brand">
          <img
            src="/logo.png"
            alt="International French Academy"
            className="free-logo"
          />

          <div className="free-brand-name">
            International French Academy
            <small>Kigali, Rwanda</small>
          </div>
        </Link>

        <Link to="/" className="free-home">
          {labels.home}
        </Link>
      </header>

      {analyzing ? (
        <main className="analyzing-wrap">
          <div className="analyzing-card">
            <div className="analyzing-spin" />
            <h2>{labels.analyzing}</h2>
            <div className="analyzing-skills">
              {labels.skills.map((sk, i) => (
                <span key={sk} style={{ animationDelay: `${0.4 + i * 0.6}s` }}>
                  {sk}
                  {i < labels.skills.length - 1 ? " •" : ""}
                </span>
              ))}
            </div>
          </div>
        </main>
      ) : !finished ? (
        <>
          <div className="free-intro">
            <div className="free-kicker">
              <span className="free-kicker-dot" />
              🇫🇷 {labels.kicker}
            </div>

            <h1>
              {labels.title1}
              <br />
              <span>{labels.title2}</span>
            </h1>

            <p>{labels.intro}</p>

            <div className="free-features">
              <span className="free-feature">
                <strong>✓</strong>
                {labels.free}
              </span>

              <span className="free-feature">
                <strong>✓</strong>
                {labels.online}
              </span>

              <span className="free-feature">
                <strong>✓</strong>
                {labels.levels}
              </span>
            </div>
          </div>

          <main className="free-test-shell">
            <div className="free-card">
              <div className="free-card-top">
                <div className="free-progress-row">
                  <span className="free-progress-text">
                    {labels.question} {current + 1} / {QUESTIONS.length}
                  </span>

                  <span className="free-question-level">
                    {q.level}
                  </span>
                </div>

                <div className="free-progress">
                  <div
                    className="free-progress-fill"
                    style={{
                      width: `${((current + 1) / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="free-card-body">
                <div className="free-question-number">
                  International French Academy
                </div>

                <h2 className="free-question">
                  {q.question}
                </h2>

                <div className="free-options">
                  {q.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`free-option ${
                          selected === option ? "selected" : ""
                        }`}
                        onClick={() => setSelected(option)}
                      >
                        <span className="free-option-letter">
                          {letter}
                        </span>

                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="free-next"
                  disabled={!selected}
                  onClick={handleNext}
                >
                  {labels.next} →
                </button>
              </div>
            </div>
          </main>
        </>
      ) : (
        <main className="free-result">
          {done &&
            confetti.map((c, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${c.left}%`,
                  background: c.color,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.dur}s`,
                }}
              />
            ))}

          <div className="result-card">
            <div className="result-top">
              <div className="result-small">{labels.resultKicker}</div>

              <h1 className="result-title">{labels.resultTitle}</h1>

              <div className={`result-level${done ? " pop" : ""}`}>
                {LEVELS[shown].name}
              </div>

              <div className="result-ladder">
                {LEVELS.map((l, i) => (
                  <span key={l.name} className={i <= shown ? "on" : ""} />
                ))}
              </div>
            </div>

            {done && (
              <div className="result-body result-reveal">
                <div className="result-congrats">
                  🎉 {labels.congrats} {level}
                </div>

                <div className="result-levelname">{LEVELS[finalIdx].label}</div>

                <div className="result-score">
                  {labels.score}: {score} / {QUESTIONS.length}
                </div>

                <p className="result-description">
                  {getLevelDescription(level, lang)} {WELCOME_MSG[lang][level]}
                </p>

                <div className="result-notice">{labels.official}</div>

                <div className="welcome-block">
                  <h2>
                    {labels.welcomeTitle1}
                    <span>{labels.welcomeTitle2}</span> 🇫🇷
                  </h2>

                  <p>{labels.welcomeText}</p>

                  <div className="welcome-why-title">{labels.whyTitle}</div>

                  <div className="welcome-why">
                    {labels.why.map(([ic, tx]) => (
                      <div key={tx}>
                        <b>{ic}</b>
                        {tx}
                      </div>
                    ))}
                  </div>

                  <div className="welcome-ready">{labels.ready}</div>

                  <div className="result-actions">
                    <button
                      type="button"
                      className="result-btn result-btn-enroll"
                      onClick={() => goTo("contact")}
                    >
                      {labels.enroll}
                    </button>

                    <button
                      type="button"
                      className="result-btn result-btn-ghost"
                      onClick={() => goTo("pricing")}
                    >
                      {labels.courses}
                    </button>
                  </div>

                  <div className="welcome-links">
                    <Link to="/tests">{labels.officialBtn}</Link>

                    <button type="button" onClick={restart}>
                      {labels.retry}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      <footer className="free-footer">
        <strong>IFA</strong> · {labels.footer}
      </footer>
    </div>
  );
}