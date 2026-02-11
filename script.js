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
        link.classList.remove("hidden");
        sectionHasVisibleLink = true;
      } else {
        link.classList.add("hidden");
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
document.querySelectorAll(".bouton-lien").forEach((link) => {
  // 1. Créer le conteneur (wrapper)
  const wrapper = document.createElement("div");
  wrapper.className = "quiz-wrapper";
  // 2. Créer le bouton de téléchargement
  const dlBtn = document.createElement("a");
  dlBtn.href = link.href;
  dlBtn.download = ""; // Force le téléchargement
  dlBtn.className = "btn-dl";
  dlBtn.innerHTML = "📥";
  dlBtn.title = "Télécharger le fichier";
  // 3. Placer le wrapper là où était le lien
  link.parentNode.insertBefore(wrapper, link);

  // 4. Mettre le lien et le bouton de téléchargement dans le wrapper
  wrapper.appendChild(link);
  wrapper.appendChild(dlBtn);
});

// Enregistrement du Service Worker pour activer la PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker enregistré:", reg.scope))
      .catch((err) =>
        console.warn("Erreur d'enregistrement du Service Worker:", err),
      );
  });
}

// --- Masquer les boutons de téléchargement en mode PWA ---
function isRunningAsPWA() {
  return (
    (window.matchMedia &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches)) ||
    // iOS
    window.navigator.standalone === true ||
    // Android webapp referrer
    (document.referrer && document.referrer.startsWith("android-app://"))
  );
}

function updateDownloadButtonsVisibility() {
  const hide = isRunningAsPWA();
  document.querySelectorAll(".btn-dl").forEach((btn) => {
    if (hide) btn.classList.add("hidden");
    else btn.classList.remove("hidden");
  });
}

// Appel initial
updateDownloadButtonsVisibility();

// Sur certaines plateformes, l'état peut changer; on écoute les événements pertinents
try {
  [
    "(display-mode: standalone)",
    "(display-mode: fullscreen)",
    "(display-mode: minimal-ui)",
  ].forEach((q) => {
    const mql = window.matchMedia(q);
    if (mql && typeof mql.addEventListener === "function")
      mql.addEventListener("change", updateDownloadButtonsVisibility);
    else if (mql && typeof mql.addListener === "function")
      mql.addListener(updateDownloadButtonsVisibility);
  });
} catch (e) {
  // silence
}

window.addEventListener("appinstalled", updateDownloadButtonsVisibility);
window.addEventListener("visibilitychange", updateDownloadButtonsVisibility);
