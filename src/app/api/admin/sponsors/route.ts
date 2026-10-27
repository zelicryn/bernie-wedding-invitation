import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentSponsors, savePersistentSponsors } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check persistent Blob storage first (Vercel cloud)
    const blobSponsors = await getPersistentSponsors();
    if (blobSponsors !== null) {
      return NextResponse.json({ sponsors: blobSponsors });
    }

    // 2. Fallback to Prisma database
    const sponsors = await prisma.principalSponsor.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ sponsors });
  } catch (error) {
    console.warn('Sponsors query failed, returning empty list:', error);
    return NextResponse.json({ sponsors: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, gender, partnerName, role, photoUrl, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Sponsor name is required' }, { status: 400 });
    }

    // Get current list
    let list = await getPersistentSponsors();
    if (!list) {
      list = await prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const newSponsor = {
      id: `sp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      gender: gender || 'MALE',
      partnerName: partnerName ? partnerName.trim() : null,
      role: role ? role.trim() : 'Principal Sponsor',
      photoUrl: photoUrl || null,
      order: Number(order) || (list.length + 1),
    };

    const updatedList = [...list, newSponsor].sort((a, b) => a.order - b.order);
    await savePersistentSponsors(updatedList);

    // Also mirror to prisma if available
    prisma.principalSponsor.create({
      data: {
        id: newSponsor.id,
        name: newSponsor.name,
        gender: newSponsor.gender,
        partnerName: newSponsor.partnerName,
        role: newSponsor.role,
        photoUrl: newSponsor.photoUrl,
        order: newSponsor.order,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, sponsor: newSponsor });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, gender, partnerName, role, photoUrl, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentSponsors();
    if (!list) {
      list = await prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    let updatedItem: any = null;
    const updatedList = list.map((sp) => {
      if (sp.id === id) {
        updatedItem = {
          ...sp,
          name: name ? name.trim() : sp.name,
          gender: gender || sp.gender,
          partnerName: partnerName !== undefined ? (partnerName ? partnerName.trim() : null) : sp.partnerName,
          role: role !== undefined ? role.trim() : sp.role,
          photoUrl: photoUrl !== undefined ? photoUrl : sp.photoUrl,
          order: order !== undefined ? Number(order) : sp.order,
        };
        return updatedItem;
      }
      return sp;
    });

    await savePersistentSponsors(updatedList);

    // Mirror to prisma
    prisma.principalSponsor.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        gender: gender || undefined,
        partnerName: partnerName !== undefined ? (partnerName ? partnerName.trim() : null) : undefined,
        role: role !== undefined ? role.trim() : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, sponsor: updatedItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentSponsors();
    if (!list) {
      list = await prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const filtered = list.filter((sp) => sp.id !== id);
    await savePersistentSponsors(filtered);

    // Mirror to prisma
    prisma.principalSponsor.delete({ where: { id } }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  }
}
