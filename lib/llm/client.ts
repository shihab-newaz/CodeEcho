export const OPENROUTER_MODELS = [
  "qwen/qwen-2.5-coder-32b-instruct",
  "meta-llama/llama-3.3-70b-instruct",
  "meta-llama/llama-3.1-8b-instruct",
  "google/gemini-2.0-flash-001",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
];

export async function callOpenRouterCompletion({
  messages,
  preferredModel,
  temperature = 0.3,
  responseFormat,
}: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  preferredModel?: string;
  temperature?: number;
  responseFormat?: { type: "json_object" };
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "";
  const modelsToTry = [
    preferredModel,
    ...OPENROUTER_MODELS.filter((m) => m !== preferredModel),
  ].filter(Boolean) as string[];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "DevQuiz AI",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          ...(responseFormat ? { response_format: responseFormat } : {}),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`OpenRouter model ${model} returned ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && typeof content === "string") {
        return content;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Error trying model ${model}:`, err.message);
    }
  }

  throw lastError || new Error("Failed to get response from OpenRouter models.");
}
