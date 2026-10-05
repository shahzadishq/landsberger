/* =====================================================================
   Landsberger Medienagentur — interactions & animations
   Vanilla JS, no dependencies.
   ===================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth inertia scrolling (Lenis) ---------- */
  var lenis = null;
  if (!prefersReduced && typeof window.Lenis === "function") {
    try {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
      var rafLoop = function (time) { lenis.raf(time); requestAnimationFrame(rafLoop); };
      requestAnimationFrame(rafLoop);
    } catch (e) { lenis = null; }
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("header");
  var toTop = document.getElementById("toTop");
  var heroEl = document.querySelector(".hero");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    // Keep the header transparent over the dark hero, solidify once past it.
    var headerH = header ? header.offsetHeight : 70;
    var solidAt = heroEl ? Math.max(60, heroEl.offsetHeight - headerH - 40) : 24;
    if (header) header.classList.toggle("scrolled", y > solidAt);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("mobile-open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close when a link is tapped
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("mobile-open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".num[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var numSpan = el.querySelector("span");
    if (!numSpan) return;
    if (prefersReduced) { numSpan.textContent = target; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      numSpan.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else numSpan.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cObs.observe(el); });
  } else {
    counters.forEach(function (el) {
      var s = el.querySelector("span");
      if (s) s.textContent = el.getAttribute("data-count");
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close others
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          var oa = other.querySelector(".faq-a");
          if (oa) oa.style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Testimonial slider ---------- */
  (function () {
    var track = document.getElementById("tsliderTrack");
    var dotsWrap = document.getElementById("tDots");
    var prev = document.getElementById("tPrev");
    var next = document.getElementById("tNext");
    if (!track) return;
    var slides = track.children.length;
    var index = 0, timer = null;

    // build dots
    for (var i = 0; i < slides; i++) {
      var d = document.createElement("button");
      d.className = "tdot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Bewertung " + (i + 1));
      (function (idx) { d.addEventListener("click", function () { go(idx); }); })(i);
      dotsWrap.appendChild(d);
    }
    var dots = dotsWrap.querySelectorAll(".tdot");

    function render() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (dot, i) { dot.classList.toggle("active", i === index); });
    }
    function go(i) { index = (i + slides) % slides; render(); restart(); }
    function restart() {
      if (prefersReduced) return;
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, 6000);
    }

    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });

    // pause on hover
    var slider = document.getElementById("tslider");
    if (slider) {
      slider.addEventListener("mouseenter", function () { clearInterval(timer); });
      slider.addEventListener("mouseleave", restart);
    }

    // basic touch swipe
    var startX = 0, dx = 0;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
    track.addEventListener("touchmove", function (e) { dx = e.touches[0].clientX - startX; }, { passive: true });
    track.addEventListener("touchend", function () {
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      else restart();
      dx = 0;
    });

    render();
    restart();
  })();

  /* ---------- Lead form (front-end validation + success state) ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#fname");
      var email = form.querySelector("#femail");
      var ok = true;
      [name, email].forEach(function (f) {
        if (!f) return;
        if (!f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))) {
          f.style.borderColor = "#e74c3c";
          ok = false;
        } else {
          f.style.borderColor = "";
        }
      });
      if (!ok) return;
      var okBox = document.getElementById("formOk");
      if (okBox) okBox.classList.add("show");
      form.querySelectorAll("input, textarea, select, button").forEach(function (el) {
        if (el.type !== "button") el.setAttribute("disabled", "disabled");
      });
      // NOTE: wire this up to a real endpoint / mail handler in production.
    });
  }

  /* ---------- Smooth-scroll offset for sticky header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id === "#top") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      if (lenis) {
        lenis.scrollTo(target, { offset: -(headerH + 12) });
      } else {
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
        window.scrollTo({ top: top, behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  });
})();
