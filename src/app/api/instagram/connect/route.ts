import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const { username, name } = body

  if (!username) {
    return NextResponse.json({ error: 'Username é obrigatório' }, { status: 400 })
  }

  const existing = await prisma.instagramAccount.findUnique({
    where: { userId: session.userId },
  })

  if (existing) {
    const account = await prisma.instagramAccount.update({
      where: { userId: session.userId },
      data: { username, name: name || username, accessToken: 'mock_token' },
    })
    return NextResponse.json(account)
  }

  const account = await prisma.instagramAccount.create({
    data: {
      userId: session.userId,
      instagramId: `ig_${Date.now()}`,
      username,
      name: name || username,
      accessToken: 'mock_token',
    },
  })

  return NextResponse.json(account, { status: 201 })
}
