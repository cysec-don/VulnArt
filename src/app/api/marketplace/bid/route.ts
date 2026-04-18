import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { auctionId, amount } = body;

    if (!auctionId || !amount) {
      return NextResponse.json(
        { error: 'Auction ID and bid amount are required' },
        { status: 400 }
      );
    }

    const auction = await db.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      );
    }

    if (!auction.isActive) {
      return NextResponse.json(
        { error: 'Auction is not active' },
        { status: 400 }
      );
    }

    if (new Date() > auction.endTime) {
      return NextResponse.json(
        { error: 'Auction has ended' },
        { status: 400 }
      );
    }

    // CTF VULN: No minimum bid validation server-side
    // Client may enforce min bid, but server doesn't
    // Should check: amount >= auction.currentPrice + auction.minBid

    if (user.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Check if bid is below minimum - flag trigger
    if (amount < auction.currentPrice + auction.minBid) {
      await db.hiddenLog.create({
        data: {
          eventType: 'flag',
          message: `User ${user.username} placed bid below minimum - FLAG{b1d_m4n1pul4t10n}`,
          metadata: JSON.stringify({ userId: user.id, auctionId, amount, minRequired: auction.currentPrice + auction.minBid }),
        },
      });
    }

    const bid = await db.bid.create({
      data: {
        userId: user.id,
        auctionId,
        amount,
      },
    });

    // Update auction current price
    await db.auction.update({
      where: { id: auctionId },
      data: { currentPrice: amount, winnerId: user.id },
    });

    return NextResponse.json({
      message: 'Bid placed successfully',
      bid: {
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
      },
      // CTF: Leak flag if bid is below minimum
      ...(amount < auction.currentPrice + auction.minBid ? { hint: 'FLAG{b1d_m4n1pul4t10n}' } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Bid failed' },
      { status: 500 }
    );
  }
}
