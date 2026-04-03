import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Derive the database path from DATABASE_URL to stay in sync with Prisma
function getDbPath(): string {
  const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db';
  // Handle both file: and file:// formats
  let filePath = dbUrl.replace(/^file:\/\//, '').replace(/^file:/, '');
  // If relative, resolve from project root
  if (!path.isAbsolute(filePath)) {
    filePath = path.join(process.cwd(), filePath);
  }
  // Ensure the directory exists
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  return filePath;
}

// Global singleton to survive hot-reloads in development
const globalForDb = globalThis as unknown as {
  _rawDb: Database.Database | undefined;
};

export function getRawDb(): Database.Database {
  if (!globalForDb._rawDb) {
    const dbPath = getDbPath();
    globalForDb._rawDb = new Database(dbPath, { readonly: false });
  }
  return globalForDb._rawDb;
}
