import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "KARUPPASAMY C — Full Stack Developer · Creative Video Editor · AI Enthusiast",
  description:
    "Portfolio of Karuppasamy C — a developer and digital creator combining modern web technologies, creative storytelling, digital marketing and AI.",
};

export const viewport: Viewport = {
  themeColor: "#07080D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain min-h-screen antialiased">{children}</body>
    </html>
  );
}
