"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { aiApi } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";

interface Puzzle {
  id: number;
  module: string;
  icon: string;
  type: string;
  question: string;
  code?: string;
  options: string[];
  correct: number;
  explanation: string;
  xp: number;
}

const PUZZLES: Puzzle[] = [
  {
    id: 1, module: "Variables", icon: "📦", type: "Multiple Choice",
    question: "What will this code print?",
    code: 'name = "Alex"\nage = 12\nprint(name + " is " + str(age))',
    options: ["name is age", "Alex is 12", "Alex is age", "Error"],
    correct: 1, xp: 50,
    explanation: "str(age) converts the number 12 to a string, then + joins them to produce \"Alex is 12\".",
  },
  {
    id: 2, module: "Loops", icon: "🔄", type: "Predict Output",
    question: "How many times does this loop run?",
    code: 'for i in range(5):\n    print("Hello")',
    options: ["4 times", "5 times", "6 times", "Forever"],
    correct: 1, xp: 60,
    explanation: "range(5) yields 0,1,2,3,4 — exactly 5 values — so the loop body runs 5 times.",
  },
  {
    id: 3, module: "Conditionals", icon: "🔀", type: "Fix the Bug",
    question: "What is wrong with this code?",
    code: 'score = 85\nif score > 90\n    print("A grade")',
    options: ["score must be a string", "Missing colon after if condition", "print needs brackets", "Nothing is wrong"],
    correct: 1, xp: 70,
    explanation: "Python if-statements must end with a colon (:). The correct line is: if score > 90:",
  },
  {
    id: 4, module: "Functions", icon: "⚙️", type: "Trace the Code",
    question: "What does this function return?",
    code: "def double(x):\n    return x * 2\n\nresult = double(7)",
    options: ["7", "2", "14", "double"],
    correct: 2, xp: 80,
    explanation: "double(7) passes 7 as x, then returns x * 2 = 7 * 2 = 14.",
  },
  {
    id: 5, module: "Variables", icon: "📦", type: "Concept Check",
    question: "Which of these correctly creates a list in Python?",
    options: ["myList = (1, 2, 3)", "myList = {1, 2, 3}", "myList = [1, 2, 3]", "myList = <1, 2, 3>"],
    correct: 2, xp: 50,
    explanation: "Square brackets [] create lists. Parentheses () create tuples; curly braces {} create sets or dicts.",
  },
  {
    id: 6, module: "Loops", icon: "🔄", type: "Predict Output",
    question: "What does this print?",
    code: "total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)",
    options: ["3", "6", "10", "4"],
    correct: 1, xp: 70,
    explanation: "range(1,4) gives 1,2,3. Summing them: 0+1+2+3 = 6.",
  },
  {
    id: 7, module: "Functions", icon: "⚙️", type: "Multiple Choice",
    question: "What keyword defines a function in Python?",
    options: ["func", "function", "def", "define"],
    correct: 2, xp: 40,
    explanation: "In Python, functions are defined using the 'def' keyword, followed by the function name.",
  },
  {
    id: 8, module: "Conditionals", icon: "🔀", type: "Concept Check",
    question: "Which operator checks if two values are equal?",
    options: ["=", "=>", "==", "!="],
    correct: 2, xp: 40,
    explanation: "== checks equality. A single = is assignment. != checks if values are NOT equal.",
  },
];

const MODULES = ["All", "Variables", "Loops", "Conditionals", "Functions"];

