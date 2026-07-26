// ClipCheck configuration.
//
// EXTPAY_ID is your extension's ID on https://extensionpay.com (Stripe-based
// payments for extensions — no server of your own to run).
//
// Leave it as "FREE_MODE" and ClipCheck runs fully unlocked with no payment
// prompts — useful for development and if you want to ship it free.
// To monetise: register at extensionpay.com, set your ID here, and Pro
// features (custom keywords) become paid.
const CLIPCHECK_CONFIG = {
  EXTPAY_ID: "FREE_MODE",
};
