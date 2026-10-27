import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentGuests, savePersistentGuests, PersistentGuest } from '@/lib/blobStorage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guestId, status, attendingCount, accompanyingNames, notes, email, phone } = body;

    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    let allGuests: PersistentGuest[] = (await getPersistentGuests()) || [];
    let updatedGuest: any = null;

    if (allGuests.length > 0) {
      allGuests = allGuests.map((g) => {
        if (g.id === guestId) {
          const validCount = status === 'CONFIRMED'
            ? Math.min(Math.max(1, Number(attendingCount) || 1), g.seats)
            : 0;

          updatedGuest = {
            ...g,
            status: status === 'CONFIRMED' ? 'CONFIRMED' : 'DECLINED',
            attendingCount: validCount,
            accompanyingNames: accompanyingNames || null,
            notes: notes || null,
            email: email || g.email,
            phone: phone || g.phone,
          };
          return updatedGuest;
        }
        return g;
      });

      if (updatedGuest) {
        await savePersistentGuests(allGuests);
      }
    }

    // Mirror to prisma if exists
    try {
      const dbGuest = await prisma.guest.findUnique({ where: { id: guestId } });
      if (dbGuest) {
        const validCount = status === 'CONFIRMED'
          ? Math.min(Math.max(1, Number(attendingCount) || 1), dbGuest.seats)
          : 0;

        await prisma.guest.update({
          where: { id: guestId },
          data: {
            status: status === 'CONFIRMED' ? 'CONFIRMED' : 'DECLINED',
            attendingCount: validCount,
            accompanyingNames: accompanyingNames || null,
            notes: notes || null,
            email: email || dbGuest.email,
            phone: phone || dbGuest.phone,
          },
        });
      }
    } catch (e) {
      console.warn('Prisma mirror update note:', e);
    }

    return NextResponse.json({
      success: true,
      guest: updatedGuest || {
        id: guestId,
        status: status === 'CONFIRMED' ? 'CONFIRMED' : 'DECLINED',
        attendingCount: Number(attendingCount) || 1,
        accompanyingNames,
        notes,
      },
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
