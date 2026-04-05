"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ReceiptText,
  FolderOpen,
  Settings,
  UserCircle,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/categories", label: "Categories", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-64 z-50",
        "flex flex-col py-8",
        "bg-[#0e141a]/80 backdrop-blur-xl",
        "border-r border-slate-800/50",
        "shadow-[0_0_40px_rgba(99,102,241,0.08)]"
      )}
    >
      {/* Logo */}
      <div className="px-8 mb-12">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap
            className="w-5 h-5 text-[#c0c1ff]"
            fill="currentColor"
          />
          <h1 className="text-2xl font-black tracking-tighter text-[#c0c1ff]">
            Spendly
          </h1>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 py-3 pl-4 pr-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all duration-200",
                isActive
                  ? "text-[#c0c1ff] font-bold bg-[#c0c1ff]/8 border-r-2 border-[#c0c1ff]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-[#c0c1ff]" : "text-slate-500"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="px-4 mt-auto">
        <Link
          href="/settings"
          className="flex items-center gap-3 py-3 pl-4 pr-3 rounded-xl text-xs uppercase tracking-wider font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all"
        >
          <UserCircle className="w-5 h-5 text-slate-500 shrink-0" />
          Profile
        </Link>
      </div>
    </aside>
  );
}
