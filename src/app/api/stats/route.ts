import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalContacts, activeFlows, openConversations, messagesToday] = await Promise.all([
    prisma.contact.count({ where: { userId: session.userId } }),
    prisma.flow.count({ where: { userId: session.userId, status: 'active' } }),
    prisma.conversation.count({
      where: { contact: { userId: session.userId }, status: 'open' },
    }),
    prisma.message.count({
      where: {
        createdAt: { gte: today },
        conversation: { contact: { userId: session.userId } },
      },
    }),
  ])

  return NextResponse.json({
    totalContacts,
    activeFlows,
    openConversations,
    messagesToday,
  })
}
