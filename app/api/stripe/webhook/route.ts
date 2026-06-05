import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tipo = session.metadata?.tipo;
        if (!userId) break;

        if (tipo === "avulso") {
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: 1 } },
          });
        }

        if (tipo === "pro" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          // billing_cycle_anchor + 30 days as approximate period end
          const nextBilling = new Date((sub.billing_cycle_anchor + 30 * 24 * 60 * 60) * 1000);
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: "pro",
              stripeSubId: sub.id,
              planExpiresAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : nextBilling,
            },
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as unknown as { subscription?: string }).subscription;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const nextBilling = new Date((sub.billing_cycle_anchor + 30 * 24 * 60 * 60) * 1000);
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "pro",
            planExpiresAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : nextBilling,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: { plan: "free", stripeSubId: null, planExpiresAt: null },
        });
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}
