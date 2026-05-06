import { NextRequest, NextResponse } from 'next/server';

/**
 * Verifies the HMAC-signed session token using Web Crypto API (Edge-compatible).
 * Token format: "<timestamp>.<sha256-hex-signature>"
 * Expiry: 24 hours.
 */
async function verifySession(token: string): Promise<boolean> {
  try {
    const dotIdx = token.indexOf('.');
    if (dotIdx === -1) return false;

    const payload = token.slice(0, dotIdx);
    const sig     = token.slice(dotIdx + 1);

    const timestamp = Number(payload);
    if (!Number.isFinite(timestamp)) return false;
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return false; // expired

    const secret = process.env.SESSION_SECRET;
    if (!secret) return false;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert hex signature to Uint8Array
    const sigBytes = new Uint8Array(
      sig.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
    );

    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(payload)
    );
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow: login page, auth API, static assets
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/logo.jpg'
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('qs_session')?.value;

  if (!token || !(await verifySession(token))) {
    const loginUrl = new URL('/login', req.url);
    const res = NextResponse.redirect(loginUrl);
    // Clear invalid cookie
    res.cookies.set('qs_session', '', { maxAge: 0, path: '/' });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
