import { ShieldCheck, MonitorOff, Lock, Globe } from "lucide-react";

const badges = [
  {
    icon: MonitorOff,
    title: "Browser-Only Processing",
    description:
      "Your receipts and bank data never leave your device. All OCR and matching runs 100% client-side.",
  },
  {
    icon: Lock,
    title: "Zero Data Retention",
    description:
      "We don't store, log, or cache your financial data. Close the tab and it's gone forever.",
  },
  {
    icon: ShieldCheck,
    title: "Stripe-Secured Payments",
    description:
      "All billing goes through Stripe with PCI DSS Level 1 compliance. We never see your card number.",
  },
  {
    icon: Globe,
    title: "GDPR & CCPA Ready",
    description:
      "Built with privacy-by-design. Full compliance with European and California data protection laws.",
  },
];

export default function Trust() {
  return (
    <section className="bg-gray-900 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Enterprise-Grade Security
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your financial data stays on your device
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Unlike other tools, ReceiptMatch processes everything in your browser.
            We architecturally cannot access your data — even if we wanted to.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <div
              key={b.title}
              className="card-hover rounded-2xl border border-gray-800 bg-gray-800/50 p-6 text-center"
            >
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <b.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{b.title}</h3>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
