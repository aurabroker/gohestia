import { Stepper } from '@/components/stepper';

export default function KalkulatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Aura Expert</p>
            <h1 className="text-lg font-bold text-gray-900">
              ERGO Razem <span className="text-[#E4002B]">Kalkulator</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Grupa Otwarta</p>
            <p className="text-xs text-gray-400">ER 01/25</p>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Stepper />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {children}
        </div>
      </main>

    </div>
  );
}
