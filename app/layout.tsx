import type { Metadata } from "next";
// FIX: Import React to use React.ReactNode type.
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turnform - Gymnastics AI Coach & Tracker",
  description: "An application for gymnasts to track their skill repetitions to prevent overuse injuries and receive AI-powered coaching feedback on their form by analyzing uploaded videos and photos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
