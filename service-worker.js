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

const CACHE_NAME = "quiz-cache-v4";

// INSTALLATION : On force la mise en cache de TOUT
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Mise en cache intégrale démarrée...");
        // addAll échoue si un seul fichier manque, c'est plus sûr pour toi
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()), // Force l'activation
  );
});

// ACTIVATION : On nettoie et on prend le contrôle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// FETCH : On sert le cache en priorité (Ultra rapide et Offline)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      }),
  );
});
