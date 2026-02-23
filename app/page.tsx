'use client';

import { useState } from 'react';
import ReceiptUploader from '@/components/ReceiptUploader';
import CSVUploader from '@/components/CSVUploader';
import MatchResults from '@/components/MatchResults';
import { matchReceiptsToTransactions } from '@/lib/matcher';

export type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  imageUrl?: string;
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

export default function Home() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMatch = async () => {
    setIsProcessing(true);
    try {
      const results = matchReceiptsToTransactions(receipts, transactions);
      setMatches(results);
    } catch (error) {
      console.error('Matching failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ReceiptMatch
          </h1>
          <p className="text-xl text-gray-600">
            Auto-match receipts to bank transactions. Save 3-6 hours every month.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Free this week · $3/month after
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">1. Upload Receipts</h2>
            <ReceiptUploader onReceiptsProcessed={setReceipts} />
            {receipts.length > 0 && (
              <p className="mt-4 text-sm text-green-600">
                ✓ {receipts.length} receipts uploaded
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">2. Upload Bank CSV</h2>
            <CSVUploader onTransactionsLoaded={setTransactions} />
            {transactions.length > 0 && (
              <p className="mt-4 text-sm text-green-600">
                ✓ {transactions.length} transactions loaded
              </p>
            )}
          </div>
        </div>

        {receipts.length > 0 && transactions.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={handleMatch}
              disabled={isProcessing}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Matching...' : '3. Match Receipts →'}
            </button>
          </div>
        )}

        {matches.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <MatchResults matches={matches} />
          </div>
        )}
      </div>
    </div>
  );
}
