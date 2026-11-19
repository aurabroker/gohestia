import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageHeroProps {
  title: ReactNode;
  description?: ReactNode;
  /** Krótka informacja pod wstępem, np. kod dokumentu („WU/ER 01/25, Załącznik 1"). */
  note?: ReactNode;
  actions?: ReactNode;
  /** Link powrotny nad tytułem; `null` go ukrywa. */
  backHref?: string | null;
  backLabel?: string;
}

/** Nagłówek strony treściowej: pas blankietu z tytułem i krótkim wstępem. */
export function PageHero({
  title,
  description,
  note,
  actions,
  backHref = '/',
  backLabel = 'Strona główna',
}: PageHeroProps) {
  return (
    <section className="sheet">
      <div className="wrap ph-page">
        {backHref && (
          <Link href={backHref} className="back">
            {backLabel}
          </Link>
        )}
        <h1>{title}</h1>
        {description && <p className="lead">{description}</p>}
        {note && <p className="mt-2 text-[16px] text-druk-2">{note}</p>}
        {actions && <div className="acts">{actions}</div>}
      </div>
    </section>
  );
}
