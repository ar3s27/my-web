import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { Prompt } from '@/lib/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const promptsJson = await redis.get('prompts');
    const prompts: Prompt[] = promptsJson ? (JSON.parse(promptsJson) as Prompt[]) : [];
    return NextResponse.json(prompts);
  } catch (error) {
    console.warn('Failed to fetch prompts from Redis', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, title_tr, description, description_tr, content, content_tr, category, tags, imageUrl } = body;

    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title,
      title_tr,
      description,
      description_tr,
      content,
      content_tr,
      category,
      tags: tags || [],
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    const promptsJson = await redis.get('prompts');
    let prompts: Prompt[] = promptsJson ? (JSON.parse(promptsJson) as Prompt[]) : [];
    
    prompts.push(newPrompt);
    
    // Sort by newest
    prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    await redis.set('prompts', JSON.stringify(prompts));

    return NextResponse.json(newPrompt);
  } catch (error) {
    console.error('Failed to create prompt', error);
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const promptsJson = await redis.get('prompts');
        if (!promptsJson) {
             return NextResponse.json({ message: 'No prompts found' }, { status: 404 });
        }

        let prompts: Prompt[] = JSON.parse(promptsJson);
        const filteredPrompts = prompts.filter(p => p.id !== id);

        await redis.set('prompts', JSON.stringify(filteredPrompts));

        return NextResponse.json({ message: 'Prompt deleted' });

    } catch (error) {
        console.error('Failed to delete prompt', error);
        return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
    }
}
