import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const flow = await prisma.flow.findFirst({
    where: { id, userId: session.userId },
  })

  if (!flow) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(flow)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const flow = await prisma.flow.updateMany({
    where: { id, userId: session.userId },
    data: {
      name: body.name,
      description: body.description,
      status: body.status,
      nodes: body.nodes,
      edges: body.edges,
      trigger: body.trigger,
      triggerValue: body.triggerValue,
      channelId: body.channelId,
    },
  })

  if (flow.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.flow.findUnique({ where: { id } })
  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  await prisma.flow.deleteMany({
    where: { id, userId: session.userId },
  })

  return NextResponse.json({ success: true })
}
