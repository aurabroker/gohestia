import type { Metadata } from 'next';
import { UbezpieczeniaDodatkowe } from './ubezpieczenia';

export const metadata: Metadata = {
  title: 'MediPlan · Medical Assistance — Ubezpieczenia Dodatkowe ERGO Razem',
  description: 'Zakres ubezpieczeń dodatkowych ERGO Razem (WU ER 01/25): MediPlan (specjalistyczna pomoc medyczna po wypadku, 10 000 zł) i Medical Assistance (pomoc opiekuńczo-medyczna, 3 000 zł / rok) — świadczenia, limity, wyłączenia, definicje i procedura.',
};

export default function UbezpieczeniaDodatkowePage() {
  return <UbezpieczeniaDodatkowe />;
}
