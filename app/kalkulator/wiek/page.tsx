'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAgeGroup } from '@/lib/calculator';
import { useCalculatorStore } from '@/store/calculator-store';
import { format, subYears } from 'date-fns';

export default function WiekPage() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setAgeGroup, setBirthDate } = useCalculatorStore();

  const maxDate = format(subYears(new Date(), 18), 'yyyy-MM-dd');
  const minDate = format(subYears(new Date(), 66), 'yyyy-01-01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) { setError('Podaj datę urodzenia.'); return; }
    const birth = new Date(value);
    const group = getAgeGroup(birth);
    if (!group) {
      router.push('/wykluczenie/wiek');
    } else {
      setAgeGroup(group);
      setBirthDate(birth);
      router.push('/kalkulator/ankieta');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sprawdź, czy możesz przystąpić
          </h2>
          <p className="text-gray-600 mb-6">
            Grupowe ubezpieczenie na życie ERGO Razem — Grupa Otwarta
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                Data urodzenia
              </label>
              <input
                id="birthdate"
                type="date"
                value={value}
                min={minDate}
                max={maxDate}
                onChange={(e) => { setValue(e.target.value); setError(''); }}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#E4002B] py-4 font-semibold text-white hover:bg-[#c00025] transition-colors"
            >
              Dalej →
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Nie przechowujemy Twojej daty urodzenia po zamknięciu strony.
          </p>
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
          <strong>Warunki przystąpienia:</strong> wiek 18–65 lat w dniu objęcia ochroną.
        </div>
      </div>
    </div>
  );
}
