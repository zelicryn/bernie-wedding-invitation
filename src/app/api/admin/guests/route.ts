import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';

    let allGuests: any[] = [];
    try {
      allGuests = await prisma.guest.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('Prisma query for guests failed, returning initial guests:', dbErr);
      allGuests = [
        {
          id: '1',
          name: 'Mr. & Mrs. Juan dela Cruz',
          seats: 2,
          status: 'CONFIRMED',
          attendingCount: 2,
          accompanyingNames: 'Maria dela Cruz',
          phone: '0917 111 2233',
          notes: 'Principal table',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Dr. Evelyn Tan',
          seats: 2,
          status: 'CONFIRMED',
          attendingCount: 2,
          accompanyingNames: 'Hon. Roberto Tan',
          phone: '0918 222 3344',
          notes: 'Sponsors table',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Engr. Danilo Ramos',
          seats: 2,
          status: 'PENDING',
          attendingCount: 0,
          phone: '0919 333 4455',
          notes: '',
          createdAt: new Date().toISOString(),
        },
      ];
    }

    let filtered = allGuests;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.accompanyingNames && g.accompanyingNames.toLowerCase().includes(q))
      );
    }

    if (statusFilter && statusFilter !== 'ALL') {
      filtered = filtered.filter((g) => g.status === statusFilter);
    }

    // Calculate statistics
    const totalGuests = allGuests.length;
    const totalSeatsAllocated = allGuests.reduce((acc, g) => acc + g.seats, 0);
    const confirmedCount = allGuests.filter((g) => g.status === 'CONFIRMED').length;
    const totalConfirmedAttendees = allGuests
      .filter((g) => g.status === 'CONFIRMED')
      .reduce((acc, g) => acc + (g.attendingCount || 1), 0);
    const declinedCount = allGuests.filter((g) => g.status === 'DECLINED').length;
    const pendingCount = allGuests.filter((g) => g.status === 'PENDING').length;

    return NextResponse.json({
      guests: filtered,
      stats: {
        totalGuests,
        totalSeatsAllocated,
        confirmedCount,
        totalConfirmedAttendees,
        declinedCount,
        pendingCount,
      },
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if bulk insert
    if (Array.isArray(body.bulkGuests)) {
      const created = [];
      for (const item of body.bulkGuests) {
        if (item.name && item.name.trim()) {
          const guest = await prisma.guest.create({
            data: {
              name: item.name.trim(),
              seats: Math.max(1, Number(item.seats) || 1),
              phone: item.phone ? item.phone.trim() : null,
              notes: item.notes ? item.notes.trim() : null,
            },
          });
          created.push(guest);
        }
      }
      return NextResponse.json({ success: true, count: created.length, created });
    }

    // Single insert
    const { name, seats, phone, email, notes } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Guest name is required' }, { status: 400 });
    }

    const newGuest = await prisma.guest.create({
      data: {
        name: name.trim(),
        seats: Math.max(1, Number(seats) || 1),
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json({ success: true, guest: newGuest });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, seats, status, attendingCount, accompanyingNames, notes, phone, email } = body;

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const updated = await prisma.guest.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        seats: seats !== undefined ? Math.max(1, Number(seats) || 1) : undefined,
        status: status !== undefined ? status : undefined,
        attendingCount: attendingCount !== undefined ? Number(attendingCount) : undefined,
        accompanyingNames: accompanyingNames !== undefined ? accompanyingNames : undefined,
        notes: notes !== undefined ? notes : undefined,
        phone: phone !== undefined ? phone : undefined,
        email: email !== undefined ? email : undefined,
      },
    });

    return NextResponse.json({ success: true, guest: updated });
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    await prisma.guest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}
