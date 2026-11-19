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

/** Nagłówek strony treściowej: tytuł wielkimi literami, krótki wstęp i gruba kreska pod spodem. */
export function PageHero({
  title,
  description,
  note,
  actions,
  backHref = '/',
  backLabel = 'Strona główna',
}: PageHeroProps) {
  return (
    <section>
      <div className="wrap ph-page">
        {backHref && (
          <Link href={backHref} className="back">
            {backLabel}
          </Link>
        )}
        <h1>{title}</h1>
        {description && <p className="lead">{description}</p>}
        {note && <p className="ph-note">{note}</p>}
        {actions && <div className="acts">{actions}</div>}
      </div>
    </section>
  );
}
