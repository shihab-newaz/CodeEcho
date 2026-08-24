import { TopicSelector } from "@/components/quiz/TopicSelector";
import { getAllTopicsFromDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const topics = getAllTopicsFromDb();

  return (
    <main className="w-full">
      <TopicSelector topics={topics} />
    </main>
  );
}
