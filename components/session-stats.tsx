"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  X,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  RotateCw,
  Sparkles,
} from "lucide-react";
import type { SessionStats } from "@/types/session";

interface SessionStatsProps {
  stats: SessionStats;
  onNewSession: () => void;
}

export function SessionStatsComponent({
  stats,
  onNewSession,
}: SessionStatsProps) {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const duration = stats.duration || 0;
  const accuracy = Math.round(stats.accuracy);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 perspective-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
        className="w-full max-w-4xl space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-4 relative"
        >
          {/* Floating sparkles around trophy */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [
                  0,
                  Math.cos((i * Math.PI) / 3) * 80,
                  Math.cos((i * Math.PI) / 3) * 120,
                ],
                y: [
                  0,
                  Math.sin((i * Math.PI) / 3) * 80,
                  Math.sin((i * Math.PI) / 3) * 120,
                ],
              }}
              transition={{
                duration: 2,
                delay: 0.3 + i * 0.1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
              style={{
                left: "50%",
                top: "80px",
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -180, z: -50 }}
            animate={{ scale: 1, rotate: 0, z: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 border-2 border-primary/30 mb-2 preserve-3d animate-trophy-bounce relative overflow-hidden"
            style={{
              boxShadow:
                "0 12px 24px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 60px rgba(var(--primary), 0.2)",
              transform: "translateZ(40px)",
            }}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <Trophy
              className="w-16 h-16 text-primary relative z-10"
              strokeWidth={1.5}
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-display font-bold text-foreground"
          >
            Session Complete!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground"
          >
            Here&apos;s how you performed
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotateZ: -180 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 relative overflow-hidden h-full preserve-3d"
              style={{
                boxShadow:
                  "0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(20px)",
              }}
            >
              {/* Subtle color gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%)",
                }}
              />
              <div className="space-y-3 relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/30"
                  style={{
                    boxShadow: "0 4px 8px rgba(139, 92, 246, 0.2)",
                    transform: "translateZ(10px)",
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="w-6 h-6 text-primary" strokeWidth={2} />
                </motion.div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Total
                  </p>
                  <motion.p
                    className="text-5xl font-display font-bold text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {stats.total}
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotateZ: -180 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 relative overflow-hidden h-full preserve-3d"
              style={{
                boxShadow:
                  "0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(20px)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, transparent 100%)",
                }}
              />
              <div className="space-y-3 relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-success/15 flex items-center justify-center border border-success/30"
                  style={{
                    boxShadow: "0 4px 8px rgba(34, 197, 94, 0.2)",
                    transform: "translateZ(10px)",
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Check className="w-6 h-6 text-success" strokeWidth={2} />
                </motion.div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Correct
                  </p>
                  <motion.p
                    className="text-5xl font-display font-bold text-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {stats.correct}
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotateZ: -180 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 relative overflow-hidden h-full preserve-3d"
              style={{
                boxShadow:
                  "0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(20px)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%)",
                }}
              />
              <div className="space-y-3 relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-error/15 flex items-center justify-center border border-error/30"
                  style={{
                    boxShadow: "0 4px 8px rgba(239, 68, 68, 0.2)",
                    transform: "translateZ(10px)",
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <X className="w-6 h-6 text-error" strokeWidth={2} />
                </motion.div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Wrong
                  </p>
                  <motion.p
                    className="text-5xl font-display font-bold text-error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {stats.incorrect}
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotateZ: -180 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 relative overflow-hidden h-full preserve-3d"
              style={{
                boxShadow:
                  "0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(20px)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)",
                }}
              />
              <div className="space-y-3 relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center border border-accent/30"
                  style={{
                    boxShadow: "0 4px 8px rgba(59, 130, 246, 0.2)",
                    transform: "translateZ(10px)",
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <TrendingUp className="w-6 h-6 text-accent" strokeWidth={2} />
                </motion.div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Accuracy
                  </p>
                  <motion.p
                    className="text-5xl font-display font-bold text-accent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {accuracy}%
                  </motion.p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          whileHover={{ scale: 1.02, y: -4, rotateX: 2 }}
          transition={{
            delay: 0.7,
            type: "spring",
            stiffness: 260,
            damping: 24,
          }}
        >
          <Card
            className="p-8 rounded-3xl border border-border/50 relative overflow-hidden"
            style={{
              boxShadow:
                "0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
              transform: "translateZ(15px)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%)",
              }}
            />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/30"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <Clock className="w-8 h-8 text-primary" strokeWidth={2} />
                </motion.div>
                <p className="text-lg font-bold text-muted-foreground uppercase tracking-wide">
                  Session Duration
                </p>
              </div>
              <motion.p
                className="text-4xl font-display font-bold text-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.9,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {formatDuration(duration)}
              </motion.p>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 to-transparent h-full preserve-3d"
              style={{
                boxShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(10px)",
              }}
            >
              <div className="space-y-3">
                <div
                  className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20"
                  style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    transform: "translateZ(5px)",
                  }}
                >
                  <Target className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Total
                  </p>
                  <p className="text-4xl font-display font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ delay: 0.25 }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 bg-gradient-to-br from-success/5 to-transparent h-full preserve-3d"
              style={{
                boxShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(10px)",
              }}
            >
              <div className="space-y-3">
                <div
                  className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center border border-success/20"
                  style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    transform: "translateZ(5px)",
                  }}
                >
                  <Check className="w-5 h-5 text-success" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Correct
                  </p>
                  <p className="text-4xl font-display font-bold text-success">
                    {stats.correct}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 bg-gradient-to-br from-error/5 to-transparent h-full preserve-3d"
              style={{
                boxShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(10px)",
              }}
            >
              <div className="space-y-3">
                <div
                  className="w-10 h-10 rounded-2xl bg-error/10 flex items-center justify-center border border-error/20"
                  style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    transform: "translateZ(5px)",
                  }}
                >
                  <X className="w-5 h-5 text-error" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Wrong
                  </p>
                  <p className="text-4xl font-display font-bold text-error">
                    {stats.incorrect}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ delay: 0.35 }}
          >
            <Card
              className="p-6 rounded-3xl border border-border/50 bg-gradient-to-br from-accent/5 to-transparent h-full preserve-3d"
              style={{
                boxShadow:
                  "0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.08)",
                transform: "translateZ(10px)",
              }}
            >
              <div className="space-y-3">
                <div
                  className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20"
                  style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    transform: "translateZ(5px)",
                  }}
                >
                  <TrendingUp className="w-5 h-5 text-accent" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                    Accuracy
                  </p>
                  <p className="text-4xl font-display font-bold text-accent">
                    {accuracy}%
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            className="p-6 rounded-3xl border border-border/50"
            style={{
              boxShadow:
                "0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.08)",
              transform: "translateZ(5px)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Clock className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  Session Duration
                </p>
              </div>
              <p className="text-3xl font-display font-bold text-foreground">
                {formatDuration(duration)}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card
            className="p-6 rounded-3xl border border-border/50 max-h-[400px] overflow-y-auto"
            style={{
              boxShadow:
                "0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.08)",
              transform: "translateZ(5px)",
            }}
          >
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Words Reviewed
            </h3>
            <div className="space-y-3">
              {stats.wordsReviewed.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20, rotateY: -5 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ delay: 0.5 + index * 0.03 }}
                  className="flex items-center justify-between p-5 rounded-2xl bg-muted/50 border border-border/50"
                  style={{
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                    transform: "translateZ(2px)",
                  }}
                >
                  <div className="flex-1">
                    <p className="font-display font-bold text-xl text-foreground">
                      {word.korean}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {word.english}
                    </p>
                    {!word.isCorrect && word.userAnswer && (
                      <p className="text-xs text-error mt-1">
                        Your answer: {word.userAnswer}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${
                      word.isCorrect
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-error/10 text-error border border-error/20"
                    }`}
                  >
                    {word.isCorrect ? (
                      <Check className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <X className="w-5 h-5" strokeWidth={2} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.97 }}
          transition={{
            delay: 0.9,
            type: "spring",
            stiffness: 280,
            damping: 22,
          }}
        >
          <Button
            size="lg"
            onClick={onNewSession}
            className="w-full h-20 text-xl font-display font-semibold rounded-3xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground transition-all touch-manipulation relative overflow-hidden group"
            style={{
              boxShadow:
                "0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(139, 92, 246, 0.3)",
              transform: "translateZ(20px)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <RotateCw className="w-7 h-7 mr-3 group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative z-10">Start New Session</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
