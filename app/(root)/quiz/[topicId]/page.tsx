import { QuizRunner } from "@/components/quiz/QuizRunner";
import { TOPIC_CATEGORIES } from "@/constants/topics";
import { DifficultyLevel, QuizConfig } from "@/types/quiz";

interface QuizPageProps {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{
    difficulty?: string;
    count?: string;
    prompt?: string;
  }>;
}

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
  const { topicId } = await params;
  const query = await searchParams;

  const topicMeta = TOPIC_CATEGORIES.find((t) => t.id === topicId);
  const difficulty = (query.difficulty as DifficultyLevel) || topicMeta?.defaultDifficulty || "intermediate";
  const questionCount = query.count ? parseInt(query.count, 10) : 5;
  const isCustom = topicId === "custom";

  const config: QuizConfig = {
    topicId,
    topicTitle: isCustom ? "Custom Assessment" : topicMeta?.title || "Computer Science Assessment",
    difficulty,
    questionCount: isNaN(questionCount) ? 5 : Math.min(Math.max(questionCount, 1), 20),
    isCustomPrompt: isCustom,
    customPrompt: query.prompt ? decodeURIComponent(query.prompt) : "",
  };

  return (
    <div className="w-full">
      <QuizRunner config={config} />
    </div>
  );
}
