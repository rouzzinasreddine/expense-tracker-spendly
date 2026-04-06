"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0e141a]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <TopBar title={title} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1600px] mx-auto w-full animate-page-in">
          {children}
        </main>
      </div>
    </div>
  );
}
