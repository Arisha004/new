"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import Cookies from "js-cookie";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { init, isLoading } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    init();
    // Wait for init to complete before checking auth
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
    }
    setChecked(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!checked || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-4xl animate-spin">🌿</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
