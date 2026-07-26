// ClipCheck options page logic.

const enabledInput = document.getElementById("enabled");
const keywordsArea = document.getElementById("keywords-area");
const keywordsInput = document.getElementById("keywords");
const savedNote = document.getElementById("saved");
const proTag = document.getElementById("pro-tag");
const upgradeArea = document.getElementById("upgrade-area");
const FREE_MODE = CLIPCHECK_CONFIG.EXTPAY_ID === "FREE_MODE";

chrome.storage.sync.get(
  { enabled: true, customKeywords: [] },
  ({ enabled, customKeywords }) => {
    enabledInput.checked = enabled;
    keywordsInput.value = customKeywords.join("\n");
  }
);

enabledInput.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledInput.checked });
});

document.getElementById("save").addEventListener("click", () => {
  const customKeywords = keywordsInput.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 200);
  chrome.storage.sync.set({ customKeywords }, () => {
    savedNote.textContent = "Saved";
    setTimeout(() => (savedNote.textContent = ""), 2000);
  });
});

function lockKeywords(extpay) {
  proTag.textContent = "(Pro)";
  keywordsArea.classList.add("locked");
  const btn = document.createElement("button");
  btn.id = "upgrade";
  btn.textContent = "Upgrade to Pro to add your own keywords";
  btn.addEventListener("click", () => extpay.openPaymentPage());
  upgradeArea.appendChild(btn);
}

if (!FREE_MODE) {
  const extpay = ExtPay(CLIPCHECK_CONFIG.EXTPAY_ID);
  extpay
    .getUser()
    .then((user) => {
      chrome.storage.local.set({ paid: user.paid });
      if (!user.paid) lockKeywords(extpay);
    })
    .catch(() => {});
}
