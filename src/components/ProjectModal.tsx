import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../lib/i18n';
import { projects, ui, type Project } from '../content';
import { Cover } from './Projects';
import { EASE } from './motion';

type Props = {
  project: Project;
  origin: { x: number; y: number };
  onClose: () => void;
  onNext: (p: Project) => void;
};

/** Full-screen project page that opens as a circle from where you clicked. */
export default function ProjectModal({ project, origin, onClose, onNext }: Props) {
  const { t, lang } = useLang();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];
  const at = `${origin.x}px ${origin.y}px`;

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [project.id]);

  const item = (i: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay: 0.35 + i * 0.07 },
  });

  return (
    <motion.div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={t(project.title)}
      initial={{ clipPath: `circle(0px at ${at})` }}
      animate={{ clipPath: `circle(150% at ${at})` }}
      exit={{ clipPath: `circle(0px at ${at})` }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="modal__scroll" ref={body} data-lenis-prevent>
        <div className="modal__bar">
          <span className="label">
            <span className="label__idx">{String(index + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}
          </span>
          <button ref={closeBtn} className="modal__close" onClick={onClose}>
            {t(ui.projects.close)} <kbd>Esc</kbd>
            <span className="modal__x" aria-hidden="true" />
          </button>
        </div>

        <div className="modal__content" key={`${project.id}-${lang}`}>
          <motion.div className="modal__meta" {...item(0)}>
            <div>
              <span className="label">{t(ui.projects.year)}</span>
              <span>{project.year}</span>
            </div>
            <div>
              <span className="label">{t(ui.projects.role)}</span>
              <span>{t(project.role)}</span>
            </div>
          </motion.div>

          <motion.h2 className="modal__title" {...item(1)}>
            {t(project.title)}
          </motion.h2>
          <motion.p className="modal__summary" {...item(2)}>
            {t(project.summary)}
          </motion.p>

          <motion.div className="modal__cover" {...item(3)}>
            <Cover project={project} index={index} />
          </motion.div>

          <div className="modal__cols">
            <motion.div {...item(4)}>
              <p className="modal__desc">{t(project.description)}</p>
              {project.isPrivate && <p className="modal__note">{t(ui.projects.privateNote)}</p>}
            </motion.div>
            <motion.div className="modal__side" {...item(5)}>
              <h3 className="label">{t(ui.projects.highlights)}</h3>
              <ul className="modal__list">
                {project.highlights[lang].map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <h3 className="label">{t(ui.projects.stack)}</h3>
              <ul className="tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {project.links.length > 0 && (
                <>
                  <h3 className="label">{t(ui.projects.links)}</h3>
                  <div className="modal__links">
                    {project.links.map((l) => (
                      <a key={l.href} className="btn btn--ghost btn--sm" href={l.href} target="_blank" rel="noreferrer">
                        <span>{t(l.label)}</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          <button className="modal__next" onClick={() => onNext(next)} data-cursor="view">
            <span className="label">{t(ui.projects.next)}</span>
            <span className="modal__next-title">{t(next.title)}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
