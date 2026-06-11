import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? ''
  const channel = searchParams.get('channel') ?? ''

  const conversations = await prisma.conversation.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(channel ? { channel } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      contact: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  return NextResponse.json(conversations)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const conversation = await prisma.conversation.create({
    data: {
      contactId: body.contactId,
      channel: body.channel ?? 'whatsapp',
      status: 'open',
    },
    include: { contact: true },
  })

  return NextResponse.json(conversation, { status: 201 })
}
