/* ----------------------------------------------------
                       PARAMÈTRES DE CONFIGURATION (MODIFIABLES DIRECTEMENT)
                       ---------------------------------------------------- */

// Theme global de style (ex: "french", "math", "physics", "svt")
const CONFIG_THEME = "french";

// Unique Sujet de Brevet principal présent dans l'Immersive
const ACTIVE_SUBJECT_JSON = window.ACTIVE_SUBJECT_JSON;
if (!ACTIVE_SUBJECT_JSON) {
  console.warn(
    "⚠️ Attention : window.ACTIVE_SUBJECT_JSON est manquant ou invalide ! Valeur actuelle :",
    ACTIVE_SUBJECT_JSON,
  );
} else {
  console.log("✅ Fichier JSON chargé avec succès :", ACTIVE_SUBJECT_JSON);
}
// App state
let currentSubject = {};
let subjectsAnswers = {};

// Lifecycle init
function bootApp() {
  if (typeof lucide !== "undefined") lucide.createIcons();
  initSubject();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}

// Initialize active subject structure
function initSubject() {
  currentSubject = JSON.parse(JSON.stringify(ACTIVE_SUBJECT_JSON));

  // Update Exam Card Color borders based on config theme
  const cardContainer = document.getElementById("exam-card-container");
  cardContainer.className = `exam-card bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden exam-card-${CONFIG_THEME}`;

  // Update titles
  document.getElementById("copy-subject").innerText =
    `Épreuve officielle de ${currentSubject.subject}`;
  document.getElementById("copy-title").innerText = currentSubject.title;
  document.getElementById("copy-description").innerHTML =
    currentSubject.description;

  // Render copy layout
  renderQuestionsSheet(currentSubject);
  fillJSONEditor(currentSubject);
  updateProgressStats();
}

// Render All questions like an exam sheet
function renderQuestionsSheet(subject) {
  const container = document.getElementById("copy-questions-sheet");
  container.innerHTML = "";

  let totalPoints = 0;
  let questionCount = 0;

  if (!subject.exercises || subject.exercises.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500">Aucun exercice de brevet disponible dans ce modèle.</div>`;
    return;
  }

  subject.exercises.forEach((exo) => {
    // Exercise Section Group
    const exoBlock = document.createElement("div");
    exoBlock.className =
      "flex flex-col gap-4 border-l-4 border-slate-700 pl-4 py-1";

    exoBlock.innerHTML = `
                        <div class="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                          <h3 class="font-extrabold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            ${exo.title}
                          </h3>
                          <span class="text-xs bg-indigo-950/60 text-indigo-400 px-2 py-0.5 rounded font-bold border border-indigo-900/30">
                            ${exo.points} Points
                          </span>
                        </div>
                      `;

    // Question sub-group
    if (exo.questions) {
      exo.questions.forEach((q, index) => {
        questionCount++;
        totalPoints += q.points;

        // Retrieve existing answers from localStorage ou mémoire
        const savedFromStorage =
          JSON.parse(localStorage.getItem("brevet_answers") || "{}")[q.id] ||
          "";
        const savedVal = subjectsAnswers[q.id] || savedFromStorage || "";

        let qImg = "";
        if (q.image) {
          qImg = `
                              <div class="my-4 rounded-xl overflow-hidden max-h-60 border border-slate-800">
                                <img src="${q.image}" onerror="this.src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'; this.onerror=null;" alt="Brevet document" class="w-full h-full object-cover">
                              </div>
                            `;
        }

        const qItem = document.createElement("div");
        qItem.className =
          "mt-4 bg-slate-950/25 p-4 rounded-xl border border-slate-800 flex flex-col gap-3";
        qItem.innerHTML = `
                            <div class="flex justify-between items-start gap-4">
                              <h4 class="font-bold text-slate-100 text-sm leading-relaxed">
                                <span class="text-indigo-400 font-mono mr-1">Q${index + 1}.</span> ${q.text}
                              </h4>
                              <span class="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                /${q.points} Pts
                              </span>
                            </div>
                            ${qImg}

                            <!-- Ruled input block -->
                            <div class="mt-2 flex flex-col gap-2">
                              <div class="flex justify-between items-center">
                                <label class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Copie du candidat :</label>
                                <span id="char-count-${q.id}" class="text-[9px] text-slate-600 font-mono">0 car.</span>
                              </div>

                              <!-- Saisie interactive -->
                              <div class="flex flex-col w-full">
                                <textarea id="answer_${q.id}" oninput="handleTextareaInput('${q.id}')" class="ruled-paper w-full min-h-[120px] bg-slate-900 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-600 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors font-serif resize-y" placeholder="Formulez vos démonstrations, définitions ou calculs étape par étape ici...">${savedVal}</textarea>

                                <!-- Surlignement interactif une fois l'analyse effectuée -->
                                <div id="correction-overlay-${q.id}" class="ruled-paper w-full min-h-[120px] bg-slate-900 rounded-xl p-4 text-sm text-slate-300 font-serif border border-slate-800 overflow-y-auto hidden"></div>
                              </div>
                            </div>


                          `;
        exoBlock.appendChild(qItem);
      });
    }

    container.appendChild(exoBlock);
  });

  // Update Copy Stats
  document.getElementById("copy-total-points").innerText = `${totalPoints} Pts`;
  document.getElementById("stats-questions").innerText = questionCount;

  // Init newly created items characters counters
  if (subject.exercises) {
    subject.exercises.forEach((exo) => {
      if (exo.questions) {
        exo.questions.forEach((q) => handleTextareaInput(q.id));
      }
    });
  }

  lucide.createIcons();
}

