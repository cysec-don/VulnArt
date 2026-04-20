import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// CTF: Search endpoint with REAL SQL injection vulnerability
// The search parameter is directly interpolated into a raw SQL query
// using $queryRawUnsafe, making it vulnerable to:
//   - UNION-based injection (extract data from other tables)
//   - Error-based injection (leak table/column names)
//   - Authentication bypass via login endpoint
//
// To exploit: /api/v2/search?q=' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11 FROM HiddenLog--
// Flag: FLAG{sql_qu3ry_m4st3r}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q) {
      return NextResponse.json({ results: [], query: '' });
    }

    // CTF VULNERABILITY: Direct string interpolation into SQL query
    // This is intentionally vulnerable - user input goes directly into the query
    // without parameterization or sanitization
    const sql = `SELECT id, title, artist, description, category, price, "rentPrice", image, "isForSale", "isForRent", "isForAuction" FROM Artwork WHERE title LIKE '%${q}%' OR artist LIKE '%${q}%' OR description LIKE '%${q}%' OR category LIKE '%${q}%'`;

    try {
      const results = await db.$queryRawUnsafe(sql);

      // CTF: Check if the query results contain flag indicators from UNION injection
      // If the user successfully UNION-injects into HiddenLog, the results
      // will contain flag-related data
      const resultsArray = results as any[];
      const flagHint = resultsArray.some((r: any) =>
        (r.description && typeof r.description === 'string' && r.description.includes('FLAG{')) ||
        (r.artist && typeof r.artist === 'string' && r.artist.includes('FLAG{')) ||
        (r.title && typeof r.title === 'string' && r.title.includes('FLAG{'))
      );

      return NextResponse.json({
        results: resultsArray,
        query: q,
        count: resultsArray.length,
        // CTF: Leak flag when SQL injection successfully extracts data from other tables
        ...(flagHint ? { bonus: 'FLAG{sql_qu3ry_m4st3r}', message: 'You successfully extracted hidden data via SQL injection!' } : {}),
      });
    } catch (sqlError: any) {
      // CTF: Error-based information disclosure - leak database structure on SQL errors
      // This reveals table names, column names, and database type to aid injection
      const errorMsg = sqlError?.message || 'Unknown error';

      return NextResponse.json({
        error: 'Search query failed',
        query: q,
        // CTF: Verbose error messages leak database schema information
        debugInfo: {
          database: 'SQLite',
          error: errorMsg,
          // Hint about the schema to guide injection attempts
          hint: 'Try UNION SELECT with these columns: id, title, artist, description, category, price, rentPrice, image, isForSale, isForRent, isForAuction',
          tables: ['Artwork', 'User', 'Session', 'Purchase', 'Rental', 'Auction', 'Bid', 'FlagSubmission', 'HiddenLog'],
          vulnerableParameter: 'q',
          injectionType: 'UNION-based / Error-based',
        },
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed', query: '' },
      { status: 500 }
    );
  }
}
