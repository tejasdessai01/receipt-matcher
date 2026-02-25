const banks = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Capital One",
  "Citi",
  "US Bank",
  "PNC",
  "TD Bank",
];

const tools = [
  "QuickBooks",
  "Xero",
  "FreshBooks",
  "Wave",
  "Sage",
  "Zoho Books",
];

export default function Integrations() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Compatibility
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Works with every bank & accounting tool
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Export a CSV from your bank or bookkeeping software. If it has
            Date, Description, and Amount columns, it works.
          </p>
        </div>

        {/* Bank logos - rendered as stylized badges */}
        <div className="mt-14">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
            Supported Banks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {banks.map((bank) => (
              <span
                key={bank}
                className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {bank}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-gray-300 bg-white px-5 py-2.5 text-sm text-gray-400">
              + any bank with CSV export
            </span>
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
            Accounting Software
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {tool}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-gray-300 bg-white px-5 py-2.5 text-sm text-gray-400">
              + any CSV-compatible tool
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
