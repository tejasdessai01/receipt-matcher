import {
  Camera,
  FileSpreadsheet,
  Zap,
  Download,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "OCR Receipt Scanning",
    description:
      "Upload photos or scans of receipts. Our OCR engine extracts vendor, amount, and date automatically.",
    gradient: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: FileSpreadsheet,
    title: "Any Bank CSV Format",
    description:
      "Works with exports from Chase, Bank of America, Wells Fargo, QuickBooks, and any standard CSV format.",
    gradient: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Zap,
    title: "Instant Fuzzy Matching",
    description:
      "Our algorithm matches receipts to transactions using vendor name similarity, amount, and date proximity.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description:
      "Export your matched results as a clean CSV ready for your accountant or bookkeeping software.",
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your financial data is processed in the browser. Nothing is stored on our servers. Zero data retention.",
    gradient: "from-sky-500 to-sky-600",
    bg: "bg-sky-50",
  },
  {
    icon: Clock,
    title: "Save 3-6 Hours/Month",
    description:
      "What used to take hours of tedious spreadsheet work now takes under 60 seconds. Seriously.",
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to reconcile faster
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            No more cross-referencing receipts against bank statements row by
            row. Let ReceiptMatch do it for you.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-hover group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
            >
              <div
                className={`mb-5 inline-flex rounded-2xl ${f.bg} p-3.5 transition-transform group-hover:scale-110`}
              >
                <f.icon className={`h-6 w-6 bg-gradient-to-br ${f.gradient} bg-clip-text`} style={{ color: 'currentColor' }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
