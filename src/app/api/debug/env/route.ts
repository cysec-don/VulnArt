import { NextResponse } from 'next/server';

// CTF VULN: Debug endpoint that leaks environment variables
export async function GET() {
  try {
    // Leaking various env vars - intentional CTF vulnerability
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DATABASE_URL: process.env.DATABASE_URL || 'not set',
      NEXT_PUBLIC_APP_NAME: 'Vuln Art Shop',
      NEXT_PUBLIC_VERSION: '1.0.0',
      SECRET_KEY: process.env.SECRET_KEY || 'vuln_art_secret_2024',
      ADMIN_EMAIL: 'mike@vulnart.shop',
      DEBUG_MODE: 'true',
      DB_TYPE: 'SQLite',
      API_VERSION: 'v1',
      // More leaks
      SMTP_HOST: 'smtp.vulnart.shop',
      SMTP_PORT: '587',
      SMTP_USER: 'noreply@vulnart.shop',
      SMTP_PASS: '********',
      FLAG: 'FLAG{d3bug_m0d3_l34k}',
    };

    return NextResponse.json({
      environment: envInfo,
      message: 'Debug mode is enabled. This endpoint should not be accessible in production.',
      hint: 'Check robots.txt for more hidden endpoints.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug endpoint error' },
      { status: 500 }
    );
  }
}
