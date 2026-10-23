import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentSettings } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settingsList, episodes, entourage, sponsors, faqs, gifts, gallery, blobSettings] = await Promise.all([
      prisma.setting.findMany().catch(() => []),
      prisma.episode.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.entourage.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.faq.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.giftOption.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.gallery.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      getPersistentSettings().catch(() => ({})),
    ]);

    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    const mergedSettings = { ...settings, ...blobSettings };

    return NextResponse.json({
      settings: mergedSettings,
      episodes,
      entourage,
      sponsors,
      faqs,
      gifts,
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
