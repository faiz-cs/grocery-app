import { NextResponse, type NextRequest } from 'next/server'

// Middleware is intentionally minimal - auth is handled in app/admin/layout.tsx
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
