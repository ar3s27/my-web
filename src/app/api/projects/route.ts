import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const projectsFilePath = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
  try {
    const kvProjects = await kv.get('projects');
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

    // Save to KV
    await kv.set('projects', projects);
    
    return NextResponse.json({ success: true, message: 'Projects updated successfully' });
  } catch (error) {
    console.error('Error writing projects:', error);
    return NextResponse.json({ error: 'Failed to update projects' }, { status: 500 });
  }
}
