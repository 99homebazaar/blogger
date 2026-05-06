import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogger",
  description: "Multi-site blog publisher",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#f5f5f7]">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col p-5 gap-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Blogger</p>
          <Link href="/" className="sidebar-link">✏️ Create Post</Link>
          <Link href="/posts" className="sidebar-link">📄 All Posts</Link>
          <Link href="/websites" className="sidebar-link">🌐 Websites</Link>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
