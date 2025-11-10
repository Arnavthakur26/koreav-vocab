"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  delay: number
  size: number
}

interface SparklesProps {
  trigger: boolean
  color?: string
}

export function Sparkles({ trigger, color = "#a78bfa" }: SparklesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        x: 0,
        y: 0,
        angle: (i * 360) / 16,
        delay: i * 0.015,
        size: Math.random() * 8 + 3,
      }))
      setParticles(newParticles)

      setTimeout(() => setParticles([]), 900)
    }
  }, [trigger])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            boxShadow: `0 0 ${particle.size * 3}px ${color}`,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: Math.cos((particle.angle * Math.PI) / 180) * 80,
            y: Math.sin((particle.angle * Math.PI) / 180) * 80,
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.7,
            delay: particle.delay,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      ))}
    </div>
  )
}
