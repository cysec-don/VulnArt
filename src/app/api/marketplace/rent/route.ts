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
    const { artworkId, days } = body;

    if (!artworkId || !days) {
      return NextResponse.json(
        { error: 'Artwork ID and rental days are required' },
        { status: 400 }
      );
    }

    // CTF VULN: No validation on days parameter
    // Can set days > 365, negative days, etc.
    const rentalDays = Number(days);

    const artwork = await db.artwork.findUnique({
      where: { id: artworkId },
    });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    if (!artwork.isForRent) {
      return NextResponse.json(
        { error: 'Artwork is not available for rent' },
        { status: 400 }
      );
    }

    const amount = artwork.rentPrice * rentalDays;

    if (user.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Check if days > 365 — CTF flag trigger
    if (rentalDays > 365) {
      // Record this as a flag-worthy event
      await db.hiddenLog.create({
        data: {
          eventType: 'flag',
          message: `User ${user.username} rented for ${rentalDays} days - FLAG{r3nt_t1m3_tr4v3l3r}`,
          metadata: JSON.stringify({ userId: user.id, days: rentalDays }),
        },
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + rentalDays * 24 * 60 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: { balance: { decrement: amount } },
    });

    const rental = await db.rental.create({
      data: {
        userId: user.id,
        artworkId,
        amount,
        startDate,
        endDate,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: 'Rental successful',
      rental: {
        id: rental.id,
        amount: rental.amount,
        startDate: rental.startDate,
        endDate: rental.endDate,
        days: rentalDays,
      },
      // CTF: Leak flag if days > 365
      ...(rentalDays > 365 ? { hint: 'FLAG{r3nt_t1m3_tr4v3l3r}' } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Rental failed' },
      { status: 500 }
    );
  }
}
