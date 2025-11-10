"use client";

import { VocabularyCard } from "@/components/vocabulary-card";
import { LevelSelector } from "@/components/level-selector";
import { SessionStart } from "@/components/session-start";
import { SessionStatsComponent } from "@/components/session-stats";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionStats } from "@/types/session";

type AppState = "start" | "session" | "stats";

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<"topik1" | "topik2">(
    "topik1"
  );
  const [appState, setAppState] = useState<AppState>("start");
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    correct: 0,
    incorrect: 0,
    total: 0,
    accuracy: 0,
    wordsReviewed: [],
    startTime: 0,
  });

  const handleStartSession = () => {
    setSessionStats({
      correct: 0,
      incorrect: 0,
      total: 0,
      accuracy: 0,
      wordsReviewed: [],
      startTime: Date.now(),
    });
    setAppState("session");
  };

  const handleEndSession = (stats: SessionStats) => {
    const endTime = Date.now();
    const finalStats: SessionStats = {
      ...stats,
      endTime,
      duration: endTime - stats.startTime,
    };
    setSessionStats(finalStats);
    setAppState("stats");
  };

  const handleNewSession = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAppState("start");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-xl font-display font-bold text-primary">
                  韓
                </span>
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">
                Korean Vocab
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24">
        <AnimatePresence mode="wait">
          {appState === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center pt-4 pb-4"
              >
                <LevelSelector
                  selectedLevel={selectedLevel}
                  onLevelChange={setSelectedLevel}
                />
              </motion.div>
              <SessionStart
                onStartSession={handleStartSession}
                selectedLevel={selectedLevel}
              />
            </motion.div>
          )}

          {appState === "session" && (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VocabularyCard
                selectedLevel={selectedLevel}
                onEndSession={handleEndSession}
                sessionStats={sessionStats}
                onUpdateStats={setSessionStats}
              />
            </motion.div>
          )}

          {appState === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SessionStatsComponent
                stats={sessionStats}
                onNewSession={handleNewSession}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
