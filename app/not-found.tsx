import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-5 py-20 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-costco-red">404</p>
        <h1 className="section-title mt-2">We can't find that page.</h1>
        <p className="text-[color:var(--muted)] mt-2">The link may be old or mistyped. Try the home page.</p>
        <Link href="/" className="btn btn-primary mt-5">Take me home</Link>
      </div>
    </div>
  );
}
