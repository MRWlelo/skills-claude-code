import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: session.userId },
  })
  if (!conversation) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      content: body.content,
      direction: 'outbound',
      status: 'sent',
    },
  })

  await prisma.conversation.update({
    where: { id },
    data: { lastMessage: body.content, lastMessageAt: new Date() },
  })

  return NextResponse.json(message, { status: 201 })
}
