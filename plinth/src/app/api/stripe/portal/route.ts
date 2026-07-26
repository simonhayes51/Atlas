import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getStripe, siteUrl } from "@/lib/stripe";

// Opens the Stripe Customer Portal (manage card, invoices, cancel).
export async function POST() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.redirect(new URL("/login", siteUrl()), 303);
  }

  const user = getUserById(session.id);
  if (!user?.stripe_customer_id) {
    return NextResponse.redirect(new URL("/account", siteUrl()), 303);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.redirect(
      new URL(
        `/account?error=${encodeURIComponent("Billing isn't configured on this deployment yet.")}`,
        siteUrl()
      ),
      303
    );
  }

  try {
    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${siteUrl()}/account`,
    });

    return NextResponse.redirect(portal.url, 303);
  } catch {
    return NextResponse.redirect(
      new URL(
        `/account?error=${encodeURIComponent("Couldn't open the billing portal. Try again in a moment.")}`,
        siteUrl()
      ),
      303
    );
  }
}
