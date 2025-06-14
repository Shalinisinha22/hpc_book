import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/login']

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/bookings',
  '/halls',
  '/rooms-and-suites',
  '/dining',
  '/discounts',
  '/events-calendar',
  '/extras',
  '/help-center',
  '/meetings-events',
  '/members',
  '/policies',
  '/settings',
  '/staff-leave',
  '/user-ratings',
  '/user-roles',
  '/cancel-bookings'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // For the root path, let the page component handle the redirect
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // For protected routes, let the client-side auth handle the logic
  // This allows the auth store to properly initialize and maintain the current page
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}