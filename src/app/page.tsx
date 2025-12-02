import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { getProjects } from '@/lib/api';

export default async function Home() {
  const projects = await getProjects();
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <Hero />

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">About Me</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-zinc-800 overflow-hidden">
               {/* Placeholder for profile photo */}
               <div className="w-full h-full flex items-center justify-center text-gray-400">Profile Photo</div>
            </div>
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                [Insert your bio here. Talk about your background, experience, and what drives you.]
              </p>
              <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-500">Download Resume &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Git', 'SQL'].map((skill) => (
              <div key={skill} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 text-center font-medium text-gray-900 dark:text-white hover:border-indigo-500 transition-colors">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href="https://github.com" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              View all projects on GitHub <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Have a project in mind or just want to say hi? I'd love to hear from you.
          </p>
          <form className="space-y-6 text-left">
             <div>
               <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email</label>
               <div className="mt-2">
                 <input type="email" name="email" id="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent" placeholder="you@example.com" />
               </div>
             </div>
             <div>
               <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Message</label>
               <div className="mt-2">
                 <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent" />
               </div>
             </div>
             <button type="submit" className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send Message</button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
