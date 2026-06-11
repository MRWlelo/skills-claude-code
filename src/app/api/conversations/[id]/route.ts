import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      contact: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(conversation)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const updated = await prisma.conversation.update({
    where: { id },
    data: {
      status: body.status,
      assignedTo: body.assignedTo,
      unreadCount: body.unreadCount ?? 0,
    },
    include: { contact: true },
  })

  return NextResponse.json(updated)
}
