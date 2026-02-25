import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const bullets = [
  "Upload receipts + bank CSV",
  "Instant AI-powered matching",
  "Export reconciliation report",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-32 lg:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700">
              Trusted by 2,000+ small businesses
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl text-balance">
              Match receipts to bank&nbsp;transactions in&nbsp;seconds
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-lg">
              Upload receipt images and a bank export. ReceiptMatch uses OCR and
              fuzzy matching to pair them automatically &mdash; so you can close
              your books in minutes, not hours.
            </p>

            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-600" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Start matching free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
              >
                View pricing
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free for your first 10 matches. No credit card required.
            </p>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl shadow-indigo-200/40">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">
                  ReceiptMatch Dashboard
                </span>
              </div>
              {/* Mock match rows */}
              {[
                {
                  vendor: "Staples Office Supply",
                  amount: "$127.43",
                  txn: "STAPLES #1284",
                  conf: "97%",
                },
                {
                  vendor: "AWS Cloud Services",
                  amount: "$84.20",
                  txn: "AMAZON WEB SERVICES",
                  conf: "94%",
                },
                {
                  vendor: "Uber Eats",
                  amount: "$32.50",
                  txn: "UBER EATS ORDER",
                  conf: "91%",
                },
              ].map((row) => (
                <div
                  key={row.vendor}
                  className="mb-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{row.vendor}</p>
                    <p className="text-gray-500">{row.amount}</p>
                  </div>
                  <div className="text-center">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      {row.conf}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{row.txn}</p>
                    <p className="text-gray-500">{row.amount}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-2 text-sm">
                <span className="font-medium text-indigo-700">
                  3 of 3 receipts matched
                </span>
                <span className="text-indigo-600 font-semibold">
                  Avg 94% confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
