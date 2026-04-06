"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/layout/AppShell";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/user/data", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast.success(`Deleted ${data.deleted} transactions`);
      setShowResetDialog(false);
      router.refresh();
    } catch {
      toast.error("Failed to reset data");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AppShell title="Settings">
      <div className="max-w-2xl space-y-8 pb-12">
        {/* ── Profile Section ── */}
        <section className="bg-[#171c23] rounded-2xl p-8 border border-[#464554]/15">
          <div className="flex items-center gap-3 mb-8">
            <i className="fi fi-rr-user text-base text-[#c0c1ff]" />
            <h3 className="text-lg font-bold text-[#dee3ec]">Profile</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 block">
                Name
              </label>
              <div className="bg-[#252a32] rounded-xl px-4 py-3.5 text-sm text-[#dee3ec] font-mono border border-[#464554]/10">
                {session?.user?.name || "—"}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 block">
                Email
              </label>
              <div className="bg-[#252a32] rounded-xl px-4 py-3.5 text-sm text-[#dee3ec] font-mono border border-[#464554]/10">
                {session?.user?.email || "—"}
              </div>
            </div>
          </div>
        </section>

        {/* ── Appearance Section ── */}
        <section className="bg-[#171c23] rounded-2xl p-8 border border-[#464554]/15">
          <div className="flex items-center gap-3 mb-8">
            <i className="fi fi-rr-paint-brush text-base text-[#c0c1ff]" />
            <h3 className="text-lg font-bold text-[#dee3ec]">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#dee3ec]">Dark Mode</p>
              <p className="text-xs text-slate-500 mt-1">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                darkMode ? "bg-[#c0c1ff]" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  darkMode ? "translate-x-7" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </section>

        {/* ── Danger Zone ── */}
        <section className="bg-[#171c23] rounded-2xl p-8 border border-[#ffb2b7]/15">
          <div className="flex items-center gap-3 mb-8">
            <i className="fi fi-rr-triangle-warning text-base text-[#ffb2b7]" />
            <h3 className="text-lg font-bold text-[#ffb2b7]">Danger Zone</h3>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#dee3ec]">Reset all data</p>
              <p className="text-xs text-slate-500 mt-1">
                Permanently delete all your transactions. Categories will be preserved.
              </p>
            </div>
            <button
              onClick={() => setShowResetDialog(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#ffb2b7]/30 text-[#ffb2b7] font-bold text-sm hover:bg-[#ffb2b7]/10 transition-all shrink-0"
            >
              <i className="fi fi-rr-trash text-xs" />
              Reset Data
            </button>
          </div>
        </section>

        {/* ── App Info ── */}
        <div className="text-center pt-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
            Spendly v1.0 · Built with Next.js 15 & Prisma
          </p>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={(v) => !v && setShowResetDialog(false)}>
        <DialogContent className="bg-[#1b2027] border-[#464554]/20 text-[#dee3ec]">
          <DialogHeader>
            <DialogTitle className="text-xl">Reset All Data</DialogTitle>
            <DialogDescription className="text-slate-400">
              This will permanently delete all your transactions. This action cannot be undone.
              Your categories will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 border-none bg-transparent">
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-white"
              onClick={() => setShowResetDialog(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetData}
              disabled={isResetting}
              className="bg-gradient-to-r from-[#ffb2b7] to-[#e64c58] text-[#3b0d11] font-bold border-none hover:opacity-90 disabled:opacity-50"
            >
              {isResetting ? "Resetting..." : "Delete All Transactions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
