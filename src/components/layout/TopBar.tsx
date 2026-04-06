"use client";

import { useState } from "react";
import AddTransactionModal from "@/components/modals/AddTransactionModal";

interface TopBarProps {
  title: string;
  onToggleSidebar: () => void;
}

export default function TopBar({ title, onToggleSidebar }: TopBarProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center w-full px-4 md:px-8 py-4 md:py-6 sticky top-0 z-40 bg-[#0e141a]/80 backdrop-blur-md border-b border-slate-800/30">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Hamburger — mobile only */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all flex items-center justify-center"
          >
            <i className="fi fi-rr-menu-burger text-base" />
          </button>

          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-[#dee3ec]">
            {title}
          </h2>

          {/* Search — hidden on small screens */}
          <div className="relative group hidden md:block">
            <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#c0c1ff] transition-colors" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="bg-[#252a32] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono text-[#dee3ec] placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]/30 w-64 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all items-center justify-center hidden md:flex">
            <i className="fi fi-rr-bell text-base" />
          </button>
          <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all items-center justify-center hidden md:flex">
            <i className="fi fi-rr-interrogation text-base" />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-xl font-bold text-sm text-[#1000a9] bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] shadow-[0_0_20px_rgba(192,193,255,0.2)] hover:shadow-[0_0_30px_rgba(192,193,255,0.4)] active:scale-95 transition-all"
          >
            <i className="fi fi-rr-plus text-sm" />
            <span className="hidden md:inline">Add Transaction</span>
          </button>
        </div>
      </header>

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
