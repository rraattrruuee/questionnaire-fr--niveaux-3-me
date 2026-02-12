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
    const sectionId = section.id;
    let sectionHasVisibleLink = false;

    section.classList.remove("is-animated");

    const isSectionTargetedByLabel =
      filterTarget === "all" || sectionId === filterTarget;

    section.querySelectorAll(".bouton-lien").forEach((link) => {
      const linkText = link.textContent.toLowerCase();

      const matchesSearch =
        currentSearchTerm === "" || linkText.includes(currentSearchTerm);

      if (isSectionTargetedByLabel && matchesSearch) {
        // Si on a un wrapper, on cache le wrapper entier, sinon juste le lien
        const elementToHide = link.parentElement.classList.contains(
          "quiz-wrapper",
        )
          ? link.parentElement
          : link;
        elementToHide.classList.remove("hidden");
        sectionHasVisibleLink = true;
      } else {
        const elementToHide = link.parentElement.classList.contains(
          "quiz-wrapper",
        )
          ? link.parentElement
          : link;
        elementToHide.classList.add("hidden");
      }
    });

    if (!isSectionTargetedByLabel || !sectionHasVisibleLink) {
      section.classList.add("hidden");
    } else {
      section.classList.remove("hidden");

      setTimeout(() => {
        section.classList.add("is-animated");
      }, 0);
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
  // On vérifie si on est en mode PWA
  if (isRunningAsPWA()) {
    console.log(
      "📱 Mode PWA détecté : masquage des boutons de téléchargement.",
    );
    // Si on est en PWA, on ne fait rien (on sort de la fonction)
    return;
  }

  // Si on n'est PAS en PWA (navigateur classique), on crée les boutons
  document.querySelectorAll(".bouton-lien").forEach((link) => {
    // Sécurité : éviter de créer le wrapper plusieurs fois si la fonction est rappelée
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
