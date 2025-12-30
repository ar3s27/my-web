import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

function getEvents() {
  if (!fs.existsSync(TIMELINE_FILE)) {
    fs.writeFileSync(TIMELINE_FILE, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(TIMELINE_FILE, 'utf8');
  return JSON.parse(data) as TimelineEvent[];
}

function saveEvents(events: TimelineEvent[]) {
  fs.writeFileSync(TIMELINE_FILE, JSON.stringify(events, null, 2));
}

export async function GET() {
  try {
    const events = getEvents();
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
    saveEvents(events);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timeline events' }, { status: 500 });
  }
}
