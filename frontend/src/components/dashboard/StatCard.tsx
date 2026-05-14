"use client";
import { motion } from "motion/react";

interface Props {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  delay?: number;
  glow?: boolean;
}

export default function StatCard({ icon, label, value, sub, color = "var(--leaf)", delay = 0, glow }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass rounded-2xl p-5 flex flex-col gap-2 cursor-default ${glow ? "glow-amber" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs px-2 py-1 rounded-full font-mono"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)" }}>
          LIVE
        </span>
      </div>
      <div>
        <p className="text-3xl font-display font-bold" style={{ color }}>{value}</p>
        <p className="text-sm font-medium mt-0.5" style={{ color: "var(--muted)" }}>{label}</p>
        {sub && <p className="text-xs mt-1" style={{ color: "var(--muted2)" }}>{sub}</p>}
      </div>
    </motion.div>
  );
}
