'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import type { Transaction } from '@/app/page';

type Props = {
  onTransactionsLoaded: (transactions: Transaction[]) => void;
};

export default function CSVUploader({ onTransactionsLoaded }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = parseTransactions(results.data as any[]);
          onTransactionsLoaded(transactions);
          setIsProcessing(false);
        } catch (err) {
          setError('Failed to parse CSV. Make sure it has Date, Description, and Amount columns.');
          setIsProcessing(false);
        }
      },
      error: (err) => {
        setError(`Error reading file: ${err.message}`);
        setIsProcessing(false);
      },
    });
  };

  const parseTransactions = (rows: any[]): Transaction[] => {
    // Try to detect column names (flexible)
    const firstRow = rows[0];
    const keys = Object.keys(firstRow).map(k => k.toLowerCase());
    
    const dateCol = keys.find(k => k.includes('date')) || 'date';
    const descCol = keys.find(k => k.includes('description') || k.includes('memo') || k.includes('name')) || 'description';
    const amountCol = keys.find(k => k.includes('amount') || k.includes('debit') || k.includes('credit')) || 'amount';

    return rows
      .map((row, index) => {
        const date = row[dateCol] || row[Object.keys(row)[0]];
        const description = row[descCol] || row[Object.keys(row)[1]] || 'Unknown';
        const amountStr = row[amountCol] || row[Object.keys(row)[2]] || '0';
        
        // Clean amount string (remove $, commas, etc.)
        const amount = parseFloat(amountStr.replace(/[$,]/g, ''));

        if (!date || isNaN(amount)) {
          return null;
        }

        return {
          id: `txn-${index}`,
          description,
          amount,
          date: parseDate(date),
        };
      })
      .filter((t): t is Transaction => t !== null);
  };

  const parseDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isProcessing}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className={`cursor-pointer ${isProcessing ? 'opacity-50' : ''}`}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing ? 'Processing...' : 'Click to upload bank CSV'}
          </p>
          <p className="text-xs text-gray-500">
            Exported from your bank or QuickBooks
          </p>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p className="font-semibold mb-1">CSV should have columns:</p>
        <ul className="list-disc list-inside">
          <li>Date (MM/DD/YYYY or similar)</li>
          <li>Description (merchant/vendor name)</li>
          <li>Amount (numbers, $ optional)</li>
        </ul>
      </div>
    </div>
  );
}
