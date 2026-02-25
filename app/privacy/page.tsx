import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ReceiptMatch",
};

export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: February 2026
        </p>

        <div className="prose prose-gray mt-8 max-w-none text-sm leading-7 text-gray-600">
          <h2 className="text-lg font-semibold text-gray-900">
            1. Data Processing
          </h2>
          <p>
            ReceiptMatch processes your receipt images and bank CSV files
            entirely in your browser. Your financial data is <strong>never
            uploaded to or stored on our servers</strong>. OCR processing
            and matching happens client-side.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            2. What We Collect
          </h2>
          <p>
            We collect only the minimum information needed to provide the
            Service:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Account information:</strong> Email address (for
              authentication and billing).
            </li>
            <li>
              <strong>Payment information:</strong> Handled securely by Stripe.
              We never see or store your credit card details.
            </li>
            <li>
              <strong>Usage analytics:</strong> Anonymous, aggregate usage
              statistics to improve the product (page views, feature usage).
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900">
            3. Data Retention
          </h2>
          <p>
            We do not retain your receipt images, bank transaction data, or
            match results. All processing data exists only in your browser
            session and is discarded when you close the page.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            4. Third-Party Services
          </h2>
          <p>
            We use Stripe for payment processing. Stripe&rsquo;s privacy policy
            governs the handling of your payment information. We do not share
            your data with any other third parties.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            5. Your Rights
          </h2>
          <p>
            You may request deletion of your account and any associated data
            at any time by contacting us. Since we do not store your financial
            data, there is nothing to delete beyond your account record.
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            6. Contact
          </h2>
          <p>
            For privacy-related questions, please contact us at
            privacy@receiptmatch.app.
          </p>
        </div>
      </div>
    </div>
  );
}
