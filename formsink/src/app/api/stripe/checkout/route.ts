import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getStripe, siteUrl } from "@/lib/stripe";

// Starts a Stripe Checkout session for the Pro subscription.
export async function POST() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.redirect(new URL("/login", siteUrl()), 303);
  }
  const user = getUserById(session.id);
  if (!user) {
    return NextResponse.redirect(new URL("/login", siteUrl()), 303);
  }

  const stripe = getStripe();
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    // Reuse the Stripe customer if they've checked out before.
    ...(user.stripe_customer_id
      ? { customer: user.stripe_customer_id }
      : { customer_email: user.email }),
    client_reference_id: user.id,
    metadata: { user_id: user.id },
    success_url: `${siteUrl()}/dashboard/billing?success=1`,
    cancel_url: `${siteUrl()}/dashboard/billing`,
  });

  return NextResponse.redirect(checkout.url!, 303);
}
