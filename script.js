const searchInput = document.getElementById("searchInput");
const sections = document.querySelectorAll(".menu-section");
const labelButtons = document.querySelectorAll(".label-button");
const cachingIndicator = document.getElementById("caching-indicator");

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

      // On cible le wrapper s'il existe, sinon le lien lui-même
      const elementToHide = link.closest(".quiz-wrapper") || link;

      if (isSectionTargetedByLabel && matchesSearch) {
        elementToHide.classList.remove("hidden");
        sectionHasVisibleLink = true;
      } else {
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

function isRunningAsPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true ||
    (document.referrer && document.referrer.startsWith("android-app://"))
  );
}

// INITIALISATION : Ajout des boutons de téléchargement SI hors PWA
if (!isRunningAsPWA()) {
  document.querySelectorAll(".bouton-lien").forEach((link) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quiz-wrapper";

    const dlBtn = document.createElement("a");
    dlBtn.href = link.href;
    dlBtn.download = "";
    dlBtn.className = "btn-dl";
    dlBtn.innerHTML = "📥";
    dlBtn.title = "Télécharger le fichier";

    link.parentNode.insertBefore(wrapper, link);
    wrapper.appendChild(link);
    wrapper.appendChild(dlBtn);
  });
}

// GESTION DES ÉVÉNEMENTS
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

// Lancement au chargement via le filtre initial
const urlParams = new URLSearchParams(window.location.search);
const initialFilter = urlParams.get("filtre") || "all";
const initialButton = document.querySelector(
  `.label-button[data-target="${initialFilter}"]`,
);

if (initialButton) {
  initialButton.click();
} else {
  const allBtn = document.querySelector('.label-button[data-target="all"]');
  if (allBtn) allBtn.click();
}

// Service Worker
if ("serviceWorker" in navigator) {
  // listen for messages sent from SW (caching start/progress/complete)
  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("SW message", event.data);
    if (!cachingIndicator) return;
    const { type, completed, total } = event.data || {};
    if (type === "caching-start") {
      cachingIndicator.style.display = "block";
      cachingIndicator.textContent = "Téléchargement... 0%";
    } else if (type === "caching-progress") {
      if (typeof completed === "number" && typeof total === "number") {
        const pct = Math.floor((completed / total) * 100);
        cachingIndicator.textContent = `Téléchargement... ${pct}%`;
      }
    } else if (type === "caching-complete") {
      cachingIndicator.textContent = "Téléchargement terminé";
      setTimeout(() => {
        cachingIndicator.style.display = "none";
      }, 2000);
    }
  });

  window.addEventListener("load", () => {
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });

    navigator.serviceWorker
      .register("service-worker.js", { scope: "./" })
      .then((reg) => {
        // Le cache est maintenant géré automatiquement (et uniquement) lors de l'installation et la mise à jour
        // du Service Worker grâce à cacheAllAssets() défini dans events "install"
      })
      .catch((err) => console.warn("Erreur SW:", err));
  });
}
