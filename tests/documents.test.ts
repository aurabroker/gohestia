import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { OFFER_DOCUMENTS } from '@/lib/data/documents';

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

describe('dokumenty dołączane do maila', () => {
  it.each(OFFER_DOCUMENTS)('$file istnieje w public/ pod dokładnie taką nazwą i jest PDF-em', ({ file }) => {
    const fullPath = path.join(PUBLIC_DIR, file);
    expect(existsSync(fullPath)).toBe(true);

    // Na serwerze wielkość liter ma znaczenie, więc sprawdzamy nazwę z listingu
    // katalogu, a nie tylko to, że system plików ją „znalazł".
    expect(readdirSync(path.dirname(fullPath))).toContain(path.basename(file));
    expect(file).toBe(file.toLowerCase());

    expect(readFileSync(fullPath).subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });

  it('wszystkie załączniki razem mieszczą się z zapasem w limicie maila (40 MB)', () => {
    const total = OFFER_DOCUMENTS.reduce(
      (sum, { file }) => sum + readFileSync(path.join(PUBLIC_DIR, file)).byteLength,
      0,
    );
    // base64 powiększa załącznik o 1/3
    expect((total * 4) / 3).toBeLessThan(10 * 1024 * 1024);
  });
});
