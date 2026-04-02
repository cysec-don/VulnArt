import { NextRequest, NextResponse } from 'next/server';
import { getRawDb } from '@/lib/db-raw';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const db = getRawDb();

    // VULNERABLE: Raw SQL with string interpolation - SQL Injection!
    const query = `SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`;
    console.log('Executing raw query:', query);

    const user = db.prepare(query).get() as any;

    if (user) {
      return NextResponse.json({
        success: true,
        message: 'Login successful!',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}