// Track typing to show stats + sauvegarde localStorage
function handleTextareaInput(qId) {
  const textVal = document.getElementById(`answer_${qId}`)?.value || "";
  const charCountEl = document.getElementById(`char-count-${qId}`);
  if (charCountEl) {
    charCountEl.innerText = `${textVal.length} car.`;
  }
  // Sauvegarde en temps réel
  const saved = JSON.parse(localStorage.getItem("brevet_answers") || "{}");
  saved[qId] = textVal;
  localStorage.setItem("brevet_answers", JSON.stringify(saved));
  updateProgressStats();
}

// Calculate progress percentage of current questionnaire
function updateProgressStats() {
  if (!currentSubject || !currentSubject.exercises) return;

  let totalQuestions = 0;
  let filledQuestions = 0;

  currentSubject.exercises.forEach((exo) => {
    if (exo.questions) {
      exo.questions.forEach((q) => {
        totalQuestions++;
        const elVal = document.getElementById(`answer_${q.id}`)?.value || "";
        if (elVal.trim().length > 10) {
          filledQuestions++;
        }
      });
    }
  });

  const ratio =
    totalQuestions > 0
      ? Math.round((filledQuestions / totalQuestions) * 100)
      : 0;
  const progressEl = document.getElementById("stats-progress");
  progressEl.innerText = `${ratio}%`;

  // Colors shifts
  if (ratio === 100) {
    progressEl.className = "text-lg font-black text-emerald-400 animate-bounce";
  } else if (ratio > 40) {
    progressEl.className = "text-lg font-black text-amber-400";
  } else {
    progressEl.className = "text-lg font-black text-slate-500";
  }
}

// Save Answers state in memory
function saveActiveAnswers() {
  if (!currentSubject || !currentSubject.exercises) return;

  currentSubject.exercises.forEach((exo) => {
    if (exo.questions) {
      exo.questions.forEach((q) => {
        const textVal = document.getElementById(`answer_${q.id}`)?.value || "";
        subjectsAnswers[q.id] = textVal;
      });
    }
  });
}

