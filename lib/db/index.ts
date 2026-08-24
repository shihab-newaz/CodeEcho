import Database from "better-sqlite3";
import path from "path";
import { Question } from "@/types/quiz";

const dbPath = path.join(process.cwd(), "dev_assess.db");

let dbInstance: Database.Database | null = null;

const INITIAL_DB_SEEDS: Question[] = [
  {
    id: "seed-js-1",
    topicId: "js-output",
    topicTitle: "JavaScript / TypeScript Snippets",
    type: "code_output",
    difficulty: "intermediate",
    question: "What will be printed to the console when the following code runs?",
    codeSnippet: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');`,
    language: "javascript",
    options: ["1, 2, 3, 4", "1, 4, 2, 3", "1, 4, 3, 2", "1, 3, 4, 2"],
    correctAnswerIndex: 2,
    explanation: "Synchronous code runs first (1, 4). Microtasks from Promise.resolve() execute before the next macrotask (3). Finally, the setTimeout macrotask runs (2).",
    keyTakeaway: "Microtasks (Promises) execute before Macrotasks (setTimeout, setInterval).",
  },
  {
    id: "seed-js-2",
    topicId: "js-output",
    topicTitle: "JavaScript / TypeScript Snippets",
    type: "code_output",
    difficulty: "intermediate",
    question: "What is the output of the following function invocation?",
    codeSnippet: `const numbers = [1, 2, 3, 4];

const result = numbers.map(num => {
  if (num > 2) return num * 2;
});

console.log(result);`,
    language: "javascript",
    options: ["[6, 8]", "[undefined, undefined, 6, 8]", "[null, null, 6, 8]", "[0, 0, 6, 8]"],
    correctAnswerIndex: 1,
    explanation: "Array.prototype.map returns an array of the same length as the original. Branch without an explicit return defaults to undefined.",
    keyTakeaway: "Use .filter() before .map() or .flatMap() to omit elements without leaving undefined slots.",
  },
  {
    id: "seed-dsa-1",
    topicId: "dsa",
    topicTitle: "Data Structures & Algorithms",
    type: "mcq",
    difficulty: "intermediate",
    question: "What is the worst-case time complexity of searching in an unbalanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswerIndex: 2,
    explanation: "When elements are inserted in sorted order, an unbalanced BST degenerates into a singly linked list with depth n, requiring O(n) worst-case search.",
    keyTakeaway: "Self-balancing trees (AVL, Red-Black) guarantee O(log n) search by performing tree rotations.",
  },
  {
    id: "seed-dsa-2",
    topicId: "dsa",
    topicTitle: "Data Structures & Algorithms",
    type: "mcq",
    difficulty: "intermediate",
    question: "Which data structure is typically used to implement Breadth-First Search (BFS) in a graph?",
    options: ["Stack", "Queue", "Priority Queue", "Min-Heap"],
    correctAnswerIndex: 1,
    explanation: "BFS explores nodes level by level using a FIFO (First-In, First-Out) Queue. In contrast, DFS uses a LIFO Stack or recursive call stack.",
    keyTakeaway: "Queues enforce level-order FIFO traversal in graph and tree breadth-first searches.",
  },
  {
    id: "seed-networks-1",
    topicId: "networks",
    topicTitle: "Computer Networks",
    type: "mcq",
    difficulty: "intermediate",
    question: "Which layer of the OSI model is responsible for end-to-end communication, flow control, and error recovery (e.g. TCP)?",
    options: ["Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Data Link Layer (Layer 2)", "Session Layer (Layer 5)"],
    correctAnswerIndex: 1,
    explanation: "The Transport Layer (Layer 4) manages host-to-host communications, segmentation, flow control, and reliability (TCP).",
    keyTakeaway: "Layer 3 handles IP routing across networks; Layer 4 handles process-to-process transport and reliability.",
  },
  {
    id: "seed-databases-1",
    topicId: "databases",
    topicTitle: "Databases & SQL Theory",
    type: "mcq",
    difficulty: "intermediate",
    question: "In relational database ACID properties, what does 'Isolation' guarantee?",
    options: [
      "Transactions survive system crashes permanently",
      "Concurrent transactions execute without interfering with one another",
      "All foreign key constraints remain valid",
      "Either all operations in a transaction complete or none do",
    ],
    correctAnswerIndex: 1,
    explanation: "Isolation ensures that intermediate states of concurrent transactions are invisible to one another, preventing dirty reads and race conditions.",
    keyTakeaway: "Isolation levels (Read Committed, Repeatable Read, Serializable) balance concurrency with anomaly prevention.",
  },
  {
    id: "seed-oop-1",
    topicId: "oop",
    topicTitle: "OOP & System Design Patterns",
    type: "mcq",
    difficulty: "intermediate",
    question: "In SOLID principles, what does the 'L' (Liskov Substitution Principle) state?",
    options: [
      "A class should only have one reason to change",
      "Subtypes must be substitutable for their base types without altering program correctness",
      "Software entities should be open for extension but closed for modification",
      "High-level modules should not depend on low-level modules",
    ],
    correctAnswerIndex: 1,
    explanation: "LSP guarantees that subclasses honor the contracts and preconditions/postconditions of their base classes without unexpected side effects.",
    keyTakeaway: "Subclasses must maintain the behavioral invariants established by their parent classes.",
  },
];

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

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        topicId TEXT NOT NULL,
        topicTitle TEXT NOT NULL,
        subtopic TEXT,
        type TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        question TEXT NOT NULL,
        codeSnippet TEXT,
        language TEXT,
        optionsJson TEXT NOT NULL,
        correctAnswerIndex INTEGER NOT NULL,
        explanation TEXT NOT NULL,
        keyTakeaway TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    // Seed database if questions table is empty
    const countRow = dbInstance.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
    if (countRow.count === 0) {
      const insertStmt = dbInstance.prepare(`
        INSERT INTO questions (
          id, topicId, topicTitle, subtopic, type, difficulty,
          question, codeSnippet, language, optionsJson,
          correctAnswerIndex, explanation, keyTakeaway, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertMany = dbInstance.transaction((questions: Question[]) => {
        for (const q of questions) {
          insertStmt.run(
            q.id,
            q.topicId,
            q.topicTitle,
            q.subtopic || null,
            q.type,
            q.difficulty,
            q.question,
            q.codeSnippet || null,
            q.language || null,
            JSON.stringify(q.options),
            q.correctAnswerIndex,
            q.explanation,
            q.keyTakeaway || null,
            new Date().toISOString()
          );
        }
      });

      insertMany(INITIAL_DB_SEEDS);
    }
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

export function getQuestionsFromDb(topicId: string, limit: number = 5): Question[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM questions WHERE topicId = ? ORDER BY RANDOM() LIMIT ?").all(topicId, limit) as any[];

  return rows.map((r) => ({
    id: r.id,
    topicId: r.topicId,
    topicTitle: r.topicTitle,
    subtopic: r.subtopic,
    type: r.type,
    difficulty: r.difficulty,
    question: r.question,
    codeSnippet: r.codeSnippet || undefined,
    language: r.language || undefined,
    options: JSON.parse(r.optionsJson),
    correctAnswerIndex: r.correctAnswerIndex,
    explanation: r.explanation,
    keyTakeaway: r.keyTakeaway || undefined,
  }));
}

export function saveQuestionsToDb(questions: Question[]): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO questions (
      id, topicId, topicTitle, subtopic, type, difficulty,
      question, codeSnippet, language, optionsJson,
      correctAnswerIndex, explanation, keyTakeaway, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items: Question[]) => {
    for (const q of items) {
      stmt.run(
        q.id,
        q.topicId,
        q.topicTitle,
        q.subtopic || null,
        q.type,
        q.difficulty,
        q.question,
        q.codeSnippet || null,
        q.language || null,
        JSON.stringify(q.options),
        q.correctAnswerIndex,
        q.explanation,
        q.keyTakeaway || null,
        new Date().toISOString()
      );
    }
  });

  insertMany(questions);
}
