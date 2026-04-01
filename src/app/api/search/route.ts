import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    // Search products using Prisma (safe backend query)
    const products = await db.product.findMany({
      where: q ? {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      } : undefined,
      take: 20,
    });

    // VULNERABLE: Reflect the raw query back as HTML - Reflected XSS!
    const html = `
      <div style="padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="color: #c9a96e; margin-bottom: 16px; font-size: 13px; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 11px; opacity: 0.7;">Search results for:</span>
          <strong style="color: #f5f0e8;">${q}</strong>
          <span style="color: #666; font-size: 11px;">(${products.length} found)</span>
        </div>
        <div style="display: grid; gap: 10px;">
          ${products.map((p: any) => `
            <div style="border: 1px solid rgba(201,169,110,0.15); border-radius: 10px; padding: 14px; background: rgba(201,169,110,0.03); transition: all 0.2s;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                  <div style="font-weight: 600; color: #f5f0e8; font-size: 14px;">${p.name}</div>
                  <div style="color: #888; font-size: 12px; margin-top: 4px; line-height: 1.4;">${p.description}</div>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="background: rgba(201,169,110,0.1); color: #c9a96e; padding: 3px 10px; border-radius: 6px; font-size: 11px; border: 1px solid rgba(201,169,110,0.15);">${p.category}</span>
                <span style="color: #c9a96e; font-weight: 700; font-size: 15px;">$${p.price.toLocaleString()}</span>
              </div>
            </div>
          `).join('')}
          ${products.length === 0 ? '<div style="color: #666; text-align: center; padding: 30px; font-size: 13px;">No artworks found matching your search.</div>' : ''}
        </div>
      </div>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Search failed: ' + error.message },
      { status: 500 }
    );
  }
}
