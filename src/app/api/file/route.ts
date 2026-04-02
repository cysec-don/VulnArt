import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'File parameter is required' },
        { status: 400 }
      );
    }

    // VULNERABLE: Path traversal - no sanitization!
    const logDir = path.join(process.cwd(), 'logs');
    const filePath = path.join(logDir, file);

    // Only resolve - no check for path traversal!
    const resolvedPath = path.resolve(filePath);

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json(
        { error: `File not found: ${file}` },
        { status: 404 }
      );
    }

    if (!fs.statSync(resolvedPath).isFile()) {
      return NextResponse.json(
        { error: 'Not a file' },
        { status: 400 }
      );
    }

    const content = fs.readFileSync(resolvedPath, 'utf-8');

    return NextResponse.json({
      success: true,
      file: file,
      path: resolvedPath,
      content: content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read file: ' + error.message },
      { status: 500 }
    );
  }
}
