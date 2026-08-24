"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QuizResult } from "@/types/quiz";
import { RotateCcw, ArrowLeft, ChevronDown, ChevronUp, Check, X, Clock, Target, Award } from "lucide-react";

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
}

export function QuizResults({ result, onRetake }: QuizResultsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isPassed = result.scorePercentage >= 70;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Taxonomy</span>
        </Link>
      </div>

      {/* Score Header */}
      <div className="mb-10 rounded-md border border-border/80 bg-card p-6 text-center sm:p-8">
        <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <Award className="h-3.5 w-3.5" />
          <span>Assessment Report</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {result.topicTitle}
        </h1>

        {/* Big Score Display */}
        <div className="my-6">
          <div className="font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {result.correctAnswers} <span className="text-2xl text-muted-foreground font-normal">/ {result.totalQuestions}</span>
          </div>
          <div className="mt-2 font-mono text-sm font-semibold tracking-wider">
            <span className={isPassed ? "text-emerald-500" : "text-rose-500"}>
              {result.scorePercentage}% ACCURACY &mdash; {isPassed ? "PASSING GRADE" : "NEEDS REVIEW"}
            </span>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-mono text-xs text-muted-foreground border-t border-border/60 pt-6">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Time: {formatTime(result.totalTimeSeconds)}</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" />
            <span className="capitalize">Difficulty: {result.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Detailed Question Breakdown
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {result.correctAnswers} Correct &bull; {result.totalQuestions - result.correctAnswers} Missed
          </span>
        </div>

        {result.questions.map((q, idx) => {
          const userAnswer = result.answers.find((a) => a.questionId === q.id);
          const isCorrect = userAnswer?.isCorrect ?? false;
          const userChoice = userAnswer?.selectedOptionIndex ?? -1;
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={q.id || idx}
              className={`rounded-md border transition-all ${
                isCorrect ? "border-border/60 bg-card" : "border-border/80 bg-card"
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="flex w-full items-start justify-between gap-4 p-4 text-left focus-visible:outline-none"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex shrink-0 items-center justify-center rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                      isCorrect
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}
                  >
                    {isCorrect ? "[PASS]" : "[FAIL]"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    <span className="font-mono text-muted-foreground mr-1.5">#{idx + 1}</span>
                    {q.question}
                  </span>
                </div>
                <div className="shrink-0 text-muted-foreground pt-0.5">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="border-t border-border/60 p-4 space-y-4 font-sans text-xs">
                  {/* Code Snippet if present */}
                  {q.codeSnippet && (
                    <div className="rounded-md border border-code-border bg-code-bg p-3 font-mono text-xs overflow-x-auto text-foreground">
                      <pre><code>{q.codeSnippet}</code></pre>
                    </div>
                  )}

                  {/* Options Comparison */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded border border-border/80 bg-background p-3">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground block mb-1">
                        Your Selection:
                      </span>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        )}
                        <span className={`font-mono text-xs ${isCorrect ? "text-emerald-500" : "text-rose-500 font-medium"}`}>
                          {userChoice >= 0 ? q.options[userChoice] : "No answer selected"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded border border-border/80 bg-background p-3">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground block mb-1">
                        Correct Answer:
                      </span>
                      <div className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="font-mono text-xs text-foreground font-medium">
                          {q.options[q.correctAnswerIndex]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation Box */}
                  <div className="rounded-md border border-border/80 bg-muted/30 p-3.5 space-y-2">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Technical Concept & Explanation:
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/90">
                      {q.explanation}
                    </p>
                    {q.keyTakeaway && (
                      <div className="mt-2 border-t border-border/40 pt-2 font-mono text-[11px] text-muted-foreground">
                        <span className="text-foreground font-medium">Takeaway: </span>
                        {q.keyTakeaway}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onRetake}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-2.5 font-mono text-xs font-semibold text-background transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retake Assessment</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-border/80 bg-background px-6 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Select Another Topic
        </Link>
      </div>
    </div>
  );
}
