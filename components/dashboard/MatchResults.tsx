"use client";

import { useMemo } from "react";
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import type { Match } from "@/lib/types";

type Props = {
  matches: Match[];
};

export default function MatchResults({ matches }: Props) {
  const { matched, unmatched, avgConfidence } = useMemo(() => {
    const m = matches.filter((r) => r.transaction !== null);
    const u = matches.filter((r) => r.transaction === null);
    const avg =
      m.length > 0
        ? m.reduce((sum, r) => sum + r.confidence, 0) / m.length
        : 0;
    return { matched: m, unmatched: u, avgConfidence: avg };
  }, [matches]);

  const exportToCSV = () => {
    const header = [
      "Receipt Vendor",
      "Receipt Amount",
      "Receipt Date",
      "Transaction Description",
      "Transaction Amount",
      "Transaction Date",
      "Confidence",
      "Status",
    ];
    const rows = matches.map((m) => [
      m.receipt.vendor,
      m.receipt.amount.toFixed(2),
      m.receipt.date,
      m.transaction?.description || "",
      m.transaction?.amount.toFixed(2) || "",
      m.transaction?.date || "",
      m.transaction ? `${(m.confidence * 100).toFixed(0)}%` : "0%",
      m.transaction ? "Matched" : "Unmatched",
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-matches-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const confidenceColor = (c: number) => {
    if (c >= 0.85) return "text-green-700 bg-green-100";
    if (c >= 0.65) return "text-yellow-700 bg-yellow-100";
    return "text-orange-700 bg-orange-100";
  };

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Matched</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-green-800">
            {matched.length}{" "}
            <span className="text-sm font-normal text-green-600">
              of {matches.length}
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              Unmatched
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-orange-800">
            {unmatched.length}
          </p>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Avg Confidence
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-indigo-800">
            {(avgConfidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Export button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Match Details</h2>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Matched rows */}
      {matched.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Matched ({matched.length})
          </h3>
          <div className="space-y-2">
            {matched.map((match) => (
              <div
                key={match.receipt.id}
                className="rounded-lg border border-green-200 bg-green-50/50 px-4 py-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {match.receipt.vendor}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${Math.abs(match.receipt.amount).toFixed(2)} &middot;{" "}
                      {match.receipt.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${confidenceColor(match.confidence)}`}
                    >
                      {(match.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex-1 sm:text-right">
                    <p className="font-medium text-gray-900">
                      {match.transaction?.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${Math.abs(match.transaction?.amount || 0).toFixed(2)}{" "}
                      &middot; {match.transaction?.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unmatched rows */}
      {unmatched.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-700">
            <AlertTriangle className="h-4 w-4" />
            Unmatched ({unmatched.length})
          </h3>
          <div className="space-y-2">
            {unmatched.map((match) => (
              <div
                key={match.receipt.id}
                className="rounded-lg border border-orange-200 bg-orange-50/50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {match.receipt.vendor}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${Math.abs(match.receipt.amount).toFixed(2)} &middot;{" "}
                      {match.receipt.date}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-orange-600">
                    No match found
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
