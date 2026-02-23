const searchInput = document.getElementById("searchInput");
const sections = document.querySelectorAll(".menu-section");
const labelButtons = document.querySelectorAll(".label-button");
const cachingIndicator = document.getElementById("caching-indicator");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

function isRunningAsPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  );
}

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
    let hasVisibleContent = false;
    const isTargetedSection = (filterTarget === "all" || section.id === filterTarget);

    const links = section.querySelectorAll(".bouton-lien");
    links.forEach((link) => {
      const text = link.textContent.toLowerCase();
      const matchesSearch = (currentSearchTerm === "" || text.includes(currentSearchTerm));
      
      // Gestion du conteneur (wrapper ou lien direct)
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

    // Masque la section si elle est vide ou non ciblée
    section.style.display = (isTargetedSection && hasVisibleContent) ? "block" : "none";
  });
}

function initInterface() {
  const isPWA = isRunningAsPWA();

  // Création des boutons de téléchargement hors PWA
  if (!isPWA) {
    document.querySelectorAll(".bouton-lien").forEach((link) => {
      if (link.parentElement.classList.contains("quiz-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "quiz-wrapper";
      const dlBtn = document.createElement("a");
      dlBtn.href = link.href;
      dlBtn.download = "";
      dlBtn.className = "btn-dl";
      dlBtn.innerHTML = "📥";
      link.parentNode.insertBefore(wrapper, link);
      wrapper.appendChild(link);
      wrapper.appendChild(dlBtn);
    });
  }
  
  // Correction : Appel initial pour afficher les éléments au chargement
  filterElements("", "all");
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((err) => console.error("❌ Erreur SW:", err));
  });

  navigator.serviceWorker.addEventListener("message", (event) => {
    if (!cachingIndicator) return;
    if (event.data.type === "caching-start") {
      cachingIndicator.style.display = "block";
    } else if (event.data.type === "caching-complete") {
      setTimeout(() => { cachingIndicator.style.display = "none"; }, 2000);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInterface);
} else {
  initInterface();
}
