"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CONCERNS, DEPTS, DEPT_NAME, MODALITIES, TESTS, rupee, searchTests, testHref, type Dept, type Modality } from "@/lib/data";
import { AddButton } from "./Buttons";

type Sort = "az" | "lo" | "hi";

/** Searchable, filterable price list. `dept` scopes it to one department page. */
export default function Catalogue({ dept = "all", pageSize = 12 }: { dept?: Dept | "all"; pageSize?: number }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [concern, setConcern] = useState<string | null>(params.get("concern"));
  const [mod, setMod] = useState<Modality | "All">("All");
  const [sort, setSort] = useState<Sort>("az");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { setQuery(params.get("q") ?? ""); setConcern(params.get("concern")); setShowAll(false); }, [params]);

  const results = useMemo(() => {
    let r = query.trim() ? searchTests(query) : [...TESTS];
    const re = concern ? CONCERNS[concern] : null;
    if (re) r = r.filter((t) => re.test(t.key));
    if (dept !== "all") r = r.filter((t) => t.dept === dept);
    if (dept === "radiology" && mod !== "All") r = r.filter((t) => t.mod === mod);
    if (sort === "lo") r.sort((a, b) => a.price! - b.price!);
    else if (sort === "hi") r.sort((a, b) => b.price! - a.price!);
    else if (!query.trim()) r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [query, concern, dept, mod, sort]);

  const shown = showAll || concern ? results : results.slice(0, pageSize);

  return (
    <div className="cat-layout">
      <nav className="cats" aria-label="Departments">
        <Link href="/tests" aria-current={dept === "all" ? "page" : undefined} scroll={false}>All tests <span>{TESTS.length}</span></Link>
        {DEPTS.map((d) => (
          <Link key={d.slug} href={`/tests/${d.slug}`} aria-current={dept === d.slug ? "page" : undefined} scroll={false}>
            {d.name} <span>{TESTS.filter((t) => t.dept === d.slug).length}</span>
          </Link>
        ))}
      </nav>
      <div>
        <div className="tools">
          <label className="sr" htmlFor="cq">Filter tests</label>
          <input className="field" id="cq" type="search" placeholder="Filter by test name" autoComplete="off" value={query} onChange={(e) => { setQuery(e.target.value); setShowAll(false); }} />
          <label className="sr" htmlFor="sort">Sort</label>
          <select className="field" id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="az">Name A–Z</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option>
          </select>
        </div>
        {dept === "radiology" && (
          <div className="mods" role="group" aria-label="Scan type">
            {(["All", ...MODALITIES] as const).map((m) => (
              <button key={m} aria-pressed={mod === m} onClick={() => { setMod(m); setShowAll(false); }}>{m === "Other" ? "ECG & other" : m}</button>
            ))}
          </div>
        )}
        <ul className="list" aria-live="polite">
          {shown.length ? shown.map((t) => (
            <li key={t.id}>
              <div className="nm"><Link href={testHref(t)}><b>{t.name}</b></Link><small>{t.dept !== "package" && DEPT_NAME[t.dept]}{t.mod && t.mod !== "Other" ? ` · ${t.mod}` : ""}</small></div>
              <span className="price">{rupee(t.price!)}</span>
              <AddButton id={t.id} />
            </li>
          )) : (
            <li className="empty"><div><b>No test matches that search</b>Check the spelling or try a shorter name. You can also call +91 81508 15026 and read out your prescription.</div></li>
          )}
        </ul>
        <div className="result-meta">
          <span>
            {concern && <><b>{concern}</b>: </>}Showing {shown.length} of {results.length} tests
            {concern && <> · <button className="sec-link" style={{ background: "none", border: 0, padding: 0 }} onClick={() => setConcern(null)}>Clear filter</button></>}
          </span>
          {results.length > shown.length && <button className="btn btn-ghost btn-sm" onClick={() => setShowAll(true)}>Show all {results.length}</button>}
        </div>
      </div>
    </div>
  );
}
