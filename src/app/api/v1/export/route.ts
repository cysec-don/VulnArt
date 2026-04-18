import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// CTF: Data export endpoint - leaks user and artwork data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    if (format !== 'json') {
      return NextResponse.json(
        { error: 'Only JSON format is supported' },
        { status: 400 }
      );
    }

    const [users, artworks] = await Promise.all([
      db.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          balance: true,
          createdAt: true,
        },
      }),
      db.artwork.findMany({
        select: {
          id: true,
          title: true,
          artist: true,
          category: true,
          price: true,
          isForAuction: true,
        },
      }),
    ]);

    return NextResponse.json({
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      data: { users, artworks },
      hint: 'FLAG{exp0rt_d4t4_br34ch}',
      _meta: {
        source: 'Vuln Art Shop Data Export',
        generatedBy: 'v1/export API',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
