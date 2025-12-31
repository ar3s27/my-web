import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

const projectsFilePath = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
  try {
    let kvProjects;
    try {
        const raw = await redis.get('projects');
        if (raw) kvProjects = JSON.parse(raw);
    } catch (e) {
        console.warn('Redis Projects Fetch Error (using fallback):', e);
    }

    if (kvProjects) {
        return NextResponse.json(kvProjects);
    }
    
    // Fallback to file
    const fileContents = await readFile(projectsFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await request.json();
    
    // Basic validation to ensure it's an array
    if (!Array.isArray(projects)) {
         return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Save to Redis
    let result = { success: true, message: 'Projects updated successfully' };
    
    try {
        await redis.set('projects', JSON.stringify(projects));
        // Try to sync file if possible (works locally, fails in prod)
        try {
            await writeFile(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
        } catch (fsError) {
            // Ignore file write error if Redis succeeded
            console.log('File write skipped (likely read-only fs)', fsError);
        }
    } catch (kvError) {
        console.warn('Redis Write Error:', kvError);
        
        // If Redis failed, we MUST try to write to file, but if that fails too, we are stuck.
        try {
            await writeFile(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
             // If we reached here, file fallback worked (likely local dev)
        } catch (fsError) {
            console.error('CRITICAL: Both Redis and File Write failed.');
            return NextResponse.json({ 
                error: 'Storage Error: Database not configured and file system is read-only. Please set REDIS_URL environment variable in Vercel.' 
            }, { status: 500 });
        }
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error writing projects:', error);
    return NextResponse.json({ error: 'Failed to update projects' }, { status: 500 });
  }
}
