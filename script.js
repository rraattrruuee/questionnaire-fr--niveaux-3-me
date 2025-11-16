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
