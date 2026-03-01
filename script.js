// Animation au défilement (Intersection Observer)
const observerOptions = {
  threshold: 0.2,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("appear");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Effet de transparence au scroll sur la barre de navigation
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.style.padding = "10px 10%";
    nav.style.background = "rgba(255, 255, 255, 0.98)";
    nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  } else {
    nav.style.padding = "20px 10%";
    nav.style.background = "rgba(255, 255, 255, 0.95)";
    nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
  }
});
