"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I used to spend half a Saturday matching receipts. Now it takes me less than 5 minutes. ReceiptMatch paid for itself in the first week.",
    name: "Sarah Chen",
    title: "Freelance Consultant",
    company: "Chen Advisory",
    initials: "SC",
    color: "bg-indigo-500",
    stars: 5,
  },
  {
    quote:
      "We process 200+ receipts a month across 8 clients. This tool cut our reconciliation time by 80%. My team actually looks forward to month-end now.",
    name: "Marcus Johnson",
    title: "Bookkeeper",
    company: "Precision Books LLC",
    initials: "MJ",
    color: "bg-emerald-500",
    stars: 5,
  },
  {
    quote:
      "The matching accuracy blew me away — it matched vendor names even when the bank statement abbreviates them. Way better than doing it manually in Excel.",
    name: "Lisa Park",
    title: "Small Business Owner",
    company: "Park & Co. Design",
    initials: "LP",
    color: "bg-violet-500",
    stars: 5,
  },
];

const stats = [
  { value: "2,000+", label: "Businesses" },
  { value: "1.2M", label: "Receipts matched" },
  { value: "94%", label: "Avg accuracy" },
  { value: "4.9/5", label: "User rating" },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-white py-24">
      {/* Decorative blob */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Loved by Small Businesses
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Don&rsquo;t take our word for it
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Join thousands of freelancers, bookkeepers, and business owners who
            stopped wasting time on manual receipt matching.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white px-6 py-5 text-center shadow-sm"
            >
              <p className="text-3xl font-extrabold gradient-text">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`card-hover rounded-2xl border border-gray-100 bg-white p-8 shadow-sm animate-fade-in-up animation-delay-${(i + 1) * 200}`}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-4 text-sm leading-7 text-gray-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.title}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
