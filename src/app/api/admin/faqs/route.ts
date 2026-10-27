import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPersistentFaqs, savePersistentFaqs } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blobList = await getPersistentFaqs();
    if (blobList !== null) {
      return NextResponse.json({ faqs: blobList });
    }

    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ faqs });
  } catch (error) {
    console.warn('Prisma faqs query failed, returning empty list:', error);
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

    let list = await getPersistentFaqs();
    if (!list) {
      list = await prisma.faq.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const newFaq = {
      id: `faq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      question: question.trim(),
      answer: answer.trim(),
      order: Number(order) || (list.length + 1),
    };

    const updatedList = [...list, newFaq].sort((a, b) => a.order - b.order);
    await savePersistentFaqs(updatedList);

    prisma.faq.create({
      data: {
        id: newFaq.id,
        question: newFaq.question,
        answer: newFaq.answer,
        order: newFaq.order,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, faq: newFaq });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, question, answer, order } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentFaqs();
    if (!list) {
      list = await prisma.faq.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    let updatedFaq: any = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedFaq = {
          ...item,
          question: question ? question.trim() : item.question,
          answer: answer ? answer.trim() : item.answer,
          order: order !== undefined ? Number(order) : item.order,
        };
        return updatedFaq;
      }
      return item;
    });

    await savePersistentFaqs(updatedList);

    prisma.faq.update({
      where: { id },
      data: {
        question: question ? question.trim() : undefined,
        answer: answer ? answer.trim() : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, faq: updatedFaq });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    let list = await getPersistentFaqs();
    if (!list) {
      list = await prisma.faq.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    }

    const filtered = list.filter((item) => item.id !== id);
    await savePersistentFaqs(filtered);

    prisma.faq.delete({ where: { id } }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
