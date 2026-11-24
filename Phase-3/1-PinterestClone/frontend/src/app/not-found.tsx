import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="text-8xl font-black text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-500">The idea you were looking for may have moved.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
          Back to home
        </Link>
      </div>
    </div>
  );
}
