import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const COMMENTS_FILE = path.join(process.cwd(), 'src/data/comments.json');

// Interface for a Comment
interface Comment {
  id: number;
  postId: string;
  nickname: string;
  content: string;
  date: string;
}

function getComments() {
  if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
  return JSON.parse(data) as Comment[];
}

function saveComments(comments: Comment[]) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    const comments = getComments();

    if (postId) {
      const filtered = comments.filter(c => c.postId === postId);
      return NextResponse.json(filtered);
    }

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, nickname, content } = body;

    if (!postId || !nickname || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comments = getComments();
    const newComment: Comment = {
      id: Date.now(),
      postId,
      nickname,
      content,
      date: new Date().toISOString(),
    };

    comments.push(newComment);
    saveComments(comments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const comments = getComments();
    const filtered = comments.filter(c => c.id !== Number(id));

    if (comments.length === filtered.length) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    saveComments(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
