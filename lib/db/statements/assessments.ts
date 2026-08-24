import { Database } from "better-sqlite3";
import { QuizResult } from "@/types/quiz";

export function getAssessmentStatements(db: Database) {
  const saveAssessmentStmt = db.prepare(`
    INSERT INTO assessments (
      id, userId, topicId, topicTitle, difficulty,
      score, totalQuestions, totalTimeSeconds, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const getUserAssessmentsStmt = db.prepare(`
    SELECT * FROM assessments WHERE userId = ? ORDER BY createdAt DESC
  `);

  return {
    saveAssessment: (userId: string, result: QuizResult): void => {
      saveAssessmentStmt.run(
        crypto.randomUUID(),
        userId,
        result.topicId,
        result.topicTitle,
        result.difficulty,
        result.correctAnswers,
        result.totalQuestions,
        result.totalTimeSeconds,
        new Date().toISOString()
      );
    },
    getUserAssessments: (userId: string) => {
      return getUserAssessmentsStmt.all(userId);
    },
  };
}
