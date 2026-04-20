import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';

// CTF: Login endpoint with REAL SQL injection vulnerability
// The username parameter is directly interpolated into a raw SQL query,
// making it vulnerable to classic authentication bypass:
//   Username: admin'--          (bypasses password check)
//   Username: ' OR '1'='1'--   (returns first user)
//   Username: ' UNION SELECT ... (data extraction)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // CTF VULNERABILITY: Raw SQL query with direct string interpolation
    // The username is placed directly into the SQL query without sanitization,
    // allowing classic SQL injection authentication bypass attacks.
    // A payload like: admin'--
    // transforms the query into: SELECT * FROM User WHERE username='admin'--' AND passwordHash='...'
    // which comments out the password check entirely.
    const sql = `SELECT id, username, email, "passwordHash", name, role, balance FROM User WHERE username='${username}'`;

    let user: any;
    try {
      const users = await db.$queryRawUnsafe(sql) as any[];

      if (!users || users.length === 0) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      user = users[0];

      // CTF: If the SQL injection has already bypassed the WHERE clause
      // (e.g., using ' OR '1'='1'--), the passwordHash might not match.
      // But if the attacker uses admin'--, they get the specific user
      // and can bypass the password check.
      // We still verify the password for legitimate logins.
      const isValid = await verifyPassword(password, user.passwordHash);

      if (!isValid) {
        // CTF: Log failed SQL injection attempts for the security log
        // If the username contains SQL-like patterns, record it
        if (username.includes("'") || username.includes("--") || username.includes("OR") || username.includes("UNION")) {
          await db.hiddenLog.create({
            data: {
              eventType: 'security',
              message: `SQL injection attempt detected on login: ${username}`,
              metadata: JSON.stringify({ username, timestamp: new Date().toISOString() }),
            },
          });

          // CTF: Verbose error message that helps attackers refine their injection
          return NextResponse.json(
            {
              error: 'Invalid credentials',
              hint: 'The username field may accept special characters. Try commenting out the rest of the query.',
              debug: 'Password verification failed but user was found',
            },
            { status: 401 }
          );
        }

        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } catch (sqlError: any) {
      // CTF: Error-based information disclosure on login SQL errors
      const errorMsg = sqlError?.message || 'Unknown error';

      // Log the SQL error for debugging (information disclosure)
      await db.hiddenLog.create({
        data: {
          eventType: 'error',
          message: `SQL error on login query`,
          metadata: JSON.stringify({ error: errorMsg, username }),
        },
      });

      return NextResponse.json({
        error: 'Login query failed',
        // CTF: Leak SQL error details to help with injection
        debug: errorMsg,
        hint: 'The login query uses raw SQL. The username parameter is vulnerable.',
        table: 'User',
        columns: ['id', 'username', 'email', 'passwordHash', 'name', 'role', 'balance'],
      }, { status: 500 });
    }

    // Create session
    const token = await createSession(user.id);

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        balance: user.balance,
      },
    });

    response.headers.set('Set-Cookie', setSessionCookie(token));
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
