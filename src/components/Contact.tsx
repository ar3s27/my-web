import { useEffect, useState } from 'react';
import { useLang } from '../lib/i18n';
import { scrollToTarget } from '../lib/scroll';
import { socials, ui } from '../content';
import { Magnetic, Reveal, SplitWords } from './motion';

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const fmt = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return <time>{fmt.format(now)}</time>;
}

export default function Contact() {
  const { t } = useLang();
  const linkedin = socials[0];
  return (
    <section id="contact" className="section contact" data-shape="4">
      <span className="label">
        <span className="label__idx">05</span> / {t(ui.contact.label)}
      </span>
      <h2 className="contact__title">
        <SplitWords text={t(ui.contact.title1)} className="contact__line" />
        <SplitWords text={t(ui.contact.title2)} className="contact__line contact__line--grad" delay={0.15} />
      </h2>

      <div className="contact__row">
        <Reveal className="contact__text">
          <p>{t(ui.contact.text)}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <Magnetic strength={0.4}>
            <a className="orb" href={linkedin.href} target="_blank" rel="noreferrer">
              <span>{t(ui.contact.button)}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </Magnetic>
        </Reveal>
      </div>

      <ul className="socials">
        {socials.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <li>
              <a href={s.href} target="_blank" rel="noreferrer">
                <span className="socials__label">{s.label}</span>
                <span className="socials__handle">{s.handle}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>

      <footer className="footer">
        <span>
          © 2026 Muhammed Veysel Erkoyuncu. {t(ui.contact.rights)}
        </span>
        <span>
          {t(ui.contact.localTime)} — <LocalTime />
        </span>
        <button onClick={() => scrollToTarget(0)} className="footer__top">
          {t(ui.contact.top)} ↑
        </button>
      </footer>
    </section>
  );
}
