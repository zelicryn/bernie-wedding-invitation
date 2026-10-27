import { put } from '@vercel/blob';

const BLOB_BASE_URL = 'https://3emzantd5ggd7ty7.public.blob.vercel-storage.com/data';

/**
 * Generic fetcher for JSON data stored in Vercel Blob.
 */
async function getBlobJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BLOB_BASE_URL}/${filename}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data !== null && data !== undefined) {
        return data as T;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch ${filename} from Blob:`, err);
  }
  return fallback;
}

/**
 * Generic saver for JSON data into Vercel Blob.
 */
async function saveBlobJson<T>(filename: string, data: T): Promise<boolean> {
  try {
    await put(`data/${filename}`, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return true;
  } catch (err) {
    console.warn(`Failed to save ${filename} to Blob:`, err);
    return false;
  }
}

// --- SETTINGS ---
export async function getPersistentSettings(): Promise<Record<string, string>> {
  return getBlobJson<Record<string, string>>('settings.json', {});
}

export async function savePersistentSettings(updates: Record<string, string>): Promise<boolean> {
  try {
    const current = await getPersistentSettings();
    const merged = { ...current, ...updates };
    return saveBlobJson('settings.json', merged);
  } catch (err) {
    console.warn('Failed to save persistent settings to Blob:', err);
    return false;
  }
}

// --- SPONSORS (Ninong & Ninang) ---
export interface PersistentSponsor {
  id: string;
  name: string;
  gender: string;
  partnerName?: string | null;
  role: string;
  photoUrl?: string | null;
  order: number;
}

export async function getPersistentSponsors(): Promise<PersistentSponsor[] | null> {
  return getBlobJson<PersistentSponsor[] | null>('sponsors.json', null);
}

export async function savePersistentSponsors(sponsors: PersistentSponsor[]): Promise<boolean> {
  return saveBlobJson('sponsors.json', sponsors);
}

// --- ENTOURAGE ---
export interface PersistentEntourage {
  id: string;
  name: string;
  role: string;
  category?: string;
  description?: string | null;
  photoUrl?: string | null;
  order: number;
}

export async function getPersistentEntourage(): Promise<PersistentEntourage[] | null> {
  return getBlobJson<PersistentEntourage[] | null>('entourage.json', null);
}

export async function savePersistentEntourage(entourage: PersistentEntourage[]): Promise<boolean> {
  return saveBlobJson('entourage.json', entourage);
}

// --- GIFTS (GCash / Maya / Bank) ---
export interface PersistentGift {
  id: string;
  type: string;
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  qrCodeUrl?: string | null;
  note?: string | null;
  order: number;
}

export async function getPersistentGifts(): Promise<PersistentGift[] | null> {
  return getBlobJson<PersistentGift[] | null>('gifts.json', null);
}

export async function savePersistentGifts(gifts: PersistentGift[]): Promise<boolean> {
  return saveBlobJson('gifts.json', gifts);
}

// --- EPISODES ---
export interface PersistentEpisode {
  id: string;
  title: string;
  date?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  videoUrl?: string | null;
  order: number;
}

export async function getPersistentEpisodes(): Promise<PersistentEpisode[] | null> {
  return getBlobJson<PersistentEpisode[] | null>('episodes.json', null);
}

export async function savePersistentEpisodes(episodes: PersistentEpisode[]): Promise<boolean> {
  return saveBlobJson('episodes.json', episodes);
}

// --- FAQS ---
export interface PersistentFaq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export async function getPersistentFaqs(): Promise<PersistentFaq[] | null> {
  return getBlobJson<PersistentFaq[] | null>('faqs.json', null);
}

export async function savePersistentFaqs(faqs: PersistentFaq[]): Promise<boolean> {
  return saveBlobJson('faqs.json', faqs);
}

// --- GUESTS (RSVP list) ---
export interface PersistentGuest {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  seats: number;
  status: string;
  attendingCount: number;
  accompanyingNames?: string | null;
  notes?: string | null;
  createdAt: string;
}

export async function getPersistentGuests(): Promise<PersistentGuest[] | null> {
  return getBlobJson<PersistentGuest[] | null>('guests.json', null);
}

export async function savePersistentGuests(guests: PersistentGuest[]): Promise<boolean> {
  return saveBlobJson('guests.json', guests);
}
