import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if user has auth token in localStorage (client-side only)
  // For server-side protection, implement JWT or session tokens
  if (pathname.startsWith('/chat')) {
    // Server-side route protection would require actual session management
    // This is a client-side check - for production, use proper session handling
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*'],
};
