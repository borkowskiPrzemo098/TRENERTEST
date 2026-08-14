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

// ---- Scroll-to-top button ----
var scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  var toggleScrollTop = function () {
    scrollTopBtn.classList.toggle("visible", window.scrollY > 560);
  };
  toggleScrollTop();
  window.addEventListener("scroll", toggleScrollTop, { passive: true });
}

// ---- Bottom nav: highlight the section currently in view ----
var bottomNavLinks = document.querySelectorAll(".bottom-nav a[data-section]");
if (bottomNavLinks.length && "IntersectionObserver" in window) {
  var sectionEls = Array.from(bottomNavLinks)
    .map(function (a) { return document.getElementById(a.dataset.section); })
    .filter(Boolean);

  var setActive = function (id) {
    bottomNavLinks.forEach(function (a) {
      a.classList.toggle("active", a.dataset.section === id);
    });
  };

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  sectionEls.forEach(function (el) { sectionObserver.observe(el); });
}

// ---- Motion enhancements (optional, never load-bearing) ----
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  import("https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm")
    .then(function (motion) {
      var animate = motion.animate;
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

      // Scroll reveals: sections/cards fade+lift in as they enter view —
      // ONCE each. Using a plain IntersectionObserver (instead of Motion's
      // inView, which keeps re-firing every time an element re-enters the
      // viewport) so every element unobserves itself right after its first
      // reveal. Without this, scrolling up and down made sections flicker
      // as they replayed their entrance animation on every pass.
      var revealGroups = [
        ".about-media", ".about-copy > *",
        ".offer-plate",
        ".transform-card",
        ".testi-card",
        ".price-row:not(.price-row-head)",
        ".section-head",
        ".contact-copy > *", ".contact-form",
      ];

      if ("IntersectionObserver" in window) {
        var revealed = new WeakSet();
        var revealObserver = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting || revealed.has(entry.target)) return;
              revealed.add(entry.target);
              obs.unobserve(entry.target);
              safe(function () {
                var siblings = Array.from(entry.target.parentElement.children).filter(function (c) {
                  return revealGroups.some(function (sel) { return c.matches(sel); });
                });
                var index = siblings.indexOf(entry.target);
                animate(
                  entry.target,
                  { opacity: [0, 1], y: [22, 0] },
                  { duration: 0.55, delay: Math.min(Math.max(index, 0), 6) * 0.06, easing: [0.16, 0.8, 0.24, 1] }
                );
              });
            });
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
        );

        revealGroups.forEach(function (selector) {
          safe(function () {
            document.querySelectorAll(selector).forEach(function (el) {
              revealObserver.observe(el);
            });
          });
        });
      }

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
