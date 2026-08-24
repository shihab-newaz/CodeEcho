"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TOPIC_CATEGORIES } from "@/constants/topics";
import { DifficultyLevel } from "@/types/quiz";
import {
  GitBranch,
  Network,
  Layers,
  Database,
  Cpu,
  Binary,
  Sparkles,
  Code2,
  Terminal,
  Workflow,
  FileCode,
  ArrowRight,
  SlidersHorizontal,
  Sparkle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  GitBranch,
  Network,
  Layers,
  Database,
  Cpu,
  Binary,
  Sparkles,
  Code2,
  Terminal,
  Workflow,
  FileCode,
};

export function TopicSelector() {
  const router = useRouter();
  const [selectedTopicId, setSelectedTopicId] = useState<string>("dsa");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("intermediate");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const csBasics = TOPIC_CATEGORIES.filter((t) => t.category === "cs_basics");
  const codeSnippets = TOPIC_CATEGORIES.filter((t) => t.category === "code_snippets");

  const handleStart = () => {
    if (isCustomMode) {
      if (!customPrompt.trim()) return;
      const encodedPrompt = encodeURIComponent(customPrompt.trim());
      router.push(`/quiz/custom?difficulty=${difficulty}&count=${questionCount}&prompt=${encodedPrompt}`);
    } else {
      router.push(`/quiz/${selectedTopicId}?difficulty=${difficulty}&count=${questionCount}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-widest">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Evaluation Protocol // Phase 1</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Technical Assessment Engine
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Precision question generation across CS fundamentals and code output prediction, evaluated via OpenRouter open-weight models.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="mb-8 flex border-b border-border/80">
        <button
          onClick={() => setIsCustomMode(false)}
          className={`pb-3 pr-6 font-mono text-xs font-medium uppercase tracking-wider transition-colors ${
            !isCustomMode
              ? "border-b-2 border-foreground text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          [01] Curated Taxonomy
        </button>
        <button
          onClick={() => setIsCustomMode(true)}
          className={`pb-3 px-6 font-mono text-xs font-medium uppercase tracking-wider transition-colors ${
            isCustomMode
              ? "border-b-2 border-foreground text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          [02] Custom Syllabus Prompt
        </button>
      </div>

      {!isCustomMode ? (
        <div className="space-y-10">
          {/* Section 1: CS Fundamentals */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Computer Science Core
              </h2>
              <span className="font-mono text-[11px] text-muted-foreground">
                {csBasics.length} Categories
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {csBasics.map((topic) => {
                const IconComponent = ICON_MAP[topic.iconName] || Terminal;
                const isSelected = selectedTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`group relative flex cursor-pointer flex-col justify-between rounded-md border p-4 transition-all ${
                      isSelected
                        ? "border-foreground bg-accent/40 shadow-sm"
                        : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/80 bg-background text-foreground">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {topic.subtopics.slice(0, 2).map((sub, i) => (
                          <span
                            key={i}
                            className="rounded border border-border/40 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        {topic.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Code Snippets & Output Prediction */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Code Snippets & Output Prediction
              </h2>
              <span className="font-mono text-[11px] text-muted-foreground">
                {codeSnippets.length} Categories
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {codeSnippets.map((topic) => {
                const IconComponent = ICON_MAP[topic.iconName] || Code2;
                const isSelected = selectedTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`group relative flex cursor-pointer flex-col justify-between rounded-md border p-4 transition-all ${
                      isSelected
                        ? "border-foreground bg-accent/40 shadow-sm"
                        : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/80 bg-background text-foreground">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        Output Logic
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        {topic.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        /* Custom Prompt Mode */
        <div className="rounded-md border border-border/80 bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkle className="h-4 w-4 text-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Define Custom Assessment Syllabus
            </h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Provide specific concepts, frameworks, or interview topics (e.g. &ldquo;Golang channels and mutexes, Kafka partition rebalancing, PostgreSQL index selectivity&rdquo;).
          </p>
          <textarea
            rows={4}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Distributed locks with Redis, optimistic vs pessimistic concurrency, Rust memory safety invariants..."
            className="w-full rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        </div>
      )}

      {/* Configuration & Action Bar */}
      <div className="mt-10 flex flex-col gap-4 rounded-md border border-border/80 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          {/* Difficulty Selection */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Difficulty:</span>
            <div className="inline-flex rounded-md border border-border/80 bg-background p-0.5">
              {(["beginner", "intermediate", "advanced"] as DifficultyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded px-2.5 py-1 font-mono text-xs capitalize transition-colors ${
                    difficulty === level
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Count:</span>
            <div className="inline-flex rounded-md border border-border/80 bg-background p-0.5">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                    questionCount === cnt
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Assessment CTA */}
        <button
          onClick={handleStart}
          disabled={isCustomMode && !customPrompt.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-2.5 font-mono text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <span>Start Assessment</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
