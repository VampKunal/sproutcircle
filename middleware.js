import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const isAdmin = token?.role === "admin"
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")

  if (isAdminRoute && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (!isAuthenticated && !isAuthRoute && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/register",
    "/chat/:path*",
    "/location/:path*",
    "/gallery/:path*",
    "/video-call/:path*",
    "/timetable/:path*",
    "/games/:path*",
  ],
}
