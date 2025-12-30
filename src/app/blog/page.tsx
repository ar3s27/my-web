import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import BlogPageHeader from '@/components/BlogPageHeader';
import { getPosts } from '@/lib/api';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <BlogPageHeader />
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
