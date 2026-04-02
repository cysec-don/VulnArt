import { NextRequest, NextResponse } from 'next/server';
import { getRawDb } from '@/lib/db-raw';

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json();

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Username, password, and email are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const db = getRawDb();

    // Check if username already exists — VULNERABLE to SQL injection too
    const checkQuery = `SELECT id FROM User WHERE username = '${username}'`;
    const existing = db.prepare(checkQuery).get() as any;

    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Insert new user — VULNERABLE: direct interpolation
    const userId = `usr_${Date.now()}`;
    const insertQuery = `INSERT INTO User (id, username, password, role, email, ssn, creditCard, address, createdAt) VALUES ('${userId}', '${username}', '${password}', 'user', '${email}', '000-00-0000', '0000-XXXX-XXXX-0000', 'Not provided', '${new Date().toISOString()}')`;

    console.log('Executing insert query:', insertQuery);
    db.prepare(insertQuery).run();

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: userId,
        username,
        role: 'user',
        email,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Signup failed: ' + error.message },
      { status: 500 }
    );
  }
}
