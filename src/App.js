import { useState, useEffect, useRef } from "react";

// ─── TRANSLATIONS ───────────────────────────────────────────────────────────
const T = {
  en: {
    nav: {
      about: "About",
      vision: "Vision",
      method: "Method",
      certifications: "Certifications",
      why: "Why Us",
      place: "Our Place",
      enroll: "Enroll Now",
    },
    hero: {
      badge: "Professional French Language Academy",
      title1: "International",
      title2: "French Academy",
      sub: "The knowledge of today builds the success of tomorrow",
      subFr: "Le savoir d'aujourd'hui construit le succès de demain",
      cta1: "Start Learning French",
      cta2: "View Certifications",
      stat1: "Certifications",
      stat2: "Guided Support",
      stat3: "Academy in Rwanda",
      stat4: "Opportunities",
    },
    about: {
      eyebrow: "About Us",
      title: "Rwanda's Premier French Language Academy",
      p1: "International French Academy is a professional French language institution based in Kigali, Rwanda. We specialize in preparing students for internationally recognized French certifications, opening doors to global opportunities.",
      p2: "Our expert FLE trainers provide structured, exam-focused training in a modern, comfortable environment — from first lesson to final certification.",
      cardTitle: "Académie Professionnelle de la Langue Française",
      cardText: "We are the professional French language academy in Rwanda, offering bilingual support in both French and English throughout your learning journey.",
      cardTag: "Bilingual French & English Support",
      location: "Norrsken House, Kigali – Rwanda",
    },
    video: {
      eyebrow: "Our Campus",
      title: "Study at Norrsken House",
      sub: "Discover our world-class learning environment in the heart of Kigali.",
    },
    vision: {
      eyebrow: "Our Foundation",
      title: "Vision & Mission",
      visionTitle: "Our Vision",
      visionItems: [
        "Enable students to earn internationally recognized French certificates",
        "Be Rwanda's leading institution for French language excellence",
        "Connect Rwandans to a world of Francophone opportunities",
      ],
      missionTitle: "Our Mission",
      missionItems: [
        "Prepare students for international French language exams",
        "Promote multilingual skills and global opportunities",
        "Develop strong French communication skills",
        "Support students from first lesson to final certification",
      ],
    },
    method: {
      eyebrow: "How We Teach",
      title: "Our Method",
      sub: "A proven, structured approach designed to get you certified efficiently and confidently.",
      steps: [
        {
          title: "Practice with Real Exam Questions",
          desc: "Train on authentic past exam papers from DELF, DALF, TCF, TEF — so you know exactly what to expect on test day.",
        },
        {
          title: "Regular Progress Evaluation",
          desc: "Frequent assessments track your progress and identify areas for improvement, keeping your learning on course.",
        },
        {
          title: "Continuous Support & Guidance",
          desc: "Our qualified FLE trainers provide personalized coaching from enrollment right through to your certification.",
        },
      ],
    },
    cert: {
      eyebrow: "Qualifications",
      title: "Certification Support",
      sub: "We prepare you for all major internationally recognized French language qualifications.",
      whyTitle: "Why Get a French Certification?",
      benefits: [
        {
          icon: "💼",
          title: "Career Boost",
          desc: "Strengthen your professional profile and stand out to international employers.",
        },
        {
          icon: "🌍",
          title: "International Orgs",
          desc: "Qualify for roles at the UN, AU, and other global organizations requiring French.",
        },
        {
          icon: "✈️",
          title: "Immigration",
          desc: "Facilitates secure immigration to French-speaking countries like France and Canada.",
        },
      ],
    },
    why: {
      eyebrow: "Our Advantage",
      title: "Why Choose Us?",
      cards: [
        {
          icon: "👨‍🏫",
          title: "Expert FLE Trainers",
          desc: "Certified French as a Foreign Language specialists with deep exam expertise and genuine passion for teaching.",
        },
        {
          icon: "🏆",
          title: "End-to-End Certification Support",
          desc: "We walk with you from day one to certification day — guiding, coaching and preparing you every step of the way.",
        },
        {
          icon: "🎮",
          title: "Interactive & Practical Learning",
          desc: "Real conversations, role plays, and practical exercises for real-world French fluency.",
        },
      ],
    },
    place: {
      eyebrow: "Where We Learn",
      title: "Learning Environment",
      sub: "Study in an inspiring, modern environment designed for focused learning and personal growth at Norrsken House.",
      features: [
        { icon: "💡", title: "Modern Facilities", desc: "State-of-the-art classrooms with audio-visual tools for an immersive French experience." },
        { icon: "🌐", title: "Comfort & Modernity", desc: "Study at one of Kigali's premier innovation hubs, surrounded by a dynamic professional community." },
        { icon: "📍", title: "Prime Location", desc: "Conveniently located at Norrsken House, Kigali — easily accessible from all parts of the city." },
      ],
    },
    cta: {
      title: "Mission Accomplie – Start Yours",
      tagline: "Learn French. Earn your Certificate. Transform your Future.",
      taglineFr: "Apprenez le français. Obtenez votre Certificat. Transformez votre Avenir.",
      btn1: "Enroll Today",
      btn2: "Contact Us",
    },
    contact: {
      title: "Get in Touch",
      sub: "Ready to start your French journey? We'd love to hear from you.",
      form: {
        title: "Enroll Now",
        first: "First Name",
        last: "Last Name",
        firstPh: "Your first name",
        lastPh: "Your last name",
        email: "Email Address",
        emailPh: "your@email.com",
        phone: "Phone Number",
        phonePh: "+250 7xx xxx xxx",
        cert: "Certification Goal",
        certOpts: ["Select a certification…", "DELF (A1–B2)", "DALF (C1–C2)", "TCF", "TEF", "DILF (A1.1)", "DFP", "General French (Beginner)", "Not sure – advise me"],
        msg: "Message (optional)",
        msgPh: "Tell us about your French learning goals…",
        submit: "Send Enrollment Request →",
        sent: "✓ Request Sent! We will contact you shortly.",
      },
    },
    footer: {
      copy: "© 2026 International French Academy. Kigali, Rwanda.",
      tagline: "Le savoir d'aujourd'hui construit le succès de demain",
    },
  },
  fr: {
    nav: {
      about: "À Propos",
      vision: "Vision",
      method: "Méthode",
      certifications: "Certifications",
      why: "Pourquoi Nous",
      place: "Notre Lieu",
      enroll: "S'inscrire",
    },
    hero: {
      badge: "Académie Professionnelle de Langue Française",
      title1: "Académie",
      title2: "Française Internationale",
      sub: "Le savoir d'aujourd'hui construit le succès de demain",
      subFr: "The knowledge of today builds the success of tomorrow",
      cta1: "Commencer l'apprentissage",
      cta2: "Voir les certifications",
      stat1: "Certifications",
      stat2: "Accompagnement",
      stat3: "Académie au Rwanda",
      stat4: "Opportunités",
    },
    about: {
      eyebrow: "À Propos",
      title: "La Première Académie de Français au Rwanda",
      p1: "L'Académie Française Internationale est une institution professionnelle de langue française basée à Kigali, au Rwanda. Nous nous spécialisons dans la préparation des étudiants aux certifications françaises internationalement reconnues.",
      p2: "Nos formateurs FLE experts offrent une formation structurée et axée sur les examens dans un environnement moderne et confortable — du premier cours jusqu'à la certification finale.",
      cardTitle: "Académie Professionnelle de la Langue Française",
      cardText: "Nous sommes l'académie professionnelle de langue française au Rwanda, offrant un soutien bilingue en français et en anglais tout au long de votre parcours d'apprentissage.",
      cardTag: "Soutien Bilingue Français & Anglais",
      location: "Norrsken House, Kigali – Rwanda",
    },
    video: {
      eyebrow: "Notre Campus",
      title: "Étudier à Norrsken House",
      sub: "Découvrez notre environnement d'apprentissage de classe mondiale au cœur de Kigali.",
    },
    vision: {
      eyebrow: "Notre Fondation",
      title: "Vision & Mission",
      visionTitle: "Notre Vision",
      visionItems: [
        "Permettre aux étudiants d'obtenir des certificats français reconnus internationalement",
        "Être l'institution de référence pour l'excellence du français au Rwanda",
        "Connecter les Rwandais à un monde d'opportunités francophones",
      ],
      missionTitle: "Notre Mission",
      missionItems: [
        "Préparer les étudiants aux examens internationaux de langue française",
        "Promouvoir les compétences multilingues et les opportunités mondiales",
        "Développer de solides compétences en communication en français",
        "Accompagner les étudiants du premier cours à la certification finale",
      ],
    },
    method: {
      eyebrow: "Notre Pédagogie",
      title: "Notre Méthode",
      sub: "Une approche structurée et éprouvée conçue pour vous amener à la certification efficacement et en toute confiance.",
      steps: [
        {
          title: "Pratique avec de vrais examens",
          desc: "Entraînez-vous sur d'authentiques épreuves passées du DELF, DALF, TCF, TEF — pour savoir exactement à quoi s'attendre le jour J.",
        },
        {
          title: "Évaluation régulière de la progression",
          desc: "Des évaluations fréquentes suivent votre progression et identifient les axes d'amélioration, maintenant votre apprentissage sur la bonne voie.",
        },
        {
          title: "Accompagnement et soutien continus",
          desc: "Nos formateurs FLE qualifiés offrent un coaching personnalisé de l'inscription jusqu'à l'obtention de votre certification.",
        },
      ],
    },
    cert: {
      eyebrow: "Qualifications",
      title: "Accompagnement à la Certification",
      sub: "Nous vous préparons à toutes les principales qualifications de langue française reconnues internationalement.",
      whyTitle: "Pourquoi obtenir une certification française ?",
      benefits: [
        {
          icon: "💼",
          title: "Profil Professionnel",
          desc: "Renforcez votre profil professionnel et démarquez-vous auprès des employeurs internationaux.",
        },
        {
          icon: "🌍",
          title: "Organisations Internationales",
          desc: "Accédez à des postes à l'ONU, à l'UA et dans d'autres organisations mondiales nécessitant le français.",
        },
        {
          icon: "✈️",
          title: "Immigration",
          desc: "Facilite l'immigration sécurisée vers les pays francophones comme la France et le Canada.",
        },
      ],
    },
    why: {
      eyebrow: "Notre Avantage",
      title: "Pourquoi nous choisir ?",
      cards: [
        {
          icon: "👨‍🏫",
          title: "Formateurs FLE Experts",
          desc: "Spécialistes certifiés en FLE avec une expertise approfondie des examens et une véritable passion pour l'enseignement.",
        },
        {
          icon: "🏆",
          title: "Accompagnement complet",
          desc: "Nous vous accompagnons du premier jour au jour de la certification — guidage, coaching et préparation à chaque étape.",
        },
        {
          icon: "🎮",
          title: "Apprentissage interactif",
          desc: "Vraies conversations, jeux de rôle et exercices pratiques pour une maîtrise du français dans la vie réelle.",
        },
      ],
    },
    place: {
      eyebrow: "Où Nous Apprenons",
      title: "Lieu d'Apprentissage",
      sub: "Étudiez dans un environnement inspirant et moderne conçu pour un apprentissage concentré à Norrsken House.",
      features: [
        { icon: "💡", title: "Équipements Modernes", desc: "Salles de classe dotées d'outils audiovisuels pour une expérience française immersive." },
        { icon: "🌐", title: "Confort & Modernité", desc: "Étudiez dans l'un des hubs d'innovation phares de Kigali, au sein d'une communauté professionnelle dynamique." },
        { icon: "📍", title: "Emplacement Idéal", desc: "Situé à Norrsken House, Kigali — facilement accessible depuis toutes les parties de la ville." },
      ],
    },
    cta: {
      title: "Mission Accomplie – Commencez la Vôtre",
      tagline: "Apprenez le français. Obtenez votre Certificat. Transformez votre Avenir.",
      taglineFr: "Learn French. Earn your Certificate. Transform your Future.",
      btn1: "S'inscrire Maintenant",
      btn2: "Nous Contacter",
    },
    contact: {
      title: "Contactez-Nous",
      sub: "Prêt à commencer votre parcours en français ? Nous serons ravis de vous entendre.",
      form: {
        title: "Inscrivez-vous",
        first: "Prénom",
        last: "Nom",
        firstPh: "Votre prénom",
        lastPh: "Votre nom",
        email: "Adresse e-mail",
        emailPh: "votre@email.com",
        phone: "Numéro de téléphone",
        phonePh: "+250 7xx xxx xxx",
        cert: "Objectif de certification",
        certOpts: ["Choisir une certification…", "DELF (A1–B2)", "DALF (C1–C2)", "TCF", "TEF", "DILF (A1.1)", "DFP", "Français général (Débutant)", "Pas encore sûr(e)"],
        msg: "Message (facultatif)",
        msgPh: "Parlez-nous de vos objectifs en français…",
        submit: "Envoyer la demande d'inscription →",
        sent: "✓ Demande envoyée ! Nous vous contacterons bientôt.",
      },
    },
    footer: {
      copy: "© 2026 Académie Française Internationale. Kigali, Rwanda.",
      tagline: "Le savoir d'aujourd'hui construit le succès de demain",
    },
  },
};

