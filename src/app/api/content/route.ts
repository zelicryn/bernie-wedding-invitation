import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settingsList, episodes, entourage, sponsors, faqs, gifts, gallery] = await Promise.all([
      prisma.setting.findMany(),
      prisma.episode.findMany({ orderBy: { order: 'asc' } }),
      prisma.entourage.findMany({ orderBy: { order: 'asc' } }),
      prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }),
      prisma.faq.findMany({ orderBy: { order: 'asc' } }),
      prisma.giftOption.findMany({ orderBy: { order: 'asc' } }),
      prisma.gallery.findMany({ orderBy: { order: 'asc' } }),
    ]);

    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    return NextResponse.json({
      settings,
      episodes,
      entourage,
      sponsors,
      faqs,
      gifts,
      gallery,
    });
  } catch (error) {
    console.error('Error fetching public content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
