import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentSettings, savePersistentSettings } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [list, blobSettings] = await Promise.all([
      prisma.setting.findMany().catch(() => []),
      getPersistentSettings().catch(() => ({})),
    ]);
    const map: Record<string, string> = {};
    list.forEach((s) => (map[s.key] = s.value));
    const merged = { ...map, ...blobSettings };
    return NextResponse.json({ settings: merged });
  } catch (error) {
    console.warn('Prisma settings query failed, returning empty map:', error);
    return NextResponse.json({ settings: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { key: value, ... }

    // 1. Save to persistent Vercel Blob store
    await savePersistentSettings(body);

    // 2. Also save to Prisma for local database consistency
    try {
      const operations = Object.entries(body).map(([key, value]) => {
        const valStr = typeof value === 'string' ? value : String(value ?? '');
        return prisma.setting.upsert({
          where: { key },
          update: { value: valStr },
          create: { key, value: valStr },
        });
      });

      await prisma.$transaction(operations);
    } catch (prismaErr) {
      console.warn('Prisma save fallback note:', prismaErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
