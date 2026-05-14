"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/landing.html";
  }, []);

  return (
    <div style={{ background: "#0c1f14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "3rem" }}>🌿</div>
    </div>
  );
}