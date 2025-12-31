import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

const TIMELINE_FILE = path.join(process.cwd(), 'src/data/timeline.json');

// Interface for Timeline Event
interface TimelineEvent {
  id: number;
  type: string;
  date: string;
  date_tr?: string;
  title: string;
  title_tr?: string;
  company: string;
  company_tr?: string;
  description: string;
  description_tr?: string;
}

function getYear(dateStr: string) {
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : 9999;
}

export async function GET() {
  try {
    let events: TimelineEvent[] = [];
    
    // Try Redis first
    try {
        const raw = await redis.get('timeline');
        if (raw) events = JSON.parse(raw);
    } catch (e) {
        console.warn('Redis fetch failed for timeline, using file fallback', e);
    }

    // Fallback to file if empty
    if (events.length === 0 && fs.existsSync(TIMELINE_FILE)) {
        const data = fs.readFileSync(TIMELINE_FILE, 'utf8');
        events = JSON.parse(data) as TimelineEvent[];
    }

    // Sort newest to oldest
    events.sort((a, b) => getYear(b.date) - getYear(a.date));
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timeline events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await request.json();
    
    try {
        await redis.set('timeline', JSON.stringify(events));
        // Try to sync file if possible
        try {
             fs.writeFileSync(TIMELINE_FILE, JSON.stringify(events, null, 2));
        } catch (fsError) {
             // Ignore
        }
    } catch (kvError) {
         console.warn('Redis Write Error:', kvError);
         try {
            fs.writeFileSync(TIMELINE_FILE, JSON.stringify(events, null, 2));
         } catch (fsError) {
            console.error('CRITICAL: Both Redis and File Write failed.');
            return NextResponse.json({ 
                error: 'Storage Error: Database not configured and file system is read-only. Please set REDIS_URL environment variable in Vercel.' 
            }, { status: 500 });
         }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timeline events' }, { status: 500 });
  }
}
