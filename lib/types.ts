export type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  imageUrl?: string;
  rawText?: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

export type Match = {
  receipt: Receipt;
  transaction: Transaction | null;
  confidence: number;
};

export type MatchResultSummary = {
  totalReceipts: number;
  matched: number;
  unmatched: number;
  avgConfidence: number;
};
