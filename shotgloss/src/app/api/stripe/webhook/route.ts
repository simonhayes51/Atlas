import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe webhook — keeps profiles.plan in sync with the subscription.
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

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id ?? session.client_reference_id;
      if (userId) {
        await supabase
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: String(session.customer),
            stripe_subscription_id: String(session.subscription),
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const active = ["active", "trialing"].includes(subscription.status);
      await supabase
        .from("profiles")
        .update({ plan: active ? "pro" : "free" })
        .eq("stripe_customer_id", String(subscription.customer));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await supabase
        .from("profiles")
        .update({ plan: "free", stripe_subscription_id: null })
        .eq("stripe_customer_id", String(subscription.customer));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
