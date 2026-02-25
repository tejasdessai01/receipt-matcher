"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    description: "Try it out — no credit card needed.",
    features: [
      "10 receipt matches",
      "OCR receipt scanning",
      "CSV bank import",
      "Export to CSV",
    ],
    cta: "Get started free",
    href: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: "$3", yearly: "$29" },
    period: { monthly: "/month", yearly: "/year" },
    badge: "Most Popular",
    description: "For freelancers and small business owners.",
    features: [
      "Unlimited receipt matches",
      "OCR receipt scanning",
      "Any bank CSV format",
      "One-click export",
      "Priority processing",
      "Email support",
    ],
    cta: "Start 7-day free trial",
    href: "/dashboard?plan=pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: { monthly: "$12", yearly: "$99" },
    period: { monthly: "/month", yearly: "/year" },
    description: "For bookkeepers managing multiple clients.",
    features: [
      "Everything in Pro",
      "Up to 10 workspaces",
      "Batch processing",
      "API access",
      "Priority email support",
    ],
    cta: "Start free trial",
    href: "/dashboard?plan=team",
    highlighted: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const cycle = annual ? "yearly" : "monthly";

  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Less than the cost of a coffee. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                !annual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                annual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly{" "}
              <span className="text-green-600 font-semibold">save 20%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`card-hover relative rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-indigo-600 bg-gradient-to-b from-indigo-50/50 to-white shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-600 scale-[1.02]"
                  : "border-gray-200 bg-white"
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-200">
                  {tier.badge}
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-gray-900">
                  {tier.price[cycle]}
                </span>
                {tier.period && (
                  <span className="text-sm font-medium text-gray-400">
                    {tier.period[cycle]}
                  </span>
                )}
              </div>

              <div className="my-8 h-px bg-gray-100" />

              <ul className="space-y-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tier.highlighted ? "text-indigo-600" : "text-emerald-500"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-bold transition-all ${
                  tier.highlighted
                    ? "btn-shimmer bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
