import { NextRequest, NextResponse } from 'next/server';
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

    // On Vercel / AWS Lambda, the filesystem is read-only.
    // Return a base64 Data URL directly so no disk writes are attempted.
    const isServerless = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT
    );

    if (isServerless) {
      const mime = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      const url = `data:${mime};base64,${base64}`;
      return NextResponse.json({ success: true, url, filename: file.name });
    }

    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Clean filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}_${safeName}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);

      const url = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url, filename });
    } catch (fsError) {
      console.warn('Local disk write failed, falling back to base64 data URL:', fsError);
      const mime = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      const url = `data:${mime};base64,${base64}`;
      return NextResponse.json({ success: true, url, filename: file.name });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
