import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adobe Impact Dashboard",
  description: "AI-Augmented Engineering Metrics Dashboard - Showcasing the Cursor Effect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
