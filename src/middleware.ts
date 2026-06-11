import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

const protectedPaths = ['/dashboard', '/automacoes', '/inbox', '/contatos', '/planos', '/configuracoes']
const authPaths = ['/entrar', '/cadastrar']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const isAuth = authPaths.some(p => pathname.startsWith(p))

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/entrar', request.url))
    }
    const payload = await verifyJWT(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/entrar', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  if (isAuth && token) {
    const payload = await verifyJWT(token)
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
