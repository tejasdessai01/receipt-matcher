import type { Receipt, Transaction, Match } from "@/lib/types";

// Common words to strip when comparing vendor names to bank descriptions
const NOISE_WORDS = new Set([
  "inc",
  "llc",
  "ltd",
  "corp",
  "co",
  "the",
  "and",
  "of",
  "store",
  "shop",
  "#",
  "pos",
  "debit",
  "purchase",
  "card",
]);

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !NOISE_WORDS.has(w))
    .join(" ");
}

// Bigram (Dice coefficient) string similarity
function bigramSimilarity(a: string, b: string): number {
  const s1 = normalize(a);
  const s2 = normalize(b);

  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;

  const bigrams = new Map<string, number>();
  for (let i = 0; i < s1.length - 1; i++) {
    const bg = s1.substring(i, i + 2);
    bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
  }

  let intersect = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bg = s2.substring(i, i + 2);
    const count = bigrams.get(bg) || 0;
    if (count > 0) {
      bigrams.set(bg, count - 1);
      intersect++;
    }
  }

  return (2.0 * intersect) / (s1.length + s2.length - 2);
}

// Check if one string contains (or starts with) the other
function containmentScore(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na.length === 0 || nb.length === 0) return 0;
  if (nb.includes(na) || na.includes(nb)) return 0.9;
  // Check if any significant word from receipt appears in transaction
  const wordsA = na.split(" ").filter((w) => w.length > 2);
  const wordsB = new Set(nb.split(" ").filter((w) => w.length > 2));
  if (wordsA.length === 0) return 0;
  const overlap = wordsA.filter((w) => wordsB.has(w)).length;
  return overlap / wordsA.length;
}

// Combined vendor/description similarity
function vendorSimilarity(vendor: string, description: string): number {
  const bigram = bigramSimilarity(vendor, description);
  const contain = containmentScore(vendor, description);
  return Math.max(bigram, contain);
}

// Date similarity — smooth decay based on day difference
function dateSimilarity(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  const diffDays = Math.abs(
    (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays <= 0.5) return 1.0;
  if (diffDays <= 1) return 0.9;
  if (diffDays <= 2) return 0.75;
  if (diffDays <= 3) return 0.6;
  if (diffDays <= 5) return 0.4;
  if (diffDays <= 7) return 0.2;
  return 0;
}

// Amount similarity — exact match is best, small rounding errors tolerated
function amountSimilarity(a: number, b: number): number {
  const v1 = Math.abs(a);
  const v2 = Math.abs(b);
  const diff = Math.abs(v1 - v2);

  if (diff < 0.005) return 1.0; // exact (floating-point tolerance)
  if (diff <= 0.05) return 0.98; // rounding error
  const max = Math.max(v1, v2);
  if (max === 0) return 0;
  const pct = diff / max;
  if (pct < 0.01) return 0.95;
  if (pct < 0.02) return 0.9;
  if (pct < 0.05) return 0.7;
  if (pct < 0.10) return 0.4;
  return 0;
}

// Calculate composite match confidence
function calculateConfidence(
  receipt: Receipt,
  transaction: Transaction
): number {
  const vSim = vendorSimilarity(receipt.vendor, transaction.description);
  const dSim = dateSimilarity(receipt.date, transaction.date);
  const aSim = amountSimilarity(receipt.amount, transaction.amount);

  // Amount is the strongest signal for financial data.
  // Vendor name second, date third (transactions can post 1-3 days late).
  // Weights: amount 45%, vendor 35%, date 20%
  const raw = aSim * 0.45 + vSim * 0.35 + dSim * 0.2;

  // Boost: if amount is exact AND vendor is decent, high confidence
  if (aSim >= 0.98 && vSim >= 0.4) return Math.min(raw + 0.1, 1);

  return raw;
}

const MIN_CONFIDENCE = 0.45;

// Hungarian-style greedy matching: sort all candidate pairs by confidence
// desc, assign greedily. This produces globally better matches than
// per-receipt greedy.
export function matchReceiptsToTransactions(
  receipts: Receipt[],
  transactions: Transaction[]
): Match[] {
  // Build all candidate pairs
  const candidates: {
    receiptIdx: number;
    transactionIdx: number;
    confidence: number;
  }[] = [];

  for (let ri = 0; ri < receipts.length; ri++) {
    for (let ti = 0; ti < transactions.length; ti++) {
      const conf = calculateConfidence(receipts[ri], transactions[ti]);
      if (conf >= MIN_CONFIDENCE) {
        candidates.push({
          receiptIdx: ri,
          transactionIdx: ti,
          confidence: conf,
        });
      }
    }
  }

  // Sort by confidence descending
  candidates.sort((a, b) => b.confidence - a.confidence);

  const usedReceipts = new Set<number>();
  const usedTransactions = new Set<number>();
  const matchMap = new Map<
    number,
    { transaction: Transaction; confidence: number }
  >();

  for (const c of candidates) {
    if (usedReceipts.has(c.receiptIdx)) continue;
    if (usedTransactions.has(c.transactionIdx)) continue;
    usedReceipts.add(c.receiptIdx);
    usedTransactions.add(c.transactionIdx);
    matchMap.set(c.receiptIdx, {
      transaction: transactions[c.transactionIdx],
      confidence: c.confidence,
    });
  }

  // Build final results preserving receipt order
  return receipts.map((receipt, idx) => {
    const m = matchMap.get(idx);
    return {
      receipt,
      transaction: m?.transaction ?? null,
      confidence: m?.confidence ?? 0,
    };
  });
}
