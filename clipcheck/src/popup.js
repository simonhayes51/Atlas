// ClipCheck popup logic.

const enabledInput = document.getElementById("enabled");
const proArea = document.getElementById("pro-area");
const FREE_MODE = CLIPCHECK_CONFIG.EXTPAY_ID === "FREE_MODE";

chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  enabledInput.checked = enabled;
});

enabledInput.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledInput.checked });
});

document.getElementById("options").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

if (!FREE_MODE) {
  const extpay = ExtPay(CLIPCHECK_CONFIG.EXTPAY_ID);
  extpay
    .getUser()
    .then((user) => {
      chrome.storage.local.set({ paid: user.paid });
      if (!user.paid) {
        const btn = document.createElement("button");
        btn.textContent = "Upgrade to Pro — custom keywords";
        btn.addEventListener("click", () => extpay.openPaymentPage());
        proArea.appendChild(btn);
      }
    })
    .catch(() => {});
}
