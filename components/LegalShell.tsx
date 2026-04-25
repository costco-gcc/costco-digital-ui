import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LegalShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-costco-blue hover:underline">
        <ArrowLeft size={14} /> Back to home
      </Link>
      <h1 className="section-title mt-4">{title}</h1>
      <p className="text-xs text-[color:var(--muted)] mt-1">Last updated: {updated}</p>
      <div className="mt-8 space-y-4 leading-relaxed text-[color:var(--ink)]/90 text-[15px]">
        {children}
      </div>
    </>
  );
}
