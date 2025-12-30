import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import SkillsSection from '@/components/SkillsSection';
import { getProjects } from '@/lib/api';

export default async function Home() {
  const projects = await getProjects();
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      <Hero />

      <AboutSection />

      <SkillsSection />

      <ProjectsSection projects={featuredProjects} />

      <ContactSection />

      <Footer />
    </main>
  );
}
