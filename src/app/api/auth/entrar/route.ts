import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signJWT } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 })
    }

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
