export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type QuestionType = "mcq" | "code_output";

export interface Question {
  id: string;
  topicId: string;
  topicTitle: string;
  subtopic?: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  codeSnippet?: string;
  language?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  keyTakeaway?: string;
}

export interface QuizConfig {
  topicId: string;
  topicTitle: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  isCustomPrompt?: boolean;
  customPrompt?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizResult {
  topicId: string;
  topicTitle: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  totalTimeSeconds: number;
  answers: UserAnswer[];
  questions: Question[];
}

export interface TopicCategory {
  id: string;
  title: string;
  description: string;
  category: "cs_basics" | "code_snippets";
  iconName: string;
  defaultDifficulty: DifficultyLevel;
  subtopics: string[];
}
