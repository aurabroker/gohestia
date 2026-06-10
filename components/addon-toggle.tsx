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
      'flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors',
      disabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50',
      checked ? 'border-[#E4002B] bg-[#E4002B]/5' : 'border-gray-200'
    )}>
      <div className="flex items-center gap-3">
        <div
          onClick={() => !disabled && onToggle()}
          className={clsx(
            'relative h-6 w-11 rounded-full transition-colors flex-shrink-0',
            checked ? 'bg-[#E4002B]' : 'bg-gray-300'
          )}
        >
          <span className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )} />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{label}</p>
          <p className="text-xs text-gray-500">{tooltip}</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap ml-4">{price}</span>
    </label>
  );
}
