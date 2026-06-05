import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { id } = await params;

  const contrato = await prisma.contract.findFirst({
    where: { id, userId },
  });

  if (!contrato) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(contrato);
}
