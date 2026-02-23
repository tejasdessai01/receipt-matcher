'use client';

import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import type { Receipt } from '@/app/page';

type Props = {
  onReceiptsProcessed: (receipts: Receipt[]) => void;
};

export default function ReceiptUploader({ onReceiptsProcessed }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processImage = async (file: File): Promise<Receipt | null> => {
    try {
      const worker = await createWorker('eng');
      const imageUrl = URL.createObjectURL(file);
      
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();
      
      // Parse OCR text to extract vendor, amount, date
      const receipt = parseReceiptText(text, imageUrl);
      return receipt;
    } catch (error) {
      console.error('OCR failed:', error);
      return null;
    }
  };

  const parseReceiptText = (text: string, imageUrl: string): Receipt => {
    // Simple parsing logic - can be improved
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    // Extract vendor (usually first non-empty line)
    const vendor = lines[0] || 'Unknown Vendor';
    
    // Extract amount (look for $ or numbers with decimal)
    const amountMatch = text.match(/\$?\s*(\d+\.\d{2})/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    
    // Extract date (look for common date formats)
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    const date = dateMatch ? parseDateString(dateMatch[1]) : new Date().toISOString().split('T')[0];
    
    return {
      id: `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      vendor,
      amount,
      date,
      imageUrl,
    };
  };

  const parseDateString = (dateStr: string): string => {
    try {
      // Try to parse common formats: MM/DD/YYYY, DD-MM-YYYY, etc.
      const parts = dateStr.split(/[\/\-]/);
      if (parts.length === 3) {
        const [p1, p2, p3] = parts.map(p => parseInt(p));
        
        // Assume MM/DD/YYYY
        const year = p3 < 100 ? 2000 + p3 : p3;
        const month = p1;
        const day = p2;
        
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    } catch {
      // Fall back to today
    }
    return new Date().toISOString().split('T')[0];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    const fileArray = Array.from(files);
    const receipts: Receipt[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const receipt = await processImage(file);
      if (receipt) {
        receipts.push(receipt);
      }
      setProgress(((i + 1) / fileArray.length) * 100);
    }

    onReceiptsProcessed(receipts);
    setIsProcessing(false);
    setProgress(0);
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={isProcessing}
          className="hidden"
          id="receipt-upload"
        />
        <label
          htmlFor="receipt-upload"
          className={`cursor-pointer ${isProcessing ? 'opacity-50' : ''}`}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing ? 'Processing receipts...' : 'Click to upload receipt images'}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, PDF up to 10MB each
          </p>
        </label>
      </div>
      
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}
    </div>
  );
}
