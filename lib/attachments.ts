import { getCloudflareEnv } from './cloudflare-env';
import { OFFER_DOCUMENTS, type OfferDocument } from './data/documents';
import { getSiteUrl } from './site-url';

export interface EmailAttachment {
  filename: string;
  /** Zawartość pliku zakodowana w base64. */
  content: string;
  /** Typ pliku podawany wprost, żeby program pocztowy nie musiał go zgadywać. */
  contentType: 'application/pdf';
}

export interface LoadedDocuments {
  /** Załączniki gotowe do przekazania do Resend. */
  attachments: EmailAttachment[];
  /** Dokumenty, które udało się wczytać (w kolejności z konfiguracji). */
  attached: OfferDocument[];
  /** Dokumenty z konfiguracji, których NIE udało się wczytać. */
  missing: OfferDocument[];
}

/** Minimalny kształt bindingu statycznych zasobów workera (`assets.binding`). */
interface AssetsBinding {
  fetch(input: URL | string): Promise<Response>;
}

const HTTP_FETCH_TIMEOUT_MS = 5000;
const PDF_MAGIC = '%PDF-';

/**
 * Binding `ASSETS` z wrangler.jsonc. Poza Cloudflare (`next dev`,
 * `next start`) bindingu nie ma — wtedy zwracamy `null`.
 */
function getAssetsBinding(): AssetsBinding | null {
  const assets = getCloudflareEnv()?.ASSETS;
  const usable = typeof assets === 'object' && assets !== null
    && typeof (assets as { fetch?: unknown }).fetch === 'function';
  return usable ? (assets as AssetsBinding) : null;
}

function isPdf(bytes: Uint8Array): boolean {
  if (bytes.byteLength < PDF_MAGIC.length) return false;
  for (let i = 0; i < PDF_MAGIC.length; i++) {
    if (bytes[i] !== PDF_MAGIC.charCodeAt(i)) return false;
  }
  return true;
}

async function fetchDocument(
  doc: OfferDocument,
  assets: AssetsBinding | null,
  httpBase: string,
): Promise<EmailAttachment | null> {
  try {
    const res = assets
      // Nazwa hosta nie ma znaczenia — binding dopasowuje wyłącznie ścieżkę.
      ? await assets.fetch(new URL(`/${doc.file}`, 'https://assets.local'))
      : await fetch(`${httpBase}/${doc.file}`, { signal: AbortSignal.timeout(HTTP_FETCH_TIMEOUT_MS) });

    if (!res.ok) {
      console.warn(`Załącznik niedostępny (HTTP ${res.status}): ${doc.file}`);
      return null;
    }

    const bytes = new Uint8Array(await res.arrayBuffer());
    if (!isPdf(bytes)) {
      console.warn(`Załącznik pominięty (to nie jest plik PDF): ${doc.file}`);
      return null;
    }

    return {
      filename: doc.filename,
      content: Buffer.from(bytes).toString('base64'),
      contentType: 'application/pdf',
    };
  } catch (err) {
    console.warn(`Nie udało się wczytać załącznika: ${doc.file}`, err instanceof Error ? err.name : '');
    return null;
  }
}

/**
 * Wczytuje dokumenty z `OFFER_DOCUMENTS` jako załączniki maila.
 *
 * Na Cloudflare pliki są czytane przez binding `ASSETS` (bez wychodzenia do
 * sieci). Lokalnie, gdy bindingu nie ma, pobieramy je po HTTP z `SITE_URL`,
 * a jeśli nie jest ustawiony — z originu bieżącego żądania.
 *
 * Nigdy nie rzuca: plik, którego nie da się wczytać, trafia na listę `missing`.
 */
export async function loadOfferDocuments(requestUrl: string): Promise<LoadedDocuments> {
  const assets = getAssetsBinding();
  const httpBase = getSiteUrl() ?? new URL(requestUrl).origin;

  const loaded = await Promise.all(
    OFFER_DOCUMENTS.map((doc) => fetchDocument(doc, assets, httpBase)),
  );

  const result: LoadedDocuments = { attachments: [], attached: [], missing: [] };
  OFFER_DOCUMENTS.forEach((doc, i) => {
    const attachment = loaded[i];
    if (attachment) {
      result.attachments.push(attachment);
      result.attached.push(doc);
    } else {
      result.missing.push(doc);
    }
  });
  return result;
}
