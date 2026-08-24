import { Database } from "better-sqlite3";

export interface DbUser {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export function getUserStatements(db: Database) {
  const getUserByEmailStmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const getUserByIdStmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const createUserStmt = db.prepare(`
    INSERT INTO users (id, name, email, passwordHash, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  return {
    getUserByEmail: (email: string): DbUser | undefined => {
      return getUserByEmailStmt.get(email.toLowerCase()) as DbUser | undefined;
    },
    getUserById: (id: string): DbUser | undefined => {
      return getUserByIdStmt.get(id) as DbUser | undefined;
    },
    createUser: (user: { id: string; name: string | null; email: string; passwordHash: string }): void => {
      createUserStmt.run(user.id, user.name, user.email.toLowerCase(), user.passwordHash, new Date().toISOString());
    },
  };
}
