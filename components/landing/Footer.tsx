import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                </svg>
              </div>
              <p className="text-lg font-bold text-gray-900">ReceiptMatch</p>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Auto-match receipts to bank transactions.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="#features" className="hover:text-gray-900 transition">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-gray-900 transition">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-gray-900 transition">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 transition">
              Privacy
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ReceiptMatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
