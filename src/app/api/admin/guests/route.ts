import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentGuests, savePersistentGuests, PersistentGuest } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';

    let allGuests: PersistentGuest[] = [];

    // 1. Check persistent Blob storage first
    const blobGuests = await getPersistentGuests();
    if (blobGuests !== null) {
      allGuests = blobGuests;
    } else {
      try {
        const dbGuests = await prisma.guest.findMany({
          orderBy: { createdAt: 'desc' },
        });
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
        console.warn('Prisma query for guests failed, returning fallback:', dbErr);
        allGuests = [];
      }
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

    let allGuests: PersistentGuest[] = (await getPersistentGuests()) || [];
    if (allGuests.length === 0) {
      const dbGuests = await prisma.guest.findMany().catch(() => []);
      if (dbGuests.length > 0) {
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
      }
    }

    // Bulk insert
    if (Array.isArray(body.bulkGuests)) {
      const created: PersistentGuest[] = [];
      for (const item of body.bulkGuests) {
        if (item.name && item.name.trim()) {
          const newG: PersistentGuest = {
            id: `gst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: item.name.trim(),
            seats: Math.max(1, Number(item.seats) || 1),
            phone: item.phone ? item.phone.trim() : null,
            notes: item.notes ? item.notes.trim() : null,
            status: 'PENDING',
            attendingCount: 0,
            accompanyingNames: null,
            createdAt: new Date().toISOString(),
          };
          created.push(newG);
          allGuests.unshift(newG);

          prisma.guest.create({
            data: {
              id: newG.id,
              name: newG.name,
              seats: newG.seats,
              phone: newG.phone,
              notes: newG.notes,
            },
          }).catch(() => {});
        }
      }

      await savePersistentGuests(allGuests);
      return NextResponse.json({ success: true, count: created.length, created });
    }

    // Single insert
    const { name, seats, phone, email, notes } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Guest name is required' }, { status: 400 });
    }

    const newGuest: PersistentGuest = {
      id: `gst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      seats: Math.max(1, Number(seats) || 1),
      phone: phone ? phone.trim() : null,
      email: email ? email.trim() : null,
      notes: notes ? notes.trim() : null,
      status: 'PENDING',
      attendingCount: 0,
      accompanyingNames: null,
      createdAt: new Date().toISOString(),
    };

    allGuests.unshift(newGuest);
    await savePersistentGuests(allGuests);

    prisma.guest.create({
      data: {
        id: newGuest.id,
        name: newGuest.name,
        seats: newGuest.seats,
        phone: newGuest.phone,
        email: newGuest.email,
        notes: newGuest.notes,
      },
    }).catch(() => {});

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

    let allGuests: PersistentGuest[] = (await getPersistentGuests()) || [];
    if (allGuests.length === 0) {
      const dbGuests = await prisma.guest.findMany().catch(() => []);
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
    }

    let updatedGuest: PersistentGuest | null = null;
    const updatedList = allGuests.map((g) => {
      if (g.id === id) {
        updatedGuest = {
          ...g,
          name: name !== undefined ? name.trim() : g.name,
          seats: seats !== undefined ? Math.max(1, Number(seats) || 1) : g.seats,
          status: status !== undefined ? status : g.status,
          attendingCount: attendingCount !== undefined ? Number(attendingCount) : g.attendingCount,
          accompanyingNames: accompanyingNames !== undefined ? accompanyingNames : g.accompanyingNames,
          notes: notes !== undefined ? notes : g.notes,
          phone: phone !== undefined ? phone : g.phone,
          email: email !== undefined ? email : g.email,
        };
        return updatedGuest;
      }
      return g;
    });

    await savePersistentGuests(updatedList);

    prisma.guest.update({
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
    }).catch(() => {});

    return NextResponse.json({ success: true, guest: updatedGuest });
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

    let allGuests: PersistentGuest[] = (await getPersistentGuests()) || [];
    const filtered = allGuests.filter((g) => g.id !== id);
    await savePersistentGuests(filtered);

    prisma.guest.delete({ where: { id } }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}
