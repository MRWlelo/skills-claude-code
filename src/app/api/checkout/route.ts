import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      plan: 'pro',
      planExpiresAt: expiresAt,
    },
  })

  return NextResponse.json({ success: true, message: 'Upgrade para Pro realizado com sucesso!' })
}
