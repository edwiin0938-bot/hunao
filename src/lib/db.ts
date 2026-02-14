import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'kanban.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS experiments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
      owner TEXT,
      start_date TEXT,
      end_date TEXT,
      revenue_signal TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_status ON experiments(status);
    CREATE INDEX IF NOT EXISTS idx_created ON experiments(created_at);
  `);
}

export type Experiment = {
  id: number;
  name: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  owner: string | null;
  start_date: string | null;
  end_date: string | null;
  revenue_signal: string | null;
  created_at: string;
  updated_at: string;
};
