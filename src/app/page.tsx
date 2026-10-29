import { getContent } from "@/lib/content";
import { isContactConfigured } from "@/lib/actions/contact";
import SmoothScroll from "@/components/animations/SmoothScroll";
import SceneLoader from "@/components/three/SceneLoader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Capabilities from "@/components/sections/Capabilities";
import Contact from "@/components/sections/Contact";

// Re-generated on demand when content is saved in /admin (see revalidatePath in admin actions).
export const revalidate = 3600;

export default async function Home() {
  const content = await getContent();
  const contactActive = await isContactConfigured();

  return (
    <SmoothScroll>
      <SceneLoader />
      <Navbar name={content.profile.name} />
      <main>
        <Hero profile={content.profile} />
        <About profile={content.profile} />
        <Skills categories={content.skills} />
        <Projects projects={content.projects} />
        <Experience data={content.experience} />
        <Education data={content.education} />
        <Capabilities />
        <Contact profile={content.profile} active={contactActive} />
      </main>
      <Footer profile={content.profile} />
    </SmoothScroll>
  );
}
