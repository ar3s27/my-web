import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STATS_FILE = path.join(process.cwd(), 'src/data/stats.json');

function getStats() {
  if (!fs.existsSync(STATS_FILE)) {
    // Initialize if not exists
    const initial = { totalVisitors: 0, pageViews: 0 };
    fs.writeFileSync(STATS_FILE, JSON.stringify(initial));
    return initial;
  }
  const data = fs.readFileSync(STATS_FILE, 'utf8');
  return JSON.parse(data);
}

function saveStats(stats: any) {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

export async function GET() {
  try {
    const stats = getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const stats = getStats();
    stats.totalVisitors += 1;
    saveStats(stats);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}
