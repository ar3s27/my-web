
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function saveFileLocally(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public/images');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Directory might already exist
    }

    // Sanitize filename to prevent issues
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    console.log(`Saved file locally to ${filePath}`);
    
    return `/images/${filename}`;
}

export function checkForLocalFallback() {
    return process.env.NODE_ENV !== 'production';
}
