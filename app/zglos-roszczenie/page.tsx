import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { PageHero } from '@/components/page-hero';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Zgłoś roszczenie — Grupa Otwarta ERGO Hestia',
};

export default function ZglosRoszczeniePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <PageHero
        eyebrow="Grupa Otwarta ERGO Razem"
        title={<>Zgłoś <span className="text-[#E4002B]">roszczenie</span></>}
        description="Sprawdź, jak zgłosić zdarzenie objęte ochroną — zarówno w ramach podstawowego ubezpieczenia, jak i pakietów dodatkowych."
      />

      <main className="flex-1 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-sm max-w-none">
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
                https://zgloszenieroszczenia.ergohestia.pl
              </a>
              ,
            </li>
            <li>
              <strong>MediPlan i Medical Assistance</strong> – przez infolinię Centrum
              Alarmowego pod numerem <a href="tel:+48225222994">22 522 29 94</a>.
            </li>
          </ul>
        </div>
      </div>
      </main>

      <SiteFooter />
    </div>
  );
}
