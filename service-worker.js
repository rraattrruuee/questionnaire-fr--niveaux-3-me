// BEGIN_ASSETS
const STATIC_ASSETS = [
  "./angalais/Maître_de_l'Anglais_-_Verbes_Irréguliers.html",
  "./angalais/Revision_HarrietTubman_CivilWar_Grammaire_Connecteurs.html",
  "./angalais/Vocabulary_Quiz_–_Unit_16:_The_World_of_Work_&_Teen Jobs.html",
  "./brevet/Amérique du Nord/FRANCAIS-Grammaire-et-competences-linguistiques.html",
  "./brevet/Amérique du Nord/francais-redaction.html",
  "./brevet/Amérique du Nord/json/FRANCAIS-Grammaire-et-competences-linguistiques.json",
  "./brevet/Amérique du Nord/json/francais-redaction.json",
  "./brevet/Amérique du Nord/svg/FRANCAIS-Grammaire-et-competences-linguistiques.svg",
  "./brevet/code/brevet.css",
  "./brevet/code/brevet.html",
  "./brevet/code/brevet.js",
  "./brevet/exemple.html",
  "./capture/1.png",
  "./capture/2.png",
  "./capture/3.png",
  "./capture/4.png",
  "./capture/AppImages/android/android-launchericon-144-144.png",
  "./capture/AppImages/android/android-launchericon-192-192.png",
  "./capture/AppImages/android/android-launchericon-48-48.png",
  "./capture/AppImages/android/android-launchericon-512-512.png",
  "./capture/AppImages/android/android-launchericon-72-72.png",
  "./capture/AppImages/android/android-launchericon-96-96.png",
  "./capture/AppImages/ios/100.png",
  "./capture/AppImages/ios/1024.png",
  "./capture/AppImages/ios/114.png",
  "./capture/AppImages/ios/120.png",
  "./capture/AppImages/ios/128.png",
  "./capture/AppImages/ios/144.png",
  "./capture/AppImages/ios/152.png",
  "./capture/AppImages/ios/167.png",
  "./capture/AppImages/ios/16.png",
  "./capture/AppImages/ios/180.png",
  "./capture/AppImages/ios/192.png",
  "./capture/AppImages/ios/20.png",
  "./capture/AppImages/ios/256.png",
  "./capture/AppImages/ios/29.png",
  "./capture/AppImages/ios/32.png",
  "./capture/AppImages/ios/40.png",
  "./capture/AppImages/ios/50.png",
  "./capture/AppImages/ios/512.png",
  "./capture/AppImages/ios/57.png",
  "./capture/AppImages/ios/58.png",
  "./capture/AppImages/ios/60.png",
  "./capture/AppImages/ios/64.png",
  "./capture/AppImages/ios/72.png",
  "./capture/AppImages/ios/76.png",
  "./capture/AppImages/ios/80.png",
  "./capture/AppImages/ios/87.png",
  "./capture/AppImages/windows11/LargeTile.scale-100.png",
  "./capture/AppImages/windows11/LargeTile.scale-125.png",
  "./capture/AppImages/windows11/LargeTile.scale-150.png",
  "./capture/AppImages/windows11/LargeTile.scale-200.png",
  "./capture/AppImages/windows11/LargeTile.scale-400.png",
  "./capture/AppImages/windows11/SmallTile.scale-100.png",
  "./capture/AppImages/windows11/SmallTile.scale-125.png",
  "./capture/AppImages/windows11/SmallTile.scale-150.png",
  "./capture/AppImages/windows11/SmallTile.scale-200.png",
  "./capture/AppImages/windows11/SmallTile.scale-400.png",
  "./capture/AppImages/windows11/SplashScreen.scale-100.png",
  "./capture/AppImages/windows11/SplashScreen.scale-125.png",
  "./capture/AppImages/windows11/SplashScreen.scale-150.png",
  "./capture/AppImages/windows11/SplashScreen.scale-200.png",
  "./capture/AppImages/windows11/SplashScreen.scale-400.png",
  "./capture/AppImages/windows11/Square150x150Logo.scale-100.png",
  "./capture/AppImages/windows11/Square150x150Logo.scale-125.png",
  "./capture/AppImages/windows11/Square150x150Logo.scale-150.png",
  "./capture/AppImages/windows11/Square150x150Logo.scale-200.png",
  "./capture/AppImages/windows11/Square150x150Logo.scale-400.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
  "./capture/AppImages/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
  "./capture/AppImages/windows11/Square44x44Logo.scale-100.png",
  "./capture/AppImages/windows11/Square44x44Logo.scale-125.png",
  "./capture/AppImages/windows11/Square44x44Logo.scale-150.png",
  "./capture/AppImages/windows11/Square44x44Logo.scale-200.png",
  "./capture/AppImages/windows11/Square44x44Logo.scale-400.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-16.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-20.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-24.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-256.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-30.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-32.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-36.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-40.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-44.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-48.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-60.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-64.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-72.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-80.png",
  "./capture/AppImages/windows11/Square44x44Logo.targetsize-96.png",
  "./capture/AppImages/windows11/StoreLogo.scale-100.png",
  "./capture/AppImages/windows11/StoreLogo.scale-125.png",
  "./capture/AppImages/windows11/StoreLogo.scale-150.png",
  "./capture/AppImages/windows11/StoreLogo.scale-200.png",
  "./capture/AppImages/windows11/StoreLogo.scale-400.png",
  "./capture/AppImages/windows11/Wide310x150Logo.scale-100.png",
  "./capture/AppImages/windows11/Wide310x150Logo.scale-125.png",
  "./capture/AppImages/windows11/Wide310x150Logo.scale-150.png",
  "./capture/AppImages/windows11/Wide310x150Logo.scale-200.png",
  "./capture/AppImages/windows11/Wide310x150Logo.scale-400.png",
  "./fix-back-btn.js",
  "./français/Syllabus_:_Le_Maître_des_Subordonnées.html",
  "./histoire-geo/Décolonisation, Guerre froide et construction de nouveaux États (1945-1991).html",
  "./histoire-geo/Histoire (Guerres mondiales, Guerre froide), Géographie (Espaces productifs, Faibles densités, Aménagement) et EMC (Laïcité, Valeurs).html",
  "./histoire-geo/La_Seconde_Guerre_mondiale,_une_guerre _d_anéantissement_(1939-1945).html",
  "./histoire-geo/Le monde depuis 1945 - La Guerre froide (1947-1991).html",
  "./histoire-geo/Les_espaces_productifs_français_et_leurs_évolutions.html",
  "./histoire-geo/Les Territoires Ultramarins Français – Enjeux, Atouts et Aménagements.html",
  "./index.html",
  "./inject-back-btn.js",
  "./italien/Grammaire_(L'adjectif 'Bello')_et _ompréhension_de_Texte.html",
  "./italien/les verbes réguliers au futur en Italien.html",
  "./italien/Quiz sur les Maîtres de la Haute Couture Italienne : Ferré, Armani, Cucinelli, Prada et Valentino.html",
  "./latin/Maître_du_Latin_-_Les_verbes.html",
  "./manifest.json",
  "./math/Mathématiques : fonctions affines et linéaires.html",
  "./math/Mathématiques_:_Probabilités_–_Vocabulaire_et_Calculs.html",
  "./math/Quiz-Mathématique-calcul-littéral-en-3ème.html",
  "./math/quiz-pythagore-thales-calcul.html",
  "./math/Révisions Mathématiques 3ème : Calculs, Algèbre et Géométrie.html",
  "./offline.html",
  "./Physique/maîtrise_de_la_Tension_Electrique.html",
  "./Physique/quiz-physique-enérgie.html",
  "./questionaire-d-anglais-Vocabulaire-lié-a-l-esclavage-et-la-traite-transatlantique.html",
  "./questionaire-de-latin-Jules-César-et-l-apogée-de-la-République-Romaine.html",
  "./questionaire-d-emc.html",
  "./questionaire-de-PHYSIQUE.html",
  "./questionaire-de-svt.html",
  "./questionaire-d-italien-Le-vocabulaire-et-habitudes-alimentaires.html",
  "./quiz_icon.png",
  "./quiz_icon.svg",
  "./QuizMaster_Dynamique_:_Générateur_&_Importateur_de_Questionnaires.html",
  "./science/Sciences 3ème : Génétique, Évolution, Microbiote et Systèmes Automatisés.html",
  "./script.js",
  "./service-worker.js",
  "./style.css",
  "./svt/Le_Monde_Microbien_:_Entre_Symbioses_Vitales_et_Risques_Infectieux.html",
  "./svt/Mission_Génétique_&_Évolution.html",
  "./techno/Technologie_&_Systèmes_:_Du_Cahier_des_Charges_à_l'Algorithme.html",
];
// END_ASSETS

