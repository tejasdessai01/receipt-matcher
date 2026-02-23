'use client';

import type { Match } from '@/app/page';

type Props = {
  matches: Match[];
};

export default function MatchResults({ matches }: Props) {
  const matched = matches.filter(m => m.transaction !== null);
  const unmatched = matches.filter(m => m.transaction === null);

  const exportToCSV = () => {
    const rows = [
      ['Receipt Vendor', 'Receipt Amount', 'Receipt Date', 'Transaction Description', 'Transaction Amount', 'Transaction Date', 'Confidence'],
      ...matches.map(m => [
        m.receipt.vendor,
        m.receipt.amount.toFixed(2),
        m.receipt.date,
        m.transaction?.description || 'NO MATCH',
        m.transaction?.amount.toFixed(2) || '',
        m.transaction?.date || '',
        m.transaction ? `${(m.confidence * 100).toFixed(0)}%` : '0%',
      ]),
    ];

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-matches-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Match Results</h2>
          <p className="text-sm text-gray-600 mt-1">
            {matched.length} matched · {unmatched.length} unmatched
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export to CSV
        </button>
      </div>

      {/* Matched receipts */}
      {matched.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-700 mb-3">✓ Matched ({matched.length})</h3>
          <div className="space-y-3">
            {matched.map((match, idx) => (
              <div
                key={idx}
                className="border border-green-200 bg-green-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {match.receipt.vendor}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${Math.abs(match.receipt.amount).toFixed(2)} on {match.receipt.date}
                    </div>
                  </div>
                  <div className="text-center mx-4">
                    <div className="text-xs text-gray-500">matches</div>
                    <div className="text-sm font-semibold text-green-700">
                      {(match.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold text-gray-900">
                      {match.transaction?.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${Math.abs(match.transaction?.amount || 0).toFixed(2)} on {match.transaction?.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unmatched receipts */}
      {unmatched.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-orange-700 mb-3">⚠ Unmatched ({unmatched.length})</h3>
          <div className="space-y-3">
            {unmatched.map((match, idx) => (
              <div
                key={idx}
                className="border border-orange-200 bg-orange-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {match.receipt.vendor}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${Math.abs(match.receipt.amount).toFixed(2)} on {match.receipt.date}
                    </div>
                  </div>
                  <div className="text-sm text-orange-700 font-medium">
                    No matching transaction found
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
