import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const comments = await db.comment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // VULNERABLE: Return comments as HTML with unsanitized content - Stored XSS!
    const html = `
      <div style="padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="color: #c9a96e; margin-bottom: 16px; font-size: 13px; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 15px;">★</span>
          <strong style="color: #f5f0e8;">Collector Reviews</strong>
          <span style="color: #666; font-size: 11px;">(${comments.length} reviews)</span>
        </div>
        <div style="display: grid; gap: 10px;">
          ${comments.map((c: any) => `
            <div style="border: 1px solid rgba(201,169,110,0.15); border-radius: 10px; padding: 14px; background: rgba(201,169,110,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(201,169,110,0.15); display: flex; align-items: center; justify-content: center; color: #c9a96e; font-weight: 700; font-size: 12px;">${c.author?.[0]?.toUpperCase() || '?'}</div>
                  <span style="color: #c9a96e; font-weight: 600; font-size: 13px;">${c.author}</span>
                </div>
                <span style="color: #555; font-size: 11px;">${new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div style="color: #ccc; font-size: 13px; line-height: 1.5;">${c.content}</div>
            </div>
          `).join('')}
          ${comments.length === 0 ? '<div style="color: #666; text-align: center; padding: 30px; font-size: 13px;">No reviews yet. Be the first to share your thoughts!</div>' : ''}
        </div>
      </div>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to load reviews: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { author, content } = await request.json();

    if (!author || !content) {
      return NextResponse.json(
        { error: 'Author and content are required' },
        { status: 400 }
      );
    }

    // VULNERABLE: No sanitization - Stored XSS!
    const comment = await db.comment.create({
      data: { author, content },
    });

    return NextResponse.json({
      success: true,
      message: 'Review posted!',
      comment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to post review: ' + error.message },
      { status: 500 }
    );
  }
}
