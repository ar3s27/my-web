import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { EASE } from './motion';
import { useLang } from '../lib/i18n';
import { ui } from '../content';

/** Counts to 100 while the 3D scene boots, then lifts like a curtain. */
export default function Loader({ sceneReady, onDone }: { sceneReady: boolean; onDone: () => void }) {
  const { t } = useLang();
  const value = useMotionValue(0);
  const bar = useTransform(value, [0, 100], [0, 1]);
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  useMotionValueEvent(value, 'change', (v) => setShown(Math.round(v)));

  useEffect(() => {
    const c = animate(value, 86, { duration: 1.5, ease: [0.4, 0, 0.2, 1] });
    return () => c.stop();
  }, [value]);

  useEffect(() => {
    // Finish when the scene is ready, or after 4s no matter what.
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      animate(value, 100, {
        duration: 0.6,
        ease: EASE,
        delay: 0.9,
        onComplete: () => setLeaving(true),
      });
    };
    if (sceneReady) finish();
    const timer = window.setTimeout(finish, 4000);
    return () => window.clearTimeout(timer);
  }, [sceneReady, value]);

  if (gone) return null;

  return (
    <motion.div
      className="loader"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={leaving ? { clipPath: 'inset(0% 0% 100% 0%)' } : undefined}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (leaving) {
          setGone(true);
          onDone();
        }
      }}
    >
      <div className="loader__top">
        <span>MVE — Portfolio</span>
        <span>©2026</span>
      </div>
      <div className="loader__bottom">
        <span className="loader__msg">{t(ui.loader)}…</span>
        <span className="loader__count">{String(shown).padStart(3, '0')}</span>
      </div>
      <motion.div className="loader__bar" style={{ scaleX: bar }} />
    </motion.div>
  );
}
