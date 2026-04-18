import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// CTF VULN: No auth check - anyone can access this endpoint
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        balance: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
