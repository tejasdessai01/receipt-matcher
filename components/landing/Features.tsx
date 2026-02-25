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
  },
  {
    icon: FileSpreadsheet,
    title: "Any Bank CSV Format",
    description:
      "Works with exports from Chase, Bank of America, Wells Fargo, QuickBooks, and any standard CSV format.",
  },
  {
    icon: Zap,
    title: "Instant Fuzzy Matching",
    description:
      "Our algorithm matches receipts to transactions using vendor name similarity, amount, and date proximity.",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description:
      "Export your matched results as a clean CSV ready for your accountant or bookkeeping software.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your financial data is processed in the browser. Nothing is stored on our servers. Zero data retention.",
  },
  {
    icon: Clock,
    title: "Save 3-6 Hours/Month",
    description:
      "What used to take hours of tedious spreadsheet work now takes under 60 seconds. Seriously.",
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

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-100 bg-gray-50 p-6 transition hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3">
                <f.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
