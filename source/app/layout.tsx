import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repbook — Gym progress tracker",
  description: "Track every set, rep, and weight. A simple workout journal for your stronger start.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
