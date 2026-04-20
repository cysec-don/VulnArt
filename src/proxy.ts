import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // CTF: Information disclosure header
  response.headers.set('X-Powered-By', 'VulnArt/1.0.0');
  response.headers.set('X-Server', 'vulnart/1.0.0');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
