import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "ALL";
    const categoryId = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Prisma Where clause
    const whereClause: any = { userId };
    
    if (type !== "ALL") {
      whereClause.type = type.toUpperCase();
    }
    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.title = { contains: search };
    }

    // Parallel fetching for performance
    const [transactions, total, allFilteredTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, emoji: true } }
        }
      }),
      prisma.transaction.count({ where: whereClause }),
      // To build summary, we need the sum of all matching conditions
      prisma.transaction.findMany({
        where: whereClause,
        select: { amount: true, type: true }
      })
    ]);

    // Format transaction payload
    const formattedTransactions = transactions.map(t => ({
      id: t.id,
      title: t.title,
      amount: t.amount,
      type: t.type,
      date: t.date.toISOString(),
      note: t.note,
      category: {
        id: t.category.id,
        name: t.category.name,
        icon: t.category.emoji
      }
    }));

    // Compute Summary for filtered results
    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of allFilteredTransactions) {
      if (t.type === "INCOME") totalIncome += t.amount;
      else totalExpense += t.amount;
    }

    return NextResponse.json({
      transactions: formattedTransactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalIncome,
        totalExpense,
        netFlow: totalIncome - totalExpense
      }
    });

  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { title, amount, type, categoryId, date, note } = body;

    // Validate requirements
    if (!title || !amount || parseFloat(amount) <= 0 || !type || !categoryId || !date) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    if (type.toUpperCase() !== "INCOME" && type.toUpperCase() !== "EXPENSE") {
      return NextResponse.json({ error: "Type must be INCOME or EXPENSE" }, { status: 400 });
    }

    // Verify category belongs to user
    const checkCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!checkCategory || checkCategory.userId !== userId) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Create database entry
    const newTransaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        date: new Date(date),
        note,
        categoryId,
        userId
      },
      include: {
        category: { select: { id: true, name: true, emoji: true } }
      }
    });

    return NextResponse.json({
      id: newTransaction.id,
      title: newTransaction.title,
      amount: newTransaction.amount,
      type: newTransaction.type,
      date: newTransaction.date.toISOString(),
      note: newTransaction.note,
      category: {
        id: newTransaction.category.id,
        name: newTransaction.category.name,
        icon: newTransaction.category.emoji
      }
    }, { status: 201 });

  } catch (error) {
    console.error("[TRANSACTIONS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
