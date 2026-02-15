import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import redis from '@/lib/redis';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src/data/posts.json');

// Interface for a Post (matching what's in admin page)
interface Post {
  id: number;
  slug: string;
  title: string;
  title_tr?: string;
  date: string;
  summary: string;
  summary_tr?: string;
  content: string;
  content_tr?: string;
  [key: string]: any; 
}

async function getPosts(): Promise<Post[]> {
  try {
    const postsJson = await redis.get('posts');
    if (postsJson) {
      return JSON.parse(postsJson);
    }
  } catch (error) {
    console.warn('Redis get failed', error);
  }

  // Fallback to file system
  if (fs.existsSync(dataFilePath)) {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const posts = JSON.parse(fileData);
    // Seed Redis
    await savePosts(posts);
    return posts;
  }
  
  return [];
}

async function savePosts(posts: Post[]) {
  try {
    await redis.set('posts', JSON.stringify(posts));
  } catch (error) {
    console.error('Redis save failed', error);
  }
}

export async function GET() {
  try {
    const posts = await getPosts();
    // Sort by date descending
    const sortedPosts = posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    return NextResponse.json(sortedPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const posts = await getPosts();
    
    const newPost = {
      id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
      ...body,
    };

    posts.push(newPost);
    await savePosts(posts);

    revalidatePath('/blog');
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const posts = await getPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    posts[index] = { ...posts[index], ...updates };
    await savePosts(posts);

    revalidatePath('/blog');
    if (posts[index].slug) {
        revalidatePath(`/blog/${posts[index].slug}`);
    }

    return NextResponse.json(posts[index]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const posts = await getPosts();
    const filteredPosts = posts.filter((p) => p.id !== parseInt(id));

    if (posts.length === filteredPosts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await savePosts(filteredPosts);

    revalidatePath('/blog');

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
