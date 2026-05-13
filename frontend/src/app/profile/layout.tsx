"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { init } = useAuthStore();

  useEffect(() => {
    init();
    if (!Cookies.get("token")) router.replace("/login");
  }, [init, router]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">{children}</main>
    </div>
  );
}
