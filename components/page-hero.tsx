import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  backHref = '/',
  backLabel = '← Powrót do strony głównej',
}: PageHeroProps) {
  return (
    <section className="bg-gradient-to-br from-white via-red-50 to-rose-100 border-b border-rose-100">
      <div className="max-w-5xl mx-auto px-4 py-14 md:py-16 text-center">
        {backHref && (
          <Link
            href={backHref}
            className="inline-block text-sm text-[#E4002B] hover:underline mb-6"
          >
            {backLabel}
          </Link>
        )}
        {eyebrow && (
          <div className="mx-auto inline-block rounded-full bg-[#E4002B]/10 text-[#E4002B] px-4 py-1 text-sm font-medium mb-4">
            {eyebrow}
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 text-lg leading-relaxed mt-4 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {actions && (
          <div className="flex flex-wrap gap-3 justify-center mt-6">{actions}</div>
        )}
      </div>
    </section>
  );
}
