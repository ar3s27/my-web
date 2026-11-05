import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lib/i18n';
import { ui } from '../content';

/** Dot + trailing ring. Grows over links, shows a label over project cards. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'none' | 'hover' | 'view'>('none');
  const [visible, setVisible] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);
    };
    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
      if (!el) setMode('none');
      else setMode(el.dataset.cursor === 'view' ? 'view' : 'hover');
    };
    const onLeave = () => setVisible(false);
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.16;
      lag.y += (pos.y - lag.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`cursor is-${mode}${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <div ref={ring} className="cursor__ring">
        <span className="cursor__label">{t(ui.projects.details)}</span>
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
