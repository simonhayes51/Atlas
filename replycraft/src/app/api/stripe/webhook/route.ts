import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  activateSubscription,
  clearSubscriptionByCustomerId,
  setPlanByCustomerId,
} from "@/lib/db";

// Stripe webhook — keeps users.plan in sync with the subscription.
// Events to enable in the Stripe dashboard:
//   checkout.session.completed, customer.subscription.updated,
//   customer.subscription.deleted

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id ?? session.client_reference_id;
      if (userId) {
        activateSubscription(
          userId,
          String(session.customer),
          String(session.subscription)
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const active = ["active", "trialing"].includes(subscription.status);
      setPlanByCustomerId(String(subscription.customer), active ? "pro" : "free");
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      clearSubscriptionByCustomerId(String(subscription.customer));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
