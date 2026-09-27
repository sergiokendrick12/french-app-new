import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const STORAGE_KEY = "ifa_listening_test_attempt";
const RESULT_EMAIL_SENT_KEY = "ifa_listening_result_email_sent";

const TEST_DURATION = 30 * 60 * 1000;
const INITIALIZATION_TIMEOUT = 15000;

/*
 * IMPORTANT:
 * The audio files are unchanged.
 *
 * Exam behavior:
 * - Once an answer is selected, it is locked.
 * - Students cannot change a selected answer.
 * - Students cannot return to previous questions.
 * - Answers are saved immediately.
 */
const questions = [
  {
    id: 1,
    level: "A1",
    audio: "/audio/q1_marie.mp3",
    question: "Quel est le prénom de la personne présentée dans l'audio ?",
    choices: ["Marie", "Sophie", "Claire", "Julie"],
    answer: "Marie",
  },

  {
    id: 2,
    level: "A1",
    audio: "/audio/q2_enfants.mp3",
    question:
      "Quelle information concernant sa famille est donnée dans l'audio ?",
    choices: [
      "Elle a un enfant.",
      "Elle a deux enfants.",
      "Elle a trois enfants.",
      "Elle a quatre enfants.",
    ],
    answer: "Elle a deux enfants.",
  },

  {
    id: 3,
    level: "A1",
    audio: "/audio/q3_magasin.mp3",
    question:
      "À quel moment de la journée peut-on commencer à faire des achats dans ce magasin ?",
    choices: [
      "À 7 heures.",
      "À 8 heures.",
      "À 9 heures.",
      "À 10 heures.",
    ],
    answer: "À 9 heures.",
  },

  {
    id: 4,
    level: "A1",
    audio: "/audio/q4_pommes.mp3",
    question:
      "Quel produit alimentaire est particulièrement apprécié par la sœur ?",
    choices: [
      "Les pommes vertes.",
      "Les bananes.",
      "Les oranges.",
      "Les pommes rouges.",
    ],
    answer: "Les pommes rouges.",
  },

  {
    id: 5,
    level: "A1",
    audio: "/audio/q5_marche.mp3",
    question:
      "Quelle est la raison habituelle de sa visite au marché le samedi ?",
    choices: [
      "Acheter des légumes frais.",
      "Retrouver ses amis.",
      "Acheter des vêtements.",
      "Faire une activité sportive.",
    ],
    answer: "Acheter des légumes frais.",
  },

  {
    id: 6,
    level: "A2",
    audio: "/audio/q6_hopital.mp3",
    question:
      "Quel élément de la journée professionnelle de son frère est précisé ?",
    choices: [
      "Il commence à 6 heures.",
      "Il commence à 7 heures.",
      "Il commence à 8 heures.",
      "Il commence à 9 heures.",
    ],
    answer: "Il commence à 7 heures.",
  },

  {
    id: 7,
    level: "A2",
    audio: "/audio/q7_pluie.mp3",
    question:
      "Quel objet emporte-t-il en prévision des conditions météorologiques annoncées ?",
    choices: [
      "Un manteau.",
      "Un chapeau.",
      "Un parapluie.",
      "Une veste.",
    ],
    answer: "Un parapluie.",
  },

  {
    id: 8,
    level: "A2",
    audio: "/audio/q8_voyage.mp3",
    question:
      "Après le changement de programme, quel jour est finalement prévu pour le voyage ?",
    choices: [
      "Vendredi.",
      "Samedi.",
      "Lundi.",
      "Dimanche.",
    ],
    answer: "Dimanche.",
  },

  {
    id: 9,
    level: "B1",
    audio: "/audio/q9_emploi.mp3",
    question:
      "Quel secteur professionnel correspond au projet de la personne interrogée ?",
    choices: [
      "La comptabilité.",
      "La médecine.",
      "L'informatique.",
      "L'enseignement.",
    ],
    answer: "La comptabilité.",
  },

  {
    id: 10,
    level: "B1",
    audio: "/audio/q10_transport.mp3",
    question:
      "Quelle raison explique principalement sa préférence pour le bus ?",
    choices: [
      "Son coût est inférieur.",
      "Il lui permet de contourner les embouteillages.",
      "Il offre davantage de confort.",
      "Il est plus rapide que le train.",
    ],
    answer:
      "Il lui permet de contourner les embouteillages.",
  },

  {
    id: 11,
    level: "B1",
    audio: "/audio/q11_reunion.mp3",
    question:
      "Quelle question constitue le principal objet de la réunion ?",
    choices: [
      "Le recrutement de nouveaux employés.",
      "La présentation de nouveaux produits.",
      "L'analyse des résultats du dernier trimestre.",
      "La préparation des congés des employés.",
    ],
    answer:
      "L'analyse des résultats du dernier trimestre.",
  },

  {
    id: 12,
    level: "B1",
    audio: "/audio/q12_meteo.mp3",
    question:
      "Quelle mesure est recommandée lorsque les températures atteignent leur niveau le plus élevé ?",
    choices: [
      "Augmenter les déplacements.",
      "Prolonger les heures de travail.",
      "Pratiquer davantage d'activités physiques.",
      "Réduire les efforts physiques et s'hydrater régulièrement.",
    ],
    answer:
      "Réduire les efforts physiques et s'hydrater régulièrement.",
  },

  {
    id: 13,
    level: "B2",
    audio: "/audio/q13_entreprise.mp3",
    question:
      "Quel changement chiffré permet de caractériser l'évolution récente de l'entreprise ?",
    choices: [
      "Une progression de 10 % des ventes.",
      "Une baisse de 10 % des ventes.",
      "Une fermeture de plusieurs magasins.",
      "Une diminution du nombre de produits proposés.",
    ],
    answer:
      "Une progression de 10 % des ventes.",
  },

  {
    id: 14,
    level: "B2",
    audio: "/audio/q14_opinion.mp3",
    question:
      "Quelle position est défendue à propos du rôle des jeunes générations ?",
    choices: [
      "Elles devraient rester à l'écart des questions environnementales.",
      "Elles devraient participer davantage à la protection de l'environnement.",
      "Elles devraient donner la priorité exclusive à leurs études.",
      "Elles devraient laisser cette question aux autorités publiques.",
    ],
    answer:
      "Elles devraient participer davantage à la protection de l'environnement.",
  },

  {
    id: 15,
    level: "B2",
    audio: "/audio/q15_actualite.mp3",
    question:
      "Quelle orientation est envisagée par le gouvernement pour améliorer les transports dans la région ?",
    choices: [
      "Développer de nouvelles écoles.",
      "Diminuer les possibilités de transport.",
      "Développer le réseau routier.",
      "Supprimer certaines routes actuellement utilisées.",
    ],
    answer:
      "Développer le réseau routier.",
  },

  {
    id: 16,
    level: "C1",
    audio: "/audio/q16_numerique.mp3",
    question:
      "Quelle transformation majeure est associée au développement du numérique dans le document ?",
    choices: [
      "Les entreprises ont progressivement réduit leur utilisation d'Internet.",
      "Les clients se détournent progressivement des services numériques.",
      "La transformation numérique reste essentiellement limitée aux grandes entreprises.",
      "Les relations entre les entreprises et leurs clients ont été profondément transformées.",
    ],
    answer:
      "Les relations entre les entreprises et leurs clients ont été profondément transformées.",
  },

  {
    id: 17,
    level: "C1",
    audio: "/audio/q17_regret.mp3",
    question:
      "Quelle interprétation correspond le mieux au regret exprimé par l'intervenant ?",
    choices: [
      "Une anticipation plus importante aurait peut-être modifié la décision prise.",
      "La décision était entièrement prévisible dès le départ.",
      "Les conséquences étaient absolument impossibles à envisager.",
      "Les conséquences de la décision n'ont finalement eu aucune portée.",
    ],
    answer:
      "Une anticipation plus importante aurait peut-être modifié la décision prise.",
  },

  {
    id: 18,
    level: "C1",
    audio: "/audio/q18_projet.mp3",
    question:
      "Quelle a finalement été l'issue du projet malgré les réserves exprimées par certains experts ?",
    choices: [
      "Il a finalement été abandonné.",
      "Il a été approuvé à l'unanimité par le conseil.",
      "Sa mise en œuvre a été reportée.",
      "Il a été renvoyé devant le conseil pour un nouveau vote.",
    ],
    answer:
      "Il a été approuvé à l'unanimité par le conseil.",
  },

  {
    id: 19,
    level: "C2",
    audio: "/audio/q19_clause.mp3",
    question:
      "Quel problème d'ordre juridique est apparu autour de la clause contractuelle ?",
    choices: [
      "Elle a entraîné une révision du prix du contrat.",
      "Elle a rendu le contrat juridiquement impossible à maintenir.",
      "La portée exacte de son interprétation juridique a fait l'objet d'une controverse.",
      "Elle a empêché les parties de parvenir à la signature du contrat.",
    ],
    answer:
      "La portée exacte de son interprétation juridique a fait l'objet d'une controverse.",
  },

  {
    id: 20,
    level: "C2",
    audio: "/audio/q20_effort.mp3",
    question:
      "Face à l'importance de la tâche, quelle réaction traduit le mieux son attitude ?",
    choices: [
      "Elle renonce finalement au projet.",
      "Elle confie la fin du projet à une autre personne.",
      "Elle intensifie ses efforts afin de parvenir à terminer le projet.",
      "Elle choisit de repousser le projet à plus tard.",
    ],
    answer:
      "Elle intensifie ses efforts afin de parvenir à terminer le projet.",
  },
];

