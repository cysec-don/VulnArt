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
    const { artworkId } = body;

    if (!artworkId) {
      return NextResponse.json(
        { error: 'Artwork ID is required' },
        { status: 400 }
      );
    }

    const artwork = await db.artwork.findUnique({
      where: { id: artworkId },
    });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    if (!artwork.isForSale) {
      return NextResponse.json(
        { error: 'Artwork is not for sale' },
        { status: 400 }
      );
    }

    // Check if already purchased
    const existingPurchase = await db.purchase.findFirst({
      where: { artworkId },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Artwork has already been purchased' },
        { status: 400 }
      );
    }

    if (user.balance < artwork.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Deduct balance and create purchase
    await db.user.update({
      where: { id: user.id },
      data: { balance: { decrement: artwork.price } },
    });

    const purchase = await db.purchase.create({
      data: {
        userId: user.id,
        artworkId,
        amount: artwork.price,
      },
    });

    return NextResponse.json({
      message: 'Purchase successful',
      purchase: {
        id: purchase.id,
        amount: purchase.amount,
        createdAt: purchase.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Purchase failed' },
      { status: 500 }
    );
  }
}
