"use client";

import AppShell from "@/components/layout/AppShell";
import { stats, recentTransactions, weeklySpend } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Brain, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#30353d] border border-[#464554]/20 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-mono font-bold text-[#c0c1ff]">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  highlight,
  color,
  glowPrimary,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  highlight?: boolean;
  color: string;
  glowPrimary?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-8 border border-[#464554]/10 group transition-all duration-300 ${
        highlight
          ? "bg-[#30353d] hover:border-[#c0c1ff]/20"
          : "bg-[#1b2027] hover:bg-[#252a32]"
      }`}
    >
      {highlight && (
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-[#c0c1ff]/8 blur-[80px] group-hover:bg-[#c0c1ff]/15 transition-all duration-700 rounded-full" />
      )}
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-3">
        {label}
      </p>
      <h3
        className={`text-4xl font-mono font-bold ${glowPrimary ? "text-glow-primary" : ""}`}
        style={{ color }}
      >
        {value}
      </h3>
      {sub && <div className="mt-4">{sub}</div>}
    </div>
  );
}

// ── Transaction Feed Item ──────────────────────────────────────────────────
function LedgerItem({ tx }: { tx: (typeof recentTransactions)[0] }) {
  const isIncome = tx.type === "income";
  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 transition-all border-l-4 ${
        isIncome ? "border-[#4edea3]/50" : "border-[#ffb2b7]/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#30353d] flex items-center justify-center text-lg grayscale group-hover:grayscale-0 transition-all shrink-0">
          {tx.emoji}
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-[#dee3ec]">
            {tx.merchant}
          </p>
          <p className="text-[10px] font-mono text-slate-500">{tx.dateDisplay}</p>
        </div>
      </div>
      <p
        className={`text-sm font-mono font-bold ${
          isIncome ? "text-[#4edea3]" : "text-[#ffb2b7]"
        }`}
      >
        {isIncome ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
      </p>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const activeBarIndex = weeklySpend.findIndex((d) => d.day === "THU");

  return (
    <AppShell title="Dashboard">
      <div className="space-y-8">
        {/* ── Summary Bento Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Current Liquidity"
            value={`$${stats.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            color="#c0c1ff"
            glowPrimary
            highlight
            sub={
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[#4edea3] text-xs font-mono font-bold bg-[#4edea3]/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  +12.4%
                </span>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  vs last month
                </span>
              </div>
            }
          />
          <StatCard
            label="Total Inflow"
            value={`$${stats.totalInflow.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            color="#4edea3"
            sub={
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                30 Day Cycle
              </span>
            }
          />
          <StatCard
            label="Total Outflow"
            value={`$${stats.totalOutflow.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            color="#ffb2b7"
            sub={
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                Active Budgets: 8
              </span>
            }
          />
        </section>

        {/* ── Chart + Ledger Feed ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-2xl flex flex-col h-[400px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-xl font-bold tracking-tight mb-1 text-[#dee3ec]">
                  Cash Velocity
                </h4>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  7-Day Expenditure Pulse
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c0c1ff] shadow-[0_0_8px_rgba(192,193,255,0.7)]" />
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Net Spend
                </span>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklySpend}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  barCategoryGap="30%"
                >
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(192,193,255,0.04)" }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {weeklySpend.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === activeBarIndex
                            ? "#c0c1ff"
                            : "rgba(192,193,255,0.25)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ledger Feed */}
          <div className="lg:col-span-1 bg-[#1b2027] p-6 rounded-2xl border border-[#464554]/10 flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
              <h4 className="font-bold tracking-tight text-[#dee3ec]">
                Ledger Feed
              </h4>
              <a
                href="/transactions"
                className="text-[10px] uppercase font-bold text-[#c0c1ff] tracking-widest hover:underline"
              >
                View All
              </a>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {recentTransactions.map((tx) => (
                <LedgerItem key={tx.id} tx={tx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Lower Action Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          {/* Automated Savings */}
          <div className="bg-gradient-to-br from-[#171c23] to-[#252a32] rounded-2xl p-8 border border-[#464554]/5 flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 text-[#c0c1ff]">
              <Brain className="w-40 h-40" strokeWidth={0.5} />
            </div>
            <div className="z-10">
              <h5 className="text-xl font-bold mb-2 text-[#dee3ec]">
                Automated Savings
              </h5>
              <p className="text-slate-400 text-sm max-w-xs mb-6 leading-relaxed">
                Let Spendly AI analyze your patterns to find hidden savings every week. Join 12,000 users optimizing their future.
              </p>
              <button className="px-6 py-2 rounded-full border border-[#c0c1ff]/40 text-[#c0c1ff] text-xs font-bold uppercase tracking-widest hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all">
                Enable Intelligence
              </button>
            </div>
          </div>

          {/* Collaborative Vault */}
          <div className="bg-[#252a32] rounded-2xl p-8 border border-[#464554]/5 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-3">
                {["NR", "AK", "JM"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#0e141a] bg-gradient-to-br from-[#c0c1ff]/30 to-[#8083ff]/30 flex items-center justify-center text-[10px] font-bold text-[#c0c1ff]"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Collaborative Vault
              </p>
            </div>
            <h5 className="text-xl font-bold mb-2 text-[#dee3ec]">
              Manage shared expenses
            </h5>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Sync balances with your partner or roommates instantly with end-to-end encryption.
            </p>
            <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#c0c1ff] h-full shadow-[0_0_8px_rgba(192,193,255,0.4)] transition-all duration-1000 rounded-full"
                style={{ width: "66%" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-mono text-slate-500">2 of 3 synced</span>
              <span className="text-[10px] font-mono text-[#c0c1ff]">66%</span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
