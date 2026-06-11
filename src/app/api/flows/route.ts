import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const flows = await prisma.flow.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(flows)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const flow = await prisma.flow.create({
    data: {
      name: body.name ?? 'New Flow',
      description: body.description,
      status: body.status ?? 'draft',
      nodes: body.nodes ?? '[]',
      edges: body.edges ?? '[]',
      trigger: body.trigger ?? 'keyword',
      triggerValue: body.triggerValue,
      channelId: body.channelId,
      userId: session.userId,
    },
  })

  return NextResponse.json(flow, { status: 201 })
}
