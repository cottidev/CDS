/* ─── CUSTOM CURSOR ────────────────────────────────────── */
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

let mouseX = -100,
  mouseY = -100;
let ringX = -100,
  ringY = -100;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + "px";
  cursorDot.style.top = mouseY + "px";
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

document
  .querySelectorAll("a, button, .pole-card, .member-card, .join-btn")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave", () =>
      cursorRing.classList.remove("hover"), 
    );
  });

document.addEventListener("mousedown", () => cursorRing.classList.add("click"));
document.addEventListener("mouseup", () =>
  cursorRing.classList.remove("click"),
);

/* ─── NAVBAR ───────────────────────────────────────────── */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("active");
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("active");
  if (isOpen) {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  } else {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  }
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  });
});

/* ─── PARTICLE CANVAS ──────────────────────────────────── */
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animFrameId;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.fadeSpeed = Math.random() * 0.003 + 0.001;
    this.growing = true;
    this.color =
      Math.random() > 0.6
        ? "#1aff7a"
        : Math.random() > 0.5
          ? "#3b6bff"
          : "#00d4aa";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.growing) {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= 0.6) this.growing = false;
    } else {
      this.opacity -= this.fadeSpeed;
    }
    if (
      this.opacity <= 0 ||
      this.y < -10 ||
      this.x < -10 ||
      this.x > canvas.width + 10
    ) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(
    120,
    Math.floor((canvas.width * canvas.height) / 8000),
  );
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // scatter vertically on init
    particles.push(p);
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.12;
        ctx.strokeStyle = "#1aff7a";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  animFrameId = requestAnimationFrame(animateParticles);
}
animateParticles();

// Pause particles when hero is out of view
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!animFrameId) animateParticles();
      } else {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    });
  },
  { threshold: 0 },
);
heroObserver.observe(document.getElementById("hero"));

/* ─── SCROLL REVEAL ────────────────────────────────────── */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger child cards
        const cards = entry.target.querySelectorAll(
          ".pole-card, .member-card, .join-btn",
        );
        cards.forEach((card, idx) => {
          card.style.transitionDelay = `${idx * 0.08}s`;
        });
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

document
  .querySelectorAll(".reveal-section")
  .forEach((el) => revealObs.observe(el));

/* ─── COUNTER ANIMATION ────────────────────────────────── */
function animateCount(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".counter-num[data-count]").forEach((el) => {
          const target = parseInt(el.dataset.count);
          animateCount(el, target, target > 100 ? 2000 : 1200);
        });
        counterObs.disconnect();
      }
    });
  },
  { threshold: 0.5 },
);

const heroCounter = document.querySelector(".hero-counter");
if (heroCounter) counterObs.observe(heroCounter);

/* ─── TILT EFFECT ON POLE CARDS ────────────────────────── */
document.querySelectorAll(".pole-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
    setTimeout(() => (card.style.transition = ""), 500);
  });
});

/* ─── ACTIVE NAV LINK ──────────────────────────────────── */
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".nav-link");

const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = "";
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.style.color = "white";
          }
        });
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((s) => navObs.observe(s));

/* ─── SMOOTH ANCHOR SCROLL ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ─── PAGE LOAD TRANSITION ─────────────────────────────── */
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
});
