"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/profile",   icon: "👤", label: "Profile" },
  { href: "/play",      icon: "🎮", label: "Play" },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    toast.success("See you next time! 👋");
    router.push("/login");
  }

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-30"
      style={{
        background: "linear-gradient(180deg, #0f2419 0%, #0c1f14 100%)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="text-3xl group-hover:scale-110 transition-transform">🌿</span>
          <span className="font-display text-xl font-bold" style={{ color: "var(--cream)" }}>
            LogicLand
          </span>
        </Link>
      </div>

      {/* User mini card */}
      {user && (
        <div className="mx-4 mb-6 p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{user.avatar}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--cream)" }}>{user.username}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{user.skill_level}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--amber)" }}>⚡ {user.xp_points.toLocaleString()} XP</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "text-cream"
                    : "hover:bg-white/5"
                )}
                style={
                  active
                    ? { background: "var(--leaf)", color: "var(--cream)" }
                    : { color: "var(--muted)" }
                }
              >
                <span className="text-lg">{icon}</span>
                {label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-1">
        <div className="px-4 py-2.5 rounded-xl text-xs" style={{ color: "var(--muted2)", background: "var(--surface)" }}>
          <p className="font-mono">🔥 Logi AI is watching</p>
          <p className="mt-0.5">Adapting to your learning style</p>
        </div>
        <motion.button
          whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: "var(--terra2)" }}
        >
          <span>🚪</span> Log Out
        </motion.button>
      </div>
    </motion.aside>
  );
}
