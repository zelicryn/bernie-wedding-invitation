import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entourage = await prisma.entourage.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ entourage });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch entourage' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, category, description, photoUrl, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const item = await prisma.entourage.create({
      data: {
        name: name.trim(),
        role: (role || 'Entourage').trim(),
        category: (category || 'Entourage').trim(),
        description: description ? description.trim() : null,
        photoUrl: photoUrl || null,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entourage member' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, role, category, description, photoUrl, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updated = await prisma.entourage.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        role: role !== undefined ? role.trim() : undefined,
        category: category !== undefined ? category.trim() : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update entourage member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.entourage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entourage member' }, { status: 500 });
  }
}