export default function PlayPage() {
  const router = useRouter();
  const { init } = useAuthStore();
  const [filter, setFilter] = useState("All");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [hintText, setHintText] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "bot" as const, text: "Hey! I'm Logi 🌿 Your AI coding tutor. Ask me anything about the puzzle, or type 'hint' for a nudge!" },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (!Cookies.get("token")) router.replace("/login");
  }, [router]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const filtered = filter === "All" ? PUZZLES : PUZZLES.filter(p => p.module === filter);
  const puzzle = filtered[idx % filtered.length];

  function handleAnswer(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === puzzle.correct) {
      setSessionXP(x => x + puzzle.xp);
      setCorrect(c => c + 1);
      toast.success(`+${puzzle.xp} XP! Correct! 🎉`);
    } else {
      toast.error("Not quite — read the explanation! 💡");
    }
  }

  function nextPuzzle() {
    setSelected(null);
    setAnswered(false);
    setHintText("");
    setIdx(i => (i + 1) % filtered.length);
  }

  async function getHint() {
    setHintLoading(true);
    try {
      const res = await aiApi.hint({ module: puzzle.module, puzzle_description: puzzle.question, skill_level: "Intermediate" });
      setHintText(res.hint);
    } catch {
      setHintText(`Think step by step — what do you know about ${puzzle.module}? 💡`);
    } finally { setHintLoading(false); }
  }

  async function sendChat() {
    const msg = chatMsg.trim();
    if (!msg) return;
    setChatMsg("");
    setChatHistory(h => [...h, { role: "user", text: msg }]);
    setChatLoading(true);
    try {
      const res = await aiApi.chat(msg);
      setChatHistory(h => [...h, { role: "bot", text: res.reply }]);
    } catch {
      setChatHistory(h => [...h, { role: "bot", text: "I hit a snag! Try rephrasing your question 🤔" }]);
    } finally { setChatLoading(false); }
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3"
             style={{ background: "rgba(12,31,20,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg" style={{ color: "var(--cream)" }}>🎮 Play</span>
            <span className="text-xs px-2 py-1 rounded-full font-mono"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)" }}>
              {(idx % filtered.length) + 1} / {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold" style={{ color: "var(--amber)" }}>⚡ {sessionXP} XP</span>
            <span className="text-sm" style={{ color: "var(--sage)" }}>✅ {correct} correct</span>
          </div>
        </div>

        <div className="flex flex-1 gap-0">
          {/* LEFT: Puzzle area */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Module filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {MODULES.map(m => (
                <button key={m} onClick={() => { setFilter(m); setIdx(0); setSelected(null); setAnswered(false); setHintText(""); }}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: filter === m ? "var(--leaf)" : "rgba(255,255,255,0.05)",
                    color: filter === m ? "var(--cream)" : "var(--muted)",
                    border: filter === m ? "1px solid var(--leaf)" : "1px solid var(--border)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    cursor: "pointer",
                  }}>
                  {m}
                </button>
              ))}
            </div>

            {/* Puzzle card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={puzzle.id + filter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-6 max-w-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-2 items-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: "rgba(74,140,92,0.2)", color: "var(--sage)" }}>
                      {puzzle.icon} {puzzle.module}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs"
                          style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}>
                      {puzzle.type}
                    </span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--amber)" }}>⚡ {puzzle.xp} XP</span>
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div
                      animate={{ width: `${((idx % filtered.length) + 1) / filtered.length * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--leaf), var(--amber))" }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-base font-semibold mb-4" style={{ color: "var(--cream)" }}>
                  🎯 {puzzle.question}
                </h2>

                {/* Code block */}
                {puzzle.code && (
                  <pre className="mb-5 px-4 py-3 rounded-xl text-sm overflow-x-auto font-mono"
                       style={{ background: "rgba(0,0,0,0.4)", color: "#7fb896", border: "1px solid var(--border)", lineHeight: 1.7 }}>
                    {puzzle.code}
                  </pre>
                )}

                {/* Options */}
                <div className="space-y-3 mb-5">
                  {puzzle.options.map((opt, i) => {
                    let bg = "rgba(255,255,255,0.04)", border = "var(--border)", color = "var(--cream)";
                    if (answered) {
                      if (i === puzzle.correct) { bg = "rgba(74,140,92,0.18)"; border = "var(--leaf)"; color = "var(--sage)"; }
                      else if (i === selected) { bg = "rgba(196,96,58,0.18)"; border = "var(--terra)"; color = "var(--terra2)"; }
                      else { color = "var(--muted2)"; }
                    }
                    return (
                      <motion.button
                        key={i}
                        whileHover={!answered ? { x: 6 } : {}}
                        whileTap={!answered ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(i)}
                        disabled={answered}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                        style={{ background: bg, border: `1px solid ${border}`, color, cursor: answered ? "default" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: "rgba(255,255,255,0.08)" }}>
                          {["A","B","C","D"][i]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {answered && i === puzzle.correct && <span>✅</span>}
                        {answered && i === selected && i !== puzzle.correct && <span>❌</span>}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4 p-4 rounded-xl overflow-hidden"
                      style={{ background: "rgba(74,140,92,0.1)", border: "1px solid rgba(74,140,92,0.25)" }}
                    >
                      <p className="text-xs font-bold mb-1" style={{ color: "var(--sage)" }}>💡 Explanation</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--cream)" }}>{puzzle.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hint */}
                <AnimatePresence>
                  {hintText && !answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4 p-4 rounded-xl overflow-hidden"
                      style={{ background: "rgba(232,160,48,0.1)", border: "1px solid rgba(232,160,48,0.25)" }}
                    >
                      <p className="text-xs font-bold mb-1" style={{ color: "var(--amber)" }}>🧠 Logi's Hint</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--cream)" }}>{hintText}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="flex gap-3">
                  {!answered ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={getHint} disabled={hintLoading}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                      style={{ background: "rgba(232,160,48,0.15)", color: "var(--amber)", border: "1px solid rgba(232,160,48,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>
                      {hintLoading ? "🤔 Thinking..." : "💡 Get a Hint"}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={nextPuzzle}
                      className="flex-1 py-3 rounded-xl text-sm font-bold"
                      style={{ background: "var(--leaf)", color: "var(--cream)", border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>
                      Next Puzzle →
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Logi chat */}
          <div className="w-80 border-l flex flex-col" style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}>
            {/* Chat header */}
            <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <span className="text-2xl">🧠</span>
              </motion.div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--cream)" }}>Logi AI Tutor</p>
                <p className="text-xs" style={{ color: "var(--sage)" }}>● Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                       style={{
                         background: msg.role === "user" ? "var(--leaf)" : "rgba(255,255,255,0.06)",
                         color: "var(--cream)",
                         border: msg.role === "bot" ? "1px solid var(--border)" : "none",
                       }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                    🤔 Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
              <input
                className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--cream)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                placeholder="Ask Logi anything..."
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
              />
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={sendChat} disabled={chatLoading}
                className="px-3 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                style={{ background: "var(--leaf)", color: "var(--cream)", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ↑
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
