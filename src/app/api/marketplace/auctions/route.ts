import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const auctions = await db.auction.findMany({
      where: { isActive: true },
      include: {
        artwork: true,
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
      },
      orderBy: { endTime: 'asc' },
    });

    return NextResponse.json({ auctions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
}
