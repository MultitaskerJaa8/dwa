import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="card max-w-lg w-full text-center">
        <div className="text-5xl font-black">404</div>
        <div className="text-white/70 mt-2">Page not found.</div>
        <Link className="btn btn-primary mt-5" href="/">Go Home</Link>
      </div>
    </div>
  );
}