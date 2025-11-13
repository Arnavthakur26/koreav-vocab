"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  delay: number;
  size: number;
  color: string;
}

interface SparklesProps {
  trigger: boolean;
  palette?: string[];
}

export function Sparkles({
  trigger,
  palette = ["#a78bfa", "#7c3aed", "#60a5fa", "#34d399"],
}: SparklesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const now = Date.now();
      const newParticles: Particle[] = Array.from({ length: 14 }, (_, i) => ({
        id: now + i,
        x: 0,
        y: 0,
        angle: (i * 360) / 14 + Math.random() * 12,
        delay: i * 0.02,
        size: Math.random() * 8 + 4,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));
      setParticles(newParticles);
      const t = setTimeout(() => setParticles([]), 900);
      return () => clearTimeout(t);
    }
  }, [trigger, palette]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * 72,
            y: Math.sin((p.angle * Math.PI) / 180) * 72,
            scale: [0, 1.1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.72,
            delay: p.delay,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      ))}
    </div>
  );
}
