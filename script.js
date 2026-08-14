// ŻELAZO — template interactions: mobile nav, Motion-powered scroll reveals,
// demo contact form. Uses Motion (the vanilla-JS spinoff of Framer Motion,
// https://motion.dev) loaded from a CDN — no build step, no React required.
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";

document.documentElement.classList.add("js");

// Footer year
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
var header = document.querySelector(".site-header");
var toggle = document.getElementById("navToggle");
if (toggle && header) {
  toggle.addEventListener("click", function () {
    var open = header.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll(".mobile-nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      header.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Hero background: slow drift on the plate mark, keeps the dark
// field alive without competing with the headline ----
var heroPlate = document.querySelector(".hero-bar");
if (heroPlate && !reduceMotion) {
  animate(
    heroPlate,
    { transform: ["translateX(0px) rotate(0deg)", "translateX(-18px) rotate(-1.2deg)", "translateX(0px) rotate(0deg)"] },
    { duration: 14, easing: "ease-in-out", repeat: Infinity }
  );
}
var heroGlowPlate = document.querySelector(".hero-plate-hot");
if (heroGlowPlate && !reduceMotion) {
  animate(
    heroGlowPlate,
    { opacity: [0.35, 0.7, 0.35] },
    { duration: 5, easing: "ease-in-out", repeat: Infinity }
  );
}

// ---- Hero: one authored entrance, staggered ----
var heroItems = document.querySelectorAll("#hero [data-reveal]");
if (heroItems.length) {
  if (reduceMotion) {
    heroItems.forEach(function (el) { el.style.opacity = 1; });
  } else {
    animate(
      heroItems,
      { opacity: [0, 1], y: [16, 0] },
      { duration: 0.6, delay: stagger(0.08), easing: [0.16, 0.8, 0.24, 1] }
    );
  }
}

// ---- Scroll reveals: sections/cards fade+lift in as they enter view ----
var revealGroups = [
  ".about-media", ".about-copy > *",
  ".offer-plate",
  ".transform-card",
  ".testi-card",
  ".price-row:not(.price-row-head)",
  ".section-head",
  ".contact-copy > *", ".contact-form",
];

revealGroups.forEach(function (selector) {
  var els = document.querySelectorAll(selector);
  if (!els.length) return;
  els.forEach(function (el) { el.classList.add("reveal-child"); });

  if (reduceMotion) {
    els.forEach(function (el) { el.style.opacity = 1; });
    return;
  }

  inView(
    selector,
    function (info) {
      var siblings = Array.from(info.target.parentElement.children).filter(function (c) {
        return c.classList.contains("reveal-child");
      });
      var index = siblings.indexOf(info.target);
      animate(
        info.target,
        { opacity: [0, 1], y: [22, 0] },
        { duration: 0.55, delay: Math.min(index, 6) * 0.06, easing: [0.16, 0.8, 0.24, 1] }
      );
    },
    { margin: "0px 0px -10% 0px", amount: 0.2 }
  );
});

// ---- Micro-interaction: nav CTA + primary buttons get a soft press/hover lift ----
if (!reduceMotion) {
  document.querySelectorAll(".btn-primary, .nav-cta").forEach(function (btn) {
    btn.addEventListener("mouseenter", function () {
      animate(btn, { y: -2 }, { duration: 0.18, easing: "ease-out" });
    });
    btn.addEventListener("mouseleave", function () {
      animate(btn, { y: 0 }, { duration: 0.18, easing: "ease-out" });
    });
  });
}

// Demo contact form: this template ships no backend. Wire this up to your
// own email/CRM endpoint before publishing.
var form = document.getElementById("contactForm");
var status = document.getElementById("formStatus");
if (form && status) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    if (!name) {
      status.textContent = "Podaj imię i nazwisko, żeby wysłać zgłoszenie.";
      return;
    }
    status.textContent =
      "Formularz demonstracyjny — podłącz wysyłkę (e-mail/CRM) w script.js, aby zgłoszenia trafiały do trenera.";
    form.reset();
  });
}