// Gather ALL candidate details for Prompt
function buildGradingPrompt() {
  // Force state save
  saveActiveAnswers();

  let prompt = `Tu es un examinateur officiel de l'Éducation Nationale française pour l'épreuve du Diplôme National du Brevet (DNB) en ${currentSubject.subject}.
            Tu dois corriger la copie de l'élève.

            CONSIGNE INTERACTIVE ESSENTIELLE DE RETOUR :
            Pour chaque question, tu dois examiner scrupuleusement la réponse de l'élève.
            Si tu trouves des fautes d'orthographe (accords, usage, grammaire) ou des erreurs de calcul/raisonnement, tu dois réécrire l'intégralité de la réponse de l'élève en entourant UNIQUEMENT les mots erronés avec la balise spéciale :
            <error correct="La correction suggérée">mot erroné</error>

            Par exemple, si l'élève écrit : "Le loup affamés s'avancer lentement."
            Tu dois retourner sa réponse réécrite sous la forme suivante dans la section "TEXTE CORRIGÉ INTÉGRAL" de chaque question :
            "Le loup <error correct="affamé">affamés</error> <error correct="s'avança">s'avancer</error> lentement."

            Autre exemple en mathématiques si l'élève écrit : "AC2 = 74 + 100 = 200"
            Tu dois retourner : "AC2 = 74 + 100 = <error correct="174">200</error>"

            === SUJET DE L'ÉPREUVE : ${currentSubject.title} ===
            Description générale : ${currentSubject.description.replace(/<[^>]*>/g, "")}

            Voici les questions, les barèmes officiels et les réponses saisies par l'élève :

            `;

  if (currentSubject.exercises) {
    currentSubject.exercises.forEach((exo) => {
      if (exo.questions) {
        exo.questions.forEach((q, index) => {
          const answer = subjectsAnswers[q.id] || "";
          prompt += `---
            [EXERCICE] : ${exo.title} (Question ${index + 1})
            ID Question : ${q.id}
            Question : ${q.text}
            Barème maximal : ${q.points} points.
            Critère d'évaluation officiel : ${q.guideline}
            Réponse saisie par l'élève : "${answer.trim() || "[Aucune réponse rédigée par l'élève]"}"

            `;
        });
      }
    });
  }

  prompt += `=== FORMAT DE RETOUR ATTENDU (JSON UNIQUEMENT) ===
            Tu dois répondre UNIQUEMENT avec un objet JSON valide, sans texte avant ni après.
            Structure JSON attendue :
{
  "score": "X/Y",
  "appreciation": "Appréciation globale",
  "summary": "Résumé court",
  "questions": {
    "ID_QUESTION": {
      "score": "X/Y",
      "feedback": "Explication détaillée de la correction",
      "tips": "Conseil pour progresser",
      "corrected_text": "Réponse réécrite avec les balises <error correct='correction'>erreur</error>"
    }
  }
}

            Exemple pour une question exo1_q1 avec note 3/4 :
            "exo1_q1": {
              "score": "3/4",
              "feedback": "Bonne identification du genre poétique...",
              "tips": "Pensez à citer systématiquement le texte.",
              "corrected_text": "Ce texte appartient au genre <error correct='poétique'>poésie</error>..."
            }

            IMPORTANT : Les IDs des questions sont exactement ceux indiqués dans la liste ci-dessus (ex: exo1_q1, exo2_q2...). Utilise ces IDs comme clés dans le JSON de réponse.
            ATTENTION : Si les réponses des élèves contiennent des guillemets droits (") ou des sauts de ligne, tu dois les échapper correctement dans le JSON : \" pour les guillemets, \n pour les sauts de ligne. Le JSON doit être strictement valide.
            Reste constructif et professionnel. Réponds UNIQUEMENT le JSON.`;

  return prompt;
}

