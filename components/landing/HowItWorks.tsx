import { Upload, ArrowRight, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload",
    description:
      "Drag & drop your receipt images and bank CSV export. We support PNG, JPG, and all major bank formats.",
  },
  {
    icon: ArrowRight,
    step: "02",
    title: "Match",
    description:
      'Click "Match" and our algorithm pairs each receipt to its bank transaction using vendor, amount, and date.',
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Export",
    description:
      "Review the results, fix any edge cases, and export a clean reconciliation CSV in one click.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Three steps. Under 60 seconds.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <s.icon className="h-7 w-7 text-indigo-600" />
              </div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-500">
                Step {s.step}
              </p>
              <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
