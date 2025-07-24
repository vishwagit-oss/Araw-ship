// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')

const publicPaths = ['/login', '/api/login', '/api/verify-otp', '/_next', '/favicon.ico']

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  const isPublic = publicPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  )

  // If not logged in and accessing protected page → redirect
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If already logged in and going to /login → redirect to home
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (token) {
    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (err) {
      console.warn('❌ Invalid or expired token:', err)
      const res = NextResponse.redirect(new URL('/login', req.url))
      res.cookies.set('token', '', { maxAge: 0 }) // 🧹 Clear token
      return res
    }
  }

  return NextResponse.next()
}
