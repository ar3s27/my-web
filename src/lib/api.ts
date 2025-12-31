import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src/data');

export interface Project {
  id: number;
  title: string;
  title_tr?: string;
  description: string;
  description_tr?: string;
  tags: string[];
  imageUrl: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  title_tr?: string;
  date: string;
  summary: string;
  summary_tr?: string;
  content: string;
  content_tr?: string;
}

import { kv } from '@vercel/kv';

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await kv.get<Project[]>('projects');
    if (projects) return projects;
  } catch (error) {
    console.warn('Failed to fetch projects from KV, falling back to file system');
  }
  
  const filePath = path.join(dataDirectory, 'projects.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function getPosts(): Promise<BlogPost[]> {
  // Posts might not be editable yet, but good to prep
  const filePath = path.join(dataDirectory, 'posts.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const posts: BlogPost[] = JSON.parse(fileContents);
  // Sort by date descending
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}
