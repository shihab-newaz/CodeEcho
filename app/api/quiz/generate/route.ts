import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/llm/generator";
import { QuizConfig } from "@/types/quiz";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config: QuizConfig = {
      topicId: body.topicId || "dsa",
      topicTitle: body.topicTitle || "Data Structures & Algorithms",
      difficulty: body.difficulty || "intermediate",
      questionCount: body.questionCount ? Math.min(Math.max(body.questionCount, 1), 20) : 5,
      isCustomPrompt: Boolean(body.isCustomPrompt),
      customPrompt: body.customPrompt || "",
    };

    const questions = await generateQuizQuestions(config);
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}
