import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// CTF: Internal endpoint with sensitive data - no auth check
export async function GET() {
  try {
    const [
      totalUsers,
      totalArtworks,
      totalPurchases,
      totalRentals,
      totalAuctions,
      totalBids,
      totalFlags,
    ] = await Promise.all([
      db.user.count(),
      db.artwork.count(),
      db.purchase.count(),
      db.rental.count(),
      db.auction.count(),
      db.bid.count(),
      db.flagSubmission.count(),
    ]);

    const totalRevenue = await db.purchase.aggregate({
      _sum: { amount: true },
    });

    const recentLogs = await db.hiddenLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // CTF: Leaks sensitive internal information
    return NextResponse.json({
      stats: {
        users: totalUsers,
        artworks: totalArtworks,
        purchases: totalPurchases,
        rentals: totalRentals,
        auctions: totalAuctions,
        bids: totalBids,
        flagSubmissions: totalFlags,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      system: {
        version: 'VulnArt/1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'SQLite',
        framework: 'Next.js 16',
      },
      // CTF: Exposed logs with clues
      recentActivity: recentLogs.map(log => ({
        type: log.eventType,
        message: log.message,
        time: log.createdAt,
      })),
      hint: 'FLAG{1nt3rn4l_3xp0s3d}',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
