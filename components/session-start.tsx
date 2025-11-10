"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Target, TrendingUp, Sparkles } from "lucide-react";

interface SessionStartProps {
  onStartSession: () => void;
  selectedLevel: "topik1" | "topik2";
}

export function SessionStart({
  onStartSession,
  selectedLevel,
}: SessionStartProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 25,
        }}
        className="w-full max-w-2xl space-y-10"
      >
        <Card className="p-16 rounded-[44px] border border-border/20 backdrop-blur-xl relative overflow-hidden preserve-3d shadow-3d-xl premium-glass-elevated">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            style={{
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          <div className="text-center space-y-10 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -270, z: -100 }}
              animate={{ scale: 1, rotate: 0, z: 0 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 20,
                delay: 0.2,
              }}
              whileHover={{
                scale: 1.18,
                rotate: 5,
                y: -10,
              }}
              className="inline-block cursor-pointer"
            >
              <motion.div
                className="relative preserve-3d"
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, 3, 0, -3, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="w-36 h-36 rounded-[32px] bg-gradient-to-br from-primary/15 to-accent/10 border-2 border-primary/20 flex items-center justify-center preserve-3d shadow-3d-lg premium-glass">
                  <BookOpen
                    className="w-20 h-20 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                {[0, 0.8, 1.6].map((delay) => (
                  <motion.div
                    key={delay}
                    className="absolute inset-0 rounded-[32px] border-2 border-primary/15"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeOut",
                      delay,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            <div className="space-y-5">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 24,
                }}
                className="text-6xl md:text-7xl font-display font-bold text-foreground preserve-3d layer-2"
                style={{
                  textShadow:
                    "0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 8px rgba(0, 0, 0, 0.06)",
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to Practice?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-muted-foreground"
              >
                {selectedLevel === "topik1"
                  ? "TOPIK 1 - Beginner Level"
                  : "TOPIK 2 - Intermediate Level"}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 240,
                damping: 24,
              }}
              whileHover={{ scale: 1.06, y: -6 }}
              whileTap={{ scale: 0.96 }}
              className="preserve-3d"
            >
              <Button
                size="lg"
                onClick={onStartSession}
                className="h-24 px-20 text-2xl font-display font-bold rounded-[32px] bg-gradient-to-br from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-primary-foreground transition-all duration-300 touch-manipulation relative overflow-hidden preserve-3d shadow-3d-lg hover:shadow-3d-xl button-shine-effect group"
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
                <span className="relative z-10">Start Practice</span>
              </Button>
            </motion.div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Interactive Learning",
              description: "Practice with multiple-choice questions",
              color: "primary",
              delay: 0.3,
            },
            {
              icon: Sparkles,
              title: "AI Examples",
              description: "Powered by Gemini AI",
              color: "accent",
              delay: 0.4,
            },
            {
              icon: TrendingUp,
              title: "Track Progress",
              description: "Monitor your learning journey",
              color: "success",
              delay: 0.5,
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 35, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.05,
                y: -8,
              }}
              transition={{
                delay: feature.delay,
                type: "spring",
                stiffness: 240,
                damping: 24,
              }}
              className="md:col-span-1 preserve-3d"
            >
              <Card className="p-10 rounded-[32px] border border-border/20 h-full relative overflow-hidden preserve-3d shadow-3d-md hover:shadow-3d-lg transition-shadow duration-300 premium-glass">
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.18, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  >
                    <div
                      className={`w-20 h-20 rounded-[24px] bg-${feature.color}/12 flex items-center justify-center border border-${feature.color}/20 preserve-3d shadow-3d-sm`}
                    >
                      <feature.icon
                        className={`w-10 h-10 text-${feature.color}`}
                        strokeWidth={2}
                      />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
