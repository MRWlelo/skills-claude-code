import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      content: body.content,
      type: body.type ?? 'text',
      direction: 'outbound',
      status: 'sent',
    },
  })

  await prisma.conversation.update({
    where: { id },
    data: {
      lastMessage: body.content,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    },
  })

  return NextResponse.json(message, { status: 201 })
}
