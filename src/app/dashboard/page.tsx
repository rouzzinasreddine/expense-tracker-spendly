import AppShell from "@/components/layout/AppShell";
import DashboardChart from "@/components/dashboard/DashboardChart";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ── StatCard ──────────────────────────────────────────────────────────────
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
      className={`relative overflow-hidden rounded-2xl p-6 md:p-8 border border-[#464554]/10 group transition-all duration-300 ${
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
        className={`text-2xl md:text-4xl font-mono font-bold ${glowPrimary ? "text-glow-primary" : ""}`}
        style={{ color }}
      >
        {value}
      </h3>
      {sub && <div className="mt-4">{sub}</div>}
    </div>
  );
}

// ── LedgerItem ──────────────────────────────────────────────────
function LedgerItem({ tx }: { tx: any }) {
  const isIncome = tx.type === "INCOME";
  const dateStr = new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  
  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 transition-all border-l-4 ${
        isIncome ? "border-[#4edea3]/50" : "border-[#ffb2b7]/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#30353d] flex items-center justify-center text-lg grayscale group-hover:grayscale-0 transition-all shrink-0">
          <i className={`fi ${tx.category?.emoji || "fi-rr-box"} text-base`} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-[#dee3ec]">
            {tx.title}
          </p>
          <p className="text-[10px] font-mono text-slate-500">{dateStr}</p>
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

// ── Error Card ──────────────────────────────────────────────────
function DashboardError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#ffb2b7]/10 flex items-center justify-center mb-6">
        <i className="fi fi-rr-triangle-warning text-3xl text-[#ffb2b7]" />
      </div>
      <h3 className="text-xl font-bold text-[#dee3ec] mb-2">Dashboard Error</h3>
      <p className="text-sm text-slate-400 max-w-md">{message}</p>
      <p className="text-xs text-slate-500 mt-4 font-mono">Try refreshing the page</p>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      allTransactions,
      recentTransactions,
      sevenDaysTransactions
    ] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        select: { amount: true, type: true, date: true }
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 5,
        include: { category: true }
      }),
      prisma.transaction.findMany({
        where: { 
          userId, 
          date: { gte: sevenDaysAgo },
          type: "EXPENSE"
        },
        select: { amount: true, date: true }
      })
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    let lastMonthIncome = 0;
    let lastMonthExpense = 0;

    for (const t of allTransactions) {
      const isIncome = t.type === "INCOME";
      const val = t.amount;

      if (isIncome) totalIncome += val;
      else totalExpense += val;

      if (t.date >= startOfCurrentMonth && t.date < startOfNextMonth) {
        if (isIncome) currentMonthIncome += val;
        else currentMonthExpense += val;
      }
      
      if (t.date >= startOfLastMonth && t.date < startOfCurrentMonth) {
        if (isIncome) lastMonthIncome += val;
        else lastMonthExpense += val;
      }
    }

    const totalBalance = totalIncome - totalExpense;
    const incomeChangePercent = lastMonthIncome === 0 
      ? 100 
      : ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;
    const expenseChangePercent = lastMonthExpense === 0 
      ? 100 
      : ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;

    const chartDataMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayStr = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      chartDataMap.set(dayStr, 0);
    }

    for (const t of sevenDaysTransactions) {
      const dayStr = t.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      if (chartDataMap.has(dayStr)) {
        chartDataMap.set(dayStr, chartDataMap.get(dayStr)! + t.amount);
      }
    }

    const chartData = Array.from(chartDataMap.entries()).map(([day, amount]) => ({ day, amount }));

    return (
      <AppShell title="Dashboard">
        <div className="space-y-8">
          {/* ── Summary Bento Grid ── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              label="Current Liquidity"
              value={`$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              color="#c0c1ff"
              glowPrimary
              highlight
            />
            <StatCard
              label="Total Inflow"
              value={`$${currentMonthIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              color="#4edea3"
              sub={
                <div className="flex items-center gap-2 mt-2">
                  <span className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full ${incomeChangePercent >= 0 ? "text-[#4edea3] bg-[#4edea3]/10" : "text-[#ffb2b7] bg-[#ffb2b7]/10"}`}>
                    <i className={`fi ${incomeChangePercent >= 0 ? "fi-rr-arrow-trend-up" : "fi-rr-arrow-trend-down"} text-[10px]`} />
                    {(incomeChangePercent > 0 ? "+" : "") + incomeChangePercent.toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">vs last month</span>
                </div>
              }
            />
            <StatCard
              label="Total Outflow"
              value={`$${currentMonthExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              color="#ffb2b7"
              sub={
                <div className="flex items-center gap-2 mt-2">
                  <span className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full ${expenseChangePercent <= 0 ? "text-[#4edea3] bg-[#4edea3]/10" : "text-[#ffb2b7] bg-[#ffb2b7]/10"}`}>
                    <i className={`fi ${expenseChangePercent <= 0 ? "fi-rr-arrow-trend-down" : "fi-rr-arrow-trend-up"} text-[10px]`} />
                    {(expenseChangePercent > 0 ? "+" : "") + expenseChangePercent.toFixed(1)}%
                  </span>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">vs last month</span>
                </div>
              }
            />
          </section>

          {/* ── Chart + Ledger Feed ── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl flex flex-col h-[300px] md:h-[400px]">
               <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#dee3ec]">Cash Velocity</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">7-Day Expenditure Pulse</p>
                  </div>
               </div>
               {chartData.length > 0 ? (
                 <DashboardChart data={chartData} />
               ) : (
                 <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-mono tracking-widest uppercase">
                   No recent activity tracked
                 </div>
               )}
            </div>

            <div className="lg:col-span-1 bg-[#1b2027] p-6 rounded-2xl border border-[#464554]/10 flex flex-col h-[350px] md:h-[400px]">
              <div className="flex justify-between items-center mb-6 px-2">
                <h4 className="font-bold tracking-tight text-[#dee3ec]">Ledger Feed</h4>
                <a href="/transactions" className="text-[10px] uppercase font-bold text-[#c0c1ff] tracking-widest hover:underline">View All</a>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => <LedgerItem key={tx.id} tx={tx} />)
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                     <p className="text-[10px] uppercase tracking-widest text-[#c7c4d7]/40 font-bold">No Transactions Found</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    );
  } catch (error) {
    console.error("[DASHBOARD_ERROR]", error);
    return (
      <AppShell title="Dashboard">
        <DashboardError message="Failed to load dashboard data. Please try refreshing the page." />
      </AppShell>
    );
  }
}
