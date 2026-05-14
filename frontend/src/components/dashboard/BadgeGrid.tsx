"use client";
import { motion } from "motion/react";
import type { BadgeItem } from "@/types";

export default function BadgeGrid({ badges }: { badges: BadgeItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          className="glass rounded-xl p-3 text-center cursor-default"
        >
          <div className="text-2xl mb-1">{b.icon}</div>
          <p className="text-xs font-semibold" style={{ color: "var(--cream)" }}>{b.name}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted2)" }}>{b.earned_at}</p>
        </motion.div>
      ))}
    </div>
  );
}
