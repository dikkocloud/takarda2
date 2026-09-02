/* =========================================================
   Takarda — main.js
   Small, dependency-free behaviours shared across pages.
   ========================================================= */
(function () {
  "use strict";

  /* Rotating hero word — crossfades through data-words on a loop.
     Skipped entirely for prefers-reduced-motion: the word just stays
     on whatever is already in the markup ("planted"). */
  var rotator = document.getElementById("hero-rotator");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rotator && !reduceMotion) {
    var words = (rotator.getAttribute("data-words") || "").split(",").map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length > 1) {
      var wordIndex = 0;
      setInterval(function () {
        rotator.classList.add("is-swapping");
        setTimeout(function () {
          wordIndex = (wordIndex + 1) % words.length;
          rotator.textContent = words[wordIndex];
          rotator.classList.remove("is-swapping");
        }, 350); // matches the .word-rotate CSS transition duration
      }, 2400);
    }
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Mobile nav toggle */
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var open = mobileMenu.getAttribute("data-open") === "true";
      mobileMenu.setAttribute("data-open", String(!open));
      navToggle.setAttribute("aria-expanded", String(!open));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.setAttribute("data-open", "false");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Reveal-on-scroll — one quiet entrance per element, no repeats */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Impact / horizontal scroll galleries with prev/next controls */
  document.querySelectorAll("[data-scroller]").forEach(function (wrap) {
    var track = wrap.querySelector(".impact-scroller");
    var prev = wrap.querySelector('[data-scroll="prev"]');
    var next = wrap.querySelector('[data-scroll="next"]');
    if (!track) return;
    var step = function () {
      var card = track.querySelector(".impact-card");
      return card ? card.getBoundingClientRect().width + 20 : 300;
    };
    if (prev) prev.addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    if (next) next.addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
  });

  /* Impact gallery lightbox — click any photo to view it enlarged,
     with keyboard (Esc / arrow keys) and prev/next support. Works
     with the placeholder tiles as-is; once real <img> photos replace
     the placeholders, swap the innerHTML line below for an <img src>. */
  var lightbox = document.getElementById("lightbox");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-trigger]"));
  if (lightbox && triggers.length) {
    var frame = document.getElementById("lightbox-frame");
    var frameText = document.getElementById("lightbox-frame-text");
    var captionEl = document.getElementById("lightbox-caption");
    var closeBtn = document.getElementById("lightbox-close");
    var prevBtn = document.getElementById("lightbox-prev");
    var nextBtn = document.getElementById("lightbox-next");
    var backdrop = document.getElementById("lightbox-backdrop");
    var currentIndex = 0;
    var lastFocused = null;

    var render = function (i) {
      currentIndex = (i + triggers.length) % triggers.length;
      var trigger = triggers[currentIndex];
      var caption = trigger.getAttribute("data-caption") || "";
      // If a real <img> has been dropped into a trigger, mirror it into the lightbox.
      var img = trigger.querySelector("img");
      if (img) {
        frame.innerHTML = "";
        var full = document.createElement("img");
        full.src = img.src;
        full.alt = img.alt || caption;
        full.className = "w-full h-full object-cover rounded-lg";
        frame.appendChild(full);
      } else {
        frame.innerHTML = "";
        frame.appendChild(frameText);
        frameText.textContent = caption ? caption + " — your image here" : "Your image here";
      }
      captionEl.textContent = caption;
    };

    var open = function (i) {
      lastFocused = document.activeElement;
      render(i);
      lightbox.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    var close = function () {
      lightbox.classList.add("hidden");
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };

    triggers.forEach(function (trigger, i) {
      trigger.addEventListener("click", function () { open(i); });
    });
    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { render(currentIndex - 1); closeBtn.focus(); });
    nextBtn.addEventListener("click", function () { render(currentIndex + 1); closeBtn.focus(); });

    document.addEventListener("keydown", function (e) {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") render(currentIndex - 1);
      if (e.key === "ArrowRight") render(currentIndex + 1);
    });
  }

  /* Blog category filter */
  var chips = document.querySelectorAll("[data-filter]");
  var posts = document.querySelectorAll("[data-category]");
  if (chips.length && posts.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var value = chip.getAttribute("data-filter");
        posts.forEach(function (post) {
          var match = value === "all" || post.getAttribute("data-category") === value;
          post.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* Newsletter / join-community form — front-end only.
     Replace this handler with a real endpoint (Formspree, Mailchimp,
     Buttondown, your own API route, etc.) before going live. */
  var joinForm = document.getElementById("join-form");
  if (joinForm) {
    joinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("join-status");
      var email = joinForm.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      joinForm.reset();
      if (status) {
        status.textContent = "You're on the list — we'll be in touch at " + email + ".";
        status.classList.remove("hidden");
      }
    });
  }
})();
