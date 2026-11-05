import Lenis from 'lenis';

// Shared between the DOM (writes) and the WebGL scene (reads every frame).
export const scrollState = {
  /** Shape index the scene is heading to (fractional while between sections). */
  target: 0,
  /** Damped value the scene actually renders. */
  progress: 0,
  /** Scroll velocity in px/frame, used for the particle "burst". */
  velocity: 0,
};

type Anchor = { y: number; v: number };
let anchors: Anchor[] = [];

/**
 * Every section with data-shape="n" holds shape n while it fills the screen;
 * the morph to the next shape happens in the gap between two sections.
 */
export function measureAnchors() {
  const vh = window.innerHeight;
  const list: Anchor[] = [];
  document.querySelectorAll<HTMLElement>('[data-shape]').forEach((el) => {
    const v = Number(el.dataset.shape);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const a1 = top - vh * 0.3;
    const a2 = Math.max(a1, top + el.offsetHeight - vh * 0.7);
    list.push({ y: a1, v }, { y: a2, v });
  });
  anchors = list;
  updateScroll(window.scrollY, 0);
}

function progressAt(y: number) {
  if (!anchors.length) return 0;
  if (y <= anchors[0].y) return anchors[0].v;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (y <= b.y) {
      const span = b.y - a.y;
      return span <= 0 ? b.v : a.v + (b.v - a.v) * ((y - a.y) / span);
    }
  }
  return anchors[anchors.length - 1].v;
}

export function updateScroll(y: number, velocity: number) {
  scrollState.target = progressAt(y);
  scrollState.velocity = velocity;
}

let lenis: Lenis | null = null;

export function initSmoothScroll(reducedMotion: boolean) {
  if (reducedMotion) {
    const onScroll = () => updateScroll(window.scrollY, 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }
  lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', (l: Lenis) => updateScroll(l.scroll, l.velocity));
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle('is-locked', locked);
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
}
