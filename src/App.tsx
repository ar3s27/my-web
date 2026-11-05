import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LangProvider } from './lib/i18n';
import { hasWebGL, prefersReducedMotion, useMedia } from './lib/hooks';
import { initSmoothScroll, lockScroll, measureAnchors } from './lib/scroll';
import type { Project } from './content';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { About, Services, Skills } from './components/Sections';
import Projects from './components/Projects';
import ProjectModal from './components/ProjectModal';
import Contact from './components/Contact';

const Scene = lazy(() => import('./three/Scene'));

export default function App() {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [webgl] = useState(hasWebGL);
  const finePointer = useMedia('(hover: hover) and (pointer: fine)');
  const mobile = useMedia('(max-width: 768px)');
  const [sceneReady, setSceneReady] = useState(!webgl);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<{ project: Project; origin: { x: number; y: number } } | null>(null);

  useEffect(() => {
    const cleanup = initSmoothScroll(reducedMotion);
    lockScroll(true);
    measureAnchors();
    const ro = new ResizeObserver(() => measureAnchors());
    ro.observe(document.body);
    window.addEventListener('resize', measureAnchors);
    document.fonts?.ready.then(measureAnchors);
    return () => {
      cleanup();
      ro.disconnect();
      window.removeEventListener('resize', measureAnchors);
    };
  }, [reducedMotion]);

  const onLoaded = useCallback(() => {
    setReady(true);
    lockScroll(false);
    measureAnchors();
  }, []);

  const open = useCallback((project: Project, origin: { x: number; y: number }) => {
    lockScroll(true);
    setActive({ project, origin });
  }, []);
  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    (project: Project) => setActive((cur) => (cur ? { project, origin: cur.origin } : cur)),
    [],
  );

  return (
    <LangProvider>
      {webgl ? (
        <Suspense fallback={null}>
          <Scene onReady={() => setSceneReady(true)} mobile={mobile} finePointer={finePointer} reducedMotion={reducedMotion} />
        </Suspense>
      ) : (
        <div className="scene scene--fallback" aria-hidden="true" />
      )}
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <Loader sceneReady={sceneReady} onDone={onLoaded} />
      {finePointer && <Cursor />}
      <Nav ready={ready} />

      <main>
        <Hero ready={ready} />
        <About />
        <Services />
        <Skills />
        <Projects onOpen={open} />
        <Contact />
      </main>

      <AnimatePresence onExitComplete={() => lockScroll(false)}>
        {active && <ProjectModal key="modal" project={active.project} origin={active.origin} onClose={close} onNext={next} />}
      </AnimatePresence>
    </LangProvider>
  );
}
