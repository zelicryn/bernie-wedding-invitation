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

    // Find all guests matching
    const allGuests = await prisma.guest.findMany();
    const matches = allGuests.filter((g) =>
      g.name.toLowerCase().includes(cleanQuery)
    );

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error searching guest:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
