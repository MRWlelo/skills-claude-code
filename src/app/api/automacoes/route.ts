import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const automations = await prisma.automation.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(automations)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const { name, description, triggerType, triggerValue } = body

  if (!name || !triggerType) {
    return NextResponse.json({ error: 'Nome e tipo de gatilho são obrigatórios' }, { status: 400 })
  }

  const automation = await prisma.automation.create({
    data: {
      userId: session.userId,
      name,
      description,
      triggerType,
      triggerValue,
    },
  })

  return NextResponse.json(automation, { status: 201 })
}
