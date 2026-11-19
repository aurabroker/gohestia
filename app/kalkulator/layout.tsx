import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Stepper } from '@/components/stepper';

export default function KalkulatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Stepper />
      <main className="flex-1">
        <div className="wrap of">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
