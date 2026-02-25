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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      {/* Header */}
      <header className="border-b border-gray-200/80 glass sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-900">ReceiptMatch</h1>
            </div>
          </div>
          {step === "results" && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
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
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 animate-fade-in-up shadow-sm">
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
                      className={`h-0.5 w-8 rounded-full sm:w-16 transition-colors duration-500 ${
                        isDone ? "bg-gradient-to-r from-indigo-600 to-violet-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 shadow-sm"
                        : isDone
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
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
          <div className="animate-fade-in-up">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Receipts */}
              <div className="card-hover rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2.5">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Receipt Images
                    </h2>
                    <p className="text-sm text-gray-500">
                      Upload photos or scans of your receipts
                    </p>
                  </div>
                </div>
                <ReceiptUploader onReceiptsProcessed={setReceipts} />
                {receipts.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 animate-fade-in-up">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    {receipts.length} receipt{receipts.length !== 1 ? "s" : ""} ready
                  </div>
                )}
              </div>

              {/* Transactions */}
              <div className="card-hover rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5">
                    <FileSpreadsheet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Bank Statement CSV
                    </h2>
                    <p className="text-sm text-gray-500">
                      Export from your bank or bookkeeping tool
                    </p>
                  </div>
                </div>
                <CSVUploader onTransactionsLoaded={setTransactions} />
                {transactions.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 animate-fade-in-up">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} loaded
                  </div>
                )}
              </div>
            </div>

            {/* Match button */}
            <div className="mt-10 text-center">
              <button
                onClick={handleMatch}
                disabled={!canMatch}
                className={`btn-shimmer inline-flex items-center gap-2.5 rounded-xl px-10 py-4 text-base font-bold shadow-sm transition-all ${
                  canMatch
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
              >
                <Zap className="h-5 w-5" />
                {canMatch
                  ? `Match ${receipts.length} receipt${receipts.length !== 1 ? "s" : ""} to ${transactions.length} transaction${transactions.length !== 1 ? "s" : ""}`
                  : "Upload receipts and bank CSV to match"}
              </button>
              {canMatch && (
                <p className="mt-3 text-xs text-gray-400">
                  Processing happens in your browser. Your data never leaves your device.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Matching step */}
        {step === "matching" && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-6 w-6 text-indigo-600 animate-pulse-soft" />
              </div>
            </div>
            <p className="mt-8 text-xl font-bold text-gray-900">
              Matching in progress...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Comparing {receipts.length} receipts against {transactions.length} transactions
            </p>
          </div>
        )}

        {/* Results step */}
        {step === "results" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-in-up">
            <MatchResults matches={matches} />
          </div>
        )}
      </main>
    </div>
  );
}
