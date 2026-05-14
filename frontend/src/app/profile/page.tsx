"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { profileApi } from "@/lib/api";
import type { ProfileData } from "@/types";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

const LEVEL_THRESHOLDS = [
  { label: "Sprout",       min: 0,    color: "#7fb896" },
  { label: "Explorer",     min: 500,  color: "#2a90a8" },
  { label: "Intermediate", min: 1000, color: "#e8a030" },
  { label: "Advanced",     min: 2000, color: "#c4603a" },
  { label: "Master",       min: 5000, color: "#7b6fa0" },
];

function getLevel(xp: number) {
  return [...LEVEL_THRESHOLDS].reverse().find((l) => xp >= l.min) || LEVEL_THRESHOLDS[0];
}

export default function ProfilePage() {
  const { user: authUser, init } = useAuthStore();
  const [profile, setProfile]   = useState<ProfileData | null>(null);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ full_name: "", age: 12, avatar: "🦊" });

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    profileApi.get()
      .then((p) => {
        setProfile(p);
        setForm({ full_name: p.full_name, age: p.age, avatar: p.avatar });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await profileApi.update(form);
      setProfile(updated);
      setEditing(false);
      toast.success("Profile updated! ✨");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Update failed");
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-4xl">🌿</motion.div>
      </div>
    );
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen"><p style={{ color: "var(--muted)" }}>Failed to load profile.</p></div>;
  }

  const level = getLevel(profile.xp_points);
  const nextLevel = LEVEL_THRESHOLDS.find((l) => l.min > profile.xp_points) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpToNext = nextLevel.min - profile.xp_points;
  const pct = Math.min(100, Math.round((profile.xp_points / nextLevel.min) * 100));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: "var(--cream)" }}>My Profile</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Manage your account and track your journey</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Avatar + Level card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 flex flex-col items-center text-center"
        >
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-7xl mb-4 cursor-default select-none"
            title="Edit avatar in the form below"
          >
            {editing ? form.avatar : profile.avatar}
          </motion.div>

          <h2 className="font-display text-xl font-bold" style={{ color: "var(--cream)" }}>
            {profile.username}
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{profile.email}</p>

          {/* Level badge */}
          <div className="mt-4 px-4 py-2 rounded-full text-sm font-bold"
               style={{ background: `${level.color}22`, color: level.color, border: `1px solid ${level.color}44` }}>
            {level.label} Coder
          </div>

          {/* XP bar */}
          <div className="w-full mt-5">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted)" }}>
              <span>⚡ {profile.xp_points.toLocaleString()} XP</span>
              <span>{xpToNext > 0 ? `${xpToNext} to ${nextLevel.label}` : "Max Level!"}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${level.color}, var(--amber))` }}
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 w-full mt-6 pt-5"
               style={{ borderTop: "1px solid var(--border)" }}>
            {[
              { label: "Badges", value: profile.badges_count, icon: "🏅" },
              { label: "Mastered", value: profile.modules_mastered, icon: "✅" },
              { label: "Streak", value: `${profile.streak_days}d`, icon: "🔥" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg">{s.icon}</p>
                <p className="text-base font-bold" style={{ color: "var(--cream)" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs mt-5" style={{ color: "var(--muted2)" }}>Member since {profile.member_since}</p>
        </motion.div>

        {/* Right: Edit form + info */}
        <div className="lg:col-span-2 space-y-5">

          {/* Edit card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--cream)" }}>
                ✏️ Account Info
              </h3>
              {!editing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(74,140,92,0.2)", color: "var(--sage)", border: "1px solid rgba(74,140,92,0.3)" }}
                >
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setEditing(false); setForm({ full_name: profile.full_name, age: profile.age, avatar: profile.avatar }); }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)" }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={handleSave} disabled={saving}
                    className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-60"
                    style={{ background: "var(--leaf)", color: "var(--cream)" }}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </motion.button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Display-only fields */}
              {[
                { label: "Username", value: profile.username },
                { label: "Email", value: profile.email },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--muted)" }}>{label}</label>
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--muted)" }}>
                    {value}
                  </div>
                </div>
              ))}

              {/* Editable: Full Name */}
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--muted)" }}>Full Name</label>
                {editing ? (
                  <input
                    value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--leaf)", color: "var(--cream)" }}
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--cream)" }}>
                    {profile.full_name}
                  </div>
                )}
              </div>

              {/* Editable: Age */}
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "var(--muted)" }}>Age</label>
                {editing ? (
                  <select
                    value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "#1a3a2a", border: "1px solid var(--leaf)", color: "var(--cream)" }}
                  >
                    {Array.from({ length: 13 }, (_, i) => i + 6).map((a) => (
                      <option key={a} value={a}>{a} years old</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--cream)" }}>
                    {profile.age} years old
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Avatar picker (only when editing) */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-2xl p-6 overflow-hidden"
              >
                <h3 className="font-display text-lg font-bold mb-4" style={{ color: "var(--cream)" }}>
                  🎭 Choose Avatar
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.available_avatars.map((av) => (
                    <motion.button
                      key={av}
                      whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setForm((p) => ({ ...p, avatar: av }))}
                      className="text-3xl p-2 rounded-xl transition-all"
                      style={{
                        background: form.avatar === av ? "rgba(74,140,92,0.3)" : "rgba(255,255,255,0.04)",
                        border: `2px solid ${form.avatar === av ? "var(--leaf)" : "var(--border)"}`,
                      }}
                    >
                      {av}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Summary card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-display text-lg font-bold mb-4" style={{ color: "var(--cream)" }}>
              📊 Learning Progress
            </h3>
            <div className="space-y-3">
              {[
                { label: "Skill Level", value: profile.skill_level, icon: "🎓", color: "var(--sky2)" },
                { label: "Modules Mastered", value: `${profile.modules_mastered} / ${profile.total_modules}`, icon: "✅", color: "var(--sage)" },
                { label: "Total Badges", value: profile.badges_count, icon: "🏅", color: "var(--amber)" },
                { label: "Current Streak", value: `${profile.streak_days} days`, icon: "🔥", color: "var(--terra2)" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                     style={{ background: "var(--surface)" }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{row.icon}</span>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{row.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