// ─── HOOK: scroll into view ──────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&display=swap');

  :root {
    --navy: #0d1b2a;
    --deep-blue: #1a2e47;
    --mid-blue: #1e3a5f;
    --gold: #c9a84c;
    --gold-light: #e4c97e;
    --cream: #f8f4ee;
    --cream-dark: #ede8df;
    --white: #ffffff;
    --text-dark: #1a1a2e;
    --text-mid: #3d4a5c;
    --text-light: #6b7a8d;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text-dark); overflow-x: hidden; }

  /* NAV */
  .ifa-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 68px;
    background: rgba(13,27,42,0.97);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(201,168,76,0.18);
    transition: height 0.3s;
  }
  .ifa-nav.scrolled { height: 58px; }
  .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; }
  .nav-flag { display: flex; width: 30px; height: 20px; border-radius: 3px; overflow: hidden; }
  .nav-flag span { flex: 1; }
  .nf1 { background: #002395; } .nf2 { background: #fff; } .nf3 { background: #ED2939; }
  .nav-logo-text { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: #fff; line-height: 1.1; }
  .nav-logo-text small { color: var(--gold); display: block; font-size: 0.6rem; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; }
  .nav-links { display: flex; list-style: none; gap: 1.6rem; align-items: center; }
  .nav-links a { text-decoration: none; color: rgba(255,255,255,0.7); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; background: none; border: none; cursor: pointer; transition: color 0.25s; font-family: 'DM Sans', sans-serif; }
  .nav-links a:hover { color: var(--gold-light); }
  .nav-cta-btn { background: var(--gold) !important; color: var(--navy) !important; padding: 0.45rem 1.1rem !important; border-radius: 3px !important; font-weight: 700 !important; }
  .nav-cta-btn:hover { background: var(--gold-light) !important; }
  .lang-toggle {
    display: flex; align-items: center; gap: 0; border: 1.5px solid rgba(201,168,76,0.35); border-radius: 20px; overflow: hidden; margin-left: 0.5rem;
  }
  .lang-btn {
    background: none; border: none; padding: 0.3rem 0.75rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; cursor: pointer; color: rgba(255,255,255,0.5); font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .lang-btn.active { background: var(--gold); color: var(--navy); }
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
  .hamburger span { width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s; display: block; }

  /* MOBILE MENU */
  .mobile-menu {
    display: none; position: fixed; top: 68px; left: 0; right: 0; bottom: 0;
    background: rgba(13,27,42,0.98); backdrop-filter: blur(20px);
    z-index: 999; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { text-decoration: none; color: #fff; font-size: 1.3rem; font-family: 'Playfair Display', serif; cursor: pointer; background: none; border: none; transition: color 0.25s; font-weight: 700; }
  .mobile-menu a:hover { color: var(--gold); }
  .mobile-lang { display: flex; gap: 1rem; margin-top: 1rem; }
  .mobile-lang button { background: none; border: 1.5px solid rgba(201,168,76,0.4); color: rgba(255,255,255,0.6); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .mobile-lang button.active { background: var(--gold); color: var(--navy); border-color: var(--gold); }

  /* HERO */
  .hero {
    min-height: 100vh; background: linear-gradient(135deg, var(--navy) 0%, var(--deep-blue) 50%, #0a1628 100%);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 5rem 2rem 3rem; text-align: center;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle at 20% 50%, rgba(201,168,76,0.07) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0,35,149,0.12) 0%, transparent 40%),
      radial-gradient(circle at 60% 80%, rgba(237,41,57,0.05) 0%, transparent 35%);
  }
  .hero::after {
    content: ''; position: absolute; inset: 0;
    background-image: repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(255,255,255,0.01) 60px, rgba(255,255,255,0.01) 61px);
  }
  .tricolor { position: absolute; top: 0; left: 0; right: 0; height: 4px; display: flex; }
  .tricolor span { flex: 1; }
  .tc1 { background: #002395; } .tc2 { background: #fff; } .tc3 { background: #ED2939; }
  .hero-inner { position: relative; z-index: 2; max-width: 860px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3);
    color: var(--gold-light); padding: 0.45rem 1.2rem; border-radius: 40px;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 1.8rem; animation: fdDown 0.8s ease both;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 7vw, 5.2rem); font-weight: 900; color: #fff; line-height: 1.05;
    margin-bottom: 1.2rem; animation: fdDown 0.8s 0.15s ease both;
  }
  .hero-title .gold { color: var(--gold); font-style: italic; }
  .hero-sub { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(1.05rem, 2.5vw, 1.5rem); color: rgba(255,255,255,0.6); margin-bottom: 0.4rem; animation: fdDown 0.8s 0.25s ease both; }
  .hero-sub2 { font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 2.8rem; animation: fdDown 0.8s 0.35s ease both; }
  .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3.5rem; animation: fdDown 0.8s 0.45s ease both; }
  .btn-gold { background: var(--gold); color: var(--navy); padding: 0.85rem 2rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; transition: all 0.25s; display: inline-block; font-family: 'DM Sans', sans-serif; }
  .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(201,168,76,0.35); }
  .btn-outline-w { background: transparent; color: #fff; padding: 0.85rem 2rem; border-radius: 4px; font-weight: 500; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; border: 1.5px solid rgba(255,255,255,0.25); cursor: pointer; transition: all 0.25s; display: inline-block; font-family: 'DM Sans', sans-serif; }
  .btn-outline-w:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }
  .hero-stats { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; animation: fdDown 0.8s 0.55s ease both; }
  .stat-item { text-align: center; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: var(--gold); display: block; }
  .stat-label { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); }

  /* SECTION SHARED */
  section { padding: 5.5rem 2rem; }
  .container { max-width: 1080px; margin: 0 auto; }
  .eyebrow { font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.6rem; }
  .eyebrow::before { content: ''; width: 22px; height: 1.5px; background: var(--gold); display: inline-block; }
  .sec-title { font-family: 'Playfair Display', serif; font-size: clamp(1.7rem, 3.5vw, 2.8rem); font-weight: 700; line-height: 1.15; margin-bottom: 1.1rem; }
  .sec-title.light { color: #fff; }
  .sec-sub { font-size: 1rem; color: var(--text-mid); line-height: 1.8; max-width: 580px; }

  .fade-anim { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-anim.vis { opacity: 1; transform: translateY(0); }

  /* ABOUT */
  #about { background: #fff; }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4.5rem; align-items: center; }
  .about-card { background: linear-gradient(135deg, var(--navy) 0%, var(--mid-blue) 100%); border-radius: 12px; padding: 2.5rem; position: relative; overflow: hidden; }
  .about-card::before { content: '🇫🇷'; position: absolute; top: -15px; right: -15px; font-size: 8rem; opacity: 0.06; }
  .about-card-flag { display: flex; width: 52px; height: 36px; border-radius: 5px; overflow: hidden; margin-bottom: 1.3rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .about-card-flag span { flex: 1; }
  .about-card h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: #fff; margin-bottom: 0.7rem; }
  .about-card p { color: rgba(255,255,255,0.6); font-size: 0.87rem; line-height: 1.7; }
  .about-tag { display: inline-block; background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.28); color: var(--gold); padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; margin-top: 1.3rem; }
  .loc-badge { display: flex; align-items: center; gap: 0.4rem; margin-top: 1.2rem; color: rgba(255,255,255,0.45); font-size: 0.8rem; }

  /* VIDEO SECTION */
  #video-sec { background: var(--navy); padding: 5rem 2rem; }
  .video-header { text-align: center; margin-bottom: 2.5rem; }
  .video-wrap { position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.5); max-width: 900px; margin: 0 auto; border: 1px solid rgba(201,168,76,0.2); }
  .video-wrap video { width: 100%; display: block; max-height: 520px; object-fit: cover; }
  .video-overlay-bar { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(13,27,42,0.85)); padding: 2rem 1.5rem 1.2rem; }
  .video-overlay-bar p { color: rgba(255,255,255,0.7); font-size: 0.82rem; letter-spacing: 0.04em; }
  .video-overlay-bar strong { color: var(--gold); }

  /* VISION */
  #vision { background: linear-gradient(160deg, var(--navy) 0%, #0d1f38 100%); position: relative; overflow: hidden; }
  #vision::before { content: ''; position: absolute; top: -150px; right: -150px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%); }
  .vm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  .vm-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 2.2rem; transition: transform 0.3s, border-color 0.3s; }
  .vm-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.28); }
  .vm-icon { width: 48px; height: 48px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.22); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 1.3rem; }
  .vm-card h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: var(--gold); margin-bottom: 1rem; }
  .vm-list { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
  .vm-list li { display: flex; align-items: flex-start; gap: 0.7rem; color: rgba(255,255,255,0.65); font-size: 0.87rem; line-height: 1.6; }
  .vm-list li::before { content: ''; width: 6px; height: 6px; background: var(--gold); border-radius: 50%; margin-top: 0.52rem; flex-shrink: 0; }

  /* METHOD */
  #method { background: var(--cream); }
  .method-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem; margin-top: 2.8rem; }
  .m-card { background: #fff; border-radius: 12px; padding: 2.2rem 1.8rem; border: 1px solid var(--cream-dark); position: relative; overflow: hidden; transition: all 0.3s; }
  .m-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(13,27,42,0.1); border-color: var(--gold); }
  .m-num { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; color: rgba(201,168,76,0.1); line-height: 1; position: absolute; top: 0.8rem; right: 1.2rem; }
  .m-icon { width: 46px; height: 46px; background: linear-gradient(135deg, var(--navy), var(--mid-blue)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
  .m-card h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--text-dark); margin: 0.9rem 0 0.6rem; }
  .m-card p { font-size: 0.84rem; color: var(--text-light); line-height: 1.7; }

  /* CERTIFICATIONS */
  #cert { background: #fff; }
  .cert-top { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-bottom: 3.5rem; }
  .cert-tags { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-top: 1.8rem; }
  .cert-tag { background: linear-gradient(135deg, var(--navy), var(--mid-blue)); color: #fff; padding: 0.55rem 1.2rem; border-radius: 6px; font-weight: 700; font-size: 0.82rem; letter-spacing: 0.08em; transition: all 0.25s; cursor: default; }
  .cert-tag:hover { transform: translateY(-3px); background: linear-gradient(135deg, var(--mid-blue), var(--gold)); box-shadow: 0 6px 18px rgba(13,27,42,0.2); }
  .benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.3rem; }
  .b-card { background: linear-gradient(160deg, var(--navy), var(--deep-blue)); border-radius: 10px; padding: 1.8rem; text-align: center; border: 1px solid rgba(201,168,76,0.08); transition: all 0.3s; }
  .b-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-4px); }
  .b-icon { font-size: 1.8rem; margin-bottom: 0.8rem; display: block; }
  .b-card h4 { font-family: 'Playfair Display', serif; color: var(--gold); font-size: 0.95rem; margin-bottom: 0.45rem; }
  .b-card p { color: rgba(255,255,255,0.5); font-size: 0.8rem; line-height: 1.6; }

  /* WHY */
  #why { background: var(--cream); }
  .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem; margin-top: 2.8rem; }
  .w-card { background: #fff; border-radius: 12px; padding: 1.8rem; border-left: 4px solid var(--gold); transition: all 0.3s; }
  .w-card:hover { transform: translateX(4px); box-shadow: 0 10px 30px rgba(13,27,42,0.08); }
  .w-icon { font-size: 1.7rem; margin-bottom: 0.8rem; display: block; }
  .w-card h3 { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--text-dark); margin-bottom: 0.4rem; }
  .w-card p { font-size: 0.83rem; color: var(--text-light); line-height: 1.7; }

  /* PLACE */
  #place { background: linear-gradient(160deg, var(--navy) 0%, #071523 100%); position: relative; overflow: hidden; }
  .place-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .p-feat { display: flex; gap: 1rem; align-items: flex-start; padding: 1.3rem; background: rgba(255,255,255,0.04); border-radius: 10px; margin-bottom: 0.9rem; border: 1px solid rgba(255,255,255,0.05); }
  .p-feat-icon { font-size: 1.5rem; flex-shrink: 0; }
  .p-feat h4 { color: #fff; font-size: 0.92rem; font-weight: 600; margin-bottom: 0.25rem; }
  .p-feat p { color: rgba(255,255,255,0.45); font-size: 0.8rem; line-height: 1.6; }
  .norrsken-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.22); color: var(--gold-light); padding: 0.55rem 1.1rem; border-radius: 6px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em; margin-top: 1.8rem; }

  /* CTA */
  #cta { background: linear-gradient(135deg, var(--gold) 0%, #a8893d 100%); padding: 5rem 2rem; text-align: center; }
  .cta-inner { max-width: 680px; margin: 0 auto; }
  #cta h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900; color: var(--navy); margin-bottom: 0.8rem; }
  .cta-tag { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.2rem; color: rgba(13,27,42,0.65); margin-bottom: 0.5rem; }
  .cta-sub { font-size: 0.8rem; color: rgba(13,27,42,0.45); margin-bottom: 2.2rem; }
  .btn-navy { background: var(--navy); color: #fff; padding: 0.9rem 2.2rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; display: inline-block; border: none; cursor: pointer; transition: all 0.25s; font-family: 'DM Sans', sans-serif; margin: 0 0.4rem; }
  .btn-navy:hover { background: var(--deep-blue); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(13,27,42,0.3); }
  .btn-navy-outline { background: transparent; color: var(--navy); padding: 0.9rem 2.2rem; border-radius: 4px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; display: inline-block; border: 2px solid var(--navy); cursor: pointer; transition: all 0.25s; font-family: 'DM Sans', sans-serif; margin: 0 0.4rem; }
  .btn-navy-outline:hover { background: rgba(13,27,42,0.1); transform: translateY(-2px); }
  .cta-inner { display: flex; flex-direction: column; align-items: center; }
  .cta-inner h2, .cta-inner p { width: 100%; text-align: center; }
  .cta-btns { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; margin-top: 0.5rem; }
  .btn-navy, .btn-navy-outline { padding: 0.9rem 2.5rem; font-size: 0.85rem; width: 280px; text-align: center; }

  /* CONTACT */
  #contact { background: var(--navy); }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
  .c-info h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #fff; margin-bottom: 0.5rem; }
  .c-info p { color: rgba(255,255,255,0.45); font-size: 0.87rem; margin-bottom: 2.2rem; }
  .c-items { display: flex; flex-direction: column; gap: 1.1rem; }
  .c-item { display: flex; align-items: flex-start; gap: 1rem; }
  .c-icon { width: 40px; height: 40px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .c-text strong { display: block; color: #fff; font-size: 0.82rem; margin-bottom: 0.2rem; }
  .c-text span, .c-text a { color: rgba(255,255,255,0.45); font-size: 0.82rem; }
  .c-text a { color: var(--gold-light); text-decoration: none; }
  .c-text a:hover { text-decoration: underline; }
  .c-form { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 2.2rem; }
  .c-form h3 { font-family: 'Playfair Display', serif; color: #fff; font-size: 1.25rem; margin-bottom: 1.4rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
  .fg { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.9rem; }
  .fg label { font-size: 0.75rem; color: rgba(255,255,255,0.45); letter-spacing: 0.07em; text-transform: uppercase; }
  .fg input, .fg select, .fg textarea { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 0.7rem 0.9rem; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.87rem; outline: none; transition: border-color 0.25s; width: 100%; }
  .fg input::placeholder, .fg textarea::placeholder { color: rgba(255,255,255,0.22); }
  .fg input:focus, .fg select:focus, .fg textarea:focus { border-color: var(--gold); }
  .fg select option { background: var(--navy); }
  .fg textarea { resize: vertical; min-height: 90px; }
  .f-submit { width: 100%; background: var(--gold); color: var(--navy); border: none; padding: 0.95rem; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.87rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; margin-top: 0.4rem; }
  .f-submit:hover { background: var(--gold-light); transform: translateY(-2px); }
  .f-submit.sent { background: #2e7d32; color: #fff; }

  /* FOOTER */
  footer { background: #07111c; padding: 2rem 2rem; border-top: 1px solid rgba(255,255,255,0.05); }
  .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; max-width: 1080px; margin: 0 auto; }
  .f-logo { font-family: 'Playfair Display', serif; color: #fff; font-size: 0.95rem; font-weight: 700; }
  .f-logo span { color: var(--gold); font-style: italic; }
  footer p { color: rgba(255,255,255,0.28); font-size: 0.75rem; }

  /* ANIMATIONS */
  @keyframes fdDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .about-grid, .cert-top, .place-grid, .contact-grid, .vm-grid { grid-template-columns: 1fr; gap: 2rem; }
    .method-grid, .why-grid, .benefits-grid { grid-template-columns: 1fr 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
  }
  @media (max-width: 600px) {
    html, body { overflow-x: hidden; max-width: 100vw; }
    section { padding: 4rem 1.2rem; }
    .method-grid, .why-grid, .benefits-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 1.4rem; }
    #cta { padding: 3.5rem 1.2rem; }
    .footer-inner { flex-direction: column; text-align: center; }
    .container { overflow-x: hidden; }
    #video-sec .container > div:last-child { grid-template-columns: 1fr 1fr !important; }
    #testimonials > .container > div:last-child { grid-template-columns: 1fr !important; }
    .cert-top { grid-template-columns: 1fr !important; }
    .benefits-grid { grid-template-columns: 1fr !important; }
    #pricing > .container > div:last-child { grid-template-columns: 1fr !important; }
    #schedule > .container > div:nth-child(2) { grid-template-columns: 1fr !important; }
  }
`;

// ─── FADE WRAPPER ──────────────────────────────────────────────────────────
function HeroStats({ t }) {
  const [ref, visible] = useFadeIn();
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);
  const c1 = useCounter(6, 1500, started);
  const c2 = useCounter(100, 2000, started);
  const c3 = useCounter(1, 1000, started);
  return (
    <div className="hero-stats" ref={ref}>
      <div className="stat-item"><span className="stat-num">{c1}+</span><span className="stat-label">{t.hero.stat1}</span></div>
      <div className="stat-item"><span className="stat-num">{c2}%</span><span className="stat-label">{t.hero.stat2}</span></div>
      <div className="stat-item"><span className="stat-num">{c3}</span><span className="stat-label">{t.hero.stat3}</span></div>
      <div className="stat-item"><span className="stat-num">∞</span><span className="stat-label">{t.hero.stat4}</span></div>
    </div>
  );
}

function FadeIn({ children, delay = 0 }) {
  const [ref, vis] = useFadeIn();
  return (
    <div ref={ref} className={`fade-anim${vis ? " vis" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', certificate: 'TCF Québec', message: '' });
  const t = T[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(process.env.REACT_APP_API_URL || "https://french-academy-backend-six.vercel.app/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          certificationGoal: formData.certificate,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
    }
  };

  const certs = ["TCF Québec", "TEF Québec", "TCF Canada", "TEF Canada", "DELF A1", "DELF A2", "DILF", "DALF C1", "DALF C2", "DFP"];

  return (
    <>
      <style>{styles}</style>
      <a href="https://wa.me/250785302957?text=Hello%2C%20I%20am%20interested%20in%20International%20French%20Academy%20courses!" target="_blank" rel="noopener noreferrer" style={{position:"fixed",bottom:"2rem",right:"2rem",zIndex:9999,background:"#25D366",width:"58px",height:"58px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(37,211,102,0.4)",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* NAV */}
      <nav className={`ifa-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scroll("hero")}>
          
          <img src="logo.png" alt="IFA Logo" style={{width:"42px",height:"42px",borderRadius:"50%",objectFit:"cover",border:"2px solid var(--gold)"}} />
        <div className="nav-logo-text">
            {lang === "en" ? "International French Academy" : "Académie Française Internationale"}
            <small>Kigali, Rwanda</small>
          </div>
        </div>

        <ul className="nav-links">
          {["about","vision","method","cert","why","pricing","place","books"].map(id => (
            <li key={id}><a onClick={() => scroll(id)}>{t.nav[id === "cert" ? "certifications" : id === "pricing" ? (lang==="en"?"Pricing":"Tarifs") : id]}</a></li>
          ))}
          <li>
            <div className="lang-toggle">
              <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>EN</button>
              <button className={`lang-btn${lang === "fr" ? " active" : ""}`} onClick={() => setLang("fr")}>FR</button>
            </div>
          </li>
          <li><a className="nav-cta-btn" onClick={() => scroll("contact")}>{t.nav.enroll}</a></li>
<li><a href="https://french-academy-backend-six.vercel.app/admin" target="_blank" rel="noopener noreferrer" style={{color:"#4ade80",fontSize:"0.72rem",letterSpacing:"0.06em",textTransform:"uppercase",border:"1px solid rgba(74,222,128,0.4)",padding:"0.3rem 0.75rem",borderRadius:"4px",transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(74,222,128,0.15)"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>⚙ Admin</a></li>
        </ul>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span/><span/><span/>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {["about","vision","method","cert","why","place","contact"].map(id => (
          <a key={id} onClick={() => scroll(id)} style={id === "contact" ? { color: "var(--gold)" } : {}}>
            {t.nav[id === "cert" ? "certifications" : id === "contact" ? "enroll" : id]}
          </a>
        ))}
        <a href="https://french-academy-backend-six.vercel.app/admin" target="_blank" rel="noopener noreferrer" style={{color:"#4ade80",fontSize:"0.85rem",border:"1px solid rgba(74,222,128,0.4)",padding:"0.4rem 1.2rem",borderRadius:"4px"}}>⚙ Admin Portal</a>
        <div className="mobile-lang">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <video autoPlay muted loop playsInline style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,opacity:0.35}} src="norrsken.mp4" />
        <div className="tricolor"><span className="tc1"/><span className="tc2"/><span className="tc3"/></div>
        <div className="hero-inner">
          <div className="hero-badge">🇫🇷 {t.hero.badge}</div>
          <h1 className="hero-title">
            {t.hero.title1}<br/><span className="gold">{t.hero.title2}</span>
          </h1>
          <p className="hero-sub">{t.hero.sub}</p>
          <p className="hero-sub2">{t.hero.subFr}</p>
          <div className="hero-ctas">
            <button className="btn-gold" onClick={() => scroll("contact")}>{t.hero.cta1}</button>
            <button className="btn-outline-w" onClick={() => scroll("cert")}>{t.hero.cta2}</button>
          </div>
          <HeroStats t={t} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            <FadeIn>
              <div className="eyebrow">{t.about.eyebrow}</div>
              <h2 className="sec-title">{t.about.title}</h2>
              <p className="sec-sub">{t.about.p1}</p>
              <p className="sec-sub" style={{ marginTop: "1rem" }}>{t.about.p2}</p>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="about-card">
                <div className="about-card-flag">
                  <span style={{ background: "#002395", flex: 1 }}/>
                  <span style={{ background: "#fff", flex: 1 }}/>
                  <span style={{ background: "#ED2939", flex: 1 }}/>
                </div>
                <h3>{t.about.cardTitle}</h3>
                <p>{t.about.cardText}</p>
                <div className="about-tag">🏛️ {t.about.cardTag}</div>
                <div className="loc-badge">📍 {t.about.location}</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video-sec">
        <div className="container">
          <FadeIn>
            <div className="video-header">
              <div className="eyebrow" style={{ justifyContent: "center" }}>{t.video.eyebrow}</div>
              <h2 className="sec-title light">{t.video.title}</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.92rem" }}>{t.video.sub}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gridTemplateRows:"auto",gap:"0.75rem",maxWidth:"960px",margin:"0 auto"}}>
              {[
                "2.webp",
                "3.webp",
                "4.webp",
                "5.webp",
                "6.webp",
                "7.webp"
              ].map((src,n) => (
                <div key={n} style={{borderRadius:"12px",overflow:"hidden",aspectRatio: n===0||n===3?"16/9":"4/3",cursor:"pointer",transition:"all 0.3s",gridColumn:n===0||n===3?"span 7":n===1||n===2||n===4||n===5?"span 5":"span 4"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.4)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  <img src={src} alt={`Campus ${n+1}`} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* VISION */}
      <section id="vision">
        <div className="container">
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="eyebrow" style={{ justifyContent: "center" }}>{t.vision.eyebrow}</div>
              <h2 className="sec-title light">{t.vision.title}</h2>
            </div>
          </FadeIn>
          <div className="vm-grid">
            <FadeIn>
              <div className="vm-card">
                <div className="vm-icon">🔭</div>
                <h3>{t.vision.visionTitle}</h3>
                <ul className="vm-list">
                  {t.vision.visionItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="vm-card">
                <div className="vm-icon">🎯</div>
                <h3>{t.vision.missionTitle}</h3>
                <ul className="vm-list">
                  {t.vision.missionItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section id="method">
        <div className="container">
          <FadeIn>
            <div className="eyebrow">{t.method.eyebrow}</div>
            <h2 className="sec-title">{t.method.title}</h2>
            <p className="sec-sub">{t.method.sub}</p>
          </FadeIn>
          <div className="method-grid">
            {t.method.steps.map((s, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="m-card">
                  <span className="m-num">0{i + 1}</span>
                  <div className="m-icon">{["📝", "📊", "🤝"][i]}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="cert">
        <div className="container">
          <div className="cert-top">
            <FadeIn>
              <div className="eyebrow">{t.cert.eyebrow}</div>
              <h2 className="sec-title">{t.cert.title}</h2>
              <p className="sec-sub">{t.cert.sub}</p>
              <div className="cert-tags">
                {certs.map(c => <span key={c} className="cert-tag">{c}</span>)}
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "1.3rem", color: "var(--text-dark)" }}>{t.cert.whyTitle}</h3>
              <div className="benefits-grid">
                {t.cert.benefits.map((b, i) => (
                  <div key={i} className="b-card">
                    <span className="b-icon">{b.icon}</span>
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why">
        <div className="container">
          <FadeIn>
            <div className="eyebrow">{t.why.eyebrow}</div>
            <h2 className="sec-title">{t.why.title}</h2>
          </FadeIn>
          <div className="why-grid">
            {t.why.cards.map((c, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="w-card">
                  <span className="w-icon">{c.icon}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{background:"#fff",padding:"5.5rem 2rem"}}>
        <div className="container">
          <FadeIn>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <div className="eyebrow" style={{justifyContent:"center"}}>{lang==="en"?"Pricing":"Tarifs"}</div>
              <h2 className="sec-title">{lang==="en"?"Course Fees":"Frais de Cours"}</h2>
              <p style={{color:"var(--text-light)",fontSize:"0.9rem"}}>{lang==="en"?"All prices include training materials and exam preparation":"Tous les prix incluent les supports de cours et la préparation aux examens"}</p>
            </div>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"}}>
            {[
              {name:lang==="en"?"Beginner":"Débutant",level:"DELF A1 – A2",price:"100,000",currency:"RWF",period:"/ A1 · 120,000 / A2",features:lang==="en"?["DELF A1: 100,000 RWF","DELF A2: 120,000 RWF","Expression écrite & orale","Exam preparation included"]:["DELF A1 : 100 000 RWF","DELF A2 : 120 000 RWF","Expression écrite & orale","Préparation aux examens"],color:"var(--navy)",popular:false},
{name:lang==="en"?"Certification":"Certification",level:"TCF / TEF",price:"150,000",currency:"RWF",period:lang==="en"?"/ starting from":"/ à partir de",features:lang==="en"?["TCF Québec: 150,000 RWF","TEF Québec: 150,000 RWF","TCF Canada: 200,000 RWF","TEF Canada: 200,000 RWF","Full support until cert"]:["TCF Québec : 150 000 RWF","TEF Québec : 150 000 RWF","TCF Canada : 200 000 RWF","TEF Canada : 200 000 RWF","Suivi jusqu'à certification"],color:"var(--gold)",popular:true},
{name:lang==="en"?"Advanced":"Avancé",level:"DALF / DILF / DFP",price:"150,000",currency:"RWF",period:lang==="en"?"/ starting from":"/ à partir de",features:lang==="en"?["DALF C1: 150,000 RWF","DALF C2: 180,000 RWF","DILF: 150,000 RWF","DFP: 220,000 RWF","1-on-1 coaching included"]:["DALF C1 : 150 000 RWF","DALF C2 : 180 000 RWF","DILF : 150 000 RWF","DFP : 220 000 RWF","Coaching individuel inclus"],color:"var(--mid-blue)",popular:false},
            ].map((p,i)=>(
              <FadeIn key={i} delay={i*100}>
                <div style={{borderRadius:"16px",overflow:"hidden",border:`2px solid ${p.popular?"var(--gold)":"var(--cream-dark)"}`,position:"relative",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-6px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  {p.popular && <div style={{background:"var(--gold)",color:"var(--navy)",textAlign:"center",padding:"0.4rem",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>{lang==="en"?"⭐ Most Popular":"⭐ Le Plus Populaire"}</div>}
                  <div style={{background:p.color,padding:"2rem"}}>
                    <div style={{color:"rgba(255,255,255,0.6)",fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.3rem"}}>{p.level}</div>
                    <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1.4rem",marginBottom:"1rem"}}>{p.name}</h3>
                    <div style={{display:"flex",alignItems:"baseline",gap:"0.3rem"}}>
                      <span style={{fontFamily:"'Playfair Display',serif",color:p.popular?"var(--gold)":"#fff",fontSize:"2.2rem",fontWeight:900}}>{p.price}</span>
                      <span style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem"}}>{p.currency} {p.period}</span>
                    </div>
                  </div>
                  <div style={{background:"var(--cream)",padding:"2rem"}}>
                    <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"1.5rem"}}>
                      {p.features.map((f,j)=>(
                        <li key={j} style={{display:"flex",alignItems:"center",gap:"0.6rem",fontSize:"0.85rem",color:"var(--text-mid)"}}>
                          <span style={{color:"var(--gold)",fontWeight:700}}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={()=>document.getElementById("contact").scrollIntoView({behavior:"smooth"})} style={{width:"100%",background:p.popular?"var(--gold)":"var(--navy)",color:p.popular?"var(--navy)":"#fff",border:"none",padding:"0.85rem",borderRadius:"6px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>
                      {lang==="en"?"Enroll Now":"S'inscrire"}
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" style={{background:"var(--cream)",padding:"5.5rem 2rem"}}>
        <div className="container">
          <FadeIn>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <div className="eyebrow" style={{justifyContent:"center"}}>{lang==="en"?"Our Programs":"Nos Programmes"}</div>
              <h2 className="sec-title">{lang==="en"?"Class Schedule":"Horaires des Cours"}</h2>
              <p style={{color:"var(--text-light)",fontSize:"0.9rem",maxWidth:"520px",margin:"0 auto"}}>{lang==="en"?"Whatever your level, we guide you to French mastery. Duration: 6 months · Levels: A1 to C2":"Quel que soit votre niveau, nous vous accompagnons. Durée : 6 mois · Niveaux : A1 à C2"}</p>
            </div>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem",maxWidth:"860px",margin:"0 auto"}}>
            <FadeIn delay={0}>
              <div style={{background:"#fff",borderRadius:"16px",overflow:"hidden",border:"1px solid var(--cream-dark)",boxShadow:"0 4px 24px rgba(13,27,42,0.07)"}}>
                <div style={{background:"var(--navy)",padding:"1.2rem 2rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                  <span style={{fontSize:"1.3rem"}}>📅</span>
                  <h3 style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:"1.1rem",fontWeight:700}}>{lang==="en"?"Monday – Friday":"Lundi – Vendredi"}</h3>
                </div>
                <div style={{padding:"1.8rem 2rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
                  {[{time:"8H00 – 10H00",icon:"🌅",label:lang==="en"?"Morning Session":"Séance Matinale"},{time:"18H00 – 20H00",icon:"🌙",label:lang==="en"?"Evening Session":"Séance du Soir"}].map((s,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 1.2rem",background:"var(--cream)",borderRadius:"10px",border:"1px solid var(--cream-dark)"}}>
                      <span style={{fontSize:"1.4rem"}}>{s.icon}</span>
                      <div>
                        <div style={{fontFamily:"'Playfair Display',serif",color:"var(--gold)",fontSize:"1.3rem",fontWeight:900,lineHeight:1}}>{s.time}</div>
                        <div style={{color:"var(--text-light)",fontSize:"0.78rem",marginTop:"0.2rem",letterSpacing:"0.05em",textTransform:"uppercase"}}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div style={{background:"#fff",borderRadius:"16px",overflow:"hidden",border:"2px solid var(--gold)",boxShadow:"0 4px 24px rgba(201,168,76,0.15)"}}>
                <div style={{background:"var(--gold)",padding:"1.2rem 2rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                  <span style={{fontSize:"1.3rem"}}>🏖️</span>
                  <h3 style={{fontFamily:"'Playfair Display',serif",color:"var(--navy)",fontSize:"1.1rem",fontWeight:700}}>{lang==="en"?"Weekend":"Week-end"}</h3>
                </div>
                <div style={{padding:"1.8rem 2rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
                  {[{time:"9H00 – 12H00",icon:"☀️",label:lang==="en"?"Morning Session":"Séance Matinale"},{time:"15H00 – 18H00",icon:"🌤️",label:lang==="en"?"Afternoon Session":"Séance Après-midi"}].map((s,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 1.2rem",background:"var(--cream)",borderRadius:"10px",border:"1px solid var(--cream-dark)"}}>
                      <span style={{fontSize:"1.4rem"}}>{s.icon}</span>
                      <div>
                        <div style={{fontFamily:"'Playfair Display',serif",color:"var(--navy)",fontSize:"1.3rem",fontWeight:900,lineHeight:1}}>{s.time}</div>
                        <div style={{color:"var(--text-light)",fontSize:"0.78rem",marginTop:"0.2rem",letterSpacing:"0.05em",textTransform:"uppercase"}}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={200}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"1.5rem",justifyContent:"center",marginTop:"2.5rem"}}>
              {[{icon:"⏱️",label:lang==="en"?"Duration":"Durée",value:lang==="en"?"6 Months":"6 Mois"},{icon:"📊",label:lang==="en"?"Levels":"Niveaux",value:"A1 · A2 · B1 · B2 · C1 · C2"},{icon:"📍",label:lang==="en"?"Location":"Lieu",value:"Norrsken House, Kigali"}].map((b,i)=>(
                <div key={i} style={{background:"linear-gradient(135deg,var(--navy),var(--deep-blue))",borderRadius:"12px",padding:"1.2rem 2rem",textAlign:"center",border:"1px solid rgba(201,168,76,0.15)",minWidth:"180px"}}>
                  <div style={{fontSize:"1.5rem",marginBottom:"0.4rem"}}>{b.icon}</div>
                  <div style={{color:"rgba(255,255,255,0.45)",fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.25rem"}}>{b.label}</div>
                  <div style={{color:"var(--gold)",fontWeight:700,fontSize:"0.9rem"}}>{b.value}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={250}>
            <div style={{textAlign:"center",marginTop:"2rem"}}>
              <button onClick={()=>document.getElementById("contact").scrollIntoView({behavior:"smooth"})} className="btn-gold">{lang==="en"?"Reserve Your Spot →":"Réserver votre Place →"}</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PLACE */}
      <section id="place">
        <div className="container">
          <div className="place-grid">
            <FadeIn>
              <div className="eyebrow" style={{ color: "var(--gold)" }}>{t.place.eyebrow}</div>
              <h2 className="sec-title light">{t.place.title}</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.93rem" }}>{t.place.sub}</p>
              <div className="norrsken-badge">🏢 Norrsken House, Kigali</div>
              <div className="norrsken-badge" style={{marginTop:"0.6rem"}}>🏢 Sainte Famille Charité House, Kigali</div>
            <div style={{marginTop:"1.5rem",borderRadius:"12px",overflow:"hidden",border:"1px solid rgba(201,168,76,0.2)"}}>
              <iframe
                title="Norrsken House Kigali"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5!2d30.05891!3d-1.94995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42a8c0a1d4b%3A0x8c8e3a0b0c0d0e0f!2s1%20KN%2078%20St%2C%20Kigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1234567890"
                width="100%"
                height="220"
                style={{border:0,display:"block"}}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
            </FadeIn>
            <FadeIn delay={100}>
              {t.place.features.map((f, i) => (
                <div key={i} className="p-feat">
                  <span className="p-feat-icon">{f.icon}</span>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{background:"#fff",padding:"5.5rem 2rem"}}>
        <div className="container">
          <FadeIn>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <div className="eyebrow" style={{justifyContent:"center"}}>{lang==="en"?"Student Reviews":"Avis des Étudiants"}</div>
              <h2 className="sec-title">{lang==="en"?"What Our Students Say":"Ce que disent nos étudiants"}</h2>
            </div>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem"}}>
            {[
              {name:"Amina K.",flag:"🇷🇼",cert:"DELF B2",text:lang==="en"?"The academy prepared me perfectly for my DELF exam. The trainers are incredibly supportive and knowledgeable!":"L'académie m'a parfaitement préparée pour mon examen DELF. Les formateurs sont incroyablement compétents!",stars:5},
              {name:"Jean-Pierre M.",flag:"🇷🇼",cert:"TCF Canada",text:lang==="en"?"Thanks to IFA, I passed my TCF Canada exam and got my immigration approved. Life-changing experience!":"Grâce à l'IFA, j'ai réussi mon TCF Canada et mon immigration a été approuvée. Une expérience qui change la vie!",stars:5},
              {name:"Grace N.",flag:"🇷🇼",cert:"DALF C1",text:lang==="en"?"Interactive classes, real exam practice, and amazing support. I highly recommend this academy to everyone!":"Des cours interactifs, une pratique réelle des examens et un soutien incroyable. Je recommande vivement cette académie!",stars:5},
            ].map((r,i)=>(
              <FadeIn key={i} delay={i*100}>
                <div style={{background:"var(--cream)",borderRadius:"12px",padding:"2rem",border:"1px solid var(--cream-dark)",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 20px 40px rgba(13,27,42,0.1)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{color:"var(--gold)",fontSize:"1.1rem",marginBottom:"1rem"}}>{"★".repeat(r.stars)}</div>
                  <p style={{color:"var(--text-mid)",fontSize:"0.9rem",lineHeight:1.7,marginBottom:"1.5rem",fontStyle:"italic"}}>"{r.text}"</p>
                  <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                    <div style={{width:"42px",height:"42px",background:"linear-gradient(135deg,var(--navy),var(--mid-blue))",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>{r.flag}</div>
                    <div>
                      <strong style={{display:"block",fontSize:"0.9rem",color:"var(--text-dark)"}}>{r.name}</strong>
                      <span style={{fontSize:"0.75rem",color:"var(--gold)",fontWeight:600}}>{r.cert}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" style={{background:"#fff",padding:"5.5rem 2rem"}}>
        <div className="container">
          <FadeIn>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <div className="eyebrow" style={{justifyContent:"center"}}>{lang==="en"?"Our People":"Notre Équipe"}</div>
              <h2 className="sec-title">{lang==="en"?"Meet Our Team":"Notre Équipe"}</h2>
              <p style={{color:"var(--text-light)",fontSize:"0.9rem",maxWidth:"520px",margin:"0 auto"}}>{lang==="en"?"Dedicated professionals committed to your French language success":"Des professionnels dévoués à votre réussite en langue française"}</p>
            </div>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.5rem"}}>
            {[
              {name:"KWIBUKA Erick",role:lang==="en"?"Certification Manager & Head of Pedagogy":"Responsable de la Certification & Chargé Pédagogique",photo:"staff-erick.jpeg",featured:true,pos:"center 20%"},
              {name:"Banda Clément",role:lang==="en"?"Lead Teacher & Sound Technician":"Professeur Titulaire & Technicien de son",photo:"staff-banda.jpeg",featured:false},
              {name:"Ingabire Germaine",role:lang==="en"?"Secretary General & Communications":"Secrétaire Générale & Chargée de la communication",photo:"staff-germaine.jpeg",featured:false},
              {name:"Kabandana Ghislaine",role:lang==="en"?"Reception & Media Library Assistant":"Chargée d'Accueil & Assistante médiathèque",photo:"staff-ghislaine.jpeg",featured:false},
              {name:"Iragi Michaël",role:lang==="en"?"Cooperation Attaché & Legal Advisor":"Attaché de Coopération & Conseillé Juridique",photo:"staff-iragi.jpeg",featured:false},
              {name:"Joas Irahoza",role:lang==="en"?"Multi-skilled Agent":"Agent polyvalent",photo:"staff-joas.jpeg",featured:false},
            ].map((m,i)=>(
              <FadeIn key={i} delay={i*80}>
                <div style={{background:m.featured?"var(--navy)":"var(--cream)",borderRadius:"16px",overflow:"hidden",border:m.featured?"2px solid var(--gold)":"1px solid var(--cream-dark)",transition:"all 0.3s",textAlign:"center"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-6px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{position:"relative",paddingTop:"100%",overflow:"hidden"}}>
                    <img src={m.photo} alt={m.name} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:m.pos||"center top"}} />
                    {m.featured && <div style={{position:"absolute",top:"0.75rem",right:"0.75rem",background:"var(--gold)",color:"var(--navy)",padding:"0.25rem 0.7rem",borderRadius:"20px",fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>Director</div>}
                  </div>
                  <div style={{padding:"1.4rem 1.2rem"}}>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",color:m.featured?"#fff":"var(--text-dark)",marginBottom:"0.35rem",fontWeight:700}}>{m.name}</h3>
                    <p style={{fontSize:"0.78rem",color:m.featured?"rgba(255,255,255,0.6)":"var(--text-light)",lineHeight:1.5}}>{m.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{background:"var(--navy)",padding:"5.5rem 2rem"}}>
        <div className="container">
          <FadeIn>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <div className="eyebrow" style={{justifyContent:"center",color:"var(--gold)"}}>{lang==="en"?"FAQ":"Questions Fréquentes"}</div>
              <h2 className="sec-title light">{lang==="en"?"Frequently Asked Questions":"Questions Fréquemment Posées"}</h2>
            </div>
          </FadeIn>
          <div style={{maxWidth:"750px",margin:"0 auto",display:"flex",flexDirection:"column",gap:"1rem"}}>
            {[
              {q:lang==="en"?"Do I need prior French knowledge to enroll?":"Dois-je avoir des connaissances préalables en français pour m'inscrire?",a:lang==="en"?"No! We welcome complete beginners. Our trainers will assess your level and place you in the right class.":"Non! Nous accueillons les débutants complets. Nos formateurs évalueront votre niveau et vous placeront dans la bonne classe."},
              {q:lang==="en"?"How long does it take to get certified?":"Combien de temps faut-il pour obtenir une certification?",a:lang==="en"?"It depends on your level and dedication. On average, students reach B2 level in 6-12 months with regular attendance.":"Cela dépend de votre niveau et de votre engagement. En moyenne, les étudiants atteignent le niveau B2 en 6 à 12 mois avec une présence régulière."},
              {q:lang==="en"?"Which certification should I choose for immigration to France/Canada?":"Quelle certification choisir pour immigrer en France/Canada?",a:lang==="en"?"For France immigration, we recommend TCF TP or TEF. For Canada, TCF Canada or TEF Canada. We will guide you to the right one.":"Pour l'immigration en France, nous recommandons TCF TP ou TEF. Pour le Canada, TCF Canada ou TEF Canada. Nous vous guiderons vers le bon choix."},
              {q:lang==="en"?"Are classes available online?":"Les cours sont-ils disponibles en ligne?",a:lang==="en"?"Currently we offer in-person classes at Norrsken House. Contact us to inquire about online or hybrid options.":"Actuellement nous proposons des cours en présentiel à Norrsken House. Contactez-nous pour vous renseigner sur les options en ligne ou hybrides."},
              {q:lang==="en"?"What payment methods do you accept?":"Quels modes de paiement acceptez-vous?",a:lang==="en"?"We accept Mobile Money (MTN & Airtel), bank transfer, and cash. Monthly payment plans are available.":"Nous acceptons le Mobile Money (MTN & Airtel), les virements bancaires et les espèces. Des plans de paiement mensuel sont disponibles."},
            ].map((faq,i)=>(
              <FadeIn key={i} delay={i*80}>
                <details style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"1.3rem 1.5rem",cursor:"pointer"}}>
                  <summary style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:600,listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem"}}>
                    {faq.q}
                    <span style={{color:"var(--gold)",fontSize:"1.2rem",flexShrink:0}}>+</span>
                  </summary>
                  <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.88rem",lineHeight:1.7,marginTop:"1rem",paddingTop:"1rem",borderTop:"1px solid rgba(255,255,255,0.08)"}}>{faq.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <FadeIn>
          <div className="cta-inner">
            <h2>{t.cta.title}</h2>
            <p className="cta-tag">{t.cta.tagline}</p>
            <p className="cta-sub">{t.cta.taglineFr}</p>
            <div className="cta-btns">
              <button className="btn-navy" onClick={() => scroll("contact")}>{t.cta.btn1}</button>
              <a className="btn-navy-outline" href="mailto:frenchacademyinternational@gmail.com">{t.cta.btn2}</a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <div className="contact-grid">
            <FadeIn>
              <div className="c-info">
                <h2>{t.contact.title}</h2>
                <p>{t.contact.sub}</p>
                <div className="c-items">
                  <div className="c-item">
                    <div className="c-icon">📧</div>
                    <div className="c-text">
                      <strong>Email</strong>
                      <a href="mailto:frenchacademyinternational@gmail.com">frenchacademyinternational@gmail.com</a>
                    </div>
                  </div>
                  <div className="c-item">
                    <div className="c-icon">📞</div>
                    <div className="c-text">
                      <strong>Phone / WhatsApp</strong>
                      <a href="tel:+250785302957">+250 785 302 957</a>
                    </div>
                  </div>
                  <div className="c-item">
                    <div className="c-icon">📍</div>
                    <div className="c-text">
                      <strong>{lang === "en" ? "Address" : "Adresse"}</strong>
                      <span>📍 Norrsken House, Kigali</span>
              <span style={{display:"block",marginTop:"0.3rem"}}>📍 Sainte Famille Charité House, Kigali</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="c-form">
                <h3>{t.contact.form.title}</h3>
                <div className="form-row">
                  <div className="fg"><label>{t.contact.form.first}</label><input placeholder={t.contact.form.firstPh} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
                  <div className="fg"><label>{t.contact.form.last}</label><input placeholder={t.contact.form.lastPh} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
                </div>
                <div className="fg"><label>{t.contact.form.email}</label><input type="email" placeholder={t.contact.form.emailPh} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div className="fg"><label>{t.contact.form.phone}</label><input type="tel" placeholder={t.contact.form.phonePh} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                <div className="fg">
                  <label>{t.contact.form.cert}</label>
                  <select value={formData.certificate} onChange={e => setFormData({...formData, certificate: e.target.value})}>
                    {certs.map((o, i) => <option key={i}>{o}</option>)}
                  </select>
                </div>
                <div className="fg"><label>{t.contact.form.msg}</label><textarea placeholder={t.contact.form.msgPh} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
                <button
                  className={`f-submit${submitted ? " sent" : ""}`}
                  onClick={handleSubmit}
                >
                  {submitted ? t.contact.form.sent : t.contact.form.submit}
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* BOOKSHOP */}
      <section id="books" style={{background:"#fff",padding:"5.5rem 2rem"}}>
        <div className="container">
          <FadeIn>
            <div style={{textAlign:"center",marginBottom:"3rem"}}>
              <div className="eyebrow" style={{justifyContent:"center"}}>📚 {lang === "fr" ? "Nos Publications" : "Our Publications"}</div>
              <h2 className="sec-title">{lang === "fr" ? "Guides d'Examen de Français" : "French Exam Study Guides"}</h2>
              <p style={{color:"var(--text-light)",fontSize:"0.9rem",maxWidth:"520px",margin:"0 auto"}}>{lang === "fr" ? "Guides professionnels écrits par notre formateur expert Erick Ruhingana pour vous aider à réussir vos examens." : "Professional study guides written by our expert trainer Erick Ruhingana to help you pass your French certification exams."}</p>
            </div>
          </FadeIn>

          {/* MAIN BOOKS */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"2rem",marginBottom:"3rem"}}>
            {[
              {img:"book1.jpeg",title:"The TCF Canada",subtitle:"Complete Preparation Guide",author:"Erick Ruhingana",price:"25,000 RWF",desc:"A comprehensive guide to prepare for the TCF Canada exam. Covers all sections: reading, listening, writing and speaking with practice exercises.",tags:["TCF Canada","Immigration","B1–C2"]},
              {img:"book2.jpeg",title:"Préparation au TEF Canada",subtitle:"Guide Complet de Préparation",author:"Erick R.",price:"25,000 RWF",desc:"Le guide complet pour réussir le TEF Canada. Couvre toutes les compétences avec des exercices pratiques et des conseils d'experts.",tags:["TEF Canada","Immigration","B1–C2"]},
            ].map((book,i)=>(
              <FadeIn key={i} delay={i*100}>
                <div style={{borderRadius:"16px",overflow:"hidden",border:"1px solid var(--cream-dark)",boxShadow:"0 4px 24px rgba(13,27,42,0.08)",transition:"all 0.3s",background:"var(--cream)"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-6px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                  <div style={{position:"relative",paddingTop:"70%",overflow:"hidden",background:"var(--navy)"}}>
                    <img src={book.img} alt={book.title} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",top:"1rem",right:"1rem",background:"var(--gold)",color:"var(--navy)",padding:"0.4rem 0.8rem",borderRadius:"20px",fontSize:"0.75rem",fontWeight:700}}>{book.price}</div>
                  </div>
                  <div style={{padding:"1.5rem"}}>
                    <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",color:"var(--text-dark)",marginBottom:"0.25rem"}}>{book.title}</h3>
                    <p style={{fontSize:"0.8rem",color:"var(--gold)",fontWeight:600,marginBottom:"0.5rem"}}>{book.subtitle}</p>
                    <p style={{fontSize:"0.8rem",color:"var(--text-light)",marginBottom:"0.75rem"}}>by {book.author}</p>
                    <p style={{fontSize:"0.85rem",color:"var(--text-mid)",lineHeight:1.6,marginBottom:"1rem"}}>{book.desc}</p>
                    <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"1.2rem"}}>
                      {book.tags.map((t,j)=><span key={j} style={{fontSize:"0.7rem",background:"var(--navy)",color:"#fff",padding:"0.2rem 0.6rem",borderRadius:"4px",fontWeight:600}}>{t}</span>)}
                    </div>
                    <div style={{background:"var(--navy)",borderRadius:"10px",padding:"1rem",marginBottom:"1rem"}}>
                      <p style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",marginBottom:"0.3rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Payment via Bank Transfer</p>
                      <p style={{fontSize:"0.85rem",color:"var(--gold)",fontWeight:600}}>Access Bank</p>
                      <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.7)"}}>Account: 8002580203050001</p>
                      <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.7)"}}>Name: Erick Ruhingana</p>
                    </div>
                    <div style={{display:"flex",gap:"0.75rem"}}>
                      <a href="https://wa.me/250785302957?text=Hello%2C%20I%20want%20to%20order%20the%20book%3A%20" target="_blank" rel="noopener noreferrer" style={{flex:1,textDecoration:"none"}}>
                        <button style={{width:"100%",background:"#25D366",color:"#fff",border:"none",padding:"0.75rem",borderRadius:"8px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.82rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                          💬 Order via WhatsApp
                        </button>
                      </a>
                    </div>
                    <p style={{fontSize:"0.72rem",color:"var(--text-light)",textAlign:"center",marginTop:"0.5rem"}}>📱 Digital PDF · 🏢 Pickup at Academy</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* LEVEL GUIDES */}
          <FadeIn>
            <div style={{background:"linear-gradient(135deg,var(--navy),var(--deep-blue))",borderRadius:"16px",padding:"2rem",marginBottom:"2rem"}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",color:"#fff",marginBottom:"0.5rem",textAlign:"center"}}>{lang === "fr" ? "Guides de Niveau Français" : "Standard French Level Guides"}</h3>
              <p style={{fontSize:"0.85rem",color:"rgba(255,255,255,0.5)",textAlign:"center",marginBottom:"1.5rem"}}>{lang === "fr" ? "Guides individuels pour chaque niveau CECR — parfaits pour un apprentissage structuré" : "Individual study guides for each CEFR level — perfect for structured learning"}</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"1rem"}}>
                {["A1","A2","B1","B2","C1","C2"].map((level,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:"10px",padding:"1.2rem",textAlign:"center",transition:"all 0.3s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.1)";e.currentTarget.style.borderColor="var(--gold)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor="rgba(201,168,76,0.2)";}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",color:"var(--gold)",fontWeight:700,marginBottom:"0.3rem"}}>{level}</div>
                    <div style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.5)",marginBottom:"0.5rem"}}>{lang === "fr" ? "Guide Français" : "French Guide"}</div>
                    <div style={{fontSize:"0.85rem",color:"var(--gold)",fontWeight:600,marginBottom:"0.75rem"}}>25,000 RWF</div>
                    <a href={`https://wa.me/250785302957?text=Hello%2C%20I%20want%20to%20order%20the%20French%20${level}%20Guide`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                      <button style={{width:"100%",background:"var(--gold)",color:"var(--navy)",border:"none",padding:"0.5rem",borderRadius:"6px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.75rem",cursor:"pointer"}}>{lang === "fr" ? "Commander →" : "Order →"}</button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* {lang === "fr" ? "Comment Commander" : "How to Order"} */}
          <FadeIn>
            <div style={{background:"var(--cream-dark)",borderRadius:"16px",padding:"2rem",textAlign:"center"}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",marginBottom:"1rem",color:"var(--text-dark)"}}>How to Order</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem"}}>
                {[
                  {ico:"💳",step:"1",title:"Pay via Bank Transfer",desc:"Transfer 25,000 RWF to Access Bank account 8002580203050001 (Erick Ruhingana)"},
                  {ico:"💬",step:"2",title:"Send Proof on WhatsApp",desc:"Send your payment screenshot to +250 785 302 957 via WhatsApp"},
                  {ico:"📱",step:"3",title:"Receive Your Guide",desc:"Get your digital PDF instantly or pick up your physical copy at the academy"},
                ].map((s,i)=>(
                  <div key={i} style={{background:"#fff",borderRadius:"10px",padding:"1.2rem",border:"1px solid var(--cream-dark)"}}>
                    <div style={{fontSize:"1.5rem",marginBottom:"0.5rem"}}>{s.ico}</div>
                    <div style={{fontSize:"0.7rem",color:"var(--gold)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.3rem"}}>Step {s.step}</div>
                    <h4 style={{fontSize:"0.9rem",color:"var(--text-dark)",marginBottom:"0.4rem",fontFamily:"'Playfair Display',serif"}}>{s.title}</h4>
                    <p style={{fontSize:"0.8rem",color:"var(--text-light)",lineHeight:1.5}}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="f-logo">International <span>French Academy</span></div>
          <p>{t.footer.copy}</p>
          <div style={{display:"flex",gap:"1rem",alignItems:"center"}}>
            <a href="https://www.facebook.com/internationalfrenchacademy" target="_blank" rel="noopener noreferrer" style={{width:"36px",height:"36px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/internationalfrenchacademy.rw" target="_blank" rel="noopener noreferrer" style={{width:"36px",height:"36px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.6)" stroke="none"/></svg>
            </a>
            <a href={`https://wa.me/250785302957?text=${encodeURIComponent(lang==="fr"?"Bonjour, je suis intéressé(e) par vos cours de français. Pouvez-vous me donner plus d'informations ?":"Hello, I am interested in your French courses and certifications. Could you please give me more information?")}`} target="_blank" rel="noopener noreferrer" style={{width:"36px",height:"36px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
