"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "", age: "12" });
  const [loading, setLoading] = useState(false);

  function update(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, age: parseInt(form.age) });
      toast.success("Welcome to LogicLand! 🌿");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--border)",
    color: "var(--cream)",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
         style={{ background: "var(--bg)" }}>
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-20"
           style={{ background: "radial-gradient(circle, #2a90a8, transparent)" }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-15"
           style={{ background: "radial-gradient(circle, #4a8c5c, transparent)" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-7">
          <div className="text-4xl mb-2">🌱</div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--cream)" }}>Join LogicLand</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Start your coding adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Username", key: "username", type: "text", placeholder: "CodeExplorer" },
            { label: "Full Name", key: "full_name", type: "text", placeholder: "Alex Explorer" },
            { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm mb-1.5 font-medium" style={{ color: "var(--muted)" }}>{label}</label>
              <input
                type={type} required placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(e) => update(key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--leaf)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm mb-1.5 font-medium" style={{ color: "var(--muted)" }}>Age</label>
            <select
              value={form.age} onChange={(e) => update("age", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {Array.from({ length: 13 }, (_, i) => i + 6).map((a) => (
                <option key={a} value={a} style={{ background: "#1a3a2a" }}>{a} years old</option>
              ))}
            </select>
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-sm mt-2 disabled:opacity-60"
            style={{ background: "var(--leaf)", color: "var(--cream)" }}
          >
            {loading ? "Creating account…" : "Start Learning! 🚀"}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--sage)" }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
