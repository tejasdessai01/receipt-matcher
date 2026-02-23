import type { Receipt, Transaction, Match } from '@/app/page';

// Fuzzy string matching (Levenshtein distance)
function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;
  
  const map = new Map();
  for (let i = 0; i < s1.length - 1; i++) {
    const bigram = s1.substring(i, i + 2);
    const count = map.has(bigram) ? map.get(bigram) + 1 : 1;
    map.set(bigram, count);
  }
  
  let matches = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bigram = s2.substring(i, i + 2);
    const count = map.has(bigram) ? map.get(bigram) : 0;
    if (count > 0) {
      map.set(bigram, count - 1);
      matches++;
    }
  }
  
  return (2.0 * matches) / (s1.length + s2.length - 2);
}

// Date similarity (days difference)
function dateSimilarity(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffDays = Math.abs((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
  
  // Perfect match = 1.0, 1 day off = 0.8, 2 days = 0.6, etc.
  if (diffDays === 0) return 1.0;
  if (diffDays === 1) return 0.8;
  if (diffDays === 2) return 0.6;
  if (diffDays <= 5) return 0.4;
  return 0;
}

// Amount similarity
function amountSimilarity(amount1: number, amount2: number): number {
  const diff = Math.abs(amount1 - amount2);
  const max = Math.max(Math.abs(amount1), Math.abs(amount2));
  
  if (diff === 0) return 1.0;
  if (max === 0) return 0;
  
  const percentDiff = diff / max;
  if (percentDiff < 0.01) return 0.95; // 1% difference
  if (percentDiff < 0.05) return 0.8;  // 5% difference
  if (percentDiff < 0.10) return 0.5;  // 10% difference
  return 0;
}

// Calculate match confidence
function calculateConfidence(
  receipt: Receipt,
  transaction: Transaction
): number {
  const vendorSim = stringSimilarity(receipt.vendor, transaction.description);
  const dateSim = dateSimilarity(receipt.date, transaction.date);
  const amountSim = amountSimilarity(Math.abs(receipt.amount), Math.abs(transaction.amount));
  
  // Weighted average: vendor 40%, date 30%, amount 30%
  return (vendorSim * 0.4) + (dateSim * 0.3) + (amountSim * 0.3);
}

// Main matching function
export function matchReceiptsToTransactions(
  receipts: Receipt[],
  transactions: Transaction[]
): Match[] {
  const usedTransactions = new Set<string>();
  const matches: Match[] = [];
  
  // Sort receipts by date (newest first)
  const sortedReceipts = [...receipts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (const receipt of sortedReceipts) {
    let bestMatch: Transaction | null = null;
    let bestConfidence = 0;
    
    // Find best matching transaction
    for (const transaction of transactions) {
      if (usedTransactions.has(transaction.id)) continue;
      
      const confidence = calculateConfidence(receipt, transaction);
      
      if (confidence > bestConfidence && confidence >= 0.5) { // 50% minimum threshold
        bestConfidence = confidence;
        bestMatch = transaction;
      }
    }
    
    if (bestMatch) {
      usedTransactions.add(bestMatch.id);
    }
    
    matches.push({
      receipt,
      transaction: bestMatch,
      confidence: bestConfidence,
    });
  }
  
  return matches;
}
