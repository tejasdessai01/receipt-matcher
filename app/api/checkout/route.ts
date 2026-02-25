import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = body.plan === "yearly" ? PLANS.yearly : PLANS.monthly;

    if (!plan.priceId) {
      return NextResponse.json(
        { error: "Stripe price ID not configured. Set STRIPE_PRICE_ID_MONTHLY / STRIPE_PRICE_ID_YEARLY in environment variables." },
        { status: 500 }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
