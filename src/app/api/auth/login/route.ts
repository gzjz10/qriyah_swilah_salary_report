import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ── In-memory rate limiter (per-lambda; good enough for an internal tool)
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

function getIp(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function createToken(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET not set');
  const ts  = Date.now().toString();
  const sig = crypto.createHmac('sha256', secret).update(ts).digest('hex');
  return `${ts}.${sig}`;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  // ── Rate limit check ──
  const rec = attempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  if (rec.lockedUntil > Date.now()) {
    const mins = Math.ceil((rec.lockedUntil - Date.now()) / 60_000);
    return NextResponse.json(
      { error: `تم تجميد الوصول. حاول مجدداً بعد ${mins} دقيقة` },
      { status: 429 }
    );
  }

  // ── Parse body ──
  let body: { username?: string; password?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 }); }

  const { username, password } = body;

  // ── Constant-time credential check (both env vars must be set) ──
  const envUser = process.env.AUTH_USERNAME ?? '';
  const envPass = process.env.AUTH_PASSWORD ?? '';

  const userBuf = Buffer.from(username ?? '');
  const passBuf = Buffer.from(password ?? '');
  const envUserBuf = Buffer.from(envUser);
  const envPassBuf = Buffer.from(envPass);

  // timingSafeEqual requires same length; pad to avoid length-timing leak
  const padTo = (a: Buffer, b: Buffer) => {
    const len = Math.max(a.length, b.length) || 1;
    return [
      Buffer.concat([a, Buffer.alloc(len - a.length)]),
      Buffer.concat([b, Buffer.alloc(len - b.length)]),
    ];
  };

  const [u1, u2] = padTo(userBuf, envUserBuf);
  const [p1, p2] = padTo(passBuf, envPassBuf);

  const userMatch = crypto.timingSafeEqual(u1, u2) && userBuf.length === envUserBuf.length;
  const passMatch = crypto.timingSafeEqual(p1, p2) && passBuf.length === envPassBuf.length;

  if (!userMatch || !passMatch) {
    rec.count++;
    const remaining = MAX_ATTEMPTS - rec.count;
    if (rec.count >= MAX_ATTEMPTS) {
      rec.lockedUntil = Date.now() + LOCKOUT_MS;
      rec.count       = 0;
      attempts.set(ip, rec);
      return NextResponse.json(
        { error: 'تم تجميد الحساب لمدة 15 دقيقة بسبب المحاولات المتعددة' },
        { status: 429 }
      );
    }
    attempts.set(ip, rec);
    return NextResponse.json(
      { error: 'اسم المستخدم أو كلمة المرور غير صحيحة', remaining },
      { status: 401 }
    );
  }

  // ── Success — clear attempts, issue signed httpOnly cookie ──
  attempts.delete(ip);

  let token: string;
  try { token = createToken(); }
  catch { return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 }); }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('qs_session', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   24 * 60 * 60, // 24 hours
    path:     '/',
  });
  return res;
}
