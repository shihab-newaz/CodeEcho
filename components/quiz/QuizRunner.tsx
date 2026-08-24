"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Question, QuizConfig, QuizResult, UserAnswer } from "@/types/quiz";
import { QuizResults } from "./QuizResults";
import { ArrowLeft, ArrowRight, Check, Clock, Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface QuizRunnerProps {
  config: QuizConfig;
}

export function QuizRunner({ config }: QuizRunnerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch Questions
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = config.isCustomPrompt ? "/api/quiz/custom" : "/api/quiz/generate";
      const payload = config.isCustomPrompt
        ? { prompt: config.customPrompt, difficulty: config.difficulty, questionCount: config.questionCount }
        : config;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Server returned ${res.status}`);
      }

      if (!res.ok || !data.success || !data.questions || data.questions.length === 0) {
        throw new Error(data?.error || "Failed to load questions from assessment engine.");
      }

      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message || "Failed to load questions from AI model.");
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Timer
  useEffect(() => {
    if (loading || isCompleted || questions.length === 0) return;
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, isCompleted, questions.length]);

  const currentQuestion = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex] ?? null;

  const handleSelectOption = (index: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: index,
    }));
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading || isCompleted || !currentQuestion) return;

      const key = e.key.toUpperCase();
      if (key === "A" || key === "1") handleSelectOption(0);
      else if (key === "B" || key === "2") handleSelectOption(1);
      else if (key === "C" || key === "3") handleSelectOption(2);
      else if (key === "D" || key === "4") handleSelectOption(3);
      else if (e.key === "ArrowRight" && currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, isCompleted, currentQuestion, currentIndex, questions.length]);

  const handleCopyCode = () => {
    if (!currentQuestion?.codeSnippet) return;
    navigator.clipboard.writeText(currentQuestion.codeSnippet);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    const userAnswers: UserAnswer[] = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      return {
        questionId: q.id,
        selectedOptionIndex: selected,
        isCorrect: selected === q.correctAnswerIndex,
        timeSpentSeconds: Math.round(elapsedTime / questions.length),
      };
    });

    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const result: QuizResult = {
      topicId: config.topicId,
      topicTitle: config.topicTitle,
      difficulty: config.difficulty,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercentage,
      totalTimeSeconds: elapsedTime,
      answers: userAnswers,
      questions,
    };

    setQuizResult(result);
    setIsCompleted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setQuizResult(null);
    loadQuestions();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <div className="space-y-1">
          <div className="font-mono text-sm font-semibold text-foreground">
            Synthesizing Assessment Questions
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Querying OpenRouter free models for &ldquo;{config.topicTitle}&rdquo; ({config.difficulty})
          </p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-md border border-border/80 bg-card p-8">
          <h2 className="text-lg font-semibold text-foreground">Generation Error</h2>
          <p className="mt-2 text-xs text-muted-foreground">{error || "No questions could be generated."}</p>
          <div className="mt-6 flex justify-center gap-3 font-mono text-xs">
            <button
              onClick={loadQuestions}
              className="rounded-md bg-foreground px-4 py-2 text-background font-medium"
            >
              Retry Generation
            </button>
            <Link
              href="/"
              className="rounded-md border border-border px-4 py-2 text-muted-foreground hover:text-foreground"
            >
              Back to Taxonomy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted && quizResult) {
    return <QuizResults result={quizResult} onRetake={handleRetake} />;
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Top Header Bar */}
      <div className="mb-6 flex items-center justify-between font-mono text-xs text-muted-foreground">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Exit</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block font-semibold uppercase text-foreground">
            {config.topicTitle}
          </span>
          <span className="rounded border border-border/60 bg-muted/30 px-2 py-0.5 capitalize text-[11px]">
            {config.difficulty}
          </span>
          <div className="flex items-center gap-1 text-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
          <span className="font-semibold text-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="mb-8 h-1 w-full bg-muted overflow-hidden rounded-full">
        <div
          className="h-full bg-foreground transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-md border border-border/80 bg-card p-6 sm:p-8">
        {/* Question Statement */}
        <div className="mb-6">
          <div className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Question #{currentIndex + 1}
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Code Snippet Block if Present */}
        {currentQuestion.codeSnippet && (
          <div className="relative mb-6 rounded-md border border-code-border bg-code-bg">
            <div className="flex items-center justify-between border-b border-code-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
              <span>{currentQuestion.language || "code"}</span>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
              <pre className="m-0">
                <code>
                  {currentQuestion.codeSnippet.split("\n").map((line, idx) => (
                    <div key={idx} className="table-row">
                      <span className="table-cell pr-4 select-none text-muted-foreground/60 text-right w-6">
                        {idx + 1}
                      </span>
                      <span className="table-cell">{line || " "}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`group flex w-full items-start gap-3 rounded-md border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-foreground bg-accent/60 shadow-sm"
                    : "border-border/80 bg-background hover:border-border hover:bg-muted/40"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border font-mono text-xs font-semibold ${
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/80 bg-muted/30 text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {optionLabels[idx] || idx + 1}
                </span>
                <span className="mt-0.5 font-mono text-xs text-foreground flex-1 leading-relaxed">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-6 flex items-center justify-between font-mono text-xs">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="rounded-md border border-border/80 bg-background px-4 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-2.5 font-semibold text-background transition-opacity hover:opacity-90"
          >
            <span>
              {currentIndex === questions.length - 1 ? "Submit Assessment" : "Next Question"}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
