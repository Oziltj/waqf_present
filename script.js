const observedSections = document.querySelectorAll(".section-observe");
const header = document.querySelector(".site-header");
const root = document.documentElement;

const updateScrollState = () => {
  const scrollable = root.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

  root.style.setProperty("--scroll-progress", Math.min(Math.max(progress, 0), 1).toString());
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  observedSections.forEach((section) => observer.observe(section));
} else {
  observedSections.forEach((section) => section.classList.add("is-visible"));
}

const lightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxOriginal = document.querySelector("#lightboxOpenOriginal");
let activeLightboxTrigger = null;

const closeLightbox = () => {
  if (!lightbox) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.setAttribute("src", "");

  if (activeLightboxTrigger) {
    activeLightboxTrigger.focus();
    activeLightboxTrigger = null;
  }
};

document.querySelectorAll("[data-full]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const fullImage = trigger.dataset.full;
    const title = trigger.dataset.title || "Тасвир";

    activeLightboxTrigger = trigger;
    lightboxImage.setAttribute("src", fullImage);
    lightboxImage.setAttribute("alt", title);
    lightboxTitle.textContent = title;
    lightboxOriginal.setAttribute("href", fullImage);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightbox.querySelector("[data-close-lightbox]").focus();
  });
});

document.querySelectorAll("[data-close-lightbox]").forEach((control) => {
  control.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});
