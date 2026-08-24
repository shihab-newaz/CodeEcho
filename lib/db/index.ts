import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "dev_assess.db");

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    dbInstance.pragma("journal_mode = WAL");

    // Initialize tables
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        topicId TEXT NOT NULL,
        topicTitle TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        score INTEGER NOT NULL,
        totalQuestions INTEGER NOT NULL,
        totalTimeSeconds INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);
  }
  return dbInstance;
}

export interface DbUser {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export function getUserByEmail(email: string): DbUser | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email.toLowerCase()) as DbUser | undefined;
}

export function getUserById(id: string): DbUser | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) as DbUser | undefined;
}

export function createUser(user: {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
}): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, passwordHash, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(user.id, user.name, user.email.toLowerCase(), user.passwordHash, new Date().toISOString());
}
