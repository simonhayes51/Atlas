// ClipCheck content script — runs on mail.google.com.
//
// Strategy: intercept Send (button click or Ctrl/Cmd+Enter) in the capture
// phase. Find the compose window generically — the smallest ancestor of the
// trigger that contains an editable message body — so we don't depend on
// Gmail's obfuscated, frequently-changing class names.

(() => {
  "use strict";

  // Built-in attachment-intent phrases. English + common European languages.
  const DEFAULT_KEYWORDS = [
    // English
    "attached", "attachment", "attachments", "attaching", "enclosed",
    "see attached", "find attached", "please find attached", "i've attached",
    "i have attached", "attached is", "attached are", "my cv", "my resume",
    "my résumé",
    // German
    "anbei", "im anhang", "angehängt", "anhang", "beigefügt",
    // French
    "ci-joint", "ci-jointe", "pièce jointe", "en pièce jointe", "veuillez trouver",
    // Spanish
    "adjunto", "adjunta", "archivo adjunto", "anexo",
    // Italian
    "in allegato", "allegato", "allegata",
    // Dutch
    "bijgevoegd", "in de bijlage", "bijlage",
    // Portuguese
    "em anexo", "anexado", "segue anexo",
  ];

  // If the body links to a file-sharing service, the "attachment" is a link —
  // don't warn.
  const SHARE_LINK_RE =
    /(drive\.google\.com|docs\.google\.com|dropbox\.com|wetransfer\.com|onedrive\.live\.com|sharepoint\.com|box\.com)/i;

  const state = {
    enabled: true,
    customKeywords: [],
    paid: false,
  };

  function loadSettings() {
    chrome.storage.sync.get(
      { enabled: true, customKeywords: [] },
      (synced) => {
        state.enabled = synced.enabled;
        state.customKeywords = synced.customKeywords;
      }
    );
    chrome.storage.local.get({ paid: false }, (local) => {
      state.paid = local.paid;
    });
  }
  loadSettings();
  chrome.storage.onChanged.addListener(loadSettings);

  function activeKeywords() {
    const custom = state.paid ? state.customKeywords : [];
    return DEFAULT_KEYWORDS.concat(custom);
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function mentionsAttachment(text) {
    const haystack = ` ${text.toLowerCase()} `;
    return activeKeywords().some((kw) => {
      const needle = kw.trim().toLowerCase();
      if (!needle) return false;
      // Word-boundary match; \b doesn't handle accented chars well, so use
      // a lookaround on letters instead.
      const re = new RegExp(
        `(?<![\\p{L}\\p{N}])${escapeRegex(needle)}(?![\\p{L}\\p{N}])`,
        "iu"
      );
      return re.test(haystack);
    });
  }

  // --- Compose-window discovery --------------------------------------------

  function findComposeRoot(fromEl) {
    let node = fromEl;
    while (node && node !== document.body) {
      if (
        node.querySelector &&
        node.querySelector(
          '[contenteditable="true"][role="textbox"], [g_editable="true"]'
        )
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function getDraftText(composeRoot) {
    const bodyEl = composeRoot.querySelector(
      '[contenteditable="true"][role="textbox"], [g_editable="true"]'
    );
    let bodyText = "";
    if (bodyEl) {
      // Exclude quoted/previous conversation so replies to "see attached"
      // emails don't false-positive.
      const clone = bodyEl.cloneNode(true);
      clone
        .querySelectorAll(".gmail_quote, blockquote")
        .forEach((el) => el.remove());
      bodyText = clone.innerText || "";
    }
    const subjectEl = composeRoot.querySelector('input[name="subjectbox"]');
    const subject = subjectEl ? subjectEl.value : "";
    return `${subject}\n${bodyText}`;
  }

  function hasAttachment(composeRoot) {
    // Gmail represents compose attachments as hidden inputs named "attach";
    // ".dL" is the visible attachment chip. Either counts.
    return Boolean(
      composeRoot.querySelector('input[name="attach"], .dL')
    );
  }

  function isSendButton(el) {
    const btn = el.closest ? el.closest('[role="button"]') : null;
    if (!btn) return null;
    const tooltip = btn.getAttribute("data-tooltip") || "";
    const label = btn.getAttribute("aria-label") || "";
    if (/^send\b/i.test(tooltip) || /^send\b/i.test(label)) return btn;
    return null;
  }

  // --- Warning dialog -------------------------------------------------------

  function showDialog(onSendAnyway) {
    const overlay = document.createElement("div");
    overlay.setAttribute(
      "style",
      "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.45);" +
        "display:flex;align-items:center;justify-content:center;font-family:Roboto,Arial,sans-serif;"
    );

    const box = document.createElement("div");
    box.setAttribute(
      "style",
      "background:#fff;border-radius:12px;max-width:420px;width:90%;padding:24px;" +
        "box-shadow:0 12px 40px rgba(0,0,0,0.3);text-align:left;"
    );
    box.innerHTML =
      '<div style="font-size:17px;font-weight:600;color:#111;margin-bottom:8px;">' +
      "Forgot the attachment?</div>" +
      '<div style="font-size:14px;color:#444;line-height:1.5;margin-bottom:20px;">' +
      "Your email mentions an attachment, but nothing is attached.</div>" +
      '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
      '<button id="clipcheck-send" style="background:none;border:1px solid #ccc;border-radius:6px;' +
      'padding:8px 16px;font-size:14px;color:#444;cursor:pointer;">Send anyway</button>' +
      '<button id="clipcheck-back" style="background:#4338ca;border:none;border-radius:6px;' +
      'padding:8px 16px;font-size:14px;color:#fff;font-weight:600;cursor:pointer;">Go back</button>' +
      "</div>" +
      '<div style="font-size:11px;color:#999;margin-top:14px;">ClipCheck</div>';

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    box.querySelector("#clipcheck-back").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    box.querySelector("#clipcheck-send").addEventListener("click", () => {
      close();
      onSendAnyway();
    });
    document.addEventListener(
      "keydown",
      function esc(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", esc, true);
        }
      },
      true
    );

    box.querySelector("#clipcheck-back").focus();
  }

  // --- Send interception ----------------------------------------------------

  function shouldWarn(composeRoot) {
    if (!state.enabled) return false;
    if (composeRoot.dataset.clipcheckBypass === "1") {
      delete composeRoot.dataset.clipcheckBypass;
      return false;
    }
    if (hasAttachment(composeRoot)) return false;
    const text = getDraftText(composeRoot);
    if (SHARE_LINK_RE.test(text)) return false;
    return mentionsAttachment(text);
  }

  document.addEventListener(
    "click",
    (e) => {
      const btn = isSendButton(e.target);
      if (!btn) return;
      const composeRoot = findComposeRoot(btn);
      if (!composeRoot) return;
      if (!shouldWarn(composeRoot)) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      showDialog(() => {
        composeRoot.dataset.clipcheckBypass = "1";
        btn.click();
      });
    },
    true
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Enter" || !(e.ctrlKey || e.metaKey)) return;
      const composeRoot = findComposeRoot(e.target);
      if (!composeRoot) return;
      if (!shouldWarn(composeRoot)) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      showDialog(() => {
        composeRoot.dataset.clipcheckBypass = "1";
        // Re-trigger send via the compose window's Send button.
        const sendBtn = composeRoot.querySelector(
          '[role="button"][data-tooltip^="Send"], [role="button"][aria-label^="Send"]'
        );
        if (sendBtn) sendBtn.click();
      });
    },
    true
  );
})();
