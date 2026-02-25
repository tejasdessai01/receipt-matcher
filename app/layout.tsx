import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReceiptMatch — Auto-Match Receipts to Bank Transactions",
  description:
    "Stop wasting hours on manual receipt matching. Upload receipts and bank exports, get instant matches. Used by 2,000+ freelancers and small businesses. $3/month.",
  keywords: [
    "receipt matching",
    "expense reconciliation",
    "bank transaction matching",
    "bookkeeping automation",
    "receipt OCR",
    "small business accounting",
  ],
  openGraph: {
    title: "ReceiptMatch — Auto-Match Receipts to Bank Transactions",
    description:
      "Stop wasting hours on manual receipt matching. Upload receipts and bank exports, get instant matches.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-white text-gray-900 antialiased"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
