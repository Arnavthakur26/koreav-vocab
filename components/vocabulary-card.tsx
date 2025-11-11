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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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
    setSelectedAnswer(null);
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

  const fetchExample = async (wordId: string) => {
    setIsLoadingExample(true);
    try {
      const res = await fetch(`/api/example?id=${encodeURIComponent(wordId)}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Unknown error fetching example");
      }
      if (typeof json.example === "string") {
        setExampleSentence(json.example);
      } else {
        setExampleSentence(`Example for word ID "${wordId}" not available.`);
      }
    } catch (error) {
      console.error("Error fetching example:", error);
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
    setSelectedAnswer(answer);
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
      await fetchExample(currentWord.id);
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: -30, rotateX: -20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
          duration: 0.6,
        }}
        className="flex items-center gap-3 mb-6"
      >
        <Card className="px-6 py-3 rounded-full border-2 border-border/30 relative overflow-hidden preserve-3d shadow-3d-md animate-breathe bg-card/80 backdrop-blur-md">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <div className="flex items-center gap-3 relative z-10">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-primary/60"
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
            <span className="text-xl font-display font-bold text-foreground tracking-tight">
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
            className="rounded-full border-2 border-border/40 touch-manipulation h-10 px-5 relative overflow-hidden shadow-3d-sm group transition-all duration-300 hover:shadow-3d-md bg-card/80 backdrop-blur-md"
          >
            <Flag className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 group-hover:rotate-3" />
            <span className="font-display font-semibold text-sm">
              End Session
            </span>
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
            <Card className="relative p-6 md:p-10 rounded-[32px] border-2 border-border/30 backdrop-blur-xl overflow-hidden preserve-3d shadow-3d-xl premium-glass-elevated bg-card/90">
              <div className="absolute inset-0 korean-pattern-overlay rounded-[32px] pointer-events-none opacity-30" />

              <motion.div
                className="absolute inset-0 rounded-[32px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(59, 130, 246, 0.04) 25%, transparent 50%, rgba(14, 165, 233, 0.05) 100%)",
                  zIndex: 0,
                }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/20"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${15 + i * 25}%`,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 10, 0],
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.8,
                  }}
                />
              ))}

              <div className="space-y-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 22,
                    delay: 0.2,
                  }}
                  className="text-center space-y-3"
                >
                  <motion.div
                    className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight preserve-3d layer-3 leading-tight"
                    style={{
                      textShadow:
                        "0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)",
                      letterSpacing: "-0.02em",
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      textShadow:
                        "0 16px 40px rgba(0, 0, 0, 0.18), 0 8px 16px rgba(0, 0, 0, 0.12)",
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentWord.korean}
                    </motion.span>
                  </motion.div>
                  {currentWord.romanization && quizState === "answered" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                      className="text-sm md:text-base text-muted-foreground font-mono tracking-wider"
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
                    className="space-y-3"
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
                            scale: 1.02,
                            y: -2,
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
                            className="w-full h-16 md:h-18 text-base md:text-lg font-display font-semibold rounded-[20px] border-2 border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 transition-all duration-300 touch-manipulation relative overflow-hidden disabled:opacity-50 text-foreground preserve-3d shadow-3d-md hover:shadow-3d-lg group bg-card/80 backdrop-blur-sm px-3"
                            onClick={() => handleAnswer(option)}
                          >
                            <AnimatePresence>
                              {clickedButton === option && (
                                <>
                                  {/* Expanding ripple wave */}
                                  <motion.div
                                    className="absolute inset-0 rounded-[20px]"
                                    style={{
                                      background:
                                        "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.3) 30%, transparent 70%)",
                                    }}
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 3, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                      duration: 0.35,
                                      ease: [0.34, 1.56, 0.64, 1],
                                    }}
                                  />
                                  {/* Quick shimmer sweep */}
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-[20px]"
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
                            <span className="relative z-10 group-hover:scale-105 transition-transform animate-text-reveal line-clamp-2 break-words">
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
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 25 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                      className={`flex items-center justify-center gap-3 p-5 rounded-[24px] border-2 preserve-3d shadow-3d-lg relative overflow-hidden ${
                        isCorrect
                          ? "bg-gradient-to-br from-success/12 to-success/6 text-success border-success/30"
                          : "bg-gradient-to-br from-error/12 to-error/6 text-error border-error/30"
                      }`}
                    >
                      {isCorrect &&
                        [...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-success"
                            style={{
                              left: "50%",
                              top: "50%",
                            }}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [1, 0.6, 0],
                              x: [0, Math.cos((i * Math.PI) / 4) * 60],
                              y: [0, Math.sin((i * Math.PI) / 4) * 60],
                            }}
                            transition={{
                              duration: 0.8,
                              delay: 0.1,
                              ease: "easeOut",
                            }}
                          />
                        ))}
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
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Check className="w-10 h-10" strokeWidth={2.5} />
                          </motion.div>
                        ) : (
                          <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <X className="w-10 h-10" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </motion.div>
                      <motion.span
                        className="text-xl md:text-2xl font-display font-bold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </motion.span>
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
                        delay: 0.2,
                        type: "spring",
                        stiffness: 260,
                        damping: 24,
                      }}
                    >
                      <Card className="p-6 md:p-8 rounded-[28px] border-2 border-border/40 relative overflow-hidden preserve-3d shadow-3d-md premium-glass bg-card/80 backdrop-blur-md">
                        <p className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider relative z-10">
                          Example Usage
                        </p>
                        {isLoadingExample ? (
                          <ExampleLoader />
                        ) : (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm md:text-base text-foreground leading-relaxed relative z-10"
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
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
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
            className="fixed bottom-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground flex items-center justify-center touch-manipulation group z-50 preserve-3d shadow-3d-xl"
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
              width="36"
              height="36"
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
                className="absolute inset-0 rounded-full border-2 border-white/30"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 2.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                  delay,
                }}
              />
            ))}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
