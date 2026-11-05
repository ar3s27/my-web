import { useRef, type MouseEvent } from 'react';
import { useLang } from '../lib/i18n';
import { ui } from '../content';
import { Counter, Marquee, Reveal, ScrollWords, SplitWords } from './motion';

function SectionHead({ index, label, title }: { index: string; label: string; title?: string }) {
  return (
    <header className="sec-head">
      <Reveal>
        <span className="label">
          <span className="label__idx">{index}</span> / {label}
        </span>
      </Reveal>
      {title && (
        <h2 className="sec-title">
          <SplitWords text={title} />
        </h2>
      )}
    </header>
  );
}

export function About() {
  const { t } = useLang();
  return (
    <section id="about" className="section about" data-shape="1">
      <div className="about__grid">
        <SectionHead index="01" label={t(ui.about.label)} />
        <ScrollWords className="about__text" text={t(ui.about.body)} />
      </div>
      <div className="stats">
        {ui.about.stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.1} className="stat">
            <Counter to={s.value} className="stat__value" />
            <span className="stat__label">{t(s.label)}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const ICONS = [
  // neural net
  <svg viewBox="0 0 48 48" key="a">
    <circle cx="10" cy="14" r="3" />
    <circle cx="10" cy="34" r="3" />
    <circle cx="24" cy="10" r="3" />
    <circle cx="24" cy="24" r="3" />
    <circle cx="24" cy="38" r="3" />
    <circle cx="38" cy="24" r="3" />
    <path d="M13 14l8-4M13 14l8 10M13 34l8-10M13 34l8 4M27 10l8 14M27 24h8M27 38l8-14" />
  </svg>,
  // chart
  <svg viewBox="0 0 48 48" key="b">
    <path d="M6 40h36M10 34l9-10 7 6 12-16" />
    <circle cx="19" cy="24" r="2.5" />
    <circle cx="26" cy="30" r="2.5" />
    <circle cx="38" cy="14" r="2.5" />
  </svg>,
  // layers
  <svg viewBox="0 0 48 48" key="c">
    <path d="M24 6l18 9-18 9-18-9 18-9z" />
    <path d="M6 24l18 9 18-9M6 33l18 9 18-9" />
  </svg>,
  // server
  <svg viewBox="0 0 48 48" key="d">
    <rect x="8" y="8" width="32" height="12" rx="3" />
    <rect x="8" y="28" width="32" height="12" rx="3" />
    <path d="M14 14h2M14 34h2M24 20v8" />
  </svg>,
];

function ServiceCard({ index, title, text, tags }: { index: number; title: string; text: string; tags: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };
  return (
    <Reveal delay={(index % 2) * 0.12} y={60}>
      <article ref={ref} className="service" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="service__top">
          <span className="service__icon">{ICONS[index]}</span>
          <span className="label">0{index + 1}</span>
        </div>
        <h3 className="service__title">{title}</h3>
        <p className="service__text">{text}</p>
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

export function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="section services" data-shape="2">
      <SectionHead index="02" label={t(ui.services.label)} title={t(ui.services.title)} />
      <div className="services__grid">
        {ui.services.items.map((s, i) => (
          <ServiceCard key={i} index={i} title={t(s.title)} text={t(s.text)} tags={s.tags} />
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  const { t } = useLang();
  const groups = ui.skills.groups;
  const rowA = [...groups[0].items, ...groups[1].items];
  const rowB = [...groups[2].items, ...groups[3].items];
  return (
    <section id="skills" className="section skills" data-shape="2">
      <SectionHead index="03" label={t(ui.skills.label)} title={t(ui.skills.title)} />
      <div className="skills__marquees">
        <Marquee items={rowA} />
        <Marquee items={rowB} reverse />
      </div>
      <div className="skills__groups">
        {groups.map((g, i) => (
          <Reveal key={i} delay={i * 0.08} className="skill-group">
            <h3>
              <span className="label__idx">0{i + 1}</span> {t(g.title)}
            </h3>
            <ul>
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export { SectionHead };
