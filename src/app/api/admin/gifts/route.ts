import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentGifts, savePersistentGifts } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blobList = await getPersistentGifts();
    if (blobList !== null) {
      return NextResponse.json({ gifts: blobList });
    }

    const gifts = await prisma.giftOption.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ gifts });
  } catch (error) {
    console.warn('Prisma gifts query failed, returning empty list:', error);
    return NextResponse.json({ gifts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, accountName, accountNumber, bankName, qrCodeUrl, note, order } = body;

    if (!type || !type.trim()) {
      return NextResponse.json({ error: 'Gift type is required' }, { status: 400 });
    }

    let list = await getPersistentGifts();
    if (!list) {
      list = await prisma.giftOption.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const newGift = {
      id: `gift_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: type.trim(),
      accountName: accountName ? accountName.trim() : null,
      accountNumber: accountNumber ? accountNumber.trim() : null,
      bankName: bankName ? bankName.trim() : null,
      qrCodeUrl: qrCodeUrl || null,
      note: note ? note.trim() : null,
      order: Number(order) || (list.length + 1),
    };

    const updatedList = [...list, newGift].sort((a, b) => a.order - b.order);
    await savePersistentGifts(updatedList);

    prisma.giftOption.create({
      data: {
        id: newGift.id,
        type: newGift.type,
        accountName: newGift.accountName,
        accountNumber: newGift.accountNumber,
        bankName: newGift.bankName,
        qrCodeUrl: newGift.qrCodeUrl,
        note: newGift.note,
        order: newGift.order,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, gift: newGift });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gift option' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type, accountName, accountNumber, bankName, qrCodeUrl, note, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentGifts();
    if (!list) {
      list = await prisma.giftOption.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    let updatedGift: any = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedGift = {
          ...item,
          type: type ? type.trim() : item.type,
          accountName: accountName !== undefined ? (accountName ? accountName.trim() : null) : item.accountName,
          accountNumber: accountNumber !== undefined ? (accountNumber ? accountNumber.trim() : null) : item.accountNumber,
          bankName: bankName !== undefined ? (bankName ? bankName.trim() : null) : item.bankName,
          qrCodeUrl: qrCodeUrl !== undefined ? qrCodeUrl : item.qrCodeUrl,
          note: note !== undefined ? (note ? note.trim() : null) : item.note,
          order: order !== undefined ? Number(order) : item.order,
        };
        return updatedGift;
      }
      return item;
    });

    await savePersistentGifts(updatedList);

    prisma.giftOption.update({
      where: { id },
      data: {
        type: type ? type.trim() : undefined,
        accountName: accountName !== undefined ? (accountName ? accountName.trim() : null) : undefined,
        accountNumber: accountNumber !== undefined ? (accountNumber ? accountNumber.trim() : null) : undefined,
        bankName: bankName !== undefined ? (bankName ? bankName.trim() : null) : undefined,
        qrCodeUrl: qrCodeUrl !== undefined ? qrCodeUrl : undefined,
        note: note !== undefined ? (note ? note.trim() : null) : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, gift: updatedGift });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gift option' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentGifts();
    if (!list) {
      list = await prisma.giftOption.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const filtered = list.filter((item) => item.id !== id);
    await savePersistentGifts(filtered);

    prisma.giftOption.delete({ where: { id } }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gift option' }, { status: 500 });
  }
}
