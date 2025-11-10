"use client"

import { motion } from "framer-motion"

interface LevelSelectorProps {
  selectedLevel: "topik1" | "topik2"
  onLevelChange: (level: "topik1" | "topik2") => void
}

export function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  return (
    <div
      className="relative inline-flex items-center gap-1 p-1 rounded-full bg-card border border-border dark:border-border/40"
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
        transform: "translateZ(5px)",
      }}
    >
      <button
        onClick={() => onLevelChange("topik1")}
        className={`relative px-6 py-2.5 rounded-full font-display font-semibold text-sm transition-all touch-manipulation ${
          selectedLevel === "topik1" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        style={
          selectedLevel === "topik1"
            ? {
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transform: "translateZ(2px)",
              }
            : {}
        }
      >
        {selectedLevel === "topik1" && (
          <motion.div
            layoutId="level-indicator"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          />
        )}
        <span className="relative z-10">TOPIK 1</span>
      </button>

      <button
        onClick={() => onLevelChange("topik2")}
        className={`relative px-6 py-2.5 rounded-full font-display font-semibold text-sm transition-all touch-manipulation ${
          selectedLevel === "topik2" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        style={
          selectedLevel === "topik2"
            ? {
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transform: "translateZ(2px)",
              }
            : {}
        }
      >
        {selectedLevel === "topik2" && (
          <motion.div
            layoutId="level-indicator"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          />
        )}
        <span className="relative z-10">TOPIK 2</span>
      </button>
    </div>
  )
}
