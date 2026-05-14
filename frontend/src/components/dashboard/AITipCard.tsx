"use client";
import { motion } from "motion/react";

export default function AITipCard({ tip }: { tip: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass rounded-2xl p-5"
      style={{ borderLeft: "3px solid var(--sage)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🧠</span>
        <span className="text-sm font-bold" style={{ color: "var(--sage)" }}>Logi AI Tip</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(127,184,150,0.15)", color: "var(--sage)" }}>
          Personalised
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--cream)" }}>{tip}</p>
    </motion.div>
  );
}
