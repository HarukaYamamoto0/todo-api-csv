import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'tasks.db');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, {recursive: true});

export const db = new Database(DB_FILE, {
    fileMustExist: false,
    verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
