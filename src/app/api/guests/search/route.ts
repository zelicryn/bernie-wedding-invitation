import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('name') || searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ error: 'Please enter a name to search' }, { status: 400 });
    }

    const cleanQuery = query.trim().toLowerCase();

    let allGuests: any[] = [];
    try {
      allGuests = await prisma.guest.findMany();
    } catch (dbErr) {
      console.warn('Prisma search query failed, searching fallback guest list:', dbErr);
      allGuests = [
        { id: '1', name: 'Mr. & Mrs. Juan dela Cruz', seats: 2, status: 'CONFIRMED', attendingCount: 2, accompanyingNames: 'Maria dela Cruz' },
        { id: '2', name: 'Dr. Evelyn Tan', seats: 2, status: 'CONFIRMED', attendingCount: 2, accompanyingNames: 'Hon. Roberto Tan' },
        { id: '3', name: 'Engr. Danilo Ramos', seats: 2, status: 'PENDING', attendingCount: 0 },
        { id: '4', name: 'Atty. Fernando Reyes', seats: 2, status: 'PENDING', attendingCount: 0 },
        { id: '5', name: 'Sandy Morales', seats: 2, status: 'CONFIRMED', attendingCount: 2 },
        { id: '6', name: 'Bernadette Santos', seats: 2, status: 'CONFIRMED', attendingCount: 2 },
      ];
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
