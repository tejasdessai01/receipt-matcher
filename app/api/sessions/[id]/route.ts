import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get a single session with full data
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const matchingSession = await prisma.matchingSession.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!matchingSession) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...matchingSession,
    receipts: JSON.parse(matchingSession.receipts),
    transactions: JSON.parse(matchingSession.transactions),
    matches: JSON.parse(matchingSession.matches),
  });
}

// Update a session
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Verify ownership
  const existing = await prisma.matchingSession.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.matchingSession.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      receiptCount: body.receiptCount ?? existing.receiptCount,
      transactionCount: body.transactionCount ?? existing.transactionCount,
      matchedCount: body.matchedCount ?? existing.matchedCount,
      avgConfidence: body.avgConfidence ?? existing.avgConfidence,
      receipts: body.receipts ? JSON.stringify(body.receipts) : existing.receipts,
      transactions: body.transactions
        ? JSON.stringify(body.transactions)
        : existing.transactions,
      matches: body.matches ? JSON.stringify(body.matches) : existing.matches,
    },
  });

  return NextResponse.json(updated);
}

// Delete a session
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.matchingSession.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.matchingSession.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
