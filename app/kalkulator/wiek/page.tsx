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
  const { setAgeGroup, setBirthDate, reset } = useCalculatorStore();

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
      // Nowa data urodzenia zaczyna ścieżkę od początku: wcześniejsze wybory
      // (wariant, dodatki) mogły dotyczyć innej grupy wiekowej.
      reset();
      setAgeGroup(group);
      setBirthDate(birth);
      router.push('/kalkulator/ankieta');
    }
  };

  return (
    <div className="max-w-[34rem]">
      <h1>Kiedy się urodziłeś(-aś)?</h1>
      <p className="of-lead">
        Od wieku zależy składka. Do ubezpieczenia ERGO Razem mogą przystąpić osoby,
        które w dniu objęcia ochroną mają 18–65 lat.
      </p>

      <form onSubmit={handleSubmit} noValidate className="sec">
        <label className="fld" htmlFor="birthdate">
          <span className="fld-l">Data urodzenia</span>
        </label>
        <input
          id="birthdate"
          type="date"
          className="inp"
          value={value}
          min={minDate}
          max={maxDate}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'birthdate-err' : 'birthdate-note'}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
        />
        {error && <p id="birthdate-err" role="alert" className="err">{error}</p>}
        <p id="birthdate-note" className="hint">
          Nie przechowujemy Twojej daty urodzenia po zamknięciu strony.
        </p>

        <div className="mt-6">
          <button type="submit" className="btn">Dalej: pytania o zdrowie</button>
        </div>
      </form>
    </div>
  );
}
