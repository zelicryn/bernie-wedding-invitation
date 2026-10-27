import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentEpisodes, savePersistentEpisodes } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blobList = await getPersistentEpisodes();
    if (blobList !== null) {
      return NextResponse.json({ episodes: blobList });
    }

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

    let list = await getPersistentEpisodes();
    if (!list) {
      list = await prisma.episode.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const newEp = {
      id: `ep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      date: date ? date.trim() : null,
      description: description ? description.trim() : null,
      photoUrl: photoUrl || null,
      videoUrl: videoUrl || null,
      order: Number(order) || (list.length + 1),
    };

    const updatedList = [...list, newEp].sort((a, b) => a.order - b.order);
    await savePersistentEpisodes(updatedList);

    prisma.episode.create({
      data: {
        id: newEp.id,
        title: newEp.title,
        date: newEp.date,
        description: newEp.description,
        photoUrl: newEp.photoUrl,
        videoUrl: newEp.videoUrl,
        order: newEp.order,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, episode: newEp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, date, description, photoUrl, videoUrl, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentEpisodes();
    if (!list) {
      list = await prisma.episode.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    let updatedEp: any = null;
    const updatedList = list.map((ep) => {
      if (ep.id === id) {
        updatedEp = {
          ...ep,
          title: title ? title.trim() : ep.title,
          date: date !== undefined ? (date ? date.trim() : null) : ep.date,
          description: description !== undefined ? (description ? description.trim() : null) : ep.description,
          photoUrl: photoUrl !== undefined ? photoUrl : ep.photoUrl,
          videoUrl: videoUrl !== undefined ? videoUrl : ep.videoUrl,
          order: order !== undefined ? Number(order) : ep.order,
        };
        return updatedEp;
      }
      return ep;
    });

    await savePersistentEpisodes(updatedList);

    prisma.episode.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        date: date !== undefined ? (date ? date.trim() : null) : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        videoUrl: videoUrl !== undefined ? videoUrl : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, episode: updatedEp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentEpisodes();
    if (!list) {
      list = await prisma.episode.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const filtered = list.filter((ep) => ep.id !== id);
    await savePersistentEpisodes(filtered);

    prisma.episode.delete({ where: { id } }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
  }
}
