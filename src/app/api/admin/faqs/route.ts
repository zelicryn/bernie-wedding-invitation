import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ faqs });
  } catch (error) {
    console.warn('Prisma FAQs query failed, returning empty list:', error);
    return NextResponse.json({ faqs: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, answer, order } = body;

    if (!question || !question.trim() || !answer || !answer.trim()) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, question, answer, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: question ? question.trim() : undefined,
        answer: answer ? answer.trim() : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.faq.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
