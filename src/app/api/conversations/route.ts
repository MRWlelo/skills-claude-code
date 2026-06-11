import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.userId },
    include: { contact: true },
    orderBy: { lastMessageAt: 'desc' },
  })

  return NextResponse.json(conversations)
}
