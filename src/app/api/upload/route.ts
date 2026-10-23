import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `uploads/${Date.now()}_${safeName}`;

    // 1. Try uploading to Vercel Blob CDN (permanent cloud storage)
    try {
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: file.type || 'image/jpeg',
      });
      if (blob?.url) {
        return NextResponse.json({ success: true, url: blob.url, filename: safeName });
      }
    } catch (blobErr) {
      console.warn('Vercel Blob upload failed, attempting local disk or data URL fallback:', blobErr);
    }

    // 2. Local environment: attempt writing to public/uploads
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, `${Date.now()}_${safeName}`);
      fs.writeFileSync(filePath, buffer);

      const url = `/uploads/${Date.now()}_${safeName}`;
      return NextResponse.json({ success: true, url, filename: safeName });
    } catch (fsError) {
      console.warn('Local disk write failed, falling back to data URL:', fsError);
    }

    // 3. Fallback: Base64 Data URL
    const mime = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const url = `data:${mime};base64,${base64}`;
    return NextResponse.json({ success: true, url, filename: file.name });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