// Methods A Prompt View Handler
function openPromptModal() {
  const promptText = buildGradingPrompt();
  document.getElementById("prompt-textarea").value = promptText;
  document.getElementById("prompt-modal").classList.remove("hidden");

  // Auto-copy to make it extremely easy
  navigator.clipboard
    .writeText(promptText)
    .then(() => {
      alertNotification(
        "success",
        "Prompt copié ! Collez-le dans votre IA externe.",
      );
    })
    .catch(() => {
      // Fallback if browser blocks automatic clipboard write
    });
}

function closePromptModal() {
  document.getElementById("prompt-modal").classList.add("hidden");
}

function copyGeneratedPrompt() {
  const textArea = document.getElementById("prompt-textarea");
  textArea.select();
  try {
    document.execCommand("copy");
    const toast = document.getElementById("modal-toast");
    toast.classList.remove("opacity-0");
    setTimeout(() => {
      toast.classList.add("opacity-0");
    }, 2000);
  } catch (err) {
    alertNotification(
      "error",
      "La copie automatique a échoué. Copiez manuellement.",
    );
  }
}

// Action when the student paste AI evaluation back to the app
function parseAndDisplayPastedCorrection() {
  const textToParse = document.getElementById("ai-response-paste").value;
  if (!textToParse.trim()) {
    alertNotification(
      "error",
      "Veuillez d'abord coller le texte de réponse de l'IA.",
    );
    return;
  }

  // Sauvegarde les dernières réponses avant analyse
  saveActiveAnswers();

  const panel = document.getElementById("correction-display-panel");
  panel.classList.remove("hidden");
  panel.scrollIntoView({ behavior: "smooth" });

  parseAndDisplayCorrection(textToParse);
  alertNotification(
    "success",
    "Analyse terminée ! Vos erreurs sont surlignées sur la copie.",
  );
}

// Extrait la valeur JSON d'un champ: cherche le " de fin avant la prochaine clé connue
function extractVal(text, field, nexts) {
  const p = '"' + field + '": "';
  const s = text.indexOf(p);
  if (s < 0) return null;
  const vs = s + p.length;
  let best = text.length;
  for (const nk of nexts) {
    for (const sep of ['",\n', '",', '",\r\n']) {
      const idx = text.indexOf(sep + nk, vs);
      if (idx >= 0 && idx < best) best = idx + 1;
    }
  }
  for (const ep of ['"\n}', '"\n  }', '"\n    }', '"\r\n}']) {
    const idx = text.indexOf(ep, vs);
    if (idx >= 0 && idx < best) best = idx + 1;
  }
  return best < text.length ? text.slice(vs, best - 1) : null;
}

