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

  // Its target (#top) is a position:sticky header, and letting the browser
  // handle the native href="#top" jump to a sticky element is unreliable —
  // confirmed in testing: the URL updates to #top but the page never
  // actually scrolls. Scroll explicitly instead.
  scrollTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
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

// ---- Scroll reveal: sections/cards fade + lift in, once each, as they
// enter view. Plain CSS transition driven by IntersectionObserver — no
// animation library involved, so this can't stall or fight with anything
// Motion does. Elements only ever get the "reveal" (hidden) class here,
// right before being observed, so if JS never runs at all nothing is
// ever hidden in the first place. ----
if ("IntersectionObserver" in window) {
  var revealSelectors = [
    ".about-media", ".about-copy > *",
    ".offer-plate",
    ".transform-card",
    ".testi-card",
    ".price-row:not(.price-row-head)",
    ".section-head",
    ".contact-copy > *", ".contact-form",
  ];

  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
  );

  revealSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + "ms";
      revealObserver.observe(el);
    });
  });

  // Hero: same fade+lift, but it's above the fold on load, so it plays
  // immediately instead of waiting on the scroll observer.
  var heroItems = document.querySelectorAll("#hero [data-reveal]");
  heroItems.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = i * 90 + "ms";
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroItems.forEach(function (el) { el.classList.add("in"); });
    });
  });
}

// ---- Motion enhancements (optional, never load-bearing) ----
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  import("https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm")
    .then(function (motion) {
      var animate = motion.animate;

      function safe(fn) {
        try { fn(); } catch (err) { /* animation is decorative only — never block content */ }
      }

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

      // NOTE: an earlier version animated sections/cards in as they scrolled
      // into view (fade + lift, once each via IntersectionObserver). It was
      // removed: on some phones and even on desktop it produced a visible
      // flicker — the opacity transition could stall mid-flight under
      // load, and with dozens of observed elements this was constant and
      // reproducible. Content simply renders normally now; only the hero's
      // one-time entrance and the button hover lift remain animated.

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
