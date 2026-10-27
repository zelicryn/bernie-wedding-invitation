import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentEntourage, savePersistentEntourage } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blobList = await getPersistentEntourage();
    if (blobList !== null) {
      return NextResponse.json({ entourage: blobList });
    }

    const entourage = await prisma.entourage.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ entourage });
  } catch (error) {
    console.warn('Prisma entourage query failed, returning empty list:', error);
    return NextResponse.json({ entourage: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, category, description, photoUrl, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let list = await getPersistentEntourage();
    if (!list) {
      list = await prisma.entourage.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const newItem = {
      id: `ent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      role: (role || 'Entourage').trim(),
      category: (category || 'Entourage').trim(),
      description: description ? description.trim() : null,
      photoUrl: photoUrl || null,
      order: Number(order) || (list.length + 1),
    };

    const updatedList = [...list, newItem].sort((a, b) => a.order - b.order);
    await savePersistentEntourage(updatedList);

    prisma.entourage.create({
      data: {
        id: newItem.id,
        name: newItem.name,
        role: newItem.role,
        category: newItem.category,
        description: newItem.description,
        photoUrl: newItem.photoUrl,
        order: newItem.order,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entourage member' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, role, category, description, photoUrl, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentEntourage();
    if (!list) {
      list = await prisma.entourage.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    let updatedItem: any = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          name: name ? name.trim() : item.name,
          role: role !== undefined ? role.trim() : item.role,
          category: category !== undefined ? category.trim() : item.category,
          description: description !== undefined ? (description ? description.trim() : null) : item.description,
          photoUrl: photoUrl !== undefined ? photoUrl : item.photoUrl,
          order: order !== undefined ? Number(order) : item.order,
        };
        return updatedItem;
      }
      return item;
    });

    await savePersistentEntourage(updatedList);

    prisma.entourage.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        role: role !== undefined ? role.trim() : undefined,
        category: category !== undefined ? category.trim() : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update entourage member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentEntourage();
    if (!list) {
      list = await prisma.entourage.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const filtered = list.filter((item) => item.id !== id);
    await savePersistentEntourage(filtered);

    prisma.entourage.delete({ where: { id } }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entourage member' }, { status: 500 });
  }
}
