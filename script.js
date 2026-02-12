const searchInput = document.getElementById("searchInput");
const sections = document.querySelectorAll(".menu-section");
const labelButtons = document.querySelectorAll(".label-button");
const cachingIndicator = document.getElementById("caching-indicator");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Détection du mode PWA
function isRunningAsPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  );
}

// Mise à jour de l'URL pour les filtres
function updateURLParameter(key, value) {
  const url = new URL(window.location);
  if (value === "all") {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.pushState({ path: url.href }, "", url.href);
}

// FILTRAGE : Gère l'affichage sans laisser de "vides"
function filterElements(searchTerm = "", filterTarget = "all") {
  const currentSearchTerm = searchTerm.toLowerCase().trim();

  sections.forEach((section) => {
    let hasVisibleContent = false;
    const isTargetedSection =
      filterTarget === "all" || section.id === filterTarget;

    section.querySelectorAll(".bouton-lien").forEach((link) => {
      const text = link.textContent.toLowerCase();
      const matchesSearch =
        currentSearchTerm === "" || text.includes(currentSearchTerm);

      // On cible le wrapper (bouton DL + lien) s'il existe
      const container = link.closest(".quiz-wrapper") || link;

      if (isTargetedSection && matchesSearch) {
        container.style.display = "flex";
        container.classList.remove("hidden");
        hasVisibleContent = true;
      } else {
        container.style.display = "none";
        container.classList.add("hidden");
      }
    });

    section.style.display = hasVisibleContent ? "block" : "none";
  });
}

// INITIALISATION : Interface & Boutons
function initInterface() {
  const isPWA = isRunningAsPWA();

  // Bouton Retour en Haut
  if (scrollToTopBtn) {
    if (isPWA) {
      scrollToTopBtn.remove();
    } else {
      window.addEventListener("scroll", () => {
        scrollToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
      });
      scrollToTopBtn.onclick = () =>
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Création des boutons de téléchargement (Navigateur uniquement)
  if (!isPWA) {
    document.querySelectorAll(".bouton-lien").forEach((link) => {
      if (link.closest(".quiz-wrapper")) return;
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

  // Restaurer le filtre depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialFilter = urlParams.get("filtre") || "all";
  const initialButton = document.querySelector(
    `.label-button[data-target="${initialFilter}"]`,
  );
  if (initialButton) initialButton.click();
}

// EVENT LISTENERS
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

// SERVICE WORKER : UN SEUL ENREGISTREMENT
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js") // Chemin relatif crucial
      .then((reg) => {
        console.log("✅ SW enregistré ! Scope:", reg.scope);
      })
      .catch((err) => console.error("❌ Erreur SW:", err));
  });

  // Indicateur de téléchargement (PWA)
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (!cachingIndicator) return;
    if (event.data.type === "caching-start") {
      cachingIndicator.style.display = "block";
    } else if (event.data.type === "caching-complete") {
      setTimeout(() => {
        cachingIndicator.style.display = "none";
      }, 2000);
    }
  });
}

// Lancement au chargement
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInterface);
} else {
  initInterface();
}
