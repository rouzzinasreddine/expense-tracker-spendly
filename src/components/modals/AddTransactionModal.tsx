"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  transactionId?: string;
  initialData?: any;
  onSuccess?: () => void;
}

export default function AddTransactionModal({
  open,
  onClose,
  mode = "create",
  transactionId,
  initialData,
  onSuccess,
}: AddTransactionModalProps) {
  const router = useRouter();

  const [type, setType] = useState<"expense" | "income">("expense");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Categories
  useEffect(() => {
    if (open) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setCategories(data);
        })
        .catch(console.error);
    }
  }, [open]);

  // Pre-populate if edit
  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setType(initialData.type.toLowerCase() as "expense" | "income");
      setMerchant(initialData.title);
      setAmount(initialData.amount.toString());
      setCategoryId(initialData.category.id);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setNotes(initialData.note || "");
    } else if (open && mode === "create") {
      setType("expense");
      setMerchant("");
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
      setNotes("");
    }
  }, [open, mode, initialData]);

  // Manage Category dropdown defaults
  useEffect(() => {
    const validCats = categories.filter(c => c.type === type.toUpperCase());
    if (validCats.length > 0) {
      // If we are editing, only override if current category is invalid for this type
      if (mode === "edit" && initialData && initialData.type.toLowerCase() === type) {
        setCategoryId(initialData.category.id);
      } else {
        setCategoryId(validCats[0].id);
      }
    } else {
      setCategoryId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, categories, mode]); // Omit initialData to prevent aggressive resets

  if (!open) return null;

  const validCategories = categories.filter(c => c.type === type.toUpperCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount || !categoryId || !date) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = mode === "edit" ? `/api/transactions/${transactionId}` : "/api/transactions";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: merchant,
          amount,
          type: type.toUpperCase(),
          categoryId,
          date,
          note: notes,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success(mode === "edit" ? "Transaction updated successfully!" : "Transaction added successfully!");
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
      
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(mode === "edit" ? "Failed to update transaction" : "Failed to add transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#252a32] border-none rounded-xl px-4 py-4 text-[#dee3ec] placeholder:text-[#c7c4d7]/30 focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]/30 transition-all text-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e141a]/75 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-[#171c23] rounded-2xl shadow-[0_0_60px_rgba(192,193,255,0.08)] border border-[#464554]/15 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#dee3ec]">
              {mode === "edit" ? "Edit Transaction" : "New Transaction"}
            </h2>
            <p className="text-[#c7c4d7] text-sm mt-1">
              Record your latest financial activity
            </p>
          </div>
          <button
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            className="p-2 hover:bg-[#252a32] rounded-full text-[#c7c4d7] transition-colors disabled:opacity-30"
          >
            <i className="fi fi-rr-cross-small text-lg" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="px-8 mb-6">
          <div className="flex p-1 bg-[#090f15] rounded-xl border border-[#464554]/10">
            <button
              type="button"
              onClick={() => setType("expense")}
              disabled={isSubmitting}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                type === "expense"
                  ? "bg-[#30353d] text-[#c0c1ff]"
                  : "text-[#c7c4d7] hover:text-[#dee3ec]"
              )}
            >
              <i className="fi fi-rr-arrow-down text-base" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              disabled={isSubmitting}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                type === "income"
                  ? "bg-[#30353d] text-[#4edea3]"
                  : "text-[#c7c4d7] hover:text-[#dee3ec]"
              )}
            >
              <i className="fi fi-rr-arrow-up text-base" />
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
            <div className="relative">
              <i className="fi fi-rr-edit absolute left-4 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-sm pointer-events-none" />
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Starbucks Reserve"
                className={cn(inputClass, "pl-10")}
              />
            </div>
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c7c4d7] font-mono text-base flex">
                  <i className="fi fi-rr-dollar text-base" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  disabled={isSubmitting}
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
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className={cn(inputClass, "appearance-none cursor-pointer pl-10 truncate")}
                >
                  <option value="" disabled>Select category</option>
                  {validCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  {validCategories.length === 0 && (
                    <option disabled>No categories available</option>
                  )}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c7c4d7] pointer-events-none text-xs">
                  ▾
                </span>
                <i className="fi fi-rr-list absolute left-4 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-sm pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Date + Receipt */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
                Transaction Date
              </label>
              <div className="relative">
                <i className="fi fi-rr-calendar absolute left-4 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-sm pointer-events-none z-10" />
                <input
                  type="date"
                  required
                  disabled={isSubmitting}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={cn(inputClass, "pl-10 cursor-pointer")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#c7c4d7]/70 ml-1">
                Receipt Image
              </label>
              <div className="w-full bg-[#252a32] border border-dashed border-[#464554]/40 rounded-xl px-4 py-4 flex items-center justify-center gap-2 cursor-pointer hover:border-[#c0c1ff]/50 transition-colors group h-[56px] opacity-70">
                <i className="fi fi-rr-cloud-upload text-base text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors" />
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
            <div className="relative">
              <i className="fi fi-rr-memo absolute left-4 top-[18px] text-[#c7c4d7] text-sm pointer-events-none z-10" />
              <textarea
                rows={3}
                disabled={isSubmitting}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add details about this purchase..."
                className={cn(inputClass, "resize-none pl-10")}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] text-[#1000a9] font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(128,131,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <i className={`fi ${isSubmitting ? 'fi-rr-spinner animate-spin' : 'fi-rr-check-circle'} text-lg`} />
              {isSubmitting ? "Committing..." : (mode === "edit" ? "Save Changes" : "Add Transaction")}
            </button>
          </div>
        </form>

        {/* Brand Bar */}
        <div className="bg-[#30353d] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_6px_rgba(78,222,163,0.6)]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#c7c4d7]">
              Syncing with Application Router
            </span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fi fi-rr-database text-[10px] text-[#c7c4d7]" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#c7c4d7]">
              REST Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
