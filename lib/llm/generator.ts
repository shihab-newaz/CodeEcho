import { callOpenRouterCompletion } from "./client";
import { Question, QuestionType, QuizConfig } from "@/types/quiz";
import { getQuestionsFromDb, saveQuestionsToDb, getTopicByIdFromDb } from "@/lib/db";

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export async function generateQuizQuestions(config: QuizConfig): Promise<Question[]> {
  const topicMeta = getTopicByIdFromDb(config.topicId);
  const topicTitle = config.topicTitle || topicMeta?.title || "Computer Science";
  const isCodeOutput = topicMeta?.category === "code_snippets" || config.topicId.includes("output");
  const qType: QuestionType = isCodeOutput ? "code_output" : "mcq";

  const preferredModel = isCodeOutput
    ? "qwen/qwen-2.5-coder-32b-instruct"
    : "meta-llama/llama-3.3-70b-instruct";

  const systemPrompt = `You are a world-class principal software engineer and CS interviewer.
Generate realistic, precise, high-craft technical assessment questions for developers.
Always respond in strictly valid JSON format matching the schema below without any extra markdown wrapping or chat pleasantries.

JSON Schema format:
{
  "questions": [
    {
      "id": "string",
      "type": "${qType}",
      "difficulty": "${config.difficulty}",
      "question": "Clear problem statement or question",
      ${isCodeOutput ? '"codeSnippet": "clean formatted code snippet here without backticks",' : ""}
      ${isCodeOutput ? '"language": "javascript" | "python" | "sql" | "typescript",' : ""}
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Concise technical explanation of why the correct answer is correct and why edge cases behave this way.",
      "keyTakeaway": "1-sentence engineering rule or mental model."
    }
  ]
}`;

  const userPrompt = config.isCustomPrompt && config.customPrompt
    ? `Generate ${config.questionCount} ${config.difficulty}-level technical questions based on this prompt/syllabus:
"${config.customPrompt}".
Make sure there are exactly 4 plausible options for each question, with strictly one correct answer.`
    : `Generate ${config.questionCount} distinct, high-quality ${config.difficulty}-level assessment questions for topic: "${topicTitle}".
Subtopics to cover: ${topicMeta?.subtopics?.join(", ") || "core concepts"}.
${
  isCodeOutput
    ? "Each question MUST have a realistic code snippet testing tricky runtime behavior, event loop, scoping, mutability, closures, or query semantics with 'What will be the output?' style question."
    : "Questions should test deep conceptual understanding, trade-offs, protocols, algorithms, or system design fundamentals (no trivial definitions)."
}
Make sure each question has exactly 4 distinct, believable options (indices 0 to 3) with exactly one correct answer.`;

  try {
    const rawOutput = await callOpenRouterCompletion({
      preferredModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      responseFormat: { type: "json_object" },
    });

    const parsed = JSON.parse(cleanJsonString(rawOutput));
    const rawList = parsed.questions || parsed;
    if (Array.isArray(rawList)) {
      const questions: Question[] = rawList.map((q: any, idx: number) => ({
        id: q.id || `${config.topicId}-${Date.now()}-${idx}`,
        topicId: config.topicId,
        topicTitle,
        subtopic: q.subtopic,
        type: qType,
        difficulty: config.difficulty,
        question: q.question || "Technical question",
        codeSnippet: q.codeSnippet,
        language: q.language || (isCodeOutput ? "javascript" : undefined),
        options: Array.isArray(q.options) && q.options.length >= 4 ? q.options.slice(0, 4) : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswerIndex: typeof q.correctAnswerIndex === "number" ? q.correctAnswerIndex : 0,
        explanation: q.explanation || "",
        keyTakeaway: q.keyTakeaway || "",
      }));

      if (questions.length > 0) {
        // Save to SQLite database
        try {
          saveQuestionsToDb(questions);
        } catch (dbErr) {
          console.warn("Could not cache questions in SQLite:", dbErr);
        }
        return questions.slice(0, config.questionCount);
      }
    }
  } catch (error) {
    console.error("LLM Generation error, retrieving questions from SQLite db seed:", error);
  }

  // Fallback to SQLite DB seed questions
  const dbQuestions = getQuestionsFromDb(config.topicId, config.questionCount);
  if (dbQuestions.length >= config.questionCount) {
    return dbQuestions.slice(0, config.questionCount);
  }

  const fallbackQuestion: Question = {
    id: `${config.topicId}-fallback-${Date.now()}`,
    topicId: config.topicId,
    topicTitle,
    type: qType,
    difficulty: config.difficulty,
    question: `Which of the following is a primary characteristic of ${topicTitle}?`,
    options: [
      "Provides predictable algorithmic guarantees and deterministic runtime behavior",
      "Executes asynchronously by bypassing OS memory management",
      "Disables type checking at runtime automatically",
      "Requires manual garbage collection in all runtimes",
    ],
    correctAnswerIndex: 0,
    explanation: `${topicTitle} is designed around formal properties and predictable performance guarantees.`,
    keyTakeaway: "Core engineering principles rely on deterministic runtime invariants.",
  };

  return [...dbQuestions, fallbackQuestion].slice(0, config.questionCount);
}
