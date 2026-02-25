"use client";

import { useState, useRef, useCallback } from "react";
import { createWorker } from "tesseract.js";
import { Upload, ImageIcon, X } from "lucide-react";
import type { Receipt } from "@/lib/types";

type Props = {
  onReceiptsProcessed: (receipts: Receipt[]) => void;
};

export default function ReceiptUploader({ onReceiptsProcessed }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseReceiptText = (text: string, imageUrl: string): Receipt => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Vendor: first non-empty line that isn't just numbers/symbols
    const vendor =
      lines.find((l) => /[a-zA-Z]{2,}/.test(l)) || "Unknown Vendor";

    // Amount: look for total-like patterns first, then any dollar amount
    const totalPattern =
      /(?:total|amount|due|charged|grand\s*total)[:\s]*\$?\s*(\d+[,.]?\d*\.?\d{0,2})/i;
    const totalMatch = text.match(totalPattern);
    const amountMatch = totalMatch || text.match(/\$\s*(\d+[,.]?\d*\.\d{2})/);
    const fallbackMatch = text.match(/(\d+\.\d{2})/);
    const rawAmount = totalMatch
      ? totalMatch[1]
      : amountMatch
        ? amountMatch[1]
        : fallbackMatch
          ? fallbackMatch[1]
          : "0";
    const amount = parseFloat(rawAmount.replace(/,/g, ""));

    // Date: try common date patterns
    const datePatterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(\w{3,9}\s+\d{1,2},?\s+\d{4})/i,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    ];
    let dateStr = "";
    for (const pat of datePatterns) {
      const m = text.match(pat);
      if (m) {
        dateStr = m[1];
        break;
      }
    }
    const date = parseDateString(dateStr);

    return {
      id: `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      vendor: vendor.slice(0, 80),
      amount,
      date,
      imageUrl,
      rawText: text.slice(0, 500),
    };
  };

  const parseDateString = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString().split("T")[0];
    try {
      // Try standard Date parse first (handles "Jan 15, 2025" etc.)
      const d = new Date(dateStr);
      if (!isNaN(d.getTime()) && d.getFullYear() > 2000) {
        return d.toISOString().split("T")[0];
      }
      // Try MM/DD/YYYY
      const parts = dateStr.split(/[\/\-]/);
      if (parts.length === 3) {
        const [p1, p2, p3] = parts.map((p) => parseInt(p));
        const year = p3 < 100 ? 2000 + p3 : p3;
        return `${year}-${String(p1).padStart(2, "0")}-${String(p2).padStart(2, "0")}`;
      }
    } catch {
      // fall through
    }
    return new Date().toISOString().split("T")[0];
  };

  const processFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const validFiles = files.filter((f) => {
        if (!f.type.startsWith("image/")) return false;
        if (f.size > 10 * 1024 * 1024) return false;
        return true;
      });

      if (validFiles.length === 0) return;

      // Show previews
      const newPreviews = validFiles.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      }));
      setPreviews(newPreviews);

      setIsProcessing(true);
      setProgress(0);
      const receipts: Receipt[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setCurrentFile(file.name);
        try {
          const worker = await createWorker("eng");
          const imageUrl = URL.createObjectURL(file);
          const {
            data: { text },
          } = await worker.recognize(imageUrl);
          await worker.terminate();

          const receipt = parseReceiptText(text, imageUrl);
          receipts.push(receipt);
        } catch (err) {
          console.error(`OCR failed for ${file.name}:`, err);
        }
        setProgress(((i + 1) / validFiles.length) * 100);
      }

      onReceiptsProcessed(receipts);
      setIsProcessing(false);
      setCurrentFile("");
    },
    [onReceiptsProcessed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const clearPreviews = () => {
    setPreviews([]);
    onReceiptsProcessed([]);
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
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-3 text-sm font-medium text-gray-700">
          {isProcessing
            ? "Processing receipts..."
            : "Drag & drop receipt images or click to browse"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, WebP up to 10 MB each
        </p>
      </div>

      {/* Progress */}
      {isProcessing && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Processing: {currentFile}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Thumbnails */}
      {previews.length > 0 && !isProcessing && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">
              {previews.length} file{previews.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearPreviews();
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {previews.map((p) => (
              <div
                key={p.name}
                className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
