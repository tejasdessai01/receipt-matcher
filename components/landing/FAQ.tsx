"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What bank CSV formats do you support?",
    a: "ReceiptMatch works with any CSV that has Date, Description, and Amount columns. This covers exports from Chase, Bank of America, Wells Fargo, Capital One, QuickBooks, Xero, and virtually every other bank or accounting tool.",
  },
  {
    q: "Is my financial data safe?",
    a: "Yes. All processing happens locally in your browser. Your receipt images and bank data are never uploaded to or stored on our servers. We have a zero data-retention policy.",
  },
  {
    q: "How accurate is the matching?",
    a: "For receipts with clear text, matching accuracy is typically 90-98%. The algorithm uses vendor name similarity, transaction amount comparison, and date proximity to find the best match. You can always review and override matches before exporting.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. You can cancel from your account settings at any time. There are no contracts, no cancellation fees, and no questions asked.",
  },
  {
    q: "What image formats do you support for receipts?",
    a: "We support PNG, JPG, JPEG, and WebP. For best results, make sure the receipt text is clearly visible and the image is well-lit.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. If you're not happy within the first 30 days, email us and we'll refund you in full. No questions asked.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gray-400 transition ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm leading-6 text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
