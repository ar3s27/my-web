import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLang } from '../lib/i18n';
import { scrollToTarget } from '../lib/scroll';
import { profile, ui } from '../content';
import { EASE, Magnetic, SplitWords } from './motion';

export default function Hero({ ready }: { ready: boolean }) {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.75], ['blur(0px)', 'blur(8px)']);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section ref={ref} id="top" className="hero" data-shape="0">
      <motion.div className="hero__inner" style={{ y, opacity, filter: blur }}>
        <motion.div className="hero__top" {...fade(0.5)}>
          <span className="label">
            <i className="dot" /> {t(profile.role)}
          </span>
          <span className="label label--right">
            {profile.location} · {profile.coords}
          </span>
        </motion.div>

        <h1 className="hero__name">
          <SplitWords text={profile.first} className="hero__line hero__line--a" trigger={ready} delay={0.1} />
          <SplitWords text={profile.middle} className="hero__line hero__line--b" trigger={ready} delay={0.2} />
          <SplitWords text={profile.last} className="hero__line hero__line--c" trigger={ready} delay={0.32} />
        </h1>

        <div className="hero__bottom">
          <motion.p className="hero__intro" {...fade(0.75)}>
            {t(ui.hero.intro)}
          </motion.p>
          <motion.div className="hero__ctas" {...fade(0.9)}>
            <Magnetic>
              <button className="btn btn--primary" onClick={() => scrollToTarget('#projects')}>
                <span>{t(ui.hero.ctaWork)}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn btn--ghost" onClick={() => scrollToTarget('#contact')}>
                <span>{t(ui.hero.ctaContact)}</span>
              </button>
            </Magnetic>
          </motion.div>
          <motion.button className="scroll-cue" onClick={() => scrollToTarget('#about')} {...fade(1.05)}>
            <span>{t(ui.hero.scroll)}</span>
            <i />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
