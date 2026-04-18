import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const auction = await db.auction.findUnique({
      where: { id },
      include: {
        artwork: true,
        bids: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
      },
    });

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ auction });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch auction' },
      { status: 500 }
    );
  }
}
