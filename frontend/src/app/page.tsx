"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/play");
  }, [router]);
  return (
    <div style={{ background: "#0c1f14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "3rem" }}>🌿</div>
    </div>
  );
}
