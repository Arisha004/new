"use client";
import { motion } from "motion/react";
import type { ActivityItem } from "@/types";

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl glass-hover transition-all"
          style={{ background: "var(--surface)" }}
        >
          <span className="text-lg w-7 text-center">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--cream)" }}>
              {item.action}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--muted)" }}>{item.module}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-bold" style={{ color: "var(--amber)" }}>+{item.xp} XP</p>
            <p className="text-xs" style={{ color: "var(--muted2)" }}>{item.time_ago}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
