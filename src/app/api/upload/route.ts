import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { checkForLocalFallback, saveFileLocally } from '@/lib/upload-local';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    try {
        // Try Vercel Blob first
        const blob = await put(file.name, file, {
            access: 'public',
        });
        console.log(`Saved file to ${blob.url}`);
        return NextResponse.json({ success: true, url: blob.url });
    } catch (blobError) {
        console.warn('Blob Upload Failed, attempting local fallback:', blobError);
        
        // Fallback to local file system
        try {
            const localUrl = await saveFileLocally(file);
             return NextResponse.json({ success: true, url: localUrl });
        } catch (localError) {
             console.error('Critical: Both Blob and Local upload failed');
             return NextResponse.json({ 
                success: false, 
                message: 'Upload failed. Please ensure Vercel Blob is configured (BLOB_READ_WRITE_TOKEN) or file system is writable.' 
             }, { status: 500 });
        }
    }

  } catch (error) {
    console.error('Upload error detail:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Upload failed due to unknown error' 
    }, { status: 500 });
  }
}
