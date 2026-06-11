import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? ''
  const channel = searchParams.get('channel') ?? ''

  const contacts = await prisma.contact.findMany({
    where: {
      userId: session.userId,
      ...(search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      } : {}),
      ...(channel ? { channel } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { conversations: true } } },
  })

  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const contact = await prisma.contact.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      channel: body.channel ?? 'whatsapp',
      externalId: body.externalId,
      tags: body.tags ? JSON.stringify(body.tags) : '[]',
      userId: session.userId,
    },
  })

  return NextResponse.json(contact, { status: 201 })
}