function createNewAttempt() {
  return {
    current: 0,
    selected: null,
    answers: {},
    score: 0,
    finished: false,
    endTime: Date.now() + TEST_DURATION,
    tabSwitches: 0,
    terminationReason: null,
    serverAttemptId: null,
    serverStartedAt: null,
  };
}

function getInitialAttempt() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return createNewAttempt();
    }

    const parsed = JSON.parse(saved);

    return {
      ...createNewAttempt(),
      ...parsed,
      answers: parsed.answers || {},
    };
  } catch (error) {
    console.error(
      "Erreur récupération tentative:",
      error
    );

    return createNewAttempt();
  }
}

function saveAttempt(attempt) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(attempt)
    );
  } catch (error) {
    console.error(
      "Erreur sauvegarde tentative:",
      error
    );
  }
}

function withTimeout(
  promise,
  timeout = INITIALIZATION_TIMEOUT
) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("Timeout")
          ),
        timeout
      )
    ),
  ]);
}

export default function ListeningTest() {
  const navigate = useNavigate();

  const initialAttemptRef =
    useRef(null);

  if (!initialAttemptRef.current) {
    initialAttemptRef.current =
      getInitialAttempt();
  }

  const initialAttempt =
    initialAttemptRef.current;

  const [current, setCurrent] =
    useState(
      initialAttempt.current || 0
    );

  const [selected, setSelected] =
    useState(
      initialAttempt.selected ||
        null
    );

  const [answers, setAnswers] =
    useState(
      initialAttempt.answers ||
        {}
    );

  const [score, setScore] =
    useState(
      initialAttempt.score || 0
    );

  const [finished, setFinished] =
    useState(
      initialAttempt.finished ||
        false
    );

  const [timeLeft, setTimeLeft] =
    useState(
      Math.max(
        0,
        initialAttempt.endTime -
          Date.now()
      )
    );

  const [
    tabSwitches,
    setTabSwitches,
  ] = useState(
    initialAttempt.tabSwitches ||
      0
  );

  const [
    terminationReason,
    setTerminationReason,
  ] = useState(
    initialAttempt.terminationReason ||
      null
  );

  const [
    serverAttemptId,
    setServerAttemptId,
  ] = useState(
    initialAttempt.serverAttemptId ||
      null
  );

  const [
    serverStartedAt,
    setServerStartedAt,
  ] = useState(
    initialAttempt.serverStartedAt ||
      null
  );

  const [loading, setLoading] =
    useState(true);

  const [
    accessAllowed,
    setAccessAllowed,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [audioError, setAudioError] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const audioRef = useRef(null);

  const initializationPromiseRef =
    useRef(null);

  const finishingRef =
    useRef(false);

  const resultSavedRef =
    useRef(false);

  const tabSwitchesRef =
    useRef(
      initialAttempt.tabSwitches ||
        0
    );

  const currentQuestion =
    questions[current];

  /*
   * SERVER TIME
   */
  const getServerNow =
    useCallback(async () => {
      const {
        data,
        error,
      } = await supabase.rpc(
        "get_server_time"
      );

      if (error) {
        throw error;
      }

      return new Date(
        data
      ).getTime();
    }, []);

  /*
   * SAVE LOCAL PROGRESS
   */
  const updateAttempt =
    useCallback(
      (updates = {}) => {
        const attempt = {
          current,
          selected,
          answers,
          score,
          finished,

          endTime:
            timeLeft + Date.now(),

          tabSwitches:
            tabSwitchesRef.current,

          terminationReason,

          serverAttemptId,

          serverStartedAt,

          ...updates,
        };

        saveAttempt(attempt);
      },
      [
        current,
        selected,
        answers,
        score,
        finished,
        timeLeft,
        terminationReason,
        serverAttemptId,
        serverStartedAt,
      ]
    );

  /*
   * FINISH SERVER ATTEMPT
   */
  const finishServerAttempt =
    useCallback(
      async (
        attemptId,
        reason,
        switches
      ) => {
        if (!attemptId) {
          return null;
        }

        try {
          const {
            data,
            error,
          } = await supabase.rpc(
            "finish_listening_test_attempt",
            {
              p_attempt_id:
                attemptId,

              p_reason: reason,

              p_tab_switches:
                switches,
            }
          );

          if (error) {
            console.error(
              "Erreur fermeture tentative serveur:",
              error
            );

            return null;
          }

          return data;
        } catch (error) {
          console.error(
            "Erreur fermeture tentative:",
            error
          );

          return null;
        }
      },
      []
    );

  /*
   * SEND RESULT EMAIL
   */
  const sendResultEmail =
    useCallback(
      async (
        finalScore,
        percentage
      ) => {
        try {
          const alreadySent =
            localStorage.getItem(
              RESULT_EMAIL_SENT_KEY
            );

          if (
            alreadySent === "true"
          ) {
            return;
          }

          const {
            data: {
              user,
            },
          } =
            await supabase.auth.getUser();

          if (!user?.email) {
            return;
          }

          const {
            error,
          } =
            await supabase.functions.invoke(
              "send-test-result",
              {
                body: {
                  email: user.email,
                  score: finalScore,
                  total_questions:
                    questions.length,
                  percentage,
                  test_type:
                    "Compréhension orale",
                },
              }
            );

          if (error) {
            console.error(
              "Erreur envoi email:",
              error
            );

            return;
          }

          localStorage.setItem(
            RESULT_EMAIL_SENT_KEY,
            "true"
          );
        } catch (error) {
          console.error(
            "Erreur email résultat:",
            error
          );
        }
      },
      []
    );

  /*
   * INITIALISATION
   */
  useEffect(() => {
    let mounted = true;

    async function initializeTest() {
      try {
        setLoading(true);
        setErrorMessage("");

        if (
          !initializationPromiseRef.current
        ) {
          initializationPromiseRef.current =
            (async () => {
              /*
               * USER
               */
              const {
                data: {
                  user,
                },
                error:
                  userError,
              } =
                await withTimeout(
                  supabase.auth.getUser()
                );

              if (
                userError ||
                !user
              ) {
                return {
                  type: "redirect",
                };
              }

              /*
               * STUDENT PROFILE
               */
              const {
                data: profile,
                error:
                  profileError,
              } =
                await withTimeout(
                  supabase
                    .from(
                      "student_profiles"
                    )
                    .select("*")
                    .eq(
                      "id",
                      user.id
                    )
                    .maybeSingle()
                );

              if (profileError) {
                throw profileError;
              }

              if (!profile) {
                return {
                  type: "error",
                  message:
                    "Profil étudiant introuvable.",
                };
              }

              /*
               * APPROVED + PAID
               */
              const approved =
                profile.status ===
                "approved";

              const paid =
                profile.payment_status ===
                "paid";

              if (
                !approved ||
                !paid
              ) {
                return {
                  type:
                    "access_denied",
                  message:
                    "Votre compte doit être approuvé et votre paiement doit être confirmé avant de passer ce test.",
                };
              }

              /*
               * EXISTING RESULT
               */
              const {
                data:
                  existingResult,
                error:
                  resultError,
              } =
                await withTimeout(
                  supabase
                    .from(
                      "test_results"
                    )
                    .select("id")
                    .eq(
                      "student_id",
                      user.id
                    )
                    .eq(
                      "test_type",
                      "oral"
                    )
                    .limit(1)
                );

              if (resultError) {
                throw resultError;
              }

              if (
                existingResult &&
                existingResult.length >
                  0
              ) {
                return {
                  type:
                    "access_denied",
                  message:
                    "Vous avez déjà terminé ce test.",
                };
              }

              /*
               * EXISTING SERVER ATTEMPT
               */
              const {
                data:
                  existingAttempts,
                error:
                  attemptError,
              } =
                await withTimeout(
                  supabase
                    .from(
                      "listening_test_attempts"
                    )
                    .select("*")
                    .eq(
                      "student_id",
                      user.id
                    )
                    .order(
                      "created_at",
                      {
                        ascending:
                          false,
                      }
                    )
                    .limit(1)
                );

              if (attemptError) {
                throw attemptError;
              }

              if (
                existingAttempts &&
                existingAttempts.length >
                  0
              ) {
                const latestAttempt =
                  existingAttempts[0];

                /*
                 * ALREADY FINISHED
                 */
                if (
                  latestAttempt.status ===
                  "finished"
                ) {
                  return {
                    type:
                      "access_denied",
                    message:
                      "Vous avez déjà utilisé votre tentative de compréhension orale.",
                  };
                }

                /*
                 * RESUME EXISTING ATTEMPT
                 */
                if (
                  latestAttempt.status ===
                  "in_progress"
                ) {
                  const existingSwitches =
                    latestAttempt.tab_switches ||
                    0;

                  /*
                   * TWO TAB SWITCHES
                   */
                  if (
                    existingSwitches >=
                    2
                  ) {
                    await finishServerAttempt(
                      latestAttempt.id,
                      "tab_switch",
                      existingSwitches
                    );

                    return {
                      type:
                        "finished",

                      terminationReason:
                        "tab_switch",

                      serverAttemptId:
                        latestAttempt.id,

                      serverStartedAt:
                        latestAttempt.started_at,

                      tabSwitches:
                        existingSwitches,
                    };
                  }

                  /*
                   * SERVER TIME
                   */
                  const serverNow =
                    await getServerNow();

                  const startedAt =
                    new Date(
                      latestAttempt.started_at
                    ).getTime();

                  const calculatedEnd =
                    startedAt +
                    TEST_DURATION;

                  const remaining =
                    Math.max(
                      0,
                      calculatedEnd -
                        serverNow
                    );

                  /*
                   * EXPIRED
                   */
                  if (
                    remaining <= 0
                  ) {
                    await finishServerAttempt(
                      latestAttempt.id,
                      "time_expired",
                      existingSwitches
                    );

                    return {
                      type:
                        "finished",

                      terminationReason:
                        "time_expired",

                      serverAttemptId:
                        latestAttempt.id,

                      serverStartedAt:
                        latestAttempt.started_at,

                      tabSwitches:
                        existingSwitches,
                    };
                  }

                  return {
                    type: "resume",

                    serverAttemptId:
                      latestAttempt.id,

                    serverStartedAt:
                      latestAttempt.started_at,

                    tabSwitches:
                      existingSwitches,

                    timeLeft:
                      remaining,
                  };
                }
              }

              /*
               * CREATE NEW SERVER ATTEMPT
               */
              const {
                data:
                  newAttempt,
                error:
                  createError,
              } =
                await withTimeout(
                  supabase
                    .from(
                      "listening_test_attempts"
                    )
                    .insert({
                      student_id:
                        user.id,

                      status:
                        "in_progress",

                      tab_switches: 0,
                    })
                    .select()
                    .single()
                );

              if (createError) {
                throw createError;
              }

              /*
               * SERVER TIME
               */
              const serverNow =
                await getServerNow();

              const startedAt =
                new Date(
                  newAttempt.started_at
                ).getTime();

              const calculatedEnd =
                startedAt +
                TEST_DURATION;

              const remaining =
                Math.max(
                  0,
                  calculatedEnd -
                    serverNow
                );

              /*
               * IMMEDIATE EXPIRATION
               */
              if (
                remaining <= 0
              ) {
                await finishServerAttempt(
                  newAttempt.id,
                  "time_expired",
                  0
                );

                return {
                  type:
                    "finished",

                  terminationReason:
                    "time_expired",

                  serverAttemptId:
                    newAttempt.id,

                  serverStartedAt:
                    newAttempt.started_at,

                  tabSwitches: 0,
                };
              }

              return {
                type: "new",

                serverAttemptId:
                  newAttempt.id,

                serverStartedAt:
                  newAttempt.started_at,

                tabSwitches: 0,

                timeLeft:
                  remaining,
              };
            })();
        }

        const result =
          await initializationPromiseRef.current;

        if (!mounted) {
          return;
        }

        /*
         * REDIRECT
         */
        if (
          result.type ===
          "redirect"
        ) {
          navigate(
            "/student-login"
          );

          return;
        }

        /*
         * ERROR
         */
        if (
          result.type ===
          "error"
        ) {
          setAccessAllowed(
            false
          );

          setErrorMessage(
            result.message
          );

          return;
        }

        /*
         * ACCESS DENIED
         */
        if (
          result.type ===
          "access_denied"
        ) {
          setAccessAllowed(
            false
          );

          setErrorMessage(
            result.message
          );

          return;
        }

        /*
         * AUTOMATICALLY FINISHED
         */
        if (
          result.type ===
          "finished"
        ) {
          tabSwitchesRef.current =
            result.tabSwitches || 0;

          setTabSwitches(
            result.tabSwitches || 0
          );

          setServerAttemptId(
            result.serverAttemptId
          );

          setServerStartedAt(
            result.serverStartedAt
          );

          setTerminationReason(
            result.terminationReason
          );

          setTimeLeft(0);

          setFinished(true);

          setAccessAllowed(true);

          return;
        }

        /*
         * NEW / RESUMED
         */
        tabSwitchesRef.current =
          result.tabSwitches || 0;

        setTabSwitches(
          result.tabSwitches || 0
        );

        setServerAttemptId(
          result.serverAttemptId
        );

        setServerStartedAt(
          result.serverStartedAt
        );

        /*
         * TIMER DISPLAY FIX:
         * For a brand-new attempt, show the full
         * 30:00 immediately instead of the value
         * already reduced by initialization checks.
         * Resumed attempts keep using the real
         * server-calculated remaining time.
         */
        setTimeLeft(
          result.type === "new"
            ? TEST_DURATION
            : result.timeLeft
        );

        setAccessAllowed(true);
      } catch (error) {
        console.error(
          "Erreur initialisation test:",
          error
        );

        if (mounted) {
          setErrorMessage(
            "Une erreur est survenue lors de l'initialisation du test."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeTest();

    return () => {
      mounted = false;
    };
  }, [
    navigate,
    getServerNow,
    finishServerAttempt,
  ]);

  /*
   * SAVE PROGRESS
   */
  useEffect(() => {
    updateAttempt();
  }, [
    current,
    selected,
    answers,
    score,
    finished,
    tabSwitches,
    terminationReason,
    serverAttemptId,
    serverStartedAt,
    updateAttempt,
  ]);

  /*
   * TIMER
   */
  useEffect(() => {
    if (
      !accessAllowed ||
      finished ||
      !serverAttemptId
    ) {
      return;
    }

    let active = true;

    const updateTimer =
      async () => {
        try {
          const serverNow =
            await getServerNow();

          if (!active) {
            return;
          }

          const startedAt =
            serverStartedAt
              ? new Date(
                  serverStartedAt
                ).getTime()
              : null;

          if (!startedAt) {
            return;
          }

          const remaining =
            Math.max(
              0,
              startedAt +
                TEST_DURATION -
                serverNow
            );

          setTimeLeft(
            remaining
          );

          if (
            remaining <= 0 &&
            !finishingRef.current
          ) {
            finishingRef.current =
              true;

            await finishServerAttempt(
              serverAttemptId,
              "time_expired",
              tabSwitchesRef.current
            );

            if (!active) {
              return;
            }

            setTimeLeft(0);

            setTerminationReason(
              "time_expired"
            );

            setFinished(true);
          }
        } catch (error) {
          console.error(
            "Erreur timer:",
            error
          );
        }
      };

    updateTimer();

    const interval =
      setInterval(
        updateTimer,
        1000
      );

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [
    accessAllowed,
    finished,
    serverAttemptId,
    serverStartedAt,
    getServerNow,
    finishServerAttempt,
  ]);

  /*
   * TAB / WINDOW SECURITY
   *
   * 1st change = warning
   * 2nd change = automatic termination
   */
  useEffect(() => {
    if (
      !accessAllowed ||
      finished ||
      !serverAttemptId
    ) {
      return;
    }

    const handleVisibilityChange =
      async () => {
        if (
          document.visibilityState !==
          "hidden"
        ) {
          return;
        }

        if (
          finishingRef.current
        ) {
          return;
        }

        const newSwitchCount =
          tabSwitchesRef.current +
          1;

        tabSwitchesRef.current =
          newSwitchCount;

        setTabSwitches(
          newSwitchCount
        );

        /*
         * FIRST SWITCH
         */
        if (
          newSwitchCount === 1
        ) {
          try {
            const {
              error,
            } = await supabase
              .from(
                "listening_test_attempts"
              )
              .update({
                tab_switches:
                  newSwitchCount,
              })
              .eq(
                "id",
                serverAttemptId
              );

            if (error) {
              console.error(
                "Erreur sauvegarde changement onglet:",
                error
              );
            }
          } catch (error) {
            console.error(
              "Erreur sauvegarde changement onglet:",
              error
            );
          }

          window.setTimeout(() => {
            if (
              !finishingRef.current &&
              !document.hidden
            ) {
              alert(
                "Attention : vous avez quitté la fenêtre ou l'onglet du test. Un deuxième changement entraînera la fin automatique du test."
              );
            }
          }, 100);

          return;
        }

        /*
         * SECOND SWITCH
         */
        if (
          newSwitchCount >= 2
        ) {
          finishingRef.current =
            true;

          await finishServerAttempt(
            serverAttemptId,
            "tab_switch",
            newSwitchCount
          );

          setTerminationReason(
            "tab_switch"
          );

          setFinished(true);

          setSelected(null);
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    accessAllowed,
    finished,
    serverAttemptId,
    finishServerAttempt,
  ]);

  /*
   * AUDIO
   */
  const playAudio =
    useCallback(
      (audioPath) => {
        try {
          setAudioError(false);

          if (
            audioRef.current
          ) {
            audioRef.current.pause();

            audioRef.current =
              null;
          }

          const audio =
            new Audio(audioPath);

          audioRef.current =
            audio;

          audio.onplay = () => {
            setIsPlaying(true);
          };

          audio.onended = () => {
            setIsPlaying(false);
          };

          audio.onerror = () => {
            console.error(
              "Erreur audio:",
              audioPath
            );

            setIsPlaying(false);

            setAudioError(true);
          };

          audio
            .play()
            .catch((error) => {
              console.error(
                "Impossible de lire l'audio:",
                error
              );

              setIsPlaying(false);

              setAudioError(true);
            });
        } catch (error) {
          console.error(
            "Erreur lecture audio:",
            error
          );

          setIsPlaying(false);

          setAudioError(true);
        }
      },
      []
    );

  /*
   * SELECT ANSWER
   *
   * IMPORTANT:
   * Once an answer has been selected,
   * it cannot be changed.
   */
  const handleSelectAnswer =
    (choice) => {
      if (finished) {
        return;
      }

      /*
       * If this question already has an answer,
       * it is permanently locked.
       */
      if (
        answers[
          currentQuestion.id
        ]
      ) {
        return;
      }

      const updatedAnswers = {
        ...answers,

        [currentQuestion.id]:
          choice,
      };

      const newScore =
        questions.reduce(
          (total, question) => {
            return (
              total +
              (updatedAnswers[
                question.id
              ] === question.answer
                ? 1
                : 0)
            );
          },
          0
        );

      /*
       * Save immediately.
       */
      setAnswers(
        updatedAnswers
      );

      setSelected(choice);

      setScore(newScore);

      /*
       * Also save directly to localStorage
       * so a refresh cannot unlock the answer.
       */
      saveAttempt({
        current,
        selected: choice,
        answers: updatedAnswers,
        score: newScore,
        finished,
        endTime:
          timeLeft + Date.now(),
        tabSwitches:
          tabSwitchesRef.current,
        terminationReason,
        serverAttemptId,
        serverStartedAt,
      });
    };

  /*
   * NEXT QUESTION
   */
  const handleNext = () => {
    if (finished) {
      return;
    }

    /*
     * The current question must have
     * a locked answer.
     */
    const currentAnswer =
      answers[
        currentQuestion.id
      ];

    if (!currentAnswer) {
      alert(
        "Veuillez sélectionner une réponse avant de continuer."
      );

      return;
    }

    if (
      current <
      questions.length - 1
    ) {
      const nextQuestion =
        current + 1;

      setCurrent(
        nextQuestion
      );

      /*
       * New question starts with no selection.
       */
      setSelected(null);
    }
  };

  /*
   * SAVE RESULT
   */
  const saveResult =
    useCallback(
      async (finalScore) => {
        if (
          resultSavedRef.current ||
          !serverAttemptId
        ) {
          return;
        }

        resultSavedRef.current =
          true;

        try {
          const {
            data: {
              user,
            },
            error: userError,
          } =
            await supabase.auth.getUser();

          if (
            userError ||
            !user
          ) {
            throw (
              userError ||
              new Error(
                "Utilisateur introuvable"
              )
            );
          }

          const percentage =
            Math.round(
              (finalScore /
                questions.length) *
                100
            );

          /*
           * SAVE RESULT
           */
          const {
            error:
              resultError,
          } =
            await supabase
              .from(
                "test_results"
              )
              .insert({
                student_id:
                  user.id,

                score:
                  finalScore,

                total_questions:
                  questions.length,

                percentage,

                test_type:
                  "oral",

                completed_at:
                  new Date().toISOString(),
              });

          if (resultError) {
            resultSavedRef.current =
              false;

            throw resultError;
          }

          /*
           * FINISH SERVER ATTEMPT
           */
          await finishServerAttempt(
            serverAttemptId,
            "completed",
            tabSwitchesRef.current
          );

          /*
           * Student Portal remains the
           * primary location for results.
           */
          await sendResultEmail(
            finalScore,
            percentage
          );
        } catch (error) {
          console.error(
            "Erreur sauvegarde résultat:",
            error
          );
        }
      },
      [
        serverAttemptId,
        finishServerAttempt,
        sendResultEmail,
      ]
    );

  /*
   * FINISH BUTTON
   */
  const handleFinish = () => {
    if (finished) {
      return;
    }

    const finalAnswer =
      answers[
        currentQuestion.id
      ];

    if (!finalAnswer) {
      alert(
        "Veuillez sélectionner une réponse avant de terminer le test."
      );

      return;
    }

    if (
      finishingRef.current
    ) {
      return;
    }

    const finalScore =
      questions.reduce(
        (total, question) => {
          return (
            total +
            (answers[
              question.id
            ] === question.answer
              ? 1
              : 0)
          );
        },
        0
      );

    finishingRef.current =
      true;

    setScore(
      finalScore
    );

    setFinished(true);

    saveResult(
      finalScore
    );
  };

  /*
   * AUDIO CLEANUP
   */
  useEffect(() => {
    return () => {
      if (
        audioRef.current
      ) {
        audioRef.current.pause();

        audioRef.current =
          null;
      }
    };
  }, []);

  /*
   * FORMAT TIMER
   */
  const formatTime = (
    milliseconds
  ) => {
    const totalSeconds =
      Math.max(
        0,
        Math.floor(
          milliseconds /
            1000
        )
      );

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      seconds
    ).padStart(
      2,
      "0"
    )}`;
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            INTERNATIONAL FRENCH ACADEMY
          </h1>

          <p style={styles.loading}>
            Chargement du test...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ACCESS DENIED
   */
  if (!accessAllowed) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            INTERNATIONAL FRENCH ACADEMY
          </h1>

          <h2 style={styles.heading}>
            Test de compréhension orale
          </h2>

          <div
            style={
              styles.messageBox
            }
          >
            {errorMessage ||
              "Votre compte doit être approuvé et votre paiement doit être confirmé avant de passer ce test."}
          </div>

          <button
            style={
              styles.primaryButton
            }
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
          >
            Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }

  /*
   * TEST FINISHED
   */
  if (finished) {
    const wasTabSwitch =
      terminationReason ===
      "tab_switch";

    const wasTimeout =
      terminationReason ===
      "time_expired";

    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            INTERNATIONAL FRENCH ACADEMY
          </h1>

          {wasTabSwitch ? (
            <>
              <div
                style={
                  styles.dangerIcon
                }
              >
                ⚠️
              </div>

              <h2
                style={
                  styles.heading
                }
              >
                Test terminé
              </h2>

              <p
                style={
                  styles.resultText
                }
              >
                Le test a été
                automatiquement
                terminé après un
                deuxième changement
                de fenêtre ou
                d'onglet.
              </p>

              <div
                style={
                  styles.warningBox
                }
              >
                Votre tentative a
                été enregistrée.
              </div>
            </>
          ) : wasTimeout ? (
            <>
              <div
                style={
                  styles.dangerIcon
                }
              >
                ⏰
              </div>

              <h2
                style={
                  styles.heading
                }
              >
                Temps écoulé
              </h2>

              <p
                style={
                  styles.resultText
                }
              >
                Le temps de 30
                minutes est écoulé.
                Le test est terminé.
              </p>

              <div
                style={
                  styles.warningBox
                }
              >
                Votre tentative a
                été enregistrée.
              </div>
            </>
          ) : (
            <>
              <div
                style={
                  styles.successIcon
                }
              >
                ✓
              </div>

              <h2
                style={
                  styles.heading
                }
              >
                Test terminé
              </h2>

              <p
                style={
                  styles.resultText
                }
              >
                Votre test de
                compréhension orale
                a été enregistré.
              </p>

              <div
                style={
                  styles.scoreBox
                }
              >
                <strong>
                  Score : {score}/
                  {questions.length}
                </strong>

                <span>
                  {Math.round(
                    (score /
                      questions.length) *
                      100
                  )}
                  %
                </span>
              </div>
            </>
          )}

          <button
            style={
              styles.primaryButton
            }
            onClick={() =>
              navigate(
                "/student-dashboard"
              )
            }
          >
            Retour à mon espace étudiant
          </button>
        </div>
      </div>
    );
  }

  /*
   * CURRENT QUESTION ALREADY ANSWERED
   */
  const answerLocked =
    Boolean(
      answers[
        currentQuestion.id
      ]
    );

  /*
   * TEST SCREEN
   */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.brand}>
              INTERNATIONAL FRENCH ACADEMY
            </div>

            <h1
              style={
                styles.mainTitle
              }
            >
              Test de compréhension
              orale
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              Évaluez votre niveau
              de compréhension du
              français.
            </p>
          </div>

          <div
            style={
              styles.timerBox
            }
          >
            <span
              style={
                styles.timerLabel
              }
            >
              TEMPS RESTANT
            </span>

            <strong
              style={{
                ...styles.timer,

                ...(timeLeft <=
                5 * 60 * 1000
                  ? styles.timerWarning
                  : {}),
              }}
            >
              {formatTime(
                timeLeft
              )}
            </strong>
          </div>
        </header>

        <div
          style={
            styles.securityNotice
          }
        >
          🔒 Ne quittez pas la
          fenêtre du test. Un
          deuxième changement de
          fenêtre ou d'onglet
          entraîne la fin
          automatique du test.
        </div>

        <div
          style={
            styles.answerNotice
          }
        >
          🔒 Une fois votre réponse
          sélectionnée, elle ne peut
          plus être modifiée.
        </div>

        <main
          style={
            styles.testCard
          }
        >
          <div
            style={
              styles.questionHeader
            }
          >
            <div>
              <span
                style={
                  styles.questionNumber
                }
              >
                Question{" "}
                {current + 1} sur{" "}
                {questions.length}
              </span>

              <span
                style={
                  styles.level
                }
              >
                Niveau{" "}
                {currentQuestion.level}
              </span>
            </div>

            <div
              style={
                styles.progressText
              }
            >
              {Math.round(
                ((current + 1) /
                  questions.length) *
                  100
              )}
              %
            </div>
          </div>

          <div
            style={
              styles.progressBar
            }
          >
            <div
              style={{
                ...styles.progressFill,

                width: `${
                  ((current + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>

          <section
            style={
              styles.audioSection
            }
          >
            <button
              type="button"
              style={
                isPlaying
                  ? styles.audioButtonPlaying
                  : styles.audioButton
              }
              onClick={() =>
                playAudio(
                  currentQuestion.audio
                )
              }
            >
              {isPlaying
                ? "⏸ Lecture..."
                : "▶ Écouter l'audio"}
            </button>

            {audioError && (
              <p
                style={
                  styles.audioError
                }
              >
                Impossible de lire
                l'audio. Vérifiez
                votre connexion ou
                réessayez.
              </p>
            )}
          </section>

          <section
            style={
              styles.questionSection
            }
          >
            <div
              style={
                styles.questionLabel
              }
            >
              Question{" "}
              {current + 1}
            </div>

            <h2
              style={
                styles.question
              }
            >
              {
                currentQuestion.question
              }
            </h2>

            <div
              style={
                styles.choices
              }
            >
              {currentQuestion.choices.map(
                (
                  choice,
                  index
                ) => {
                  const isSelected =
                    selected ===
                    choice;

                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={
                        answerLocked
                      }
                      onClick={() =>
                        handleSelectAnswer(
                          choice
                        )
                      }
                      style={{
                        ...styles.choice,

                        ...(isSelected
                          ? styles.choiceSelected
                          : {}),

                        ...(answerLocked
                          ? styles.choiceLocked
                          : {}),
                      }}
                    >
                      <span
                        style={
                          styles.choiceLetter
                        }
                      >
                        {String.fromCharCode(
                          65 +
                            index
                        )}
                      </span>

                      <span>
                        {choice}
                      </span>

                      {isSelected && (
                        <span
                          style={
                            styles.lockIcon
                          }
                        >
                          🔒
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {answerLocked && (
              <div
                style={
                  styles.lockedMessage
                }
              >
                ✓ Réponse enregistrée
                et verrouillée. Vous ne
                pouvez plus la modifier.
              </div>
            )}
          </section>

          <div
            style={
              styles.navigation
            }
          >
            {current <
            questions.length - 1 ? (
              <button
                type="button"
                onClick={
                  handleNext
                }
                disabled={
                  !answerLocked
                }
                style={{
                  ...styles.primaryButton,

                  ...(!answerLocked
                    ? styles.disabledButton
                    : {}),
                }}
              >
                Question suivante →
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleFinish
                }
                disabled={
                  !answerLocked
                }
                style={{
                  ...styles.finishButton,

                  ...(!answerLocked
                    ? styles.disabledButton
                    : {}),
                }}
              >
                Terminer le test ✓
              </button>
            )}
          </div>
        </main>

        <footer
          style={
            styles.footer
          }
        >
          International French Academy —
          Kigali, Rwanda
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f4ee",
    padding: "30px 20px",
    boxSizing: "border-box",
    fontFamily:
      '"DM Sans", Arial, sans-serif',
    color: "#0d1b2a",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  card: {
    maxWidth: "700px",
    margin: "60px auto",
    background: "#ffffff",
    padding: "45px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 35px rgba(13, 27, 42, 0.10)",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "25px",
    marginBottom: "20px",
  },

  brand: {
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    marginBottom: "12px",
  },

  title: {
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "22px",
    marginBottom: "25px",
  },

  mainTitle: {
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "34px",
    margin: 0,
    lineHeight: 1.2,
  },

  subtitle: {
    marginTop: "10px",
    fontSize: "16px",
    opacity: 0.75,
  },

  heading: {
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "28px",
    marginBottom: "20px",
  },

  timerBox: {
    minWidth: "150px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "14px 18px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(13, 27, 42, 0.08)",
  },

  timerLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "5px",
  },

  timer: {
    fontSize: "25px",
    fontWeight: "800",
  },

  timerWarning: {
    color: "#b42318",
  },

  securityNotice: {
    background: "#fff8e7",
    border: "1px solid #e7d39a",
    borderRadius: "10px",
    padding: "12px 15px",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "600",
  },

  answerNotice: {
    background: "#f1f5f9",
    border: "1px solid #d8dee6",
    borderRadius: "10px",
    padding: "12px 15px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },

  testCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 10px 35px rgba(13, 27, 42, 0.08)",
  },

  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  questionNumber: {
    display: "inline-block",
    fontWeight: "800",
    fontSize: "18px",
    marginRight: "15px",
  },

  level: {
    display: "inline-block",
    background: "#0d1b2a",
    color: "#ffffff",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  progressText: {
    fontSize: "13px",
    fontWeight: "700",
  },

  progressBar: {
    height: "7px",
    background: "#e6e1d8",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "30px",
  },

  progressFill: {
    height: "100%",
    background: "#c9a84c",
    transition: "width 0.3s ease",
  },

  audioSection: {
    marginBottom: "30px",
    textAlign: "center",
  },

  audioButton: {
    border: "none",
    background: "#0d1b2a",
    color: "#ffffff",
    padding: "14px 25px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  audioButtonPlaying: {
    border: "none",
    background: "#c9a84c",
    color: "#0d1b2a",
    padding: "14px 25px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  audioError: {
    color: "#b42318",
    marginTop: "12px",
    fontSize: "14px",
  },

  questionSection: {
    marginBottom: "30px",
  },

  questionLabel: {
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
    opacity: 0.65,
  },

  question: {
    fontFamily:
      '"Playfair Display", Georgia, serif',
    fontSize: "27px",
    lineHeight: 1.35,
    marginTop: 0,
    marginBottom: "25px",
  },

  choices: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  choice: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textAlign: "left",
    background: "#ffffff",
    border: "1px solid #d8d3ca",
    borderRadius: "10px",
    padding: "15px",
    cursor: "pointer",
    fontSize: "16px",
  },

  choiceSelected: {
  border: "2px solid #c9a84c",
  background: "#c9a84c",
  color: "#0d1b2a",
  fontWeight: "700",
},

  choiceLocked: {
    cursor: "not-allowed",
  },

  choiceLetter: {
    minWidth: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1b2a",
    color: "#ffffff",
    fontWeight: "800",
  },

  lockIcon: {
    marginLeft: "auto",
    fontSize: "15px",
  },

  lockedMessage: {
    marginTop: "15px",
    background: "#f1f8f3",
    border: "1px solid #b8d8c0",
    borderRadius: "9px",
    padding: "12px 15px",
    fontSize: "14px",
    fontWeight: "700",
  },

  navigation: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "30px",
  },

  primaryButton: {
    border: "none",
    background: "#0d1b2a",
    color: "#ffffff",
    padding: "13px 22px",
    borderRadius: "9px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  finishButton: {
    border: "none",
    background: "#c9a84c",
    color: "#0d1b2a",
    padding: "13px 22px",
    borderRadius: "9px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.45,
    cursor: "not-allowed",
  },

  loading: {
    fontSize: "17px",
  },

  messageBox: {
    background: "#fff8e7",
    border:
      "1px solid #e7d39a",
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "25px",
    lineHeight: 1.5,
  },

  warningBox: {
    background: "#fff8e7",
    border:
      "1px solid #e7d39a",
    borderRadius: "10px",
    padding: "15px",
    margin: "20px 0",
    fontWeight: "600",
  },

  resultText: {
    fontSize: "16px",
    lineHeight: 1.6,
  },

  scoreBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "#f8f4ee",
    borderRadius: "12px",
    padding: "20px",
    margin: "25px 0",
    fontSize: "20px",
  },

  successIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },

  dangerIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },

  footer: {
    textAlign: "center",
    marginTop: "25px",
    fontSize: "13px",
    opacity: 0.65,
  },
};