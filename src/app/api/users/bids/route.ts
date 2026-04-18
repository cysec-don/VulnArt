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

    const bids = await db.bid.findMany({
      where: { userId: user.id },
      include: {
        auction: {
          include: {
            artwork: {
              select: {
                id: true,
                title: true,
                artist: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bids });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bids' },
      { status: 500 }
    );
  }
}
