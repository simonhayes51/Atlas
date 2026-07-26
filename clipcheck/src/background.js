// ClipCheck background service worker.
// Syncs the ExtensionPay paid status into chrome.storage.local so the
// content script (which can't call ExtPay directly) can read it.

importScripts("config.js");

const FREE_MODE = CLIPCHECK_CONFIG.EXTPAY_ID === "FREE_MODE";

if (FREE_MODE) {
  chrome.storage.local.set({ paid: true });
} else {
  importScripts("ExtPay.js");
  const extpay = ExtPay(CLIPCHECK_CONFIG.EXTPAY_ID);
  extpay.startBackground();

  const syncPaidStatus = () =>
    extpay
      .getUser()
      .then((user) => chrome.storage.local.set({ paid: user.paid }))
      .catch(() => {});

  chrome.runtime.onInstalled.addListener(syncPaidStatus);
  chrome.runtime.onStartup.addListener(syncPaidStatus);
  extpay.onPaid.addListener(() => chrome.storage.local.set({ paid: true }));

  // Re-check every 12 hours in case of refunds/cancellations.
  chrome.alarms.create("clipcheck-paid-sync", { periodInMinutes: 720 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "clipcheck-paid-sync") syncPaidStatus();
  });
}
