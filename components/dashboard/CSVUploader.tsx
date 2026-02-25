"use client";

import { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Transaction } from "@/lib/types";

type Props = {
  onTransactionsLoaded: (transactions: Transaction[]) => void;
};

export default function CSVUploader({ onTransactionsLoaded }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseTransactions = (rows: Record<string, string>[]): Transaction[] => {
    if (rows.length === 0) throw new Error("CSV file is empty");

    const firstRow = rows[0];
    const keys = Object.keys(firstRow);
    const lowerKeys = keys.map((k) => k.toLowerCase().trim());

    // Smart column detection
    const dateIdx = lowerKeys.findIndex(
      (k) =>
        k === "date" ||
        k === "transaction date" ||
        k.includes("date") ||
        k.includes("posted")
    );
    const descIdx = lowerKeys.findIndex(
      (k) =>
        k === "description" ||
        k === "memo" ||
        k === "name" ||
        k === "merchant" ||
        k === "payee" ||
        k.includes("description") ||
        k.includes("memo") ||
        k.includes("merchant")
    );
    const amountIdx = lowerKeys.findIndex(
      (k) =>
        k === "amount" ||
        k === "debit" ||
        k === "total" ||
        k.includes("amount") ||
        k.includes("debit")
    );

    if (dateIdx === -1 && descIdx === -1 && amountIdx === -1) {
      throw new Error(
        "Could not detect Date, Description, or Amount columns. Please ensure your CSV has appropriate column headers."
      );
    }

    const dateKey = dateIdx !== -1 ? keys[dateIdx] : keys[0];
    const descKey = descIdx !== -1 ? keys[descIdx] : keys[Math.min(1, keys.length - 1)];
    const amountKey = amountIdx !== -1 ? keys[amountIdx] : keys[Math.min(2, keys.length - 1)];

    return rows
      .map((row, index) => {
        const dateStr = row[dateKey]?.trim();
        const description = row[descKey]?.trim() || "Unknown";
        const amountStr = (row[amountKey] || "0").trim();

        const amount = parseFloat(amountStr.replace(/[$,()]/g, (m) => (m === "(" || m === ")" ? "-" : "")));

        if (!dateStr || isNaN(amount)) return null;

        let date: string;
        try {
          const d = new Date(dateStr);
          date =
            !isNaN(d.getTime()) && d.getFullYear() > 2000
              ? d.toISOString().split("T")[0]
              : dateStr;
        } catch {
          date = dateStr;
        }

        return { id: `txn-${index}`, description, amount, date };
      })
      .filter((t): t is Transaction => t !== null);
  };

  const processFile = useCallback(
    (file: File) => {
      setIsProcessing(true);
      setError(null);
      setFileName(file.name);

      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const transactions = parseTransactions(results.data);
            if (transactions.length === 0) {
              throw new Error("No valid transactions found in CSV.");
            }
            onTransactionsLoaded(transactions);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Failed to parse CSV. Make sure it has Date, Description, and Amount columns."
            );
          } finally {
            setIsProcessing(false);
          }
        },
        error: (err) => {
          setError(`Error reading file: ${err.message}`);
          setIsProcessing(false);
        },
      });
    },
    [onTransactionsLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        processFile(file);
      } else {
        setError("Please upload a .csv file");
      }
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
          dragOver
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
        } ${isProcessing ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <FileSpreadsheet className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-3 text-sm font-medium text-gray-700">
          {isProcessing
            ? "Parsing CSV..."
            : "Drag & drop your bank CSV or click to browse"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Exported from your bank, QuickBooks, or Xero
        </p>
      </div>

      {/* File name */}
      {fileName && !error && !isProcessing && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          {fileName}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Supported formats */}
      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
        <p className="font-medium text-gray-600">Supported CSV columns:</p>
        <p className="mt-1">
          Date, Description (or Memo/Merchant/Name), Amount (or Debit/Total)
        </p>
      </div>
    </div>
  );
}
