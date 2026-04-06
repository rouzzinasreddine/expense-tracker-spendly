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

    // Fetch categories with nested sums of exactly the current month
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        transactions: {
          where: {
            date: {
              gte: startOfCurrentMonth,
              lt: startOfNextMonth
            }
          },
          select: {
            amount: true
          }
        }
      }
    });

    const responseData = categories.map(cat => {
      // Aggregate spent (we usually only care about EXPENSE for budget checking, but let's just sum all transactions per category)
      // Actually, all amounts in the database are stored as absolute/raw amounts depending on type, but for a category total, it's just the sum.
      const spent = cat.transactions.reduce((acc, t) => acc + t.amount, 0);

      let remaining = null;
      let percentUsed = 0;

      if (cat.budget !== null) {
        remaining = cat.budget - spent;
        percentUsed = cat.budget > 0 ? (spent / cat.budget) * 100 : 0;
      }

      return {
        id: cat.id,
        name: cat.name,
        icon: cat.emoji,
        type: cat.type,
        budget: cat.budget,
        spent: spent,
        remaining,
        percentUsed: parseFloat(percentUsed.toFixed(2))
      };
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
