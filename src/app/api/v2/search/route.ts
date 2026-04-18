import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// CTF: Search with potential SQL-like behavior
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q) {
      return NextResponse.json({ results: [], query: '' });
    }

    // Search artworks with the query
    let results;
    try {
      results = await db.artwork.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { artist: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 50,
      });
    } catch {
      // CTF: If the query causes an error, leak table info
      return NextResponse.json({
        error: 'Search query failed',
        query: q,
        hint: 'The search might be vulnerable to injection-like patterns. Try special characters.',
        debugInfo: {
          table: 'Artwork',
          columns: ['id', 'title', 'artist', 'description', 'category', 'price', 'rentPrice', 'image', 'isForSale', 'isForRent', 'isForAuction'],
          database: 'SQLite',
          flag: 'FLAG{sql_qu3ry_m4st3r}',
        },
      });
    }

    return NextResponse.json({
      results,
      query: q,
      count: results.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed', query: '' },
      { status: 500 }
    );
  }
}
