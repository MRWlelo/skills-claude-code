import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signJWT } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    })

    const token = await signJWT({ userId: user.id, email: user.email })

    const response = NextResponse.json({ success: true })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
