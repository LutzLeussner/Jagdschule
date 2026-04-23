/* =========================================================
   Passwort-Gate für Vorschau — Client-seitig
   =========================================================
   Hinweis: kein echter Zutrittsschutz. Hält Suchmaschinen und
   Gelegenheitsbesucher ab. Vor Produktion entfernen.
   ========================================================= */
(function () {
  'use strict';

  // SHA-256 von "rehbock2026"
  var EXPECTED_HASH = 'f286d5d284e36c7d9f04e261862c6e3aff047643f83b247a0ebe72ee508f2b98';
  var KEY = 'jgd_auth_v1';

  // 1) Schon freigeschaltet? → nichts tun
  try {
    if (sessionStorage.getItem(KEY) === EXPECTED_HASH) return;
  } catch (e) { /* sessionStorage gesperrt — gate trotzdem zeigen */ }

  // 2) Inhalt ausblenden bis Gate bestätigt
  var blockStyle = document.createElement('style');
  blockStyle.id = 'jgd-gate-block';
  blockStyle.textContent =
    'html.jgd-locked { overflow: hidden !important; }' +
    'html.jgd-locked body > *:not(#jgd-gate) { visibility: hidden !important; }';
  (document.head || document.documentElement).appendChild(blockStyle);
  document.documentElement.classList.add('jgd-locked');

  // 3) Gate-Styles
  var gateStyle = document.createElement('style');
  gateStyle.id = 'jgd-gate-style';
  gateStyle.textContent = [
    '#jgd-gate {',
    '  position: fixed; inset: 0; z-index: 2147483647;',
    '  display: flex; align-items: center; justify-content: center;',
    '  background: #1E2F1D;',
    '  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    '  color: #FFFFFF;',
    '  padding: 24px;',
    '}',
    '#jgd-gate .jgd-gate__panel {',
    '  width: 100%; max-width: 420px;',
    '  background: #FFFFFF; color: #1A1F1A;',
    '  border-radius: 12px;',
    '  padding: 40px 32px 32px;',
    '  box-shadow: 0 20px 60px rgba(0,0,0,0.35);',
    '  text-align: center;',
    '}',
    '#jgd-gate .jgd-gate__mark {',
    '  width: 56px; height: 56px;',
    '  margin: 0 auto 20px;',
    '  display: block;',
    '}',
    '#jgd-gate h1 {',
    '  font-size: 1.125rem; font-weight: 700;',
    '  margin: 0 0 6px; line-height: 1.3;',
    '}',
    '#jgd-gate .jgd-gate__eyebrow {',
    '  font-size: 0.72rem; font-weight: 600;',
    '  text-transform: uppercase; letter-spacing: 0.18em;',
    '  color: #2D4A2B; margin: 0 0 16px;',
    '}',
    '#jgd-gate p {',
    '  font-size: 0.9rem; line-height: 1.55; color: #4A524A;',
    '  margin: 0 0 24px;',
    '}',
    '#jgd-gate label {',
    '  display: block; text-align: left; font-size: 0.78rem;',
    '  font-weight: 600; color: #1A1F1A; margin: 0 0 6px;',
    '}',
    '#jgd-gate input {',
    '  width: 100%; padding: 12px 14px; box-sizing: border-box;',
    '  font: inherit; font-size: 1rem;',
    '  border: 1px solid #D0CEC8; border-radius: 6px;',
    '  background: #FFFFFF; color: #1A1F1A;',
    '  transition: border-color 120ms ease;',
    '}',
    '#jgd-gate input:focus {',
    '  outline: 2px solid #2D4A2B; outline-offset: 1px;',
    '  border-color: #2D4A2B;',
    '}',
    '#jgd-gate button {',
    '  margin-top: 14px; width: 100%;',
    '  padding: 12px 18px; font: inherit; font-size: 0.95rem;',
    '  font-weight: 600; color: #FFFFFF; background: #2D4A2B;',
    '  border: 0; border-radius: 6px; cursor: pointer;',
    '  transition: background 120ms ease;',
    '}',
    '#jgd-gate button:hover { background: #1E2F1D; }',
    '#jgd-gate .jgd-gate__error {',
    '  margin-top: 10px; min-height: 1.3em;',
    '  font-size: 0.82rem; color: #B3371F;',
    '}',
    '#jgd-gate .jgd-gate__hint {',
    '  margin-top: 18px; font-size: 0.72rem; color: #8A8F89;',
    '}'
  ].join('\n');

  // 4) Gate rendern (wenn DOM bereit)
  function mount() {
    if (document.head && !document.getElementById('jgd-gate-style')) {
      document.head.appendChild(gateStyle);
    }

    var gate = document.createElement('div');
    gate.id = 'jgd-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'jgd-gate-title');
    gate.innerHTML =
      '<div class="jgd-gate__panel">' +
      '  <svg class="jgd-gate__mark" viewBox="0 0 48 48" aria-hidden="true">' +
      '    <circle cx="24" cy="24" r="22" fill="#2D4A2B"/>' +
      '    <g stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '      <circle cx="19" cy="37" r="1" fill="#FFFFFF" stroke="none"/>' +
      '      <path d="M19 36 C 16 28, 13 19, 11 9"/>' +
      '      <path d="M15.5 23 L 8 21"/>' +
      '      <path d="M13.3 13 L 7 11"/>' +
      '      <circle cx="29" cy="37" r="1" fill="#FFFFFF" stroke="none"/>' +
      '      <path d="M29 36 C 32 28, 35 19, 37 9"/>' +
      '      <path d="M32.5 23 L 40 21"/>' +
      '      <path d="M34.7 13 L 41 11"/>' +
      '    </g>' +
      '  </svg>' +
      '  <p class="jgd-gate__eyebrow">Interner Entwurf</p>' +
      '  <h1 id="jgd-gate-title">Jagdschule Grafschaft Diepholz</h1>' +
      '  <p>Diese Vorschau ist noch nicht \u00f6ffentlich. Bitte Passwort eingeben.</p>' +
      '  <form id="jgd-gate-form" novalidate>' +
      '    <label for="jgd-gate-pw">Passwort</label>' +
      '    <input type="password" id="jgd-gate-pw" name="pw" autocomplete="current-password" autofocus required />' +
      '    <button type="submit">\u00d6ffnen</button>' +
      '    <p class="jgd-gate__error" id="jgd-gate-error" role="alert" aria-live="polite"></p>' +
      '  </form>' +
      '  <p class="jgd-gate__hint">Sitzungsgeschützt — bleibt offen bis der Browser geschlossen wird.</p>' +
      '</div>';
    document.body.appendChild(gate);

    var form = document.getElementById('jgd-gate-form');
    var input = document.getElementById('jgd-gate-pw');
    var err = document.getElementById('jgd-gate-error');

    // Fokus setzen (autofocus-Attribut wirkt nicht immer zuverlässig)
    setTimeout(function () { try { input.focus(); } catch (e) {} }, 30);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      err.textContent = '';
      var val = input.value || '';

      hashSha256(val).then(function (h) {
        if (h === EXPECTED_HASH) {
          try { sessionStorage.setItem(KEY, EXPECTED_HASH); } catch (e) {}
          unlock(gate);
        } else {
          err.textContent = 'Passwort stimmt nicht.';
          input.value = '';
          input.focus();
        }
      }).catch(function () {
        err.textContent = 'Browser unterstützt keine Verschlüsselung.';
      });
    });
  }

  function unlock(gate) {
    document.documentElement.classList.remove('jgd-locked');
    var b = document.getElementById('jgd-gate-block');
    if (b) b.remove();
    if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
  }

  function hashSha256(str) {
    if (!(window.crypto && window.crypto.subtle && window.TextEncoder)) {
      return Promise.reject(new Error('no crypto'));
    }
    var bytes = new TextEncoder().encode(str);
    return window.crypto.subtle.digest('SHA-256', bytes).then(function (buf) {
      var arr = Array.from(new Uint8Array(buf));
      return arr.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
