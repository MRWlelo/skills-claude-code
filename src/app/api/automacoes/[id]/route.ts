import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const automation = await prisma.automation.findFirst({
    where: { id, userId: session.userId },
  })

  if (!automation) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(automation)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const existing = await prisma.automation.findFirst({
    where: { id, userId: session.userId },
  })
  if (!existing) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const automation = await prisma.automation.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      description: body.description ?? existing.description,
      triggerType: body.triggerType ?? existing.triggerType,
      triggerValue: body.triggerValue ?? existing.triggerValue,
      nodes: body.nodes !== undefined ? JSON.stringify(body.nodes) : existing.nodes,
      edges: body.edges !== undefined ? JSON.stringify(body.edges) : existing.edges,
      status: body.status ?? existing.status,
    },
  })

  return NextResponse.json(automation)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.automation.findFirst({
    where: { id, userId: session.userId },
  })
  if (!existing) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  await prisma.automation.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
