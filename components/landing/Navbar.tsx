"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100/80 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <rect x="3" y="3" width="18" height="18" rx="3" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">ReceiptMatch</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            FAQ
          </a>
          <Link
            href="/dashboard"
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:shadow-md hover:brightness-110"
          >
            Open App
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-600"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600"
            >
              FAQ
            </a>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Open App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
