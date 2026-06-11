import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const channels = await prisma.channel.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(channels)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const channel = await prisma.channel.create({
    data: {
      name: body.name,
      type: body.type,
      status: body.status ?? 'inactive',
      config: body.config ? JSON.stringify(body.config) : '{}',
      userId: session.userId,
    },
  })

  return NextResponse.json(channel, { status: 201 })
}
