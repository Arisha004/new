"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail]       = useState("demo@logicland.io");
  const [password, setPassword] = useState("Demo1234!");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Explorer! 🌿");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
         style={{ background: "var(--bg)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full opacity-20"
           style={{ background: "radial-gradient(circle, #4a8c5c, transparent)" }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-15"
           style={{ background: "radial-gradient(circle, #e8a030, transparent)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass rounded-2xl p-8 w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-5xl mb-3"
          >
            🌿
          </motion.div>
          <h1 className="font-display text-3xl font-bold" style={{ color: "var(--cream)" }}>
            LogicLand
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            AI-Powered Learning for Young Coders
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 font-medium" style={{ color: "var(--muted)" }}>
              Email
            </label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                color: "var(--cream)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--leaf)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          <div>
            <label className="block text-sm mb-2 font-medium" style={{ color: "var(--muted)" }}>
              Password
            </label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                color: "var(--cream)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--leaf)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all mt-2 disabled:opacity-60"
            style={{ background: "var(--leaf)", color: "var(--cream)" }}
          >
            {loading ? "Signing in…" : "Enter LogicLand 🚀"}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--muted)" }}>
          New here?{" "}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--sage)" }}>
            Create account
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-4 p-3 rounded-xl text-xs text-center" style={{ background: "rgba(74,140,92,0.12)", color: "var(--sage)" }}>
          🎮 Demo pre-filled — just click &quot;Enter LogicLand&quot;!
        </div>
      </motion.div>
    </div>
  );
}
