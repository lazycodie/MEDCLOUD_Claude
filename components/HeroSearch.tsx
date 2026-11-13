"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DEPT_NAME, PHONE_DISPLAY, TEL, TESTS, rupee, searchTests } from "@/lib/data";
import { AddButton } from "./Buttons";

/** Hero typeahead: live prices as you type, Enter goes to the full results on /tests. */
export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const results = searchTests(q);

  useEffect(() => {
    const away = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", away);
    return () => document.removeEventListener("click", away);
  }, []);

  const go = () => { if (q.trim()) router.push(`/tests?q=${encodeURIComponent(q.trim())}`); else router.push("/tests"); };
  const show = open && q.trim().length > 0;

  return (
    <div className="search" role="search" ref={box}>
      <label className="sr" htmlFor="q">Search tests and scans</label>
      <div className="search-box">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input id="q" type="search" autoComplete="off" placeholder={`Search ${TESTS.length} tests — try “CBC”, “thyroid”, “CT brain”`} aria-controls="suggest" aria-expanded={show}
          value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter") go(); if (e.key === "Escape") setOpen(false); }} />
        <button className="btn btn-primary" onClick={go}>Search</button>
      </div>
      {show && (
        <ul className="suggest" id="suggest">
          {results.slice(0, 6).map((t) => (
            <li key={t.id}>
              <div className="nm">{t.name}<small>{t.dept !== "package" && DEPT_NAME[t.dept]}</small></div>
              <span className="price">{rupee(t.price!)}</span>
              <AddButton id={t.id} />
            </li>
          ))}
          {results.length > 6 && <li className="all"><button onClick={go}>See all {results.length} results for “{q.trim()}” →</button></li>}
          {results.length === 0 && <li className="all"><span>No test matches “{q.trim()}”. Call <a href={TEL}>{PHONE_DISPLAY}</a> and we’ll help.</span></li>}
        </ul>
      )}
    </div>
  );
}