// Point d'entrée unique : parse le JSON IA et met à jour l'interface
function parseAndDisplayCorrection(rawText) {
  try {
    const t = rawText.trim();
    const braceStart = t.indexOf("{"),
      braceEnd = t.lastIndexOf("}");
    let json =
      braceStart >= 0 && braceEnd >= 0 ? t.slice(braceStart, braceEnd + 1) : t;

    // 1) Tentative JSON.parse direct
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {}
    // 2) Si échec, extraction manuelle (tolère guillemets non échappés)
    if (!data || !data.score) {
      data = {
        score: extractVal(json, "score", ['"appreciation"']),
        appreciation: extractVal(json, "appreciation", ['"summary"']),
        summary: extractVal(json, "summary", ['"questions"']),
        questions: {},
      };
      if (data.score) {
        const qIds =
          currentSubject && currentSubject.exercises
            ? currentSubject.exercises.flatMap((e) =>
                e.questions ? e.questions.map((q) => q.id) : [],
              )
            : [];
        for (const qId of qIds) {
          const esc = qId.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
          const m = json.match(new RegExp('"' + esc + '"\\s*:\\s*\\{'));
          if (!m) continue;
          let depth = 1,
            i = m.index + m[0].length;
          while (i < json.length && depth > 0) {
            if (json[i] === "{") depth++;
            if (json[i] === "}") depth--;
            i++;
          }
          const block = json.slice(m.index, i);
          data.questions[qId] = {
            score: extractVal(block, "score", ['"feedback"']),
            feedback: extractVal(block, "feedback", ['"tips"']),
            tips: extractVal(block, "tips", ['"corrected_text"', "}"]),
            corrected_text: extractVal(block, "corrected_text", ["}"]) || "",
          };
        }
      }
    }

    // Vérification et affichage
    if (data && data.score && data.questions) {
      // Grade + appréciation
      document.getElementById("grade-badge").innerText = data.score;
      const pts = data.score.split("/");
      const ratio =
        pts.length === 2 ? parseFloat(pts[0]) / parseFloat(pts[1]) : 0;
      const apprEl = document.getElementById("grade-appreciation");
      apprEl.innerText = data.appreciation || "Excellent Travail !";
      apprEl.className =
        ratio >= 0.8
          ? "text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-full mt-2 font-bold"
          : ratio >= 0.6
            ? "text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-full mt-2 font-bold"
            : ratio >= 0.4
              ? "text-xs text-amber-400 bg-amber-950/40 border border-amber-500/20 px-3 py-1.5 rounded-full mt-2 font-bold"
              : "text-xs text-red-400 bg-red-950/40 border border-red-500/20 px-3 py-1.5 rounded-full mt-2 font-bold";

      document.getElementById("correction-summary-text").innerText =
        data.summary || "Rapport de correction détaillé ci-dessous.";

      // Surlignage d'erreurs
      if (currentSubject && currentSubject.exercises) {
        currentSubject.exercises.forEach((exo) => {
          if (exo.questions)
            exo.questions.forEach((q) => {
              const qd = data.questions[q.id];
              const ov = document.getElementById("correction-overlay-" + q.id);
              const ta = document.getElementById("answer_" + q.id);
              if (qd && qd.corrected_text && ov && ta) {
                ta.style.display = "none";
                ov.style.display = "block";
                ov.innerHTML = renderErrorTags(qd.corrected_text);
              } else if (ov && ta) {
                ta.style.display = "";
                ov.style.display = "none";
              }
            });
        });
      }

      // Rapport détaillé
      document.getElementById("markdown-correction-output").innerHTML =
        renderCorrectionReport(data);
      lucide.createIcons();
    } else {
      // Fallback
      const nm = t.match(/"score"\s*:\s*"(\d+(?:\.\d+)?)\/(\d+)"/);
      document.getElementById("grade-badge").innerText = nm
        ? nm[1] + " / " + nm[2]
        : "?/?";
      if (nm) {
        const r = parseFloat(nm[1]) / parseFloat(nm[2]);
        const el = document.getElementById("grade-appreciation");
        el.innerText =
          r >= 0.8
            ? "Excellent travail !"
            : r >= 0.6
              ? "Bon travail !"
              : "Résultats corrects";
      }
      const sm = t.match(/"summary"\s*:\s*"([^"]+)"/);
      document.getElementById("correction-summary-text").innerText = sm
        ? sm[1]
        : "Le format de retour na pas pu être interprété.";
      document.getElementById("markdown-correction-output").innerHTML =
        '<div class="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200">' +
        '<strong>Format non reconnu</strong><p class="mt-1">Le retour de lIA na pas pu être analysé.</p></div>';
    }
  } catch (e) {
    alertNotification("error", "Erreur: " + e.message);
  }
}

