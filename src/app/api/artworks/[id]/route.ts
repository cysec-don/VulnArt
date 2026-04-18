import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();

    const artwork = await db.artwork.findUnique({
      where: { id },
      include: {
        auctions: {
          where: { isActive: true },
          include: {
            bids: {
              orderBy: { createdAt: 'desc' },
              take: 5,
              include: {
                user: {
                  select: { id: true, username: true },
                },
              },
            },
          },
        },
        purchases: {
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        rentals: {
          where: { isActive: true },
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // CTF VULN: No auth check for admin-only fields
    // Returns price history and internal notes to everyone
    const responseData: any = {
      ...artwork,
      // Internal notes - should only be visible to admins
      internalNotes: `Acquired from private collector. Auth verification: ${artwork.id.slice(0, 8)}. Reserve price: $${(artwork.price * 0.6).toFixed(2)}. Insurance value: $${(artwork.price * 1.5).toFixed(2)}.`,
      // Price history - admin only data
      priceHistory: [
        { date: '2024-01-15', price: artwork.price * 0.8, event: 'Initial listing' },
        { date: '2024-06-01', price: artwork.price * 0.9, event: 'Market adjustment' },
        { date: '2024-09-15', price: artwork.price, event: 'Current price' },
      ],
    };

    // If admin, add extra info
    if (user?.role === 'admin') {
      responseData.adminInfo = {
        flaggedBySystem: false,
        lastReviewDate: '2024-12-01',
        reviewerNotes: 'All clear. FLAG{4dm1n_fl4gs_v1ew} can be accessed via /api/admin/flags',
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    );
  }
}
