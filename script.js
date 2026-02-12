const searchInput = document.getElementById("searchInput");
const sections = document.querySelectorAll(".menu-section");
const labelButtons = document.querySelectorAll(".label-button");

function updateURLParameter(key, value) {
  const url = new URL(window.location);

  if (value === "all") {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }

  window.history.pushState({ path: url.href }, "", url.href);
}

function filterElements(searchTerm = "", filterTarget = "all") {
  const currentSearchTerm = searchTerm.toLowerCase().trim();

  sections.forEach((section) => {
    let sectionHasVisibleLink = false;
    section.classList.remove("is-animated");

    const isSectionTargetedByLabel =
      filterTarget === "all" || section.id === filterTarget;

    // On cherche tous les liens
    section.querySelectorAll(".bouton-lien").forEach((link) => {
      const linkText = link.textContent.toLowerCase();
      const matchesSearch =
        currentSearchTerm === "" || linkText.includes(currentSearchTerm);

      // TRÈS IMPORTANT : On identifie l'élément parent à cacher
      // Si le bouton 📥 existe, on cache le 'quiz-wrapper', sinon juste le 'link'
      const container = link.closest(".quiz-wrapper") || link;

      if (isSectionTargetedByLabel && matchesSearch) {
        container.style.display = "flex"; // On force l'affichage
        container.classList.remove("hidden");
        sectionHasVisibleLink = true;
      } else {
        container.style.display = "none"; // On force la disparition totale (plus de vide)
        container.classList.add("hidden");
      }
    });

    // Affichage de la section entière
    if (!sectionHasVisibleLink) {
      section.style.display = "none";
    } else {
      section.style.display = "block";
      setTimeout(() => section.classList.add("is-animated"), 10);
    }
  });
}

searchInput.addEventListener("keyup", function () {
  labelButtons.forEach((btn) => btn.classList.remove("active"));
  updateURLParameter("filtre", "all");
  filterElements(this.value, "all");
});

labelButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const target = this.getAttribute("data-target");

    labelButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    searchInput.value = "";

    updateURLParameter("filtre", target);

    filterElements("", target);
  });
});

const urlParams = new URLSearchParams(window.location.search);
const initialFilter = urlParams.get("filtre") || "all";

const initialButton = document.querySelector(
  `.label-button[data-target="${initialFilter}"]`,
);

if (initialButton) {
  initialButton.click();
} else {
  document.querySelector('.label-button[data-target="all"]').click();
}

function isRunningAsPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.navigator.standalone === true || // Spécifique iOS
    document.referrer.includes("android-app://")
  );
}

/**
 * Gère l'affichage des boutons de téléchargement
 */
function manageDownloadButtons() {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  // On vérifie si on est en mode PWA
  if (isRunningAsPWA()) {
    console.log(
      "📱 Mode PWA détecté : masquage des boutons de téléchargement et du bouton 'Retour en haut'.",
    );
    // Masquer le bouton de retour en haut aussi
    if (scrollToTopBtn) scrollToTopBtn.style.display = "none";
    return;
  }

  // Si on n'est PAS en PWA (navigateur classique), on crée les boutons de téléchargement
  document.querySelectorAll(".bouton-lien").forEach((link) => {
    if (link.parentNode.classList.contains("quiz-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "quiz-wrapper";

    const dlBtn = document.createElement("a");
    dlBtn.href = link.href;
    dlBtn.download = "";
    dlBtn.className = "btn-dl";
    dlBtn.innerHTML = "📥";
    dlBtn.title = "Télécharger pour révision hors-ligne";

    link.parentNode.insertBefore(wrapper, link);
    wrapper.appendChild(link);
    wrapper.appendChild(dlBtn);
  });

  // Afficher et gérer le bouton "Retour en haut" pour le mode navigateur
  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        // Affiche le bouton après 200px de défilement
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
    });

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Défilement doux
    });
  }
}

// Exécuter la vérification au chargement
window.addEventListener("DOMContentLoaded", manageDownloadButtons);

// --- Enregistrement du Service Worker ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker prêt :", reg.scope))
      .catch((err) => console.warn("Erreur SW :", err));
  });
}

const cachingIndicator = document.getElementById("caching-indicator");

if (cachingIndicator && "serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "caching-start") {
      cachingIndicator.style.display = "block";
    } else if (event.data && event.data.type === "caching-complete") {
      cachingIndicator.style.display = "none";
    }
  });
}
