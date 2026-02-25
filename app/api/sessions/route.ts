import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// List sessions for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.matchingSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      receiptCount: true,
      transactionCount: true,
      matchedCount: true,
      avgConfidence: true,
    },
  });

  return NextResponse.json(sessions);
}

// Create a new session
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const matchingSession = await prisma.matchingSession.create({
    data: {
      userId: session.user.id,
      name: body.name || `Session ${new Date().toLocaleDateString()}`,
      receiptCount: body.receiptCount || 0,
      transactionCount: body.transactionCount || 0,
      matchedCount: body.matchedCount || 0,
      avgConfidence: body.avgConfidence || 0,
      receipts: JSON.stringify(body.receipts || []),
      transactions: JSON.stringify(body.transactions || []),
      matches: JSON.stringify(body.matches || []),
    },
  });

  return NextResponse.json(matchingSession, { status: 201 });
}
