import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/llm/generator";
import { QuizConfig } from "@/types/quiz";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.prompt || typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Prompt is required for custom questionnaire generation." },
        { status: 400 }
      );
    }

    const config: QuizConfig = {
      topicId: "custom",
      topicTitle: body.title || "Custom Assessment",
      difficulty: body.difficulty || "intermediate",
      questionCount: body.questionCount ? Math.min(Math.max(body.questionCount, 1), 20) : 5,
      isCustomPrompt: true,
      customPrompt: body.prompt.trim(),
    };

    const questions = await generateQuizQuestions(config);
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate custom questions" },
      { status: 500 }
    );
  }
}
