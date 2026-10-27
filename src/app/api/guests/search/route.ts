import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentGuests, savePersistentGuests, PersistentGuest } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('name') || searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ error: 'Please enter a name to search' }, { status: 400 });
    }

    const cleanQuery = query.trim().toLowerCase();

    // 1. Try persistent Blob guests first
    let allGuests: PersistentGuest[] = (await getPersistentGuests()) || [];

    // 2. If empty, fallback to Prisma database
    if (allGuests.length === 0) {
      try {
        const dbGuests = await prisma.guest.findMany();
        allGuests = dbGuests.map((g) => ({
          id: g.id,
          name: g.name,
          email: g.email,
          phone: g.phone,
          seats: g.seats,
          status: g.status,
          attendingCount: g.attendingCount,
          accompanyingNames: g.accompanyingNames,
          notes: g.notes,
          createdAt: g.createdAt.toISOString(),
        }));
      } catch (dbErr) {
        console.warn('Prisma search query failed:', dbErr);
      }
    }

    const matches = allGuests.filter((g) =>
      g.name.toLowerCase().includes(cleanQuery)
    );

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error searching guest:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
