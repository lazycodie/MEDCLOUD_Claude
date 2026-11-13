"use client";

import { useEffect, useRef, useState } from "react";

/** Fades/slides children in when they scroll into view. Content stays visible without JS (see <noscript> in layout). */
export function Reveal({ children, delay = 0, className = "", kind = "up" }: { children: React.ReactNode; delay?: number; className?: string; kind?: "up" | "left" | "right" | "zoom" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv rv-${kind} ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/** Counts up to a figure like "3000+" the first time it is visible. */
export function CountUp({ value }: { value: string }) {
  const target = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[\d,]/g, "");
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(target);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target]);
  return <span ref={ref}>{n.toLocaleString("en-IN")}{suffix}</span>;
}

/** Sets --mx/--my on the element so CSS can paint a cursor-following glow. */
export function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} className={className} onPointerMove={(e) => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }}>{children}</section>
  );
}

/** Types and erases example words, for an animated input placeholder. */
export function useTyped(words: string[], hold = 1500) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0, i = words[0].length, dir = -1, timer: ReturnType<typeof setTimeout>;
    const step = () => {
      i += dir;
      setText(words[w].slice(0, i));
      let wait = dir > 0 ? 70 : 35;
      if (dir > 0 && i === words[w].length) { dir = -1; wait = hold; }
      else if (dir < 0 && i === 0) { dir = 1; w = (w + 1) % words.length; wait = 250; }
      timer = setTimeout(step, wait);
    };
    timer = setTimeout(step, hold);
    return () => clearTimeout(timer);
  }, [words, hold]);
  return text;
}
