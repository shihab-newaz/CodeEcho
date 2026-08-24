import { Database } from "better-sqlite3";
import { TopicCategory, DifficultyLevel } from "@/types/quiz";

export interface DbTopicRow {
  id: string;
  title: string;
  description: string;
  category: "cs_basics" | "code_snippets";
  iconName: string;
  defaultDifficulty: DifficultyLevel;
  subtopicsJson: string;
  createdAt: string;
}

export function getTopicStatements(db: Database) {
  const getAllTopicsStmt = db.prepare("SELECT * FROM topics ORDER BY category, id");
  const getTopicByIdStmt = db.prepare("SELECT * FROM topics WHERE id = ?");
  const getTopicsByCategoryStmt = db.prepare("SELECT * FROM topics WHERE category = ? ORDER BY id");

  const mapRowToTopic = (r: DbTopicRow): TopicCategory => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    iconName: r.iconName,
    defaultDifficulty: r.defaultDifficulty,
    subtopics: JSON.parse(r.subtopicsJson || "[]"),
  });

  return {
    getAllTopics: (): TopicCategory[] => {
      const rows = getAllTopicsStmt.all() as DbTopicRow[];
      return rows.map(mapRowToTopic);
    },
    getTopicById: (id: string): TopicCategory | undefined => {
      const row = getTopicByIdStmt.get(id) as DbTopicRow | undefined;
      return row ? mapRowToTopic(row) : undefined;
    },
    getTopicsByCategory: (category: "cs_basics" | "code_snippets"): TopicCategory[] => {
      const rows = getTopicsByCategoryStmt.all(category) as DbTopicRow[];
      return rows.map(mapRowToTopic);
    },
  };
}
