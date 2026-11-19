import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { PageHero } from '@/components/page-hero';
import { Tresc } from '@/components/content/tresc';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Zgłoś roszczenie — Grupa Otwarta ERGO Hestia',
};

export default function ZglosRoszczeniePage() {
  return (
    <>
      <SiteHeader />

      <PageHero
        title="Zgłoś roszczenie"
        description="Sprawdź, jak zgłosić zdarzenie objęte ochroną — zarówno w ramach podstawowego ubezpieczenia, jak i pakietów dodatkowych."
        note="Grupa Otwarta ERGO Razem"
      />

      <main className="flex-1">
      <div className="wrap page">
        <Tresc>
          <p>Klient może zgłosić roszczenie w Grupie Otwartej:</p>
          <ul>
            <li>za pomocą Platformy Zgłaszania Roszczeń,</li>
            <li>podczas wizyty u agenta,</li>
            <li>
              przesyłając dokumenty listem na adres:<br />
              Sopockie Towarzystwo Ubezpieczeń na Życie ERGO Hestia S.A.,<br />
              ul. Hestii 1, 81-731 Sopot,
            </li>
            <li>
              przesyłając dokumenty listem elektronicznym na adres do doręczeń
              elektronicznych <strong>AE:PL-71115-41590-RJWRG-16</strong>.
            </li>
          </ul>

          <h2>Zgłoszenie roszczenia z dodatków</h2>
          <ul>
            <li>
              <strong>Global Doctors</strong> – pod numerem telefonu{' '}
              <a href="tel:801107107">801 107 107</a> lub{' '}
              <a href="tel:+48585555555">(58) 555 55 55</a> lub przez formularz na stronie{' '}
              <a
                href="https://zgloszenieroszczenia.ergohestia.pl"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://<wbr />zgloszenieroszczenia.ergohestia.pl
              </a>
              ,
            </li>
            <li>
              <strong>MediPlan i Medical Assistance</strong> – przez infolinię Centrum
              Alarmowego pod numerem <a href="tel:+48225222994">22 522 29 94</a>.
            </li>
          </ul>
        </Tresc>
      </div>
      </main>

      <SiteFooter />
    </>
  );
}
