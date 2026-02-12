// BEGIN_ASSETS
const STATIC_ASSETS = [
  "/Physique/maîtrise_de_la_Tension_Electrique.html",
  "/Physique/quiz-physique-enérgie.html",
  "/QuizMaster_Dynamique_:_Générateur_&_Importateur_de_Questionnaires.html",
  "/angalais/Maître_de_l'Anglais_-_Verbes_Irréguliers.html",
  "/angalais/Revision_HarrietTubman_CivilWar_Grammaire_Connecteurs.html",
  "/capture/1.png",
  "/capture/2.png",
  "/capture/3.png",
  "/capture/4.png",
  "/français/Syllabus_:_Le_Maître_des_Subordonnées.html",
  "/histoire-geo/La_Seconde_Guerre_mondiale,_une_guerre _d_anéantissement_(1939-1945).html",
  "/histoire-geo/Les_espaces_productifs_français_et_leurs_évolutions.html",
  "/index.html",
  "/italien/Grammaire_(L'adjectif 'Bello')_et _ompréhension_de_Texte.html",
  "/latin/Maître_du_Latin_-_Les_verbes.html",
  "/manifest.json",
  "/math/Mathématiques_:_Probabilités_–_Vocabulaire_et_Calculs.html",
  "/math/Quiz-Mathématique-calcul-littéral-en-3ème.html",
  "/math/quiz-pythagore-thales-calcul.html",
  "/offline.html",
  "/questionaire-d-anglais-Vocabulaire-lié-a-l-esclavage-et-la-traite-transatlantique.html",
  "/questionaire-d-emc.html",
  "/questionaire-d-italien-Le-vocabulaire-et-habitudes-alimentaires.html",
  "/questionaire-de-PHYSIQUE.html",
  "/questionaire-de-latin-Jules-César-et-l-apogée-de-la-République-Romaine.html",
  "/questionaire-de-svt.html",
  "/quiz_icon.png",
  "/quiz_icon.svg",
  "/script.js",
  "/service-worker.js",
  "/style.css",
  "/svt/Le_Monde_Microbien_:_Entre_Symbioses_Vitales_et_Risques_Infectieux.html",
  "/svt/Mission_Génétique_&_Évolution.html",
  "/techno/Technologie_&_Systèmes_:_Du_Cahier_des_Charges_à_l'Algorithme.html",
];
// END_ASSETS

const CACHE_NAME = "questionnaire-cache-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((url) =>
          fetch(url, { cache: "reload" })
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch((err) => console.warn(`Échec du cache pour ${url}:`, err)),
        ),
      );
    }),
  );
});

// Activation : Nettoyage des vieux caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      ),
    ),
  );
  self.clients.claim();
});

// Stratégie de Fetch
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request) || caches.match("/index.html")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
