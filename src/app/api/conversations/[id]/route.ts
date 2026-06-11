import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: session.userId },
    include: { contact: true, messages: { orderBy: { createdAt: 'asc' } } },
  })

  if (!conversation) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(conversation)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const existing = await prisma.conversation.findFirst({ where: { id, userId: session.userId } })
  if (!existing) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      status: body.status ?? existing.status,
      unreadCount: body.unreadCount ?? existing.unreadCount,
    },
  })
  return NextResponse.json(conversation)
}
