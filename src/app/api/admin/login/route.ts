import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Debug log
  console.log('DEBUG ADMIN_PASSWORD:', adminPassword);

  if (!adminPassword) {
    return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 });
  }

  if (password === adminPassword) {
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  } else {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  }
} 