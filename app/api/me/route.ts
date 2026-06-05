import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, credits: true, planExpiresAt: true, stripeCustomerId: true },
  });

  if (!user) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const isPro = user.plan === "pro" && (!user.planExpiresAt || user.planExpiresAt > new Date());
  const contractsCount = await prisma.contract.count({ where: { userId } });

  return NextResponse.json({
    plan: isPro ? "pro" : user.plan,
    credits: user.credits,
    contractsCount,
    planExpiresAt: user.planExpiresAt,
    hasStripe: !!user.stripeCustomerId,
  });
}
