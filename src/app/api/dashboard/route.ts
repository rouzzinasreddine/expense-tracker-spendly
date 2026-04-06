import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    
    // Bounds for current month
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Bounds for last month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Trailing 7 days
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Run parallel queries
    const [
      allTransactions,
      recentTransactionsData,
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

    // Fast computations
    let totalIncome = 0;
    let totalExpense = 0;
    
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    
    let lastMonthIncome = 0;
    let lastMonthExpense = 0;

    for (const t of allTransactions) {
      const isIncome = t.type === "INCOME";
      const val = t.amount;

      // Global bounds
      if (isIncome) totalIncome += val;
      else totalExpense += val;

      // Current month bounds
      if (t.date >= startOfCurrentMonth && t.date < startOfNextMonth) {
        if (isIncome) currentMonthIncome += val;
        else currentMonthExpense += val;
      }
      
      // Last month bounds
      if (t.date >= startOfLastMonth && t.date < startOfCurrentMonth) {
        if (isIncome) lastMonthIncome += val;
        else lastMonthExpense += val;
      }
    }

    const totalBalance = totalIncome - totalExpense;

    // Change Percentages
    const incomeChangePercent = lastMonthIncome === 0 
      ? 100 
      : ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

    const expenseChangePercent = lastMonthExpense === 0 
      ? 100 
      : ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;

    // Build Trailing 7 Days Chart
    const chartDataMap = new Map<string, number>();
    // Pre-populate days
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

    const chartData = Array.from(chartDataMap.entries()).map(([day, amount]) => ({
      day,
      amount
    }));

    // Format recent transactions
    const recentTransactions = recentTransactionsData.map(t => ({
      id: t.id,
      title: t.title,
      amount: t.amount,
      type: t.type,
      date: t.date.toISOString(),
      category: {
        id: t.category.id,
        name: t.category.name,
        icon: t.category.emoji
      }
    }));

    return NextResponse.json({
      totalBalance,
      totalIncome: currentMonthIncome,
      totalExpense: currentMonthExpense,
      incomeChangePercent: parseFloat(incomeChangePercent.toFixed(2)),
      expenseChangePercent: parseFloat(expenseChangePercent.toFixed(2)),
      recentTransactions,
      chartData
    });

  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
