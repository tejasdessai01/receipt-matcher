import { Upload, Zap, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload",
    description:
      "Drag & drop your receipt images and bank CSV export. We support PNG, JPG, and all major bank formats.",
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Zap,
    step: "02",
    title: "Match",
    description:
      'Click "Match" and our algorithm pairs each receipt to its bank transaction using vendor, amount, and date.',
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Export",
    description:
      "Review the results, fix any edge cases, and export a clean reconciliation CSV in one click.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-gray-50 py-24 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Three steps. Under 60 seconds.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            No setup, no configuration. Just upload and go.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {/* Connector line (between cards) */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-0.5 w-8 translate-x-full bg-gradient-to-r from-gray-200 to-gray-300 md:block" />
              )}

              <div className="card-hover mx-auto rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                {/* Step number */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg shadow-indigo-100/50"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color}`}>
                    <s.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Step {s.step}
                </p>
                <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
