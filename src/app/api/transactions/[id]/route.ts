import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = await params;

    const body = await request.json();
    const { title, amount, type, categoryId, date, note } = body;

    // Verify ownership
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
      return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    }

    // Validate inputs
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

    // Update
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        title,
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        date: new Date(date),
        note,
        categoryId
      },
      include: {
        category: { select: { id: true, name: true, emoji: true } }
      }
    });

    return NextResponse.json({
      id: updatedTransaction.id,
      title: updatedTransaction.title,
      amount: updatedTransaction.amount,
      type: updatedTransaction.type,
      date: updatedTransaction.date.toISOString(),
      note: updatedTransaction.note,
      category: {
        id: updatedTransaction.category.id,
        name: updatedTransaction.category.name,
        icon: updatedTransaction.category.emoji
      }
    });

  } catch (error) {
    console.error("[TRANSACTIONS_PUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = await params;

    // Ensure it exists and belongs to user
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
      return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[TRANSACTIONS_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
