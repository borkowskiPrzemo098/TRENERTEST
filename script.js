// ŻELAZO — template interactions: mobile nav, Motion-powered scroll reveals,
// demo contact form. Uses Motion (the vanilla-JS spinoff of Framer Motion,
// https://motion.dev) loaded from a CDN — no build step, no React required.
//
// Safety rule: nothing on this page may become permanently invisible if the
// CDN is slow/blocked or Motion throws. Every element starts at its normal,
// visible CSS state; Motion only enhances with a "from" keyframe right
// before it animates, and every call is wrapped so one failure can't cascade.

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

// ---- Motion enhancements (optional, never load-bearing) ----
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  import("https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm")
    .then(function (motion) {
      var animate = motion.animate;
      var inView = motion.inView;
      var stagger = motion.stagger;

      function safe(fn) {
        try { fn(); } catch (err) { /* animation is decorative only — never block content */ }
      }

      // Hero: one authored entrance, staggered
      safe(function () {
        var heroItems = document.querySelectorAll("#hero [data-reveal]");
        if (heroItems.length) {
          animate(
            heroItems,
            { opacity: [0, 1], y: [16, 0] },
            { duration: 0.6, delay: stagger(0.08), easing: [0.16, 0.8, 0.24, 1] }
          );
        }
      });

      // Hero photo: slow Ken Burns drift
      safe(function () {
        var heroPhoto = document.getElementById("heroPhoto");
        if (heroPhoto) {
          animate(
            heroPhoto,
            { transform: ["scale(1.06) translateX(0px)", "scale(1.12) translateX(-14px)"] },
            { duration: 16, easing: "ease-in-out", direction: "alternate", repeat: Infinity }
          );
        }
      });

      // Scroll reveals: sections/cards fade+lift in as they enter view
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
        safe(function () {
          var els = document.querySelectorAll(selector);
          if (!els.length) return;
          inView(
            selector,
            function (info) {
              safe(function () {
                var siblings = Array.from(info.target.parentElement.children).filter(function (c) {
                  return c.matches(selector);
                });
                var index = siblings.indexOf(info.target);
                animate(
                  info.target,
                  { opacity: [0, 1], y: [22, 0] },
                  { duration: 0.55, delay: Math.min(Math.max(index, 0), 6) * 0.06, easing: [0.16, 0.8, 0.24, 1] }
                );
              });
            },
            { margin: "0px 0px -10% 0px", amount: 0.2 }
          );
        });
      });

      // Micro-interaction: primary buttons get a soft hover lift
      safe(function () {
        document.querySelectorAll(".btn-primary, .nav-cta").forEach(function (btn) {
          btn.addEventListener("mouseenter", function () {
            safe(function () { animate(btn, { y: -2 }, { duration: 0.18, easing: "ease-out" }); });
          });
          btn.addEventListener("mouseleave", function () {
            safe(function () { animate(btn, { y: 0 }, { duration: 0.18, easing: "ease-out" }); });
          });
        });
      });
    })
    .catch(function () {
      // Motion failed to load (offline, blocked CDN, etc.) — the page already
      // renders fully without it, so there is nothing to recover here.
    });
}
