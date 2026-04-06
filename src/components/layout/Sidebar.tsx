"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SpendlyLogo } from "@/components/ui/SpendlyLogo";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "fi fi-rr-apps" },
  { href: "/transactions", label: "Transactions", icon: "fi fi-rr-arrows-repeat" },
  { href: "/categories", label: "Categories", icon: "fi fi-rr-list" },
  { href: "/settings", label: "Settings", icon: "fi fi-rr-settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-64 z-50",
        "flex flex-col py-8",
        "bg-[#0e141a]/95 backdrop-blur-xl",
        "border-r border-slate-800/50",
        "shadow-[0_0_40px_rgba(99,102,241,0.08)]"
      )}
    >
      {/* Logo + Close (mobile) */}
      <div className="px-8 mb-12 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <SpendlyLogo size={32} withText={true} />
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
        >
          <i className="fi fi-rr-cross-small text-base" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map(({ href, label, icon: IconClass }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 py-3 pl-4 pr-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all duration-200",
                isActive
                  ? "text-[#c0c1ff] font-bold bg-[#c0c1ff]/8 border-r-2 border-[#c0c1ff]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              )}
            >
              <i
                className={cn(
                  IconClass,
                  "text-base shrink-0",
                  isActive ? "text-[#c0c1ff]" : "text-slate-500"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="px-4 mt-auto space-y-1">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 py-3 pl-4 pr-3 rounded-xl text-xs uppercase tracking-wider font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all"
        >
          <i className="fi fi-rr-user text-base text-slate-500 shrink-0" />
          Profile
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 py-3 pl-4 pr-3 rounded-xl text-xs uppercase tracking-wider font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <i className="fi fi-rr-sign-out text-base text-red-500 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile: overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 animate-backdrop"
            onClick={onClose}
          />
          {/* Sidebar */}
          <div className="relative animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
