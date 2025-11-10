/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Flag } from "lucide-react";
import { ExampleLoader } from "@/components/example-loader";
import {
  topik1Words,
  topik2Words,
  generateOptions,
  getRandomWord,
  type VocabularyWord,
} from "@/lib/vocabulary-data";
import type { SessionStats } from "@/types/session";

type QuizState = "question" | "answered";

interface VocabularyCardProps {
  selectedLevel: "topik1" | "topik2";
  onEndSession: (stats: SessionStats) => void;
  sessionStats: SessionStats;
  onUpdateStats: (stats: SessionStats) => void;
}

export function VocabularyCard({
  selectedLevel,
  onEndSession,
  sessionStats,
  onUpdateStats,
}: VocabularyCardProps) {
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("question");
  const [exampleSentence, setExampleSentence] = useState<string>("");
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const loadNewWord = () => {
    const wordList = selectedLevel === "topik1" ? topik1Words : topik2Words;
    const word = getRandomWord(wordList);
    setCurrentWord(word);
    setOptions(generateOptions(word.english, wordList));
    setIsCorrect(null);
    setQuizState("question");
    setExampleSentence("");
  };

  useEffect(() => {
    loadNewWord();
  }, [selectedLevel]);

  useEffect(() => {
    if (!currentWord) {
      loadNewWord();
    }
  }, []);

  const fetchExample = async (koreanWord: string) => {
    setIsLoadingExample(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setExampleSentence(
        `Example: ${koreanWord}은/는 매일 사용하는 단어입니다. (This is a commonly used word every day.)`
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setExampleSentence("Example not available at the moment.");
    } finally {
      setIsLoadingExample(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (quizState === "answered" || isAnimating || !currentWord) return;

    setIsAnimating(true);
    setClickedButton(answer);

    await new Promise((resolve) => setTimeout(resolve, 350));

    setClickedButton(null);
    const correct = answer === currentWord?.english;
    setIsCorrect(correct);
    setQuizState("answered");

    const newStats: SessionStats = {
      ...sessionStats,
      correct: sessionStats.correct + (correct ? 1 : 0),
      incorrect: sessionStats.incorrect + (correct ? 0 : 1),
      total: sessionStats.total + 1,
      accuracy:
        ((sessionStats.correct + (correct ? 1 : 0)) /
          (sessionStats.total + 1)) *
        100,
      wordsReviewed: [
        ...sessionStats.wordsReviewed,
        {
          korean: currentWord.korean,
          english: currentWord.english,
          isCorrect: correct,
          userAnswer: answer,
        },
      ],
    };
    onUpdateStats(newStats);

    if (currentWord) {
      await fetchExample(currentWord.korean);
    }

    setIsAnimating(false);
  };

  const handleNext = () => {
    loadNewWord();
  };

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md p-8 rounded-3xl">
          <div className="text-center text-muted-foreground">Loading...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: -30, rotateX: -20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
          duration: 0.6,
        }}
        className="flex items-center gap-4 mb-8"
      >
        <Card className="px-10 py-5 rounded-full border border-border/20 relative overflow-hidden preserve-3d shadow-3d-md animate-breathe">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-5"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            }}
          />
          <div className="flex items-center gap-4 relative z-10">
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary/60"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <span className="text-3xl font-display font-bold text-foreground tracking-tight">
              {sessionStats.correct}
              <span className="text-muted-foreground">/</span>
              {sessionStats.total}
            </span>
          </div>
        </Card>

        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEndSession(sessionStats)}
            className="rounded-full border border-border/30 touch-manipulation h-14 px-10 relative overflow-hidden shadow-3d-sm group transition-all duration-300 hover:shadow-3d-md hover:text-white preserve-3d"
          >
            <Flag className="w-5 h-5 mr-2 transition-transform group-hover:scale-110 group-hover:rotate-3" />
            <span className="font-display font-semibold">End Session</span>
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.korean}
          initial={{ opacity: 0, scale: 0.92, rotateX: -12, z: -80 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, z: 0 }}
          exit={{ opacity: 0, scale: 0.92, rotateX: 12, z: -80 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 26,
            duration: 0.7,
          }}
          className="w-full max-w-lg preserve-3d"
        >
          <motion.div
            className="relative preserve-3d"
            whileHover={{ scale: 1.01, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="relative md:px-14 md:py-14 px-4 py-6 rounded-[40px] border border-border/20 backdrop-blur-xl overflow-hidden preserve-3d shadow-3d-xl premium-glass-elevated">
              <motion.div
                className="absolute inset-0 rounded-[40px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.02) 50%, rgba(14, 165, 233, 0.03) 100%)",
                  zIndex: 0,
                }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--primary)/0.025) 0%, transparent 70%)",
                  transform: "translateZ(-50px)",
                  animation: "orb-rotate 35s ease-in-out infinite",
                }}
              />
              <div
                className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--accent)/0.02) 0%, transparent 70%)",
                  transform: "translateZ(-50px)",
                  animationDelay: "17s",
                  animationDuration: "40s",
                  animation: "orb-rotate 40s ease-in-out infinite",
                }}
              />

              <div className="space-y-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 22,
                    delay: 0.2,
                  }}
                  className="text-center space-y-5"
                >
                  <motion.div
                    className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight preserve-3d layer-3"
                    style={{
                      textShadow:
                        "0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
                      letterSpacing: "-0.02em",
                    }}
                    whileHover={{
                      scale: 1.08,
                      y: -4,
                      textShadow:
                        "0 16px 40px rgba(0, 0, 0, 0.18), 0 8px 16px rgba(0, 0, 0, 0.12)",
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  >
                    {currentWord.korean}
                  </motion.div>
                  {currentWord.romanization && quizState === "answered" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        delay: 0.3,
                        stiffness: 260,
                        damping: 22,
                      }}
                      className="text-xl text-muted-foreground font-mono tracking-wider"
                      style={{
                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      {currentWord.romanization}
                    </motion.div>
                  )}
                </motion.div>

                {quizState === "question" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {options.map((option, index) => (
                      <motion.div
                        key={option}
                        initial={{
                          opacity: 0,
                          y: 30,
                          rotateX: -15,
                          scale: 0.94,
                        }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                        transition={{
                          delay: 0.15 + index * 0.08,
                          type: "spring",
                          stiffness: 260,
                          damping: 24,
                        }}
                        className="preserve-3d"
                      >
                        <motion.div
                          whileTap={{ scale: 0.96 }}
                          whileHover={{
                            scale: 1.03,
                            y: -4,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 25,
                          }}
                          className="preserve-3d"
                        >
                          <Button
                            variant="outline"
                            disabled={isAnimating}
                            className="w-full h-24 text-2xl font-display font-semibold rounded-[28px] border border-border/30 hover:bg-primary hover:text-white hover:border-primary/40 transition-all duration-300 touch-manipulation relative overflow-hidden disabled:opacity-50 text-foreground preserve-3d shadow-3d-md hover:shadow-3d-lg group"
                            onClick={() => handleAnswer(option)}
                          >
                            <AnimatePresence>
                              {clickedButton === option && (
                                <>
                                  {/* Expanding ripple wave */}
                                  <motion.div
                                    className="absolute inset-0 rounded-[28px]"
                                    style={{
                                      background:
                                        "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 100%)",
                                    }}
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                      duration: 0.35,
                                      ease: [0.34, 1.56, 0.64, 1],
                                    }}
                                  />
                                  {/* Quick shimmer sweep */}
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-[28px]"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      ease: "easeInOut",
                                    }}
                                  />
                                </>
                              )}
                            </AnimatePresence>
                            <span className="relative z-10 group-hover:scale-105 transition-transform">
                              {option}
                            </span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {quizState === "answered" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 25 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                      className={`flex items-center justify-center gap-5 p-7 rounded-[32px] border-2 preserve-3d shadow-3d-lg ${
                        isCorrect
                          ? "bg-gradient-to-br from-success/12 to-success/6 text-success border-success/30"
                          : "bg-gradient-to-br from-error/12 to-error/6 text-error border-error/30"
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 18,
                          delay: 0.1,
                        }}
                      >
                        {isCorrect ? (
                          <Check className="w-10 h-10" strokeWidth={2.5} />
                        ) : (
                          <X className="w-10 h-10" strokeWidth={2.5} />
                        )}
                      </motion.div>
                      <span className="text-3xl font-display font-bold">
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 260,
                        damping: 24,
                      }}
                    >
                      <Card className="p-8 rounded-[36px] border border-border/30 relative overflow-hidden preserve-3d shadow-3d-lg premium-glass-elevated">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/4 to-transparent"
                          animate={{
                            opacity: [0.4, 0.6, 0.4],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                        <p className="text-3xl font-display font-bold text-foreground text-center relative z-10">
                          {currentWord.english}
                        </p>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 260,
                        damping: 24,
                      }}
                    >
                      <Card className="p-10 rounded-[36px] border border-border/30 relative overflow-hidden preserve-3d shadow-3d-md premium-glass">
                        <p className="text-sm font-bold text-muted-foreground mb-5 uppercase tracking-wider relative z-10">
                          Example Usage
                        </p>
                        {isLoadingExample ? (
                          <ExampleLoader />
                        ) : (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg text-foreground leading-relaxed relative z-10"
                          >
                            {exampleSentence}
                          </motion.p>
                        )}
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
          {quizState === "answered" && (
            <motion.button
              initial={{ opacity: 0, scale: 0, rotate: -180, y: 100 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180, y: 100 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 20,
              }}
              whileHover={{
                scale: 1.15,
                y: -8,
              }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="fixed md:top-1/2 top-4 right-4 md:-right-15 - transform md:-translate-y-1/2 size-16 md:w-28 md:h-28 rounded-full bg-linear-to-br from-primary via-primary to-primary/90 text-primary-foreground flex items-center justify-center touch-manipulation group z-50 preserve-3d shadow-3d-xl"
              style={{
                boxShadow:
                  "0 16px 40px rgba(0, 0, 0, 0.25), 0 0 60px rgba(var(--primary), 0.3)",
              }}
              aria-label="Next word"
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(var(--primary), 0.4), 0 0 60px rgba(var(--primary), 0.2)",
                    "0 0 45px rgba(var(--primary), 0.6), 0 0 90px rgba(var(--primary), 0.3)",
                    "0 0 30px rgba(var(--primary), 0.4), 0 0 60px rgba(var(--primary), 0.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
              >
                <motion.path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                />
              </svg>
              {[0, 0.6, 1.2].map((delay) => (
                <motion.div
                  key={delay}
                  className="absolute inset-0 rounded-full border-2 border-white/10"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 2.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
