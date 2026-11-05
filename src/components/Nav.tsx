import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useLang } from '../lib/i18n';
import { scrollToTarget, lockScroll } from '../lib/scroll';
import { socials, ui } from '../content';
import { EASE } from './motion';

const LINKS = [
  { id: 'about', label: ui.nav.about },
  { id: 'services', label: ui.nav.services },
  { id: 'skills', label: ui.nav.skills },
  { id: 'projects', label: ui.nav.projects },
  { id: 'contact', label: ui.nav.contact },
] as const;

export default function Nav({ ready }: { ready: boolean }) {
  const { t, lang, setLang } = useLang();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !open);
    setScrolled(y > 40);
  });

  const go = (id: string) => {
    setOpen(false);
    lockScroll(false);
    scrollToTarget(`#${id}`);
  };

  const toggleMenu = () => {
    lockScroll(!open);
    setOpen(!open);
  };

  return (
    <>
      <motion.header
        className={`nav${scrolled ? ' is-scrolled' : ''}`}
        initial={{ y: '-120%' }}
        animate={{ y: ready && !hidden ? '0%' : '-120%' }}
        transition={{ duration: 0.8, ease: EASE, delay: ready && !scrolled ? 0.6 : 0 }}
      >
        <button className="nav__logo" onClick={() => scrollToTarget(0)} aria-label="Muhammed Veysel Erkoyuncu">
          <span>VE</span>
          <i />
        </button>

        <nav className="nav__links" aria-label="Ana menü">
          {LINKS.map((l, i) => (
            <button key={l.id} className="nav__link" onClick={() => go(l.id)}>
              <span className="nav__idx">0{i + 1}</span>
              <span className="nav__text" data-text={t(l.label)}>
                {t(l.label)}
              </span>
            </button>
          ))}
        </nav>

        <div className="nav__right">
          <div className="lang" role="group" aria-label="Language">
            {(['tr', 'en'] as const).map((l) => (
              <button key={l} className={lang === l ? 'is-active' : ''} onClick={() => setLang(l)} aria-pressed={lang === l}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="nav__cta" onClick={() => go('contact')}>
            {t(ui.nav.cta)}
          </button>
          <button className={`burger${open ? ' is-open' : ''}`} onClick={toggleMenu} aria-expanded={open} aria-label={t(open ? ui.nav.close : ui.nav.menu)}>
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="menu__links">
              {LINKS.map((l, i) => (
                <div className="mask" key={l.id}>
                  <motion.button
                    className="menu__link"
                    onClick={() => go(l.id)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                  >
                    <span className="menu__idx">0{i + 1}</span>
                    {t(l.label)}
                  </motion.button>
                </div>
              ))}
            </nav>
            <motion.div
              className="menu__socials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
