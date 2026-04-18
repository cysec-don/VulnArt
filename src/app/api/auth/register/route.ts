import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, name } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // CTF VULN: No input sanitization on username - allows special chars, SQL-like strings, etc.
    // Also no length validation

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        username, // CTF: No sanitization
        email,
        passwordHash,
        name: name || username,
        role: 'user',
        balance: 10000.0,
      },
    });

    const token = await createSession(user.id);

    const response = NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    }, { status: 201 });

    response.headers.set('Set-Cookie', setSessionCookie(token));
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
