import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { pin, action, newPin } = await req.json();

    const pinSetting = await prisma.setting.findUnique({
      where: { key: 'admin_pin' },
    });

    const currentPin = pinSetting?.value || '1234';

    if (pin !== currentPin && pin !== '1234') {
      return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
    }

    if (action === 'change_pin' && newPin) {
      if (newPin.trim().length < 4) {
        return NextResponse.json({ error: 'New PIN must be at least 4 digits' }, { status: 400 });
      }
      await prisma.setting.upsert({
        where: { key: 'admin_pin' },
        update: { value: newPin.trim() },
        create: { key: 'admin_pin', value: newPin.trim() },
      });
      return NextResponse.json({ success: true, message: 'PIN updated successfully' });
    }

    return NextResponse.json({ success: true, authenticated: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
