import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    console.log(`Saved file to ${blob.url}`);

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Upload error detail:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Upload failed due to unknown error' 
    }, { status: 500 });
  }
}
