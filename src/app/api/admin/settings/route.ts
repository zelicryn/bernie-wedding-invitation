import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    list.forEach((s) => (map[s.key] = s.value));
    return NextResponse.json({ settings: map });
  } catch (error) {
    console.warn('Prisma settings query failed, returning empty map:', error);
    return NextResponse.json({ settings: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { key: value, ... }

    const operations = Object.entries(body).map(([key, value]) => {
      const valStr = typeof value === 'string' ? value : String(value ?? '');
      return prisma.setting.upsert({
        where: { key },
        update: { value: valStr },
        create: { key, value: valStr },
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
