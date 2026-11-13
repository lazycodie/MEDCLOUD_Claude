"use client";

import { useEffect, useRef, useState } from "react";

/** Opening counter, 0 → 100 in the bottom-left corner, shown once per browser session. */
export function Splash() {
  const [n, setN] = useState(0);
  const [state, setState] = useState<"on" | "out" | "gone">("on");
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("mc-splash") === "1"; sessionStorage.setItem("mc-splash", "1"); } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { setState("gone"); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 2; setN(Math.min(100, i));
      if (i >= 100) { clearInterval(id); setTimeout(() => setState("out"), 200); setTimeout(() => setState("gone"), 900); }
    }, 28);
    return () => clearInterval(id);
  }, []);
  if (state === "gone") return null;
  return <div className={`splash ${state === "out" ? "out" : ""}`} aria-hidden="true"><span>{n}</span></div>;
}

const IMG_W = 2400, IMG_H = 1500;

/**
 * "Masked cards": every child marked data-mask shows a different window into one shared
 * background image, so the cards read as a single picture cut into tiles.
 */
export function Mosaic({ image, className = "", children }: { image: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = () => {
      const W = el.offsetWidth, H = el.offsetHeight;
      const scale = Math.max(W / IMG_W, H / IMG_H);
      const bw = IMG_W * scale, bh = IMG_H * scale, ox = (bw - W) / 2, oy = (bh - H) / 2;
      el.querySelectorAll<HTMLElement>("[data-mask]").forEach((c) => {
        let x = 0, y = 0, node: HTMLElement | null = c;
        while (node && node !== el) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
        c.style.backgroundImage = `url(${image})`;
        c.style.backgroundSize = `${bw}px ${bh}px`;
        c.style.backgroundPosition = `${-(x + ox)}px ${-(y + oy)}px`;
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, [image]);
  return <div ref={ref} className={`mosaic ${className}`}>{children}</div>;
}