// Helper: rend le HTML de feedback pour une question
function escapeHTML(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function renderErrorTags(text) {
  return text.replace(
    /<error\s+correct=["']([^"']*)["']>(.*?)(?:<\/error>|$)/gi,
    (m, c, o) =>
      '<span class="correction-error">' +
      o +
      '<span class="correction-tooltip">Suggestion : ' +
      c +
      "</span></span>",
  );
}

function renderQuestionFeedbackHTML(q, qData, studentAnswer) {
  let html = `<div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold text-indigo-300 uppercase tracking-wider">Correction</span>
                    <span class="text-xs font-mono font-bold text-emerald-400">${qData.score || ""}</span>
                </div>`;
  if (studentAnswer && studentAnswer.trim()) {
    html += `<div class="bg-slate-900 border border-red-900/30 rounded-xl p-3 mb-3">
                        <span class="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1.5">
                            <i data-lucide="file-edit" class="w-3 h-3"></i> Ta réponse
                        </span>
                        <p class="text-sm text-slate-300 mt-1.5 leading-relaxed border-l-2 border-red-500/30 pl-3">${escapeHTML(studentAnswer)}</p>
                    </div>`;
  }
  if (qData.feedback) {
    html += `<div class="bg-indigo-950/20 border border-indigo-500/15 rounded-xl p-3 mb-3">
                        <span class="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1.5">
                            <i data-lucide="message-square" class="w-3 h-3"></i> Analyse
                        </span>
                        <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">${qData.feedback}</p>
                    </div>`;
  }
  if (qData.tips) {
    html += `<div class="flex items-start gap-2 text-xs text-amber-300 bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl mb-3">
                        <i data-lucide="lightbulb" class="w-4 h-4 mt-0.5 flex-shrink-0"></i>
                        <span>${qData.tips}</span>
                    </div>`;
  }
  if (qData.corrected_text && qData.corrected_text.trim()) {
    const hasErrors = /<error\s+correct=/i.test(qData.corrected_text);
    html += `<div class="bg-emerald-950/15 border border-emerald-700/30 rounded-xl p-3 overflow-visible">
                        <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                            <i data-lucide="check-circle" class="w-3 h-3"></i> Version corrigée
                            ${hasErrors ? '<span class="text-[9px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded-full">Survoler les mots soulignés</span>' : ""}
                        </span>
                        <div class="text-sm text-slate-200 mt-1.5 leading-relaxed overflow-visible">${renderErrorTags(qData.corrected_text)}</div>
                    </div>`;
  }
  return html;
}

// Helper: génère le rapport complet dans le panneau de correction
function renderCorrectionReport(data) {
  if (!currentSubject.exercises) return "";
  let html = '<div class="flex flex-col gap-6 overflow-visible">';
  currentSubject.exercises.forEach((exo, ei) => {
    if (!exo.questions) return;
    html += `<div class="flex flex-col gap-4">
                        <h5 class="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            ${exo.title}
                        </h5>`;
    exo.questions.forEach((q, qi) => {
      const qData = data.questions[q.id];
      const answer =
        subjectsAnswers[q.id] ||
        document.getElementById(`answer_${q.id}`)?.value ||
        "";
      html += `<div class="bg-slate-950 border border-slate-800 rounded-2xl p-5 ${qi > 0 ? "mt-3" : ""}">
                            <div class="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Question ${qi + 1}</span>
                                    <p class="text-sm text-slate-100 mt-1 font-medium leading-relaxed">${q.text}</p>
                                </div>
                                <span class="text-sm font-mono font-bold whitespace-nowrap px-3 py-1 rounded-lg ${qData ? "text-emerald-400 bg-emerald-950/30 border border-emerald-500/20" : "text-slate-500 bg-slate-900 border border-slate-800"}">${qData ? qData.score : "?/?"}</span>
                            </div>`;
      if (qData) {
        html += renderQuestionFeedbackHTML(q, qData, answer);
      } else {
        html += `<p class="text-xs text-slate-500 italic">Aucune correction fournie pour cette question.</p>`;
      }
      html += `</div>`;
    });
    html += `</div>`;
  });
  html += "</div>";
  return html;
}

// Error overlays from JSON data
function parseInteractiveErrorOverlaysFromJSON(questionsData) {
  if (!currentSubject.exercises) return;
  currentSubject.exercises.forEach((exo) => {
    if (exo.questions) {
      exo.questions.forEach((q) => {
        const qId = q.id;
        const qData = questionsData[qId];
        const overlayDiv = document.getElementById(`correction-overlay-${qId}`);
        const textarea = document.getElementById(`answer_${qId}`);

        if (qData && qData.corrected_text && overlayDiv && textarea) {
          textarea.style.display = "none";
          overlayDiv.style.display = "block";
          overlayDiv.innerHTML = renderErrorTags(qData.corrected_text);
        } else if (overlayDiv && textarea) {
          textarea.style.display = "";
          overlayDiv.style.display = "none";
        }
      });
    }
  });
}

// Error overlays from text format (fallback)
function closeCorrectionPanel() {
  document.getElementById("correction-display-panel").classList.add("hidden");
  document.getElementById("ai-response-paste").value = "";

  // Reset interactive overlays and feedback per question
  if (currentSubject.exercises) {
    currentSubject.exercises.forEach((exo) => {
      if (exo.questions) {
        exo.questions.forEach((q) => {
          const textarea = document.getElementById(`answer_${q.id}`);
          const overlayDiv = document.getElementById(
            `correction-overlay-${q.id}`,
          );
          if (textarea && overlayDiv) {
            textarea.style.display = "";
            overlayDiv.style.display = "none";
            overlayDiv.innerHTML = "";
          }
        });
      }
    });
  }
}

// Advanced JSON Drawer management
function toggleAdvancedSettings() {
  const drawer = document.getElementById("advanced-settings-drawer");
  const arrow = document.getElementById("settings-arrow");

  if (drawer.classList.contains("hidden")) {
    drawer.classList.remove("hidden");
    arrow.className = "w-4 h-4 transition-transform transform rotate-180";
  } else {
    drawer.classList.add("hidden");
    arrow.className = "w-4 h-4 transition-transform";
  }
}

// Editor values alignment
function fillJSONEditor(subjectObj) {
  document.getElementById("json-editor").value = JSON.stringify(
    subjectObj,
    null,
    2,
  );
}

function applyEditedJSON() {
  const value = document.getElementById("json-editor").value;
  try {
    const parsed = JSON.parse(value);
    currentSubject = parsed;
    renderQuestionsSheet(parsed);
    alertNotification(
      "success",
      "Sujet de Brevet mis à jour depuis votre JSON !",
    );
  } catch (error) {
    alertNotification("error", "Erreur dans le JSON : " + error.message);
  }
}

function triggerJSONFileDownload() {
  const content = document.getElementById("json-editor").value;
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `brevet_matiere_unique.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      currentSubject = parsed;
      renderQuestionsSheet(parsed);
      fillJSONEditor(parsed);
      alertNotification("success", "Sujet Brevet JSON chargé avec succès !");
    } catch (err) {
      alertNotification(
        "error",
        "Erreur lors de la lecture du fichier JSON : " + err.message,
      );
    }
  };
  reader.readAsText(file);
}

// Custom notification pop
function alertNotification(type, message) {
  const notificationDiv = document.createElement("div");
  notificationDiv.className = `fixed bottom-5 right-5 z-50 p-4 rounded-xl flex items-center gap-2 border shadow-2xl transition-all translate-y-2 opacity-0 duration-300`;

  if (type === "success") {
    notificationDiv.className +=
      " bg-emerald-950/90 border-emerald-500 text-emerald-300";
    notificationDiv.innerHTML = `<i data-lucide="check" class="w-5 h-5 text-emerald-400"></i> <span class="text-xs font-semibold">${message}</span>`;
  } else {
    notificationDiv.className += " bg-red-950/90 border-red-500 text-red-300";
    notificationDiv.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5 text-red-400"></i> <span class="text-xs font-semibold">${message}</span>`;
  }

  document.body.appendChild(notificationDiv);
  lucide.createIcons();

  // Animate in
  setTimeout(() => {
    notificationDiv.classList.remove("translate-y-2", "opacity-0");
  }, 100);

  // Remove out
  setTimeout(() => {
    notificationDiv.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      notificationDiv.remove();
    }, 300);
  }, 3500);
}
