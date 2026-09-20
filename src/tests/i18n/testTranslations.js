// Translations scoped to the Test de Niveau module only.
// Kept separate from Home.js's own `T` object on purpose: it's a different
// feature added later, and this avoids touching the homepage's existing
// translation object at all. Same simple { en, fr } pattern as the rest
// of the site so it stays consistent with how the project already works.

export const testT = {
  en: {
    backHome: "Back to home",
    badge: "IFA Level Assessment",
    title: "Level Test",
    titleFr: "Test de Niveau",
    subtitle: "Find out your French level",
    intro:
      "A practical, indicative assessment of your French level across listening, reading, grammar and vocabulary — built by International French Academy to help you understand where you stand and what to work on next.",
    forWhoTitle: "Who it's for",
    forWhoText:
      "Anyone who wants a clear, honest snapshot of their French level — prospective students, current students checking their progress, and anyone preparing for an official certification like TCF, TEF, DELF or DALF.",
    skillsTitle: "Skills evaluated",
    howTitle: "How it works",
    howText:
      "You'll answer multiple-choice questions across three sections. Each question has one correct answer. You can move between questions within a section before submitting. Once you submit — or once time runs out — your result is calculated automatically.",
    stats: {
      duration: "Duration",
      durationValue: "~60 minutes",
      questions: "Questions",
      questionsValue: "50 questions",
      sections: "Sections",
      sectionsValue: "3 sections",
      levels: "Levels covered",
      levelsValue: "A1 – C2",
    },
    sections: [
      {
        icon: "🎧",
        title: "Listening comprehension",
        desc: "Listen to short original audio recordings and answer questions about what you heard.",
      },
      {
        icon: "📖",
        title: "Reading comprehension",
        desc: "Read short original French texts and answer questions to check your understanding.",
      },
      {
        icon: "🧠",
        title: "Grammar & vocabulary",
        desc: "Grammar, conjugation, vocabulary and everyday-usage questions across all levels.",
      },
    ],
    noteTitle: "Good to know",
    note1: "Your result is indicative — it gives you an estimated CEFR level (A1–C2), not an official score.",
    note2: "This is not an official TCF, TEF, DELF or DALF examination and is not a certification.",
    note3: "Access to the test may require authorization from International French Academy.",
    cta: "Start the test",
    ctaHint: "Takes about 60 minutes — find a quiet moment before you begin.",
  },
  fr: {
    backHome: "Retour à l'accueil",
    badge: "Évaluation de niveau IFA",
    title: "Test de Niveau",
    titleFr: "Test de Niveau",
    subtitle: "Évaluez votre niveau de français",
    intro:
      "Une évaluation pratique et indicative de votre niveau de français en compréhension orale, compréhension écrite, grammaire et vocabulaire — conçue par International French Academy pour vous aider à situer votre niveau et à savoir sur quoi progresser.",
    forWhoTitle: "À qui s'adresse ce test",
    forWhoText:
      "À toute personne souhaitant obtenir un aperçu clair et honnête de son niveau de français : futurs étudiants, étudiants actuels souhaitant suivre leur progression, ou toute personne se préparant à une certification officielle comme le TCF, le TEF, le DELF ou le DALF.",
    skillsTitle: "Compétences évaluées",
    howTitle: "Comment ça fonctionne",
    howText:
      "Vous répondrez à des questions à choix multiples réparties en trois sections. Chaque question n'a qu'une seule bonne réponse. Vous pouvez naviguer entre les questions d'une section avant de valider. Une fois le test soumis — ou le temps écoulé — votre résultat est calculé automatiquement.",
    stats: {
      duration: "Durée",
      durationValue: "~60 minutes",
      questions: "Questions",
      questionsValue: "50 questions",
      sections: "Sections",
      sectionsValue: "3 sections",
      levels: "Niveaux couverts",
      levelsValue: "A1 – C2",
    },
    sections: [
      {
        icon: "🎧",
        title: "Compréhension orale",
        desc: "Écoutez de courts enregistrements audio originaux et répondez à des questions sur ce que vous avez entendu.",
      },
      {
        icon: "📖",
        title: "Compréhension écrite",
        desc: "Lisez de courts textes français originaux et répondez à des questions pour vérifier votre compréhension.",
      },
      {
        icon: "🧠",
        title: "Grammaire & vocabulaire",
        desc: "Questions de grammaire, conjugaison, vocabulaire et usage courant, tous niveaux confondus.",
      },
    ],
    noteTitle: "Bon à savoir",
    note1: "Votre résultat est indicatif — il vous donne un niveau CECR estimé (A1–C2), pas un score officiel.",
    note2: "Ce n'est pas un examen officiel TCF, TEF, DELF ou DALF, et ne constitue pas une certification.",
    note3: "L'accès au test peut nécessiter une autorisation d'International French Academy.",
    cta: "Commencer le test",
    ctaHint: "Compte environ 60 minutes — installez-vous dans le calme avant de commencer.",
  },
};
