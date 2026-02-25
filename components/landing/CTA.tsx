import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-indigo-600 py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-500 opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-500 opacity-30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stop wasting hours on receipt matching
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
          Join 2,000+ businesses that save 3-6 hours every month. Start free
          today — no credit card required.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
          >
            Start matching free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-indigo-200">
            Free for first 10 matches &middot; Then $3/mo
          </p>
        </div>
      </div>
    </section>
  );
}
