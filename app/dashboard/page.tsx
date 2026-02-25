"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Zap,
  Download,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import ReceiptUploader from "@/components/dashboard/ReceiptUploader";
import CSVUploader from "@/components/dashboard/CSVUploader";
import MatchResults from "@/components/dashboard/MatchResults";
import { matchReceiptsToTransactions } from "@/lib/matcher";
import type { Receipt, Transaction, Match } from "@/lib/types";

type Step = "upload" | "matching" | "results";

export default function Dashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);

  const canMatch = receipts.length > 0 && transactions.length > 0;

  const handleMatch = useCallback(async () => {
    setStep("matching");
    setError(null);
    try {
      // Slight delay so UI updates
      await new Promise((r) => setTimeout(r, 100));
      const results = matchReceiptsToTransactions(receipts, transactions);
      setMatches(results);
      setStep("results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Matching failed. Please try again."
      );
      setStep("upload");
    }
  }, [receipts, transactions]);

  const handleReset = () => {
    setReceipts([]);
    setTransactions([]);
    setMatches([]);
    setStep("upload");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <h1 className="text-lg font-bold text-gray-900">ReceiptMatch</h1>
          </div>
          {step === "results" && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <RotateCcw className="h-4 w-4" />
              New session
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {[
              { key: "upload", label: "Upload", icon: Upload },
              { key: "matching", label: "Match", icon: Zap },
              { key: "results", label: "Results", icon: Download },
            ].map((s, i) => {
              const isActive = s.key === step;
              const isDone =
                (s.key === "upload" && (step === "matching" || step === "results")) ||
                (s.key === "matching" && step === "results");
              return (
                <div key={s.key} className="flex items-center gap-3">
                  {i > 0 && (
                    <div
                      className={`h-px w-8 sm:w-16 ${
                        isDone ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : isDone
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <s.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload step */}
        {step === "upload" && (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Receipts */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <Upload className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Receipt Images
                    </h2>
                    <p className="text-sm text-gray-500">
                      Upload photos or scans of your receipts
                    </p>
                  </div>
                </div>
                <ReceiptUploader onReceiptsProcessed={setReceipts} />
                {receipts.length > 0 && (
                  <div className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                    {receipts.length} receipt{receipts.length !== 1 ? "s" : ""}{" "}
                    ready
                  </div>
                )}
              </div>

              {/* Transactions */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Bank Statement CSV
                    </h2>
                    <p className="text-sm text-gray-500">
                      Export from your bank or bookkeeping tool
                    </p>
                  </div>
                </div>
                <CSVUploader onTransactionsLoaded={setTransactions} />
                {transactions.length > 0 && (
                  <div className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                    {transactions.length} transaction
                    {transactions.length !== 1 ? "s" : ""} loaded
                  </div>
                )}
              </div>
            </div>

            {/* Match button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleMatch}
                disabled={!canMatch}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Zap className="h-5 w-5" />
                {canMatch
                  ? `Match ${receipts.length} receipt${receipts.length !== 1 ? "s" : ""} to ${transactions.length} transaction${transactions.length !== 1 ? "s" : ""}`
                  : "Upload receipts and bank CSV to match"}
              </button>
            </div>
          </>
        )}

        {/* Matching step */}
        {step === "matching" && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="mt-6 text-lg font-medium text-gray-900">
              Matching receipts to transactions...
            </p>
            <p className="mt-2 text-sm text-gray-500">This takes a moment</p>
          </div>
        )}

        {/* Results step */}
        {step === "results" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <MatchResults matches={matches} />
          </div>
        )}
      </main>
    </div>
  );
}
