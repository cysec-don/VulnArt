import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'custom.db');

let _db: Database.Database | null = null;

export function getRawDb(): Database.Database {
  if (!_db) {
    _db = new Database(dbPath, { readonly: false });
  }
  return _db;
}
