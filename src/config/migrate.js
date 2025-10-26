import { db } from './db.js';

const MIGRATIONS = [
    `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
  `,
    `CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);`,
];

export const applyMigrations = () =>
    db.transaction(() => MIGRATIONS.forEach((sql) => db.exec(sql)))();

if (import.meta.url === `file://${process.argv[1]}`) {
    applyMigrations();
    console.log('✅ Migrations applied.');
}
