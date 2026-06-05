import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const contratos = await prisma.contract.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      tipoLabel: true,
      arrendador: true,
      arrendatario: true,
      imovelNome: true,
      imovelMunicipio: true,
      imovelEstado: true,
      imovelArea: true,
      prazoAnos: true,
      valor: true,
      createdAt: true,
    },
  });

  return NextResponse.json(contratos);
}
