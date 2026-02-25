import { NextRequest, NextResponse } from "next/server";
import { matchReceiptsToTransactions } from "@/lib/matcher";
import type { Receipt, Transaction } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { receipts, transactions } = body as {
      receipts: Receipt[];
      transactions: Transaction[];
    };

    if (!Array.isArray(receipts) || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: "receipts and transactions must be arrays" },
        { status: 400 }
      );
    }

    if (receipts.length === 0 || transactions.length === 0) {
      return NextResponse.json(
        { error: "Both receipts and transactions are required" },
        { status: 400 }
      );
    }

    // Guard against abuse — limit payload sizes
    if (receipts.length > 500 || transactions.length > 5000) {
      return NextResponse.json(
        { error: "Too many items. Max 500 receipts and 5000 transactions." },
        { status: 413 }
      );
    }

    const matches = matchReceiptsToTransactions(receipts, transactions);

    return NextResponse.json({ matches });
  } catch (err) {
    console.error("Match API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
