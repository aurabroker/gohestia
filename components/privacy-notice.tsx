import { ShieldCheck } from 'lucide-react';

interface Props {
  dismissible?: boolean;
}

export function PrivacyNotice({ dismissible = false }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
      <p>
        Odpowiedzi na pytania dotyczące stanu zdrowia są przetwarzane{' '}
        <strong>wyłącznie lokalnie w Twojej przeglądarce</strong> i nie są
        nigdzie wysyłane ani zapisywane.
      </p>
    </div>
  );
}
