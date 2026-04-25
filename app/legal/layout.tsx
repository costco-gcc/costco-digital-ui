export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 sm:pt-32 pb-20 prose-legal">
      {children}
    </article>
  );
}
