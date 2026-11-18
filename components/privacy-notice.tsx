/** Zapewnienie, że odpowiedzi z ankiety zdrowotnej nie opuszczają przeglądarki. */
export function PrivacyNotice() {
  return (
    <p className="msg">
      Odpowiedzi na pytania dotyczące stanu zdrowia są przetwarzane{' '}
      <strong>wyłącznie lokalnie w Twojej przeglądarce</strong> i nie są
      nigdzie wysyłane ani zapisywane.
    </p>
  );
}
