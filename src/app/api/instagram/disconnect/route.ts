import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  await prisma.instagramAccount.deleteMany({
    where: { userId: session.userId },
  })

  return NextResponse.json({ success: true })
}
