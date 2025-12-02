import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src/data');

export interface Project {
  id: number;
  title: string;
  description: string;
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
  date: string;
  summary: string;
  content: string;
}

export async function getProjects(): Promise<Project[]> {
  const filePath = path.join(dataDirectory, 'projects.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function getPosts(): Promise<BlogPost[]> {
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
