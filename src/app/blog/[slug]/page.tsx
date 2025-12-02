import { getPosts, getPostBySlug } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <article className="px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">{new Date(post.date).toLocaleDateString()}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{post.title}</h1>
          <div className="mt-10 max-w-2xl prose dark:prose-invert">
             <div className="whitespace-pre-wrap font-sans">{post.content}</div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
