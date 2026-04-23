/* =======================================================================
   Jagdschule Grafschaft Diepholz — main.js
   Nur das Nötigste: Mobile-Nav-Toggle, sanftes Scroll-Verhalten,
   Formular-Stub mit Bestätigungsmeldung (ohne Backend).
   ======================================================================= */

(() => {
  "use strict";

  /* ---- Mobile Nav Toggle --------------------------------------------- */
  const navToggle = document.querySelector(".nav__toggle");
  const nav = document.querySelector("#main-nav");

  const closeNav = () => {
    if (!nav) return;
    nav.dataset.open = "false";
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Menü öffnen");
    }
  };

  const openNav = () => {
    if (!nav) return;
    nav.dataset.open = "true";
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Menü schließen");
    }
  };

  if (navToggle && nav) {
    nav.dataset.open = "false";

    navToggle.addEventListener("click", () => {
      if (nav.dataset.open === "true") closeNav();
      else openNav();
    });

    // Menü schließen, wenn ein Nav-Link geklickt wurde
    nav.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.dataset.open === "true") closeNav();
      });
    });

    // ESC schließt das mobile Menü
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.dataset.open === "true") closeNav();
    });
  }

  /* ---- Sanftes Scrollen bei Anker-Klicks ----------------------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      if (!reduceMotion) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        // Fokus für Tastaturnutzer:innen setzen
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        window.setTimeout(() => target.removeAttribute("tabindex"), 1000);

        history.replaceState(null, "", id);
      }
    });
  });

  /* ---- Formular-Stub ------------------------------------------------- */
  const form = document.getElementById("contact-form");
  const feedback = form ? form.querySelector(".form__feedback") : null;

  if (form && feedback) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        feedback.dataset.state = "error";
        feedback.textContent =
          "Bitte prüfen Sie die rot markierten Felder und versuchen es erneut.";
        return;
      }

      const data = new FormData(form);
      const firstName = String(data.get("name") || "").trim().split(/\s+/)[0];

      feedback.dataset.state = "success";
      feedback.textContent =
        "Vielen Dank" +
        (firstName ? ", " + firstName : "") +
        "! Ihre Nachricht ist bei uns angekommen. Wir melden uns innerhalb weniger Tage telefonisch oder per E-Mail zurück.";

      form.reset();

      feedback.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  /* ---- Jahr im Footer automatisch ------------------------------------ */
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
