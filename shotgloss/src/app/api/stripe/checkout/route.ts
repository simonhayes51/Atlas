import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, siteUrl } from "@/lib/stripe";

// Starts a Stripe Checkout session for the Pro subscription.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", siteUrl()), 303);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .single();

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    // Reuse the Stripe customer if they've checked out before.
    ...(profile?.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: profile?.email ?? user.email }),
    client_reference_id: user.id,
    metadata: { user_id: user.id },
    success_url: `${siteUrl()}/account?success=1`,
    cancel_url: `${siteUrl()}/account`,
  });

  return NextResponse.redirect(session.url!, 303);
}
