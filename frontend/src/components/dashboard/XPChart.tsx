"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { WeeklyXP } from "@/types";

interface Props { data: WeeklyXP[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs" style={{ border: "1px solid var(--border2)" }}>
        <p style={{ color: "var(--muted)" }}>{label}</p>
        <p className="font-bold" style={{ color: "var(--amber)" }}>⚡ {payload[0].value} XP</p>
      </div>
    );
  }
  return null;
};

export default function XPChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: "rgba(253,246,227,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(253,246,227,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="xp" fill="var(--leaf)" radius={[6,6,0,0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
