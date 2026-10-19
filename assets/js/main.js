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


  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("header");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    // Solidify the header as soon as the user starts scrolling, so the nav
    // never overlaps the hero text without a background behind it.
    if (header) header.classList.toggle("scrolled", y > 24);
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

  /* ---------- Method rail scroll progress ---------- */
  (function () {
    var flow = document.querySelector(".method-flow");
    var fill = document.getElementById("railFill");
    if (!flow || !fill) return;
    var nodes = flow.querySelectorAll(".rail-node");
    function update() {
      var r = flow.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var p = (vh * 0.5 - r.top) / r.height;
      if (p < 0) p = 0; else if (p > 1) p = 1;
      fill.style.height = (p * 100) + "%";
      nodes.forEach(function (n, i) {
        var threshold = nodes.length > 1 ? i / (nodes.length - 1) : 0;
        n.classList.toggle("active", p >= threshold - 0.08);
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

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
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
      window.scrollTo({ top: top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });
  /* ---------- Beispielseiten: sticky stacking cards ---------- */
  (function () {
    var wrap = document.querySelector("[data-ref-stack]");
    if (!wrap) return;
    var cards = [].slice.call(wrap.querySelectorAll(".ref-card"));
    var jumps = [].slice.call(wrap.querySelectorAll(".ref-jump"));
    var cur = wrap.querySelector("[data-ref-cur]");
    var bar = wrap.querySelector("[data-ref-bar]");
    var nav = wrap.querySelector(".ref-nav");
    var active = -1, ticking = false;
    var desk = function () { return window.innerWidth > 1024; };

    function fit() {
      cards.forEach(function (c, i) {
        c.style.setProperty("--i", i);
        if (!desk()) { c.style.top = ""; return; }
        var base = 150 + i * 22;
        c.style.top = Math.max(84, Math.min(base, window.innerHeight - c.offsetHeight - 20)) + "px";
      });
    }

    function update() {
      ticking = false;
      var mid = window.innerHeight * 0.5, idx = 0;
      cards.forEach(function (c, i) { if (c.getBoundingClientRect().top <= mid) idx = i; });
      if (idx !== active) {
        active = idx;
        if (cur) cur.textContent = ("0" + (idx + 1)).slice(-2);
        if (bar) bar.parentNode.style.setProperty("--p", (idx + 1) / cards.length);
        if (bar) bar.style.width = ((idx + 1) / cards.length * 100) + "%";
        jumps.forEach(function (j, i) { j.classList.toggle("is-on", i === idx); });
      }
      // gently scale down the card that is being covered
      if (desk() && !prefersReduced) {
        cards.forEach(function (c, i) {
          var next = cards[i + 1];
          if (!next) { c.style.transform = ""; return; }
          var gap = next.getBoundingClientRect().top - c.getBoundingClientRect().top;
          var p = Math.max(0, Math.min(1, 1 - gap / c.offsetHeight));
          c.style.transform = p > 0 ? "scale(" + (1 - p * 0.05).toFixed(4) + ")" : "";
          c.style.filter = p > 0 ? "brightness(" + (1 - p * 0.06).toFixed(3) + ")" : "";
        });
      } else {
        cards.forEach(function (c) { c.style.transform = ""; c.style.filter = ""; });
      }
    }

    jumps.forEach(function (j, i) {
      j.addEventListener("click", function (e) {
        var t = cards[i];
        if (!t) return;
        e.preventDefault();
        var stack = wrap.querySelector(".ref-stack");
        var gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
        var y = stack.getBoundingClientRect().top + window.pageYOffset;
        for (var k = 0; k < i; k++) y += cards[k].offsetHeight + gap;
        y -= desk() ? (parseFloat(t.style.top) || 150) : 90;
        window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
      });
    });

    fit();
    window.addEventListener("resize", function () { fit(); update(); });
    window.addEventListener("load", function () { fit(); update(); });
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

})();
