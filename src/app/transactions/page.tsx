"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import ErrorState from "@/components/ui/ErrorState";

type Filter = "ALL" | "INCOME" | "EXPENSE";

export default function TransactionsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Modal hooks
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        type: filter,
        page: page.toString(),
        limit: "10",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/transactions?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data.transactions);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  }, [filter, page, debouncedSearch]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  const executeDelete = async () => {
    if (!transactionToDelete) return;
    const targetId = transactionToDelete.id;

    const previousTransactions = [...transactions];
    setTransactions((prev) => prev.filter((t) => t.id !== targetId));
    setTransactionToDelete(null);

    try {
      const res = await fetch(`/api/transactions/${targetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Transaction deleted");
      fetchTransactions();
    } catch {
      toast.error("Failed to delete");
      setTransactions(previousTransactions);
    }
  };

  // Error state
  if (error && !isLoading) {
    return (
      <AppShell title="Transactions">
        <ErrorState message={error} onRetry={fetchTransactions} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Transactions">
      <div className="space-y-8 pb-12">
        {/* Filter + Search Bar */}
        <section className="flex flex-wrap items-center gap-3">
          {(["ALL", "INCOME", "EXPENSE"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={cn(
                "px-4 md:px-6 py-2 rounded-full text-sm font-semibold transition-all capitalize",
                filter === f
                  ? "bg-[#c0c1ff] text-[#1000a9] shadow-lg shadow-[#c0c1ff]/10"
                  : "border border-[#464554]/25 text-[#c7c4d7] hover:bg-[#252a32]"
              )}
            >
              {f.toLowerCase()}
            </button>
          ))}
          <div className="h-6 w-px bg-[#464554]/20 mx-1 hidden md:block" />
          {/* Search input */}
          <div className="relative group w-full md:w-auto order-last md:order-none mt-2 md:mt-0">
            <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#c0c1ff] transition-colors text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full md:w-56 bg-[#252a32] border-none rounded-xl py-2 pl-9 pr-4 text-sm font-mono text-[#dee3ec] placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]/30 transition-all"
            />
          </div>
        </section>

        {/* Transactions Table Box */}
        <div className="bg-[#171c23] rounded-2xl overflow-hidden border border-[#464554]/10 shadow-2xl relative">
          {/* Header — desktop only */}
          <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-[#464554]/10 bg-[#090f15]/40 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 hidden md:grid">
            <div className="col-span-1">Ref</div>
            <div className="col-span-4">Transaction Details</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3 text-right pr-12">Amount (USD)</div>
          </div>

          <div className="divide-y divide-transparent p-2 space-y-1">
            {isLoading ? (
              <>
                {/* Desktop skeletons */}
                <div className="space-y-2 p-2 hidden md:block">
                  <Skeleton variant="row" className="h-[73px]" />
                  <Skeleton variant="row" className="h-[73px]" />
                  <Skeleton variant="row" className="h-[73px]" />
                  <Skeleton variant="row" className="h-[73px]" />
                  <Skeleton variant="row" className="h-[73px]" />
                </div>
                {/* Mobile skeletons */}
                <div className="space-y-2 p-2 md:hidden">
                  <Skeleton variant="card" className="h-20" />
                  <Skeleton variant="card" className="h-20" />
                  <Skeleton variant="card" className="h-20" />
                </div>
              </>
            ) : transactions.length === 0 ? (
              /* ── Empty State ── */
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#c0c1ff]/8 flex items-center justify-center mb-6">
                  <i className="fi fi-rr-inbox text-4xl text-[#c0c1ff]/40" />
                </div>
                <h3 className="text-xl font-bold text-[#dee3ec] mb-2">No transactions yet</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs">
                  {debouncedSearch
                    ? `No results found for "${debouncedSearch}"`
                    : "Add your first transaction to get started"}
                </p>
                {!debouncedSearch && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] text-[#1000a9] font-bold text-sm shadow-lg shadow-[#c0c1ff]/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <i className="fi fi-rr-plus text-xs" />
                    Add Transaction
                  </button>
                )}
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 items-center rounded-xl transition-all cursor-pointer group relative hover:bg-[#1f2937]/50 duration-200"
                >
                  {/* Icon — desktop */}
                  <div className="col-span-1 hidden md:flex items-center justify-center h-10 w-10 bg-slate-800/40 rounded-lg text-xl shrink-0">
                    <i className={`fi ${tx.category.icon} text-base`} />
                  </div>

                  {/* Mobile card layout */}
                  <div className="md:hidden flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800/40 rounded-lg flex items-center justify-center shrink-0">
                        <i className={`fi ${tx.category.icon} text-base`} />
                      </div>
                      <div>
                        <p className="font-bold text-[#dee3ec] text-sm truncate max-w-[160px]">{tx.title}</p>
                        <p className="text-xs text-slate-500 font-mono">
                          {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {" · "}
                          <span className={tx.type === "INCOME" ? "text-[#4edea3]" : "text-slate-400"}>{tx.category.name}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("font-mono text-base font-bold", tx.type === "INCOME" ? "text-[#4edea3]" : "text-[#ffb2b7]")}>
                        {tx.type === "INCOME" ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                      <button onClick={() => setTransactionToEdit(tx)} className="p-1.5 rounded-lg hover:bg-[#30353d]">
                        <i className="fi fi-rr-edit text-[#c0c1ff] text-xs" />
                      </button>
                      <button onClick={() => setTransactionToDelete(tx)} className="p-1.5 rounded-lg hover:bg-[#3b2a2d]">
                        <i className="fi fi-rr-trash text-[#ffb2b7] text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop columns */}
                  <div className="col-span-4 hidden md:block">
                    <p className="font-bold text-[#dee3ec] group-hover:text-[#c0c1ff] transition-colors text-sm truncate">
                      {tx.title}
                    </p>
                    <p className="text-xs text-slate-500 font-mono truncate">ID: {tx.id}</p>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider truncate max-w-[120px]",
                        tx.type === "INCOME"
                          ? "bg-[#4edea3]/10 text-[#4edea3]"
                          : "bg-[#30353d] text-slate-300"
                      )}
                    >
                      {tx.category.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-slate-400 font-mono hidden md:block">
                    {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div
                    className={cn(
                      "col-span-3 text-right font-mono text-lg font-bold pr-16 md:pr-12 hidden md:block",
                      tx.type === "INCOME" ? "text-[#4edea3]" : "text-[#ffb2b7]"
                    )}
                  >
                    {tx.type === "INCOME" ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </div>

                  {/* Action Buttons — desktop hover */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex">
                    <button
                      onClick={() => setTransactionToEdit(tx)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#252a32] hover:bg-[#30353d] border border-white/5 transition-colors"
                    >
                      <i className="fi fi-rr-edit text-[#c0c1ff] text-xs" />
                    </button>
                    <button
                      onClick={() => setTransactionToDelete(tx)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#252a32] hover:bg-[#3b2a2d] border border-white/5 cursor-pointer transition-colors"
                    >
                      <i className="fi fi-rr-trash text-[#ffb2b7] text-xs" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-[#090f15]/25 border-t border-[#464554]/10">
            <p className="text-xs font-mono text-slate-500">
              Showing {pagination?.total || 0} entries
            </p>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-[#252a32] text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <i className="fi fi-rr-angle-left text-[10px]" />
                </button>
                <span className="text-xs font-bold font-mono text-[#c0c1ff]">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-[#252a32] text-slate-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <i className="fi fi-rr-angle-right text-[10px]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!transactionToDelete} onOpenChange={(v) => !v && setTransactionToDelete(null)}>
        <DialogContent className="bg-[#1b2027] border-[#464554]/20 text-[#dee3ec]">
          <DialogHeader>
            <DialogTitle className="text-xl">Delete Transaction</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 border-none bg-transparent">
            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setTransactionToDelete(null)}>
              Cancel
            </Button>
            <Button onClick={executeDelete} className="bg-gradient-to-r from-[#ffb2b7] to-[#e64c58] text-[#3b0d11] font-bold border-none hover:opacity-90">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {transactionToEdit && (
        <AddTransactionModal
          open={!!transactionToEdit}
          onClose={() => setTransactionToEdit(null)}
          mode="edit"
          transactionId={transactionToEdit.id}
          initialData={transactionToEdit}
          onSuccess={() => {
            fetchTransactions();
            setTransactionToEdit(null);
          }}
        />
      )}

      {/* Add Modal — from empty state CTA */}
      <AddTransactionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchTransactions}
      />
    </AppShell>
  );
}
