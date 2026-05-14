"use client";
import { motion } from "motion/react";
import type { ModuleCard as ModuleCardType } from "@/types";

interface Props {
  module: ModuleCardType;
  delay?: number;
}

export default function ModuleCard({ module: m, delay = 0 }: Props) {
  const pct = Math.round((m.puzzles_completed / m.total_puzzles) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass rounded-2xl p-5 flex flex-col gap-3 cursor-default relative overflow-hidden"
    >
      {/* Colored accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: m.color }} />

      {/* Header */}
      <div className="flex items-start justify-between mt-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{m.icon}</span>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--cream)" }}>{m.name}</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Tier {m.difficulty_tier}/10
            </p>
          </div>
        </div>
        {m.is_mastered && (
          <span className="text-xs px-2 py-1 rounded-full font-bold"
                style={{ background: "rgba(74,140,92,0.25)", color: "#7fb896" }}>
            ✓ Mastered
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted)" }}>
          <span>{m.puzzles_completed}/{m.total_puzzles} puzzles</span>
          <span style={{ color: m.color }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: delay + 0.3 }}
            className="h-full rounded-full"
            style={{ background: m.color }}
          />
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--muted)" }}>Accuracy</span>
        <span className="font-mono font-semibold" style={{ color: m.accuracy_rate >= 80 ? "#7fb896" : m.accuracy_rate >= 60 ? "#e8a030" : "#c4603a" }}>
          {m.accuracy_rate}%
        </span>
      </div>
    </motion.div>
  );
}
