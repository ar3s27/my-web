import { useEffect, useRef, type ReactNode } from 'react';
import {
  animate,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Words rise out of a mask. Plays on view, or when `trigger` turns true. */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  trigger,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: boolean;
}) {
  // Observe the wrapper: the words themselves start clipped by their mask,
  // so an observer on them would never report them as visible.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const words = text.split(' ');
  const show = trigger ?? inView;
  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {words.map((w, i) => (
        <span className="mask" key={`${w}-${i}`} aria-hidden="true">
          <motion.span
            className="mask__inner"
            initial={{ y: '110%' }}
            animate={{ y: show ? '0%' : '110%' }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}

/** Fade + lift on view. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 30,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function ScrollWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  );
}

/** Paragraph that lights up word by word as you scroll through it. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </ScrollWord>
      ))}
    </p>
  );
}

export function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v)).padStart(2, '0');
      },
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      00
    </span>
  );
}

/** Element drifts towards the cursor while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Endless ticker that leans with scroll speed. */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 });
  const skewX = useTransform(smooth, [-2500, 2500], [10, -10], { clamp: true });
  const group = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span className="marquee__item" key={item}>
          {item}
          <span className="marquee__star">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <motion.div className="marquee" style={{ skewX }}>
      <div className={`marquee__inner${reverse ? ' is-reverse' : ''}`}>
        {group(false)}
        {group(true)}
      </div>
    </motion.div>
  );
}
