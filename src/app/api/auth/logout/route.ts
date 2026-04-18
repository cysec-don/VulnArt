import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser, clearSessionCookie } from '@/lib/auth';

export async function POST() {
  try {
    const user = await getSessionUser();

    if (user) {
      // Delete all sessions for this user
      await db.session.deleteMany({
        where: { userId: user.id },
      });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.headers.set('Set-Cookie', clearSessionCookie());
    return response;
  } catch (error) {
    const response = NextResponse.json({ message: 'Logged out' });
    response.headers.set('Set-Cookie', clearSessionCookie());
    return response;
  }
}
