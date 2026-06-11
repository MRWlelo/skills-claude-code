import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { instagramAccount: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json(userWithoutPassword)
}
