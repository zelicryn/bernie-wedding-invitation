import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getPersistentSettings,
  getPersistentSponsors,
  getPersistentEntourage,
  getPersistentGifts,
  getPersistentEpisodes,
  getPersistentFaqs,
} from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      settingsList,
      dbEpisodes,
      dbEntourage,
      dbSponsors,
      dbFaqs,
      dbGifts,
      gallery,
      blobSettings,
      blobSponsors,
      blobEntourage,
      blobGifts,
      blobEpisodes,
      blobFaqs,
    ] = await Promise.all([
      prisma.setting.findMany().catch(() => []),
      prisma.episode.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.entourage.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.faq.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.giftOption.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.gallery.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      getPersistentSettings().catch(() => ({})),
      getPersistentSponsors().catch(() => null),
      getPersistentEntourage().catch(() => null),
      getPersistentGifts().catch(() => null),
      getPersistentEpisodes().catch(() => null),
      getPersistentFaqs().catch(() => null),
    ]);

    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    const mergedSettings = { ...settings, ...blobSettings };

    return NextResponse.json({
      settings: mergedSettings,
      episodes: blobEpisodes !== null ? blobEpisodes : dbEpisodes,
      entourage: blobEntourage !== null ? blobEntourage : dbEntourage,
      sponsors: blobSponsors !== null ? blobSponsors : dbSponsors,
      faqs: blobFaqs !== null ? blobFaqs : dbFaqs,
      gifts: blobGifts !== null ? blobGifts : dbGifts,
      gallery,
    });
  } catch (error) {
    console.warn('Error fetching public content, returning defaults:', error);
    return NextResponse.json({
      settings: {},
      episodes: [],
      entourage: [],
      sponsors: [],
      faqs: [],
      gifts: [],
      gallery: [],
    });
  }
}
