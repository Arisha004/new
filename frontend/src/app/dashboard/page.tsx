"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { dashboardApi } from "@/lib/api";
import type { DashboardData } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import XPChart from "@/components/dashboard/XPChart";
import AITipCard from "@/components/dashboard/AITipCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import BadgeGrid from "@/components/dashboard/BadgeGrid";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          🌿
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p style={{ color: "var(--muted)" }}>Failed to load dashboard.</p>
      </div>
    );
  }

  const { user, stats, modules, recent_activity, badges, weekly_xp, ai_tip } = data;
  const xpToNextLevel = 2000;
  const xpPct = Math.min(100, Math.round((stats.xp_points / xpToNextLevel) * 100));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: "var(--cream)" }}>
            Welcome back, {user.avatar} {user.full_name}!
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Your learning adventure continues — keep going! 🚀
          </p>
        </div>
        {/* XP Progress */}
        <div className="hidden md:block text-right">
          <p className="text-xs mb-1.5 font-medium" style={{ color: "var(--muted)" }}>
            ⚡ {stats.xp_points.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </p>
          <div className="w-40 h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--leaf), var(--amber))" }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted2)" }}>{xpPct}% to next level</p>
        </div>
      </motion.div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="⚡" label="Total XP" value={stats.xp_points.toLocaleString()}
                  sub="All time" color="var(--amber)" delay={0} />
        <StatCard icon="🔥" label="Day Streak" value={`${stats.streak_days} days`}
                  sub="Keep it up!" color="var(--terra2)" delay={0.1} glow />
        <StatCard icon="🎯" label="Accuracy" value={`${stats.accuracy_overall}%`}
                  sub="Overall score" color="var(--sky2)" delay={0.2} />
        <StatCard icon="🏆" label="Leaderboard" value={`#${stats.rank}`}
                  sub="Global rank" color="var(--lav2)" delay={0.3} />
      </div>

      {/* Main Grid: modules + right sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Modules + Charts */}
        <div className="lg:col-span-2 space-y-6">

          {/* AI Tip */}
          <AITipCard tip={ai_tip} />

          {/* Modules */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold" style={{ color: "var(--cream)" }}>
                📚 Learning Modules
              </h2>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                {stats.modules_mastered}/{stats.total_modules} mastered
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((m, i) => (
                <ModuleCard key={m.name} module={m} delay={i * 0.08} />
              ))}
            </div>
          </motion.div>

          {/* XP Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-5"
          >
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--cream)" }}>
              📈 Weekly XP Progress
            </h2>
            <XPChart data={weekly_xp} />
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-5"
          >
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--cream)" }}>
              🏅 Badges Earned
            </h2>
            {badges.length > 0
              ? <BadgeGrid badges={badges} />
              : <p className="text-sm" style={{ color: "var(--muted)" }}>No badges yet — keep learning!</p>
            }
          </motion.div>

          {/* Today's Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-5"
          >
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--cream)" }}>
              🌅 Today
            </h2>
            <div className="space-y-3">
              {[
                { label: "Puzzles Solved", value: stats.puzzles_today, icon: "🧩", color: "var(--sage)" },
                { label: "Skill Level", value: stats.skill_level, icon: "📊", color: "var(--sky2)" },
                { label: "Modules Active", value: `${stats.total_modules - stats.modules_mastered}`, icon: "🔓", color: "var(--amber)" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2"
                     style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <span>{row.icon}</span>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{row.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-5"
          >
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--cream)" }}>
              ⏱ Recent Activity
            </h2>
            <ActivityFeed items={recent_activity} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
