'use client';

interface Props {
  base: number;
  addonMediplan: boolean;
  addonMedicalAssistance: boolean;
  addonGlobalDoctors: boolean;
  globalDoctorsNote?: string;
}

export function PremiumCalculator({
  base,
  addonMediplan,
  addonMedicalAssistance,
  addonGlobalDoctors,
  globalDoctorsNote,
}: Props) {
  const total = base
    + (addonMediplan ? 9 : 0)
    + (addonMedicalAssistance ? 6 : 0);

  return (
    <div className="rounded-xl border-2 border-[#E4002B] bg-[#E4002B]/5 p-6 text-center">
      <p className="text-sm text-gray-600 mb-1">Łączna składka miesięczna</p>
      <p className="text-5xl font-bold text-[#E4002B]">
        {total} <span className="text-2xl">zł</span>
      </p>
      <p className="text-sm text-gray-500 mt-1">/ miesiąc</p>
      {addonGlobalDoctors && (
        <p className="mt-2 text-xs text-gray-500 italic">
          + Global Doctors: {globalDoctorsNote ?? 'wycena indywidualna'}
        </p>
      )}
    </div>
  );
}
