import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const automation = await prisma.automation.findFirst({
    where: { id, userId: session.userId },
  })
  if (!automation) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  // Check plan limits when activating
  if (automation.status === 'inactive') {
    if (user.plan === 'free') {
      const activeCount = await prisma.automation.count({
        where: { userId: session.userId, status: 'active' },
      })
      if (activeCount >= 1) {
        return NextResponse.json(
          { error: 'Upgrade para Pro para ativar mais automações. Plano gratuito permite apenas 1 automação ativa.' },
          { status: 403 }
        )
      }
    }
  }

  const newStatus = automation.status === 'active' ? 'inactive' : 'active'
  const updated = await prisma.automation.update({
    where: { id },
    data: { status: newStatus },
  })

  return NextResponse.json(updated)
}
