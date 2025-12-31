import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public/images');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Directory might already exist
    }

    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);
    console.log(`Saved file to ${filePath}`);

    return NextResponse.json({ success: true, url: `/images/${file.name}` });
  } catch (error) {
    console.error('Upload error detail:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Upload failed due to unknown error' 
    }, { status: 500 });
  }
}
