import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CTF: Information disclosure header
  response.headers.set('X-Powered-By', 'VulnArt/1.0.0');

  // Log access to hidden routes
  const pathname = request.nextUrl.pathname;
  const hiddenPaths = [
    '/admin-panel-x7k9',
    '/api/admin/',
    '/api/internal/',
    '/api/debug/',
    '/hidden/',
    '/secret-files/',
    '/backup/',
    '/.env',
  ];

  const isHiddenPath = hiddenPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  if (isHiddenPath) {
    // Log the access attempt
    try {
      const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
      await db.hiddenLog.create({
        data: {
          eventType: 'suspicious_access',
          message: `Access to hidden path: ${pathname} from ${ip}`,
          metadata: JSON.stringify({
            path: pathname,
            method: request.method,
            userAgent: request.headers.get('user-agent'),
            referer: request.headers.get('referer'),
          }),
        },
      });
    } catch {
      // Ignore logging errors
    }
  }

  // Check session for protected API routes (but not hidden ones - those are CTF)
  const protectedApiPaths = ['/api/users/', '/api/marketplace/buy', '/api/marketplace/rent', '/api/marketplace/bid', '/api/flags/'];
  const isProtectedApi = protectedApiPaths.some((path) => pathname.startsWith(path));

  if (isProtectedApi && request.method !== 'GET') {
    const sessionToken = request.cookies.get('vulnart_session')?.value;
    if (!sessionToken) {
      // Let the route handler deal with auth - middleware just logs
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
