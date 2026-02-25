import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-lg font-bold text-gray-900">ReceiptMatch</p>
            <p className="mt-1 text-sm text-gray-500">
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
