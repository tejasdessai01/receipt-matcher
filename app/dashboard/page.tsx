"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileSpreadsheet,
  Zap,
  Download,
  AlertCircle,
  Save,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import ReceiptUploader from "@/components/dashboard/ReceiptUploader";
import CSVUploader from "@/components/dashboard/CSVUploader";
import MatchResults from "@/components/dashboard/MatchResults";
import { matchReceiptsToTransactions } from "@/lib/matcher";
import type { Receipt, Transaction, Match } from "@/lib/types";

type Step = "upload" | "matching" | "results";

export default function Dashboard() {
  const { data: authSession, status } = useSession();
  const router = useRouter();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
    }
  }, [status, router]);

  const canMatch = receipts.length > 0 && transactions.length > 0;

  const handleMatch = useCallback(async () => {
    setStep("matching");
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 100));
      const results = matchReceiptsToTransactions(receipts, transactions);
      setMatches(results);
      setStep("results");

      // Auto-save after matching
      const matched = results.filter((m) => m.transaction).length;
      const avgConf =
        results.length > 0
          ? results.reduce((sum, m) => sum + m.confidence, 0) / results.length
          : 0;

      const name =
        sessionName ||
        `${receipts.length} receipts — ${new Date().toLocaleDateString()}`;

      const body = {
        name,
        receiptCount: receipts.length,
        transactionCount: transactions.length,
        matchedCount: matched,
        avgConfidence: Math.round(avgConf * 100) / 100,
        receipts: receipts.map(({ imageUrl, ...r }) => r),
        transactions,
        matches: results,
      };

      try {
        let res;
        if (activeSessionId) {
          res = await fetch(`/api/sessions/${activeSessionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } else {
          res = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
        const data = await res.json();
        if (data.id) setActiveSessionId(data.id);
        setRefreshKey((k) => k + 1);
      } catch {
        // Non-critical: session still works locally
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Matching failed. Please try again."
      );
      setStep("upload");
    }
  }, [receipts, transactions, sessionName, activeSessionId]);

  const handleNewSession = () => {
    setReceipts([]);
    setTransactions([]);
    setMatches([]);
    setStep("upload");
    setError(null);
    setActiveSessionId(null);
    setSessionName("");
    setSaved(false);
  };

  const handleLoadSession = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (!res.ok) return;
      const data = await res.json();

      setActiveSessionId(data.id);
      setSessionName(data.name);
      setReceipts(data.receipts || []);
      setTransactions(data.transactions || []);
      setMatches(data.matches || []);
      setStep(data.matches?.length > 0 ? "results" : "upload");
      setError(null);
      setSaved(false);
    } catch {
      setError("Failed to load session");
    }
  };

  const handleSave = async () => {
    if (!activeSessionId && !canMatch && matches.length === 0) return;

    setSaving(true);
    try {
      const matched = matches.filter((m) => m.transaction).length;
      const avgConf =
        matches.length > 0
          ? matches.reduce((sum, m) => sum + m.confidence, 0) / matches.length
          : 0;

      const name =
        sessionName ||
        `${receipts.length} receipts — ${new Date().toLocaleDateString()}`;

      const body = {
        name,
        receiptCount: receipts.length,
        transactionCount: transactions.length,
        matchedCount: matched,
        avgConfidence: Math.round(avgConf * 100) / 100,
        receipts: receipts.map(({ imageUrl, ...r }) => r),
        transactions,
        matches,
      };

      let res;
      if (activeSessionId) {
        res = await fetch(`/api/sessions/${activeSessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (data.id) setActiveSessionId(data.id);
      setSaved(true);
      setRefreshKey((k) => k + 1);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  // Loading state while checking auth
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100/50">
      {/* Sidebar */}
      <Sidebar
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onLoadSession={handleLoadSession}
        refreshKey={refreshKey}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-200/80 bg-white/80 px-6 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Untitled session"
              className="border-0 bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-2">
            {(receipts.length > 0 || matches.length > 0) && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  saved
                    ? "bg-emerald-50 text-emerald-700"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Saved
                  </>
                ) : saving ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-5xl">
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
                    (s.key === "upload" &&
                      (step === "matching" || step === "results")) ||
                    (s.key === "matching" && step === "results");
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      {i > 0 && (
                        <div
                          className={`h-0.5 w-8 rounded-full sm:w-16 transition-colors duration-500 ${
                            isDone
                              ? "bg-gradient-to-r from-indigo-600 to-violet-600"
                              : "bg-gray-200"
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
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {receipts.length} receipt
                        {receipts.length !== 1 ? "s" : ""} ready
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
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {transactions.length} transaction
                        {transactions.length !== 1 ? "s" : ""} loaded
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
                      Processing happens in your browser. Your data never leaves
                      your device.
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
                  Comparing {receipts.length} receipts against{" "}
                  {transactions.length} transactions
                </p>
              </div>
            )}

            {/* Results step */}
            {step === "results" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-in-up">
                <MatchResults matches={matches} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
