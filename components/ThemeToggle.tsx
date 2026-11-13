"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/** Day / dark switch. The choice is saved in the browser; layout.tsx applies it before first paint. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => { setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"); }, []);
  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("mc-theme", next); } catch {}
    setTheme(next);
  };
  return (
    <button className={`theme-toggle ${className}`} onClick={flip} role="switch" aria-checked={theme === "light"} aria-label={`Switch to ${theme === "dark" ? "day" : "dark"} theme`} title={theme === "dark" ? "Day theme" : "Dark theme"}>
      <span className="tt-track">
        <svg className="tt-sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" /></svg>
        <svg className="tt-moon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
        <span className="tt-knob" />
      </span>
    </button>
  );
}
