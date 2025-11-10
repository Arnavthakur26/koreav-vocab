"use client"

import { motion } from "framer-motion"

export function ExampleLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Rotating book/pages representing learning */}
          <motion.path
            d="M30 30 L50 25 L70 30 L70 70 L50 75 L30 70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M50 25 L50 75"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          {/* AI sparkle/stars */}
          <motion.circle
            cx="20"
            cy="40"
            r="2"
            fill="currentColor"
            className="text-accent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5,
            }}
          />
          <motion.circle
            cx="80"
            cy="60"
            r="2"
            fill="currentColor"
            className="text-accent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1,
            }}
          />
          <motion.circle
            cx="50"
            cy="15"
            r="2"
            fill="currentColor"
            className="text-accent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1.5,
            }}
          />
          {/* Rotating circle representing AI thinking */}
          <motion.circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="20 10"
            className="text-primary/30"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ originX: "50px", originY: "50px" }}
          />
        </svg>
      </div>
    </div>
  )
}