const CACHE_NAME = "quiz-cache-5487ab8"; // version automatique

// helper shared by install and message handler
function cacheAllAssets() {
  return caches.open(CACHE_NAME).then((cache) => {
    const total = STATIC_ASSETS.length;
    let completed = 0;

    // notify start
    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
      clients.forEach((c) => c.postMessage({ type: "caching-start", total }));
    });

    // fetch each asset and report progress
    return Promise.all(
      STATIC_ASSETS.map((url) =>
        fetch(url, { cache: "no-cache" })
          .then((res) => {
            if (res.ok) return cache.put(url, res);
          })
          .catch(() => {})
          .finally(() => {
            completed++;
            self.clients
              .matchAll({ includeUncontrolled: true })
              .then((clients) => {
                clients.forEach((c) =>
                  c.postMessage({
                    type: "caching-progress",
                    completed,
                    total,
                  }),
                );
              });
          }),
      ),
    ).then(() => {
      self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        clients.forEach((c) => c.postMessage({ type: "caching-complete" }));
      });
    });
  });
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(cacheAllAssets());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// respond to messages from clients (e.g. page asking to recache assets)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "cache-assets") {
    cacheAllAssets();
  }
});

self.addEventListener("fetch", (event) => {
  // Navigation requests: try network first, then cache fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            caches.match("./index.html") ||
            caches.match("./offline.html")
          );
        });
      }),
    );
    return;
  }

  // Other requests: serve from cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
