"use client";

import { useState } from "react";
import Link from "next/link";
import { CENTRES, TEL } from "@/lib/data";
import { BookButton } from "./Buttons";

/** Sketch map + address cards; selecting either highlights the other. */
export default function Centres() {
  const [current, setCurrent] = useState("mandya");
  return (
    <div className="loc-layout">
      <div className="map">
        <svg viewBox="0 0 480 372" role="img" aria-label="Map sketch of Medcloud centres between Bengaluru and Mysuru">
          <rect className="map-bg" width="480" height="372" rx="10" />
          <g className="map-grid" strokeWidth="1"><path d="M0 93h480M0 186h480M0 279h480M120 0v372M240 0v372M360 0v372" /></g>
          <path d="M56 322 L160 234 L312 154 L436 54" fill="none" className="map-road" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" opacity=".55" />
          <path d="M436 54 L212 34" fill="none" className="map-road" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" opacity=".3" />
          <path d="M160 234 L224 286" fill="none" className="map-road" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" opacity=".3" />
          <g className="city"><rect x="431" y="49" width="10" height="10" className="map-city" /><text x="424" y="42" textAnchor="end">BENGALURU</text></g>
          <g className="city"><rect x="51" y="317" width="10" height="10" className="map-city" /><text x="68" y="344">MYSURU</text></g>
          {CENTRES.map((c) => {
            const on = c.id === current;
            return (
              <g key={c.id} className={`pin ${on ? "on" : ""}`} tabIndex={0} role="button" aria-label={`${c.name} centre`} aria-pressed={on}
                onClick={() => setCurrent(c.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCurrent(c.id); } }}>
                <circle className="halo" cx={c.x} cy={c.y} r={on ? 20 : 14} />
                <circle className="dot" cx={c.x} cy={c.y} r={on ? 9 : 7} />
                <text x={c.x + c.lx} y={c.y + c.ly} textAnchor={c.anchor}>{c.name}</text>
              </g>
            );
          })}
        </svg>
        <p>Sketch map, positions approximate. Tap a centre for its address.</p>
      </div>
      <div className="locs">
        {CENTRES.map((c) => (
          <article key={c.id} className={`loc glow ${c.id === current ? "on" : ""}`} onClick={() => setCurrent(c.id)}>
            <h3>{c.name}{c.main && <span className="tag g">Main centre</span>}</h3>
            <address>{c.address}</address>
            <div className="acts" onClick={(e) => e.stopPropagation()}>
              <a className="btn btn-primary btn-sm" href={c.map} target="_blank" rel="noopener">Get directions</a>
              <a className="btn btn-ghost btn-sm" href={TEL}>Call</a>
              <BookButton className="btn btn-ghost btn-sm" preset={{ mode: "centre", centre: c.id }}>Book here</BookButton>
              <Link className="btn btn-ghost btn-sm" href={`/centres/${c.id}`}>Details</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
