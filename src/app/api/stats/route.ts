import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const [automations, contacts, messages] = await Promise.all([
    prisma.automation.findMany({ where: { userId: session.userId } }),
    prisma.contact.count({ where: { userId: session.userId } }),
    prisma.message.count({
      where: {
        conversation: { userId: session.userId },
        direction: 'outbound',
        createdAt: { gte: new Date(new Date().setDate(1)) },
      },
    }),
  ])

  const activeAutomations = automations.filter(a => a.status === 'active').length
  const totalTriggered = automations.reduce((sum, a) => sum + a.triggered, 0)
  const totalLeads = automations.reduce((sum, a) => sum + a.leads, 0)
  const conversionRate = totalTriggered > 0 ? Math.round((totalLeads / totalTriggered) * 100) : 0

  return NextResponse.json({
    activeAutomations,
    messagesSentThisMonth: messages,
    contactsCaptured: contacts,
    conversionRate,
    recentAutomations: automations.slice(0, 5),
  })
}
