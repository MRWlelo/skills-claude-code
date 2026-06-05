import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { tipo } = await req.json(); // "pro" | "avulso"

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  if (tipo === "pro") {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_PRO_MONTHLY!, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/upgrade?canceled=1`,
      metadata: { userId, tipo: "pro" },
      subscription_data: { metadata: { userId } },
    });
    return NextResponse.json({ url: checkoutSession.url });
  }

  if (tipo === "avulso") {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_AVULSO!, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgrade=credits`,
      cancel_url: `${baseUrl}/upgrade?canceled=1`,
      metadata: { userId, tipo: "avulso" },
    });
    return NextResponse.json({ url: checkoutSession.url });
  }

  return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
}
