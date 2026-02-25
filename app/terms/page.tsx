import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ReceiptMatch",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          &larr; Back to home
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-gray-900">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: February 2026
        </p>

        <div className="prose prose-gray mt-8 max-w-none text-sm leading-7 text-gray-600">
          <h2 className="text-lg font-semibold text-gray-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using ReceiptMatch (&ldquo;the Service&rdquo;), you
            agree to be bound by these Terms of Service. If you do not agree,
            please do not use the Service.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            2. Description of Service
          </h2>
          <p>
            ReceiptMatch provides an automated tool that matches uploaded receipt
            images with bank transaction records using optical character
            recognition (OCR) and fuzzy matching algorithms. The Service is
            provided &ldquo;as is&rdquo; and is intended as a productivity aid,
            not a substitute for professional accounting advice.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            3. User Responsibilities
          </h2>
          <p>
            You are responsible for the accuracy of data you upload and for
            verifying all match results before using them for accounting,
            tax, or legal purposes. ReceiptMatch is not liable for incorrect
            matches or OCR errors.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            4. Payments & Cancellation
          </h2>
          <p>
            Paid plans are billed on a recurring basis (monthly or yearly).
            You may cancel at any time from your account settings. Cancellation
            takes effect at the end of the current billing period. Refunds are
            available within 30 days of initial purchase.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            5. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, ReceiptMatch shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising out of or related to your use of the Service.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            6. Changes to Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            Service after changes constitutes acceptance of the revised Terms.
          </p>
        </div>
      </div>
    </div>
  );
}
