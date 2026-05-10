import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("mbti-auth")
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/history") || pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*", "/admin/:path*"],
}
