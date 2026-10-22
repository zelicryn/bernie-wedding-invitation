import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const gifts = await prisma.giftOption.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ gifts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gift options' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, accountName, accountNumber, bankName, qrCodeUrl, note, order } = body;

    if (!type || !type.trim()) {
      return NextResponse.json({ error: 'Gift type is required' }, { status: 400 });
    }

    const gift = await prisma.giftOption.create({
      data: {
        type: type.trim(),
        accountName: accountName ? accountName.trim() : null,
        accountNumber: accountNumber ? accountNumber.trim() : null,
        bankName: bankName ? bankName.trim() : null,
        qrCodeUrl: qrCodeUrl || null,
        note: note ? note.trim() : null,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, gift });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gift option' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type, accountName, accountNumber, bankName, qrCodeUrl, note, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updated = await prisma.giftOption.update({
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
    });

    return NextResponse.json({ success: true, gift: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gift option' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.giftOption.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gift option' }, { status: 500 });
  }
}
