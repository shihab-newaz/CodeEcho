import { Database } from "better-sqlite3";
import { Question } from "@/types/quiz";

export interface DbQuestionRow {
  id: string;
  topicId: string;
  topicTitle: string;
  subtopic: string | null;
  type: string;
  difficulty: string;
  question: string;
  codeSnippet: string | null;
  language: string | null;
  optionsJson: string;
  correctAnswerIndex: number;
  explanation: string;
  keyTakeaway: string | null;
  createdAt: string;
}

export function getQuestionStatements(db: Database) {
  const getQuestionsByTopicStmt = db.prepare("SELECT * FROM questions WHERE topicId = ? ORDER BY RANDOM() LIMIT ?");
  const insertQuestionStmt = db.prepare(`
    INSERT OR IGNORE INTO questions (
      id, topicId, topicTitle, subtopic, type, difficulty,
      question, codeSnippet, language, optionsJson,
      correctAnswerIndex, explanation, keyTakeaway, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const mapRowToQuestion = (r: DbQuestionRow): Question => ({
    id: r.id,
    topicId: r.topicId,
    topicTitle: r.topicTitle,
    subtopic: r.subtopic || undefined,
    type: r.type as Question["type"],
    difficulty: r.difficulty as Question["difficulty"],
    question: r.question,
    codeSnippet: r.codeSnippet || undefined,
    language: r.language || undefined,
    options: JSON.parse(r.optionsJson),
    correctAnswerIndex: r.correctAnswerIndex,
    explanation: r.explanation,
    keyTakeaway: r.keyTakeaway || undefined,
  });

  const insertMany = db.transaction((questions: Question[]) => {
    for (const q of questions) {
      insertQuestionStmt.run(
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

  return {
    getQuestionsByTopic: (topicId: string, limit: number = 5): Question[] => {
      const rows = getQuestionsByTopicStmt.all(topicId, limit) as DbQuestionRow[];
      return rows.map(mapRowToQuestion);
    },
    saveQuestions: (questions: Question[]): void => {
      insertMany(questions);
    },
  };
}
