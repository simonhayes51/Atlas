# ClipCheck — Forgot Attachment Alerts for Gmail

ClipCheck is a Chrome extension (Manifest V3) that stops the classic
"please find attached" email with nothing attached. When you hit Send in
Gmail — button or Ctrl/Cmd+Enter — it scans your draft for
attachment-intent phrases in 7 languages, and if nothing is attached it
blocks the send with a "Forgot the attachment?" dialog.

**Business model:** freemium via [ExtensionPay](https://extensionpay.com)
(Stripe-based payments built for extensions — no server of your own).
Free = full detection with built-in phrases. Pro (suggested £9/year) =
custom keyword lists. Out of the box the extension runs in **free mode**
(everything unlocked, no payment prompts) until you set an ExtensionPay ID.

## No build step

Plain JavaScript, HTML and CSS. No bundler, no framework, no dependencies
except the vendored `src/ExtPay.js` (from the official
[ExtPay repo](https://github.com/Glench/ExtPay)). What's in the folder is
what ships.

```
manifest.json        # MV3 manifest
src/config.js        # EXTPAY_ID — the only config
src/content.js       # THE product: send interception + detection + dialog
src/background.js    # syncs ExtensionPay paid status into storage
src/popup.html/.js   # toolbar popup: on/off toggle + upgrade button
src/options.html/.js # settings: toggle + custom keywords (Pro)
src/ExtPay.js        # vendored ExtensionPay client
icons/               # 16/32/48/128 png
```

## How detection works (src/content.js)

1. A capture-phase listener catches clicks on Gmail's Send button
   (matched by `data-tooltip`/`aria-label` starting with "Send") and
   Ctrl/Cmd+Enter inside a compose body.
2. The compose window is found **generically**: the smallest ancestor of
   the trigger containing a `contenteditable` message body. No reliance on
   Gmail's obfuscated class names, so UI churn rarely breaks it.
3. The draft text (subject + body, minus quoted replies/blockquotes) is
   checked against attachment phrases in English, German, French, Spanish,
   Italian, Dutch and Portuguese, with unicode-aware word boundaries.
4. No warning if: an attachment chip / `input[name="attach"]` exists, the
   body links to Drive/Dropbox/WeTransfer/OneDrive/Box, or the user already
   clicked "Send anyway" (per-compose bypass flag).

## Install for development

1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select this folder
3. Open Gmail, compose an email containing "see attached", press Send —
   the dialog should appear. Add an attachment or a Drive link — it
   shouldn't.

### Manual test checklist

- [ ] Send button warns; "Go back" returns to draft; "Send anyway" sends
- [ ] Ctrl/Cmd+Enter path warns
- [ ] With a real attachment: no warning
- [ ] With a Drive/Dropbox link: no warning
- [ ] Replying to an email that says "see attached" (quoted text): no warning
- [ ] Popup toggle off: no warning
- [ ] Custom keyword (e.g. "the deck") triggers after saving in options

## Monetising with ExtensionPay (~15 min)

1. Sign up at [extensionpay.com](https://extensionpay.com), register the
   extension, connect Stripe, and set a price (one-time or subscription —
   suggested £9/year).
2. Put your ExtensionPay extension ID in `src/config.js`
   (`EXTPAY_ID: "your-ext-id"`).
3. Reload. Custom keywords are now Pro-gated; popup and options show
   Upgrade buttons that open ExtensionPay's Stripe checkout.
4. Paid status is cached in `chrome.storage.local` and re-checked every
   12 hours (handles refunds/cancellations).

## Publishing to the Chrome Web Store

1. Zip the extension files only — `manifest.json`, `src/`, `icons/`.
   Exclude `site/`, `tailwind.css`, `package.json`, `node_modules/` and
   `README.md` — those are the landing page and its build tooling.
2. [Chrome Web Store developer console](https://chrome.google.com/webstore/devconsole)
   → New item → upload the zip ($5 one-time developer fee).
3. Category: Workflow & Planning. Justify permissions: `storage`
   (settings), `alarms` (periodic license re-check),
   `extensionpay.com` host (payments).
4. Listing keywords: see SEO section below.

## Landing page (site/)

`site/` is a self-contained static landing page for SEO ("gmail forgot
attachment" searches) with a CTA to the Web Store listing. It is not part
of the extension.

**Deploy on Railway:** New Project → Deploy from GitHub repo → set
**Root Directory** to `clipcheck/site` — Railpack's Staticfile provider
serves it as-is. (Any static host works.) No build runs at deploy time:
the page ships as HTML + a prebuilt `styles.css` and **zero JavaScript**.

**After publishing to the Web Store**, replace every `href="#"` on the
"Add to Chrome" buttons with your listing URL (there are four, each
marked with a comment).

**Editing the styles:** the markup uses Tailwind utility classes and
`styles.css` is a committed build artifact. If you change classes in
`index.html`, regenerate it:

```bash
npm install        # one-time, installs the Tailwind CLI here
npm run build:css  # regenerates site/styles.css
```

`tailwind.css` holds the Tailwind import plus the two custom dot-grid
utilities. The `package.json` in this folder is build tooling for the
landing page only — it is not part of the extension and is not used at
deploy time (Railway's root directory is `clipcheck/site`).

## Notes for a buyer

- **Running costs: zero.** No servers, no APIs, no database. ExtensionPay
  takes a small fee on top of Stripe's.
- **Maintenance surface:** the only realistic breakage is Gmail changing
  its DOM. The compose-window discovery is written to survive class-name
  churn; the two Gmail-specific selectors (`input[name="attach"]`, `.dL`
  chips, `subjectbox`) are long-standing and trivially updatable in
  `content.js`.
- **Known limitation:** the Send button is matched by its English
  tooltip/label. Users running Gmail's UI in another language need the
  keyboard-shortcut path or a selector addition — documented here on
  purpose rather than half-supporting every locale.
- Obvious upsell roadmap (deliberately not built): Outlook web support,
  negation handling ("no attachment needed"), per-domain rules, Firefox
  port, team licensing.

## SEO / Web Store keywords being targeted

1. "gmail forgot attachment"
2. "attachment reminder gmail"
3. "gmail attachment alert extension"
4. "forgot to attach file email"
5. "email attachment checker"
