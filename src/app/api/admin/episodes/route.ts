import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const episodes = await prisma.episode.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ episodes });
  } catch (error) {
    console.warn('Prisma episodes query failed, returning empty list:', error);
    return NextResponse.json({ episodes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, date, description, photoUrl, videoUrl, order } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Episode title is required' }, { status: 400 });
    }

    const ep = await prisma.episode.create({
      data: {
        title: title.trim(),
        date: date ? date.trim() : null,
        description: description ? description.trim() : null,
        photoUrl: photoUrl || null,
        videoUrl: videoUrl || null,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, episode: ep });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, date, description, photoUrl, videoUrl, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updated = await prisma.episode.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        date: date !== undefined ? (date ? date.trim() : null) : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        videoUrl: videoUrl !== undefined ? videoUrl : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    return NextResponse.json({ success: true, episode: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.episode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
  }
}
