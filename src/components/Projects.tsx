import { useEffect, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { useLang } from '../lib/i18n';
import { useMedia } from '../lib/hooks';
import { measureAnchors } from '../lib/scroll';
import { projects, ui, type Project } from '../content';
import { Reveal, SplitWords } from './motion';

export type OpenProject = (project: Project, origin: { x: number; y: number }) => void;

export function Cover({ project, index }: { project: Project; index: number }) {
  return (
    <div className="cover" style={{ '--h1': project.hues[0], '--h2': project.hues[1] } as CSSProperties}>
      <div className="cover__blob cover__blob--a" />
      <div className="cover__blob cover__blob--b" />
      <div className="cover__grid" />
      <span className="cover__num">{String(index + 1).padStart(2, '0')}</span>
      <span className="cover__tag">{project.tags[0]}</span>
    </div>
  );
}

function Card({ project, index, onOpen }: { project: Project; index: number; onOpen: OpenProject }) {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };
  const open = (x: number, y: number) => onOpen(project, { x, y });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const r = ref.current?.getBoundingClientRect();
      open(r ? r.left + r.width / 2 : window.innerWidth / 2, r ? r.top + r.height / 2 : window.innerHeight / 2);
    }
  };

  return (
    <article
      ref={ref}
      className="pcard"
      data-cursor="view"
      role="button"
      tabIndex={0}
      aria-label={`${t(project.title)} — ${t(ui.projects.details)}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => open(e.clientX, e.clientY)}
      onKeyDown={onKey}
    >
      <Cover project={project} index={index} />
      <div className="pcard__body">
        <div className="pcard__meta">
          <span>{project.year}</span>
          <span>{t(project.role)}</span>
        </div>
        <h3 className="pcard__title">{t(project.title)}</h3>
        <p className="pcard__summary">{t(project.summary)}</p>
        <ul className="tags">
          {project.tags.slice(0, 4).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <span className="pcard__more">
          {t(ui.projects.details)}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
    </article>
  );
}

function Intro() {
  const { t } = useLang();
  return (
    <div className="projects__intro">
      <span className="label">
        <span className="label__idx">04</span> / {t(ui.projects.label)}
      </span>
      <h2 className="sec-title">
        <SplitWords text={t(ui.projects.title)} />
        <sup className="projects__count">({String(projects.length).padStart(2, '0')})</sup>
      </h2>
      <Reveal>
        <p className="projects__lead">{t(ui.projects.intro)}</p>
      </Reveal>
    </div>
  );
}

/** Vertical scroll drives a horizontal rail while the section is pinned. */
function HorizontalProjects({ onOpen }: { onOpen: OpenProject }) {
  const { t } = useLang();
  const wrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  useLayoutEffect(() => {
    const measure = () => {
      if (!rail.current || !wrap.current) return;
      const d = Math.max(0, rail.current.scrollWidth - window.innerWidth);
      distance.set(d);
      wrap.current.style.height = `${d + window.innerHeight}px`;
      measureAnchors();
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rail.current) ro.observe(rail.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [distance]);

  return (
    <div ref={wrap} className="hscroll">
      <div className="hscroll__sticky">
        <motion.div ref={rail} className="hscroll__rail" style={{ x }}>
          <Intro />
          {projects.map((p, i) => (
            <Card key={p.id} project={p} index={i} onOpen={onOpen} />
          ))}
          <div className="hscroll__end" aria-hidden="true" />
        </motion.div>
        <div className="hscroll__footer">
          <span className="label">{t(ui.projects.hint)} →</span>
          <div className="hscroll__progress">
            <motion.i style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects({ onOpen }: { onOpen: OpenProject }) {
  const desktop = useMedia('(min-width: 900px) and (min-height: 560px)');

  useEffect(() => {
    measureAnchors();
  }, [desktop]);

  return (
    <section id="projects" className="projects" data-shape="3">
      {desktop ? (
        <HorizontalProjects onOpen={onOpen} />
      ) : (
        <div className="section projects__list">
          <Intro />
          {projects.map((p, i) => (
            <Reveal key={p.id} y={50}>
              <Card project={p} index={i} onOpen={onOpen} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
