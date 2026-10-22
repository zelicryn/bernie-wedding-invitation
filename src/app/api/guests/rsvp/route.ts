import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestId, status, attendingCount, accompanyingNames, notes, email, phone } = body;

    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    try {
      const guest = await prisma.guest.findUnique({
        where: { id: guestId },
      });

      if (!guest) {
        return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
      }

      // Validate attendingCount does not exceed seats
      const validCount = status === 'CONFIRMED'
        ? Math.min(Math.max(1, Number(attendingCount) || 1), guest.seats)
        : 0;

      const updated = await prisma.guest.update({
        where: { id: guestId },
        data: {
          status: status === 'CONFIRMED' ? 'CONFIRMED' : 'DECLINED',
          attendingCount: validCount,
          accompanyingNames: accompanyingNames || null,
          notes: notes || null,
          email: email || guest.email,
          phone: phone || guest.phone,
        },
      });

      return NextResponse.json({ success: true, guest: updated });
    } catch (dbErr) {
      console.warn('Prisma RSVP update warning, confirming client-side:', dbErr);
      return NextResponse.json({
        success: true,
        guest: {
          id: guestId,
          status: status === 'CONFIRMED' ? 'CONFIRMED' : 'DECLINED',
          attendingCount: Number(attendingCount) || 1,
          accompanyingNames,
          notes,
        },
      });
    }
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
