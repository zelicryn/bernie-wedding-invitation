import { put } from '@vercel/blob';

const SETTINGS_BLOB_URL = 'https://3emzantd5ggd7ty7.public.blob.vercel-storage.com/data/settings.json';

/**
 * Fetch persistent settings from Vercel Blob store.
 * Returns an empty object if not yet initialized or if network fails.
 */
export async function getPersistentSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${SETTINGS_BLOB_URL}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch persistent settings from Blob:', err);
  }
  return {};
}

/**
 * Save settings to Vercel Blob store so they persist across all serverless containers and cold starts.
 */
export async function savePersistentSettings(updates: Record<string, string>): Promise<boolean> {
  try {
    const current = await getPersistentSettings();
    const merged = { ...current, ...updates };

    await put('data/settings.json', JSON.stringify(merged), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return true;
  } catch (err) {
    console.warn('Failed to save persistent settings to Blob:', err);
    return false;
  }
}
