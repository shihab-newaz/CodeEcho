import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { getUserStatements, DbUser } from "./statements/users";
import { getTopicStatements } from "./statements/topics";
import { getQuestionStatements } from "./statements/questions";
import { getAssessmentStatements } from "./statements/assessments";
import { Question, QuizResult, TopicCategory } from "@/types/quiz";

const dbPath = path.join(process.cwd(), "dev_assess.db");

let dbInstance: Database.Database | null = null;
let userStatements: ReturnType<typeof getUserStatements> | null = null;
let topicStatements: ReturnType<typeof getTopicStatements> | null = null;
let questionStatements: ReturnType<typeof getQuestionStatements> | null = null;
let assessmentStatements: ReturnType<typeof getAssessmentStatements> | null = null;

function runMigrations(db: Database.Database) {
  const migrationsDir = path.join(process.cwd(), "lib", "db", "migrations");
  
  // Create migrations tracker table
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      appliedAt TEXT NOT NULL
    );
  `);

  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    for (const file of files) {
      const alreadyApplied = db.prepare("SELECT 1 FROM _migrations WHERE id = ?").get(file);
      if (!alreadyApplied) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
        db.exec(sql);
        db.prepare("INSERT INTO _migrations (id, appliedAt) VALUES (?, ?)").run(file, new Date().toISOString());
      }
    }
  }
}

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    dbInstance.pragma("journal_mode = WAL");
    runMigrations(dbInstance);

    userStatements = getUserStatements(dbInstance);
    topicStatements = getTopicStatements(dbInstance);
    questionStatements = getQuestionStatements(dbInstance);
    assessmentStatements = getAssessmentStatements(dbInstance);
  }
  return dbInstance;
}

// User Helpers
export { type DbUser };
export function getUserByEmail(email: string): DbUser | undefined {
  getDb();
  return userStatements!.getUserByEmail(email);
}
export function getUserById(id: string): DbUser | undefined {
  getDb();
  return userStatements!.getUserById(id);
}
export function createUser(user: { id: string; name: string | null; email: string; passwordHash: string }): void {
  getDb();
  userStatements!.createUser(user);
}

// Topic Helpers
export function getAllTopicsFromDb(): TopicCategory[] {
  getDb();
  return topicStatements!.getAllTopics();
}
export function getTopicByIdFromDb(id: string): TopicCategory | undefined {
  getDb();
  return topicStatements!.getTopicById(id);
}
export function getTopicsByCategoryFromDb(category: "cs_basics" | "code_snippets"): TopicCategory[] {
  getDb();
  return topicStatements!.getTopicsByCategory(category);
}

// Question Helpers
export function getQuestionsFromDb(topicId: string, limit: number = 5): Question[] {
  getDb();
  return questionStatements!.getQuestionsByTopic(topicId, limit);
}
export function saveQuestionsToDb(questions: Question[]): void {
  getDb();
  questionStatements!.saveQuestions(questions);
}

// Assessment Helpers
export function saveAssessmentToDb(userId: string, result: QuizResult): void {
  getDb();
  assessmentStatements!.saveAssessment(userId, result);
}
export function getUserAssessmentsFromDb(userId: string) {
  getDb();
  return assessmentStatements!.getUserAssessments(userId);
}
