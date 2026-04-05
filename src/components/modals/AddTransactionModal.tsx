"use client";

import { useState } from "react";
import { X, ArrowUp, ArrowDown, CheckCircle, Lock, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  "Dining & Drinks",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Health",
  "Travel",
  "Salary",
  "Investments",
  "Software",
];

export default function AddTransactionModal({
  open,
  onClose,
}: AddTransactionModalProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to API
    onClose();
  };

  const inputClass =
    "w-full bg-[#252a32] border-none rounded-xl px-4 py-4 text-[#dee3ec] placeholder:text-[#c7c4d7]/30 focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]/30 transition-all text-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e141a]/75 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl bg-[#171c23] rounded-2xl shadow-[0_0_60px_rgba(192,193,255,0.08)] border border-[#464554]/15 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#dee3ec]">
              New Transaction
            </h2>
            <p className="text-[#c7c4d7] text-sm mt-1">
              Record your latest financial activity
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#252a32] rounded-full text-[#c7c4d7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="px-8 mb-6">
          <div className="flex p-1 bg-[#090f15] rounded-xl border border-[#464554]/10">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                type === "expense"
                  ? "bg-[#30353d] text-[#c0c1ff]"
                  : "text-[#c7c4d7] hover:text-[#dee3ec]"
              )}
            >
              <ArrowUp className="w-4 h-4" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                type === "income"
                  ? "bg-[#30353d] text-[#4edea3]"
                  : "text-[#c7c4d7] hover:text-[#dee3ec]"
              )}
            >
              <ArrowDown className="w-4 h-4" />
              Income
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-0 space-y-5">
          {/* Merchant */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
              Merchant / Description
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Starbucks Reserve"
              className={inputClass}
            />
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c7c4d7] font-mono text-base">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={cn(inputClass, "pl-8 font-mono text-xl")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(inputClass, "appearance-none cursor-pointer")}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c7c4d7] pointer-events-none text-xs">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Date + Receipt */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
                Transaction Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
                Receipt Image
              </label>
              <div className="w-full bg-[#252a32] border border-dashed border-[#464554]/40 rounded-xl px-4 py-4 flex items-center justify-center gap-2 cursor-pointer hover:border-[#c0c1ff]/50 transition-colors group h-[56px]">
                <Camera className="w-4 h-4 text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors" />
                <span className="text-sm text-[#c7c4d7] group-hover:text-[#dee3ec] transition-colors">
                  Upload
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
              Internal Note
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details about this purchase..."
              className={cn(inputClass, "resize-none")}
            />
          </div>

          {/* Submit */}
          <div className="pt-2 pb-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] text-[#1000a9] font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(128,131,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              <CheckCircle className="w-5 h-5" fill="currentColor" />
              Add Transaction
            </button>
          </div>
        </form>

        {/* Brand Bar */}
        <div className="bg-[#30353d] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_6px_rgba(78,222,163,0.6)]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#c7c4d7]">
              Syncing with Chase Bank
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-[#c7c4d7]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#c7c4d7]">
              AES-256 Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
