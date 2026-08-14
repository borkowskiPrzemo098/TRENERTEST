// ŻELAZO — template interactions: mobile nav, reveal-on-scroll, demo contact form.
(function () {
  "use strict";

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

  // Reveal-on-scroll: tag section children as reveal targets, stagger by index
  var revealTargets = document.querySelectorAll(
    ".about-inner > *, .offer-plate, .transform-card, .testi-card, .price-row, .section-head"
  );
  revealTargets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
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
})();
