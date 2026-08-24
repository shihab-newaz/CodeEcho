CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  iconName TEXT NOT NULL,
  defaultDifficulty TEXT NOT NULL,
  subtopicsJson TEXT NOT NULL,
  createdAt TEXT NOT NULL
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
  createdAt TEXT NOT NULL,
  FOREIGN KEY (topicId) REFERENCES topics(id)
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
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (topicId) REFERENCES topics(id)
);
