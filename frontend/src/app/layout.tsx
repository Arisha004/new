import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "LogicLand — AI Learning for Kids",
  description: "An AI-Powered Game-Based Learning Platform for Kids",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a3a2a",
              color: "#fdf6e3",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
