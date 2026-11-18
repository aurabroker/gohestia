'use client';
import clsx from 'clsx';

interface Props {
  label: string;
  price: string;
  tooltip: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function AddonToggle({ label, price, tooltip, checked, disabled, onToggle }: Props) {
  return (
    <label className={clsx(
      'flex items-center justify-between rounded-lg border p-4 transition-colors',
      'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E4002B]',
      disabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-gray-50',
      checked ? 'border-[#E4002B] bg-[#E4002B]/5' : 'border-gray-200'
    )}>
      <span className="flex items-center gap-3">
        {/* Prawdziwy checkbox w roli przełącznika: klik w dowolne miejsce
            wiersza, spacja z klawiatury i czytniki ekranu działają natywnie. */}
        <input
          type="checkbox"
          role="switch"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={onToggle}
        />
        <span
          aria-hidden="true"
          className={clsx(
            'relative h-6 w-11 rounded-full transition-colors flex-shrink-0',
            checked ? 'bg-[#E4002B]' : 'bg-gray-300'
          )}
        >
          <span className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )} />
        </span>
        <span>
          <span className="block font-medium text-gray-900 text-sm">{label}</span>
          <span className="block text-xs text-gray-500">{tooltip}</span>
        </span>
      </span>
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap ml-4">{price}</span>
    </label>
  );
}
