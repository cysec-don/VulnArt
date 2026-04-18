import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { artist: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [artworks, total] = await Promise.all([
      db.artwork.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          auctions: {
            where: { isActive: true },
            take: 1,
          },
        },
      }),
      db.artwork.count({ where }),
    ]);

    return NextResponse.json({
      artworks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}
