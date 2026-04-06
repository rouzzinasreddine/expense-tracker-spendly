import AppShell from "@/components/layout/AppShell";
import { CategoriesDonutChart, CategoriesSpikeChart } from "@/components/categories/CategoriesChart";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

function CategoryCard({ cat }: { cat: any }) {
  const pct = cat.budget && cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;
  const rawPct = cat.budget && cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
  const overBudget = cat.budget && cat.budget > 0 ? cat.spent > cat.budget : false;

  return (
    <div className="group bg-[#1b2027] hover:bg-[#252a32] transition-all duration-300 rounded-2xl p-6 border border-[#464554]/15 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-12 rounded-xl bg-slate-800/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
          <i className={`fi ${cat.icon} text-xl`} />
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-[#090f15]/60 px-2 py-1 rounded">
          {cat.type}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-1 text-[#dee3ec]">{cat.name}</h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span
          className={cn(
            "text-2xl font-mono font-bold",
            overBudget ? "text-[#ffb2b7]" : "text-[#dee3ec]"
          )}
        >
          {cat.spent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs font-mono text-slate-500">
          / {cat.budget ? cat.budget.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "∞"}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
          <span className={overBudget ? "text-[#ffb2b7]" : "text-[#c0c1ff]"}>
            {overBudget ? "Over Budget" : "Budget Used"}
          </span>
          <span className={overBudget ? "text-[#ffb2b7]" : "text-[#dee3ec]"}>
            {Math.round(rawPct)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              overBudget ? "bg-[#ffb2b7]" : "bg-[#c0c1ff]"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [dbCategories, sevenDaysTransactions] = await Promise.all([
    prisma.category.findMany({
      where: { userId, type: "EXPENSE" },
      include: {
        transactions: {
          where: { date: { gte: startOfCurrentMonth, lt: startOfNextMonth } },
          select: { amount: true }
        }
      }
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

  let totalBudget = 0;
  let totalSpent = 0;

  const mappedCategories = dbCategories.map(cat => {
    const spent = cat.transactions.reduce((acc, t) => acc + t.amount, 0);
    totalSpent += spent;
    if (cat.budget) totalBudget += cat.budget;
    
    return {
      id: cat.id,
      name: cat.name,
      icon: cat.emoji,
      type: cat.type,
      budget: cat.budget,
      spent
    };
  }).sort((a, b) => b.spent - a.spent);

  const stats = {
    monthlyAllocation: totalBudget,
    monthlySpent: totalSpent,
    monthlyRemaining: Math.max(0, totalBudget - totalSpent)
  };

  // Build Top Categories for Donut
  const colors = ["#c0c1ff", "#ffb2b7", "#4edea3", "#8083ff", "#c7c4d7", "#464554"];
  const categoryDistribution = mappedCategories.slice(0, 6).map((c, i) => ({
    name: c.name,
    value: c.spent > 0 ? c.spent : 0.01,
    color: colors[i % colors.length]
  }));

  // Build Spike Data
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

  const spikeData = Array.from(chartDataMap.entries()).map(([day, amount]) => ({ day, amount }));
  const peakIdx = spikeData.reduce((maxI, val, i, arr) => (val.amount > arr[maxI].amount ? i : maxI), 0);

  return (
    <AppShell title="Categories">
      <div className="space-y-12 pb-12">
        {/* ── Pulse Metric ── */}
        <section className="bg-[#171c23] rounded-2xl p-8 relative overflow-hidden border border-[#464554]/15">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#c0c1ff]/8 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#c0c1ff]/80 mb-3 block">
                Aggregated Budget
              </span>
              <div className="flex items-baseline gap-4">
                <h2 className="text-6xl font-mono font-bold tracking-tighter text-[#dee3ec]">
                  {stats.monthlyAllocation.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h2>
              </div>
            </div>
            <div className="flex gap-12 border-l border-slate-800/60 pl-12">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                  Spent
                </span>
                <span className="text-2xl font-mono text-[#dee3ec]">
                  {stats.monthlySpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                  Remaining
                </span>
                <span className="text-2xl font-mono text-[#c0c1ff]">
                  {stats.monthlyRemaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedCategories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
          {mappedCategories.length === 0 && (
             <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 rounded-2xl bg-[#c0c1ff]/8 flex items-center justify-center mb-6">
                 <i className="fi fi-rr-list text-4xl text-[#c0c1ff]/40" />
               </div>
               <h3 className="text-xl font-bold text-[#dee3ec] mb-2">No categories found</h3>
               <p className="text-sm text-slate-400 max-w-xs">
                 Categories will appear here once you start tracking expenses
               </p>
             </div>
          )}
        </div>

        {/* ── Secondary Insights ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie / Donut Chart */}
          <div className="bg-[#171c23] p-8 rounded-2xl border border-[#464554]/15">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-lg font-bold text-[#dee3ec]">Category Distribution</h4>
              <i className="fi fi-rr-chart-pie-alt text-[#c7c4d7] text-sm" />
            </div>
            <div className="flex items-center gap-8">
              {categoryDistribution.length > 0 ? (
                <>
                  <CategoriesDonutChart data={categoryDistribution} />
                  <div className="flex-1 space-y-3">
                    {categoryDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#dee3ec] truncate max-w-[100px]">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-[#c7c4d7]">
                          {item.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 font-mono tracking-widest text-xs h-44 uppercase">
                  No explicit distribution available
                </div>
              )}
            </div>
          </div>

          {/* Visualized Spikes */}
          <div className="bg-[#171c23] p-8 rounded-2xl border border-[#464554]/15 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-[#dee3ec]">Visualized Spikes</h4>
              <button className="text-xs text-[#c0c1ff] font-bold uppercase tracking-widest hover:underline">
                Analyze
              </button>
            </div>
            <div className="h-44">
               {spikeData.length > 0 ? (
                 <CategoriesSpikeChart data={spikeData} peakIdx={peakIdx} />
               ) : (
                 <div className="flex-1 flex items-center justify-center text-slate-500 font-mono tracking-widest text-xs h-full uppercase">
                   No visualized spikes natively
                 </div>
               )}
            </div>
            {spikeData.length > 0 && (
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase mt-2 px-1">
                {spikeData.map((d, i) => (
                  <span
                    key={d.day}
                    className={i === peakIdx ? "text-[#c0c1ff] font-bold" : ""}
                  >
                    {d.day}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
