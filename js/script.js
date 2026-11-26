/* =====================================================
   HABTUNA 24 – Portfolio script (vanilla JavaScript)
   1. SITE_CONFIG – the ONLY place you need to edit links
   2. Link & status setup   3. Mobile navigation
   4. Active section        5. Scroll reveal
   6. Project filter        7. Back to top
   8. Contact form          9. Footer year
   ===================================================== */

(function () {
  "use strict";

  /* ---------- 1. SITE_CONFIG ----------
     Fill in the values below as you get them. Leave a value as "" and
     the matching link stays visibly disabled instead of pointing nowhere.
     Nothing here has been invented: empty means "not supplied yet". */
  const SITE_CONFIG = {
    github: "https://github.com/habtuna24",   // TODO: verify this profile URL is correct
    email: "hteklye005@gmail.com",
    phone: "0984797673",                      // shown as typed; the call link converts 09... to +2519...
    linkedin: "",                             // e.g. "https://www.linkedin.com/in/your-id"
    telegram: "https://t.me/habtuna24",

    // Optional: a form service endpoint (e.g. Formspree: "https://formspree.io/f/xxxxxxx").
    // If empty, the contact form falls back to opening your email app (needs `email` above).
    formEndpoint: "",

    // For each project: github / demo URLs, and status = "completed" or "progress".
    projects: {
      project1: { github: "", demo: "", status: "" },
      project2: { github: "", demo: "", status: "" },
      project3: { github: "", demo: "", status: "" },
      project4: { github: "", demo: "", status: "" },
      project5: { github: "", demo: "", status: "" }
    }
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 2. Link & status setup ---------- */

  // Resolve a data-link key (e.g. "github", "project1-demo") to a URL, or "" if not supplied.
  function resolveLink(key) {
    if (key === "github" || key === "linkedin" || key === "telegram") return SITE_CONFIG[key];
    if (key === "email") return SITE_CONFIG.email ? "mailto:" + SITE_CONFIG.email : "";
    if (key === "phone") {
      // Ethiopian local format 09XXXXXXXX -> international +2519XXXXXXXX for tel: links
      const digits = SITE_CONFIG.phone.replace(/\D/g, "");
      if (!digits) return "";
      return "tel:" + (digits.charAt(0) === "0" ? "+251" + digits.slice(1) : "+" + digits);
    }
    const match = key.match(/^(project\d+)-(github|demo)$/);
    if (match && SITE_CONFIG.projects[match[1]]) return SITE_CONFIG.projects[match[1]][match[2]];
    return "";
  }

  function disableLink(el) {
    el.removeAttribute("href");
    el.removeAttribute("target");
    el.classList.add("is-disabled");
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("tabindex", "-1");
    el.title = "Not available yet";
  }

  document.querySelectorAll("[data-link]").forEach(function (el) {
    const url = resolveLink(el.dataset.link);
    if (url) {
      el.href = url;
      if (url.indexOf("mailto:") === 0 || url.indexOf("tel:") === 0) el.removeAttribute("target");
      // Replace placeholder text with the real value when it is a text link.
      if (el.dataset.text) {
        const text = el.dataset.text;
        el.textContent = text === "email" ? SITE_CONFIG.email
          : text === "phone" ? SITE_CONFIG.phone
          : url.replace(/^https?:\/\/(www\.)?/, "");
      }
    } else {
      // Hero social icons with no URL are hidden instead of shown disabled.
      const socialItem = el.classList.contains("social") ? el.closest("li") : null;
      if (socialItem) socialItem.hidden = true; else disableLink(el);
    }
  });

  /* ---------- 2b. Light / dark theme ----------
     The saved choice is applied by a tiny script in <head> (no flash).
     This part handles the toggle button and remembers the choice. */
  const themeToggle = document.getElementById("themeToggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    if (themeColorMeta) themeColorMeta.setAttribute("content", theme === "light" ? "#F8FAFC" : "#0B1120");
  }

  applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("habtuna-theme", next); } catch (e) { /* storage blocked: theme still switches */ }
  });

  // Project status badges (Completed / In Progress) – stays "to confirm" until set in config.
  document.querySelectorAll("[data-status]").forEach(function (badge) {
    const project = SITE_CONFIG.projects[badge.dataset.status];
    if (!project) return;
    if (project.status === "completed") {
      badge.textContent = "Completed";
      badge.classList.add("status--completed");
    } else if (project.status === "progress") {
      badge.textContent = "In Progress";
      badge.classList.add("status--progress");
    }
  });

  /* ---------- 3. Mobile navigation ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function setMenu(open) {
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", function () {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });
  // Close after choosing a link, pressing Escape, or tapping outside the header.
  navMenu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".site-header")) setMenu(false);
  });

  /* ---------- 4. Active section highlighting ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      const active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    // A section counts as "current" when it crosses the middle band of the viewport.
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- 5. Scroll reveal (disabled for reduced motion) ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Project image galleries (swipe or use arrows) ---------- */
  document.querySelectorAll(".gallery").forEach(function (gallery) {
    const track = gallery.querySelector(".gallery__track");
    const prev = gallery.querySelector(".gallery__btn--prev");
    const next = gallery.querySelector(".gallery__btn--next");
    const count = gallery.querySelector(".gallery__count");
    const total = track.children.length;

    function current() {
      return track.clientWidth ? Math.round(track.scrollLeft / track.clientWidth) : 0;
    }
    function update() {
      const i = current();
      count.textContent = (i + 1) + " / " + total;
      prev.disabled = i === 0;
      next.disabled = i === total - 1;
    }
    function go(step) {
      track.scrollTo({ left: (current() + step) * track.clientWidth, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    track.addEventListener("scroll", update, { passive: true });
    update();
  });

  /* ---------- 6. Project filtering ---------- */
  const filterButtons = document.querySelectorAll(".filter");
  const projectCards = document.querySelectorAll(".project-card");
  const emptyNote = document.getElementById("projectsEmpty");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach(function (b) {
        const active = b === button;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      projectCards.forEach(function (card) {
        const techs = card.dataset.tech.split(" ");
        const show = filter === "all" || techs.indexOf(filter) !== -1;
        card.hidden = !show;
        if (show) {
          card.classList.add("is-visible"); // make sure revealed cards are never left invisible
          visibleCount++;
        }
      });

      emptyNote.hidden = visibleCount > 0;
    });
  });

  /* ---------- 7. Back to top ---------- */
  const toTop = document.getElementById("toTop");

  window.addEventListener("scroll", function () {
    toTop.hidden = window.scrollY < 600;
  }, { passive: true });

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0 }); // smoothness comes from CSS, which respects reduced motion
    document.getElementById("home").focus({ preventScroll: true });
  });

  /* ---------- 8. Contact form ----------
     Honest behaviour – the form never claims a message was sent unless it was:
     - formEndpoint set  -> posts to the form service and reports the real result
     - only email set    -> opens the visitor's email app with the message filled in
     - neither set       -> tells the visitor the form is not connected yet */
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const noteEl = document.getElementById("formNote");

  if (SITE_CONFIG.formEndpoint) {
    noteEl.textContent = "Your message is sent through a secure form service.";
  } else if (SITE_CONFIG.email) {
    noteEl.textContent = "This opens your email app with the message ready to send.";
  } else {
    noteEl.textContent = "Setup needed: add an email or form endpoint in js/script.js to activate this form.";
  }

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "form-status " + (type || "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation with clear feedback
    let firstInvalid = null;
    ["name", "email", "message"].forEach(function (field) {
      const input = form.elements[field];
      const valid = input.value.trim() !== "" && input.checkValidity();
      input.classList.toggle("is-invalid", !valid);
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      showStatus("Please fill in every field with valid information.", "is-error");
      firstInvalid.focus();
      return;
    }

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim()
    };

    if (SITE_CONFIG.formEndpoint) {
      showStatus("Sending...", "");
      fetch(SITE_CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (response) {
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        showStatus("Thank you! Your message was sent.", "is-ok");
      }).catch(function () {
        showStatus("Sorry, the message could not be sent. Please try again later.", "is-error");
      });
    } else if (SITE_CONFIG.email) {
      const subject = encodeURIComponent("Portfolio message from " + data.name);
      const body = encodeURIComponent(data.message + "\n\n" + data.name + " (" + data.email + ")");
      window.location.href = "mailto:" + SITE_CONFIG.email + "?subject=" + subject + "&body=" + body;
      showStatus("Your email app should open now. Press send there to deliver your message.", "is-ok");
    } else {
      showStatus("This form is not connected yet, so nothing was sent.", "is-error");
    }
  });

  /* ---------- 8b. Profile photo tilt (mouse only, skipped for reduced motion) ---------- */
  const photoArea = document.querySelector(".hero__photo");
  const photoFrame = document.querySelector(".photo-frame");

  if (photoArea && photoFrame && !prefersReducedMotion) {
    photoArea.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return; // touch screens keep the plain float animation
      const rect = photoFrame.getBoundingClientRect();
      // Position of the cursor relative to the photo centre, from -0.5 to +0.5
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      photoFrame.style.setProperty("--tilt-y", (x * 14).toFixed(1) + "deg");
      photoFrame.style.setProperty("--tilt-x", (-y * 14).toFixed(1) + "deg");
    });
    photoArea.addEventListener("pointerleave", function () {
      photoFrame.style.setProperty("--tilt-x", "0deg");
      photoFrame.style.setProperty("--tilt-y", "0deg");
    });
  }

  /* ---------- 9. Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
