import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const bullets = [
  "Upload receipts + bank CSV",
  "Instant AI-powered matching",
  "Export reconciliation report",
];

const mockRows = [
  {
    vendor: "Staples Office Supply",
    amount: "$127.43",
    txn: "STAPLES #1284",
    conf: "97%",
    confColor: "bg-emerald-100 text-emerald-700",
  },
  {
    vendor: "AWS Cloud Services",
    amount: "$84.20",
    txn: "AMAZON WEB SERVICES",
    conf: "94%",
    confColor: "bg-emerald-100 text-emerald-700",
  },
  {
    vendor: "Uber Eats",
    amount: "$32.50",
    txn: "UBER EATS ORDER",
    conf: "91%",
    confColor: "bg-emerald-100 text-emerald-700",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
      <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-[400px] w-[400px] rounded-full bg-violet-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 sm:pt-28 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Copy */}
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">
                Trusted by 2,000+ small businesses
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1] text-balance">
              Match receipts to
              <span className="gradient-text"> bank transactions </span>
              in seconds
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-lg">
              Upload receipt images and a bank export. ReceiptMatch uses OCR and
              smart matching to pair them automatically — so you can close
              your books in minutes, not hours.
            </p>

            <ul className="mt-8 space-y-3">
              {bullets.map((b, i) => (
                <li
                  key={b}
                  className={`flex items-center gap-3 text-gray-700 animate-fade-in-up animation-delay-${(i + 2) * 100}`}
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                Start matching free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300"
              >
                View pricing
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free for your first 10 matches. No credit card required.
            </p>
          </div>

          {/* Visual — floating card */}
          <div className="relative hidden lg:block animate-slide-in-right animation-delay-300">
            {/* Glow behind card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-200/50 to-violet-200/50 blur-2xl" />

            <div className="animate-float relative rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-2xl shadow-indigo-200/40 backdrop-blur-sm">
              {/* Window chrome */}
              <div className="mb-5 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-gray-400">
                  ReceiptMatch — Dashboard
                </span>
              </div>

              {/* Mock match rows */}
              {mockRows.map((row, i) => (
                <div
                  key={row.vendor}
                  className={`mb-3 flex items-center justify-between rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-white px-4 py-3.5 text-sm animate-fade-in-up animation-delay-${(i + 4) * 100}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">
                      {row.vendor}
                    </p>
                    <p className="text-xs text-gray-500">{row.amount}</p>
                  </div>
                  <div className="mx-3 flex flex-col items-center">
                    <svg className="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    <span
                      className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${row.confColor}`}
                    >
                      {row.conf}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <p className="truncate font-semibold text-gray-900">
                      {row.txn}
                    </p>
                    <p className="text-xs text-gray-500">{row.amount}</p>
                  </div>
                </div>
              ))}

              {/* Summary bar */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3 text-sm">
                <span className="font-semibold text-indigo-700">
                  3 of 3 receipts matched
                </span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
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
