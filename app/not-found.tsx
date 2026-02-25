import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-gray-600">
          The page you&rsquo;re looking for doesn&rsquo;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
