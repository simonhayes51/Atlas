import Stripe from "stripe";

// Lazy so the app builds and boots without Stripe env vars
// (billing routes will just error until they're set).
export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
