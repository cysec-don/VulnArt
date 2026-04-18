import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const rentals = await db.rental.findMany({
      where: { userId: user.id },
      include: {
        artwork: {
          select: {
            id: true,
            title: true,
            artist: true,
            image: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ rentals });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}
