"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Map as MlMap, Marker as MlMarker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CENTRES, PHONE_DISPLAY, REFERENCE_CITIES, TEL, type Centre } from "@/lib/data";
import { BookButton } from "./Buttons";

/** Keyless OpenStreetMap vector tiles. Override with NEXT_PUBLIC_MAP_STYLE_URL to use another provider. */
const STYLE_URL = process.env.NEXT_PUBLIC_MAP_STYLE_URL || "https://tiles.openfreemap.org/styles/positron";
const WIDE = { center: [76.9, 13.4] as [number, number], zoom: 6.3 };
const EASE = (t: number) => 1 - Math.pow(1 - t, 3);
/** Decorative order for the network motif. These are not roads or routes. */
const NETWORK = ["kunigal", "ramanagara", "malavalli", "mandya", "kunigal"];
const DASH_STEPS = [[0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5]];

type Status = "idle" | "loading" | "ready" | "error";

export default function NetworkMap() {
  const box = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markers = useRef<Record<string, HTMLButtonElement>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<string>("mandya");
  const [hover, setHover] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [entered, setEntered] = useState(false);
  const reduced = useRef(false);

  const bounds = useCallback((): [[number, number], [number, number]] => {
    const pts = [...CENTRES, ...REFERENCE_CITIES];
    return [[Math.min(...pts.map((p) => p.lng)), Math.min(...pts.map((p) => p.lat))], [Math.max(...pts.map((p) => p.lng)), Math.max(...pts.map((p) => p.lat))]];
  }, []);
  const pad = () => (window.innerWidth < 760 ? { top: 56, bottom: 56, left: 44, right: 44 } : { top: 120, bottom: 70, left: 90, right: 90 });

  const reset = useCallback(() => {
    const m = mapRef.current; if (!m) return;
    m.fitBounds(bounds(), { padding: pad(), duration: reduced.current ? 0 : 1100, easing: EASE });
    setSheet(false);
  }, [bounds]);

  const choose = useCallback((id: string, fly = true) => {
    setSelected(id); setSheet(true);
    const c = CENTRES.find((x) => x.id === id)!;
    const m = mapRef.current;
    if (m && fly) {
      const mobile = window.innerWidth < 760;
      m.flyTo({ center: [c.lng, c.lat], zoom: c.approx ? 12.2 : 13.2, duration: reduced.current ? 0 : 1500, easing: EASE, essential: true, offset: mobile ? [0, -70] : [0, 0], curve: 1.3 });
    }
  }, []);

  // Lazy-load the map engine when the section approaches the viewport.
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false, map: MlMap | null = null, dashTimer: ReturnType<typeof setInterval> | null = null, failTimer: ReturnType<typeof setTimeout> | null = null;
    const made: MlMarker[] = [];

    const start = async () => {
      setStatus("loading");
      try {
        const mod = await import("maplibre-gl");
        const ml = ((mod as unknown as { default?: typeof mod }).default ?? mod) as typeof mod;
        if (cancelled || !box.current) return;
        const m = new ml.Map({
          container: box.current, style: STYLE_URL, center: WIDE.center, zoom: WIDE.zoom,
          minZoom: 6, maxZoom: 16, maxBounds: [[74.2, 10.9], [79.6, 14.9]],
          attributionControl: { compact: true }, cooperativeGestures: true, dragRotate: false, pitchWithRotate: false, fadeDuration: 200,
        });
        map = m; mapRef.current = m;
        m.touchZoomRotate.disableRotation();
        failTimer = setTimeout(() => { if (!m.isStyleLoaded()) setStatus("error"); }, 12000);
        m.on("error", (e) => { if (!m.isStyleLoaded() && /style|Failed to fetch|AJAX/i.test(String(e?.error?.message ?? ""))) setStatus("error"); });

        m.on("load", () => {
          if (cancelled || !map) return;
          if (failTimer) clearTimeout(failTimer);
          brandStyle(map);

          // decorative network motif, kept under the markers
          const byId = Object.fromEntries(CENTRES.map((c) => [c.id, c]));
          map.addSource("network", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: NETWORK.map((id) => [byId[id].lng, byId[id].lat]) } } });
          map.addLayer({ id: "network-base", type: "line", source: "network", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#35B7A5", "line-width": 1.4, "line-opacity": 0.28 } });
          map.addLayer({ id: "network-flow", type: "line", source: "network", layout: { "line-join": "round" }, paint: { "line-color": "#147D82", "line-width": 1.6, "line-opacity": 0.6, "line-dasharray": [0, 4, 3] } });
          if (!reduced.current) {
            let step = 0;
            dashTimer = setInterval(() => { if (!map || document.hidden) return; step = (step + 1) % DASH_STEPS.length; map.setPaintProperty("network-flow", "line-dasharray", DASH_STEPS[step]); }, 110);
          }

          REFERENCE_CITIES.forEach((c) => {
            const n = document.createElement("div");
            n.className = "nm-ref"; n.setAttribute("aria-hidden", "true"); n.innerHTML = `<i></i><span>${c.name}</span>`;
            made.push(new ml.Marker({ element: n, anchor: "center" }).setLngLat([c.lng, c.lat]).addTo(map!));
          });
          CENTRES.forEach((c, i) => {
            const b = document.createElement("button");
            b.type = "button"; b.className = `nm-pin${c.approx ? " approx" : ""}`; b.style.setProperty("--i", String(i));
            b.innerHTML = `<span class="nm-halo"></span><span class="nm-dot"></span><span class="nm-label">${c.name}</span>`;
            b.addEventListener("click", (e) => { e.stopPropagation(); choose(c.id); });
            b.addEventListener("mouseenter", () => setHover(c.id)); b.addEventListener("mouseleave", () => setHover(null));
            b.addEventListener("focus", () => setHover(c.id)); b.addEventListener("blur", () => setHover(null));
            markers.current[c.id] = b;
            made.push(new ml.Marker({ element: b, anchor: "center" }).setLngLat([c.lng, c.lat]).addTo(map!));
            // set after addTo: MapLibre writes its own generic "Map marker" label
            b.setAttribute("aria-label", `Medcloud ${c.name}${c.approx ? ", approximate location" : ""}. Show address and directions.`);
          });

          setStatus("ready");
          // cinematic entrance: wide regional view, then settle on the network
          const go = () => { map!.fitBounds(bounds(), { padding: pad(), duration: reduced.current ? 0 : 1700, easing: EASE }); setEntered(true); };
          if (reduced.current) go();
          else {
            const seen = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.disconnect(); setTimeout(go, 350); } }, { threshold: 0.35 });
            seen.observe(el);
          }
        });
      } catch { if (!cancelled) setStatus("error"); }
    };

    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { near.disconnect(); start(); } }, { rootMargin: "500px 0px" });
    near.observe(el);
    const onResize = () => map?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true; near.disconnect(); window.removeEventListener("resize", onResize);
      if (dashTimer) clearInterval(dashTimer); if (failTimer) clearTimeout(failTimer);
      made.forEach((m) => m.remove()); markers.current = {};
      map?.remove(); mapRef.current = null;
    };
  }, [bounds, choose]);

  // reflect selection / hover on the DOM markers
  useEffect(() => {
    Object.entries(markers.current).forEach(([id, el]) => {
      el.classList.toggle("on", id === selected); el.classList.toggle("hot", id === hover);
      el.setAttribute("aria-pressed", String(id === selected));
    });
  }, [selected, hover, status]);

  const cur = CENTRES.find((c) => c.id === selected)!;
  const idx = CENTRES.findIndex((c) => c.id === selected);

  const info = (c: Centre, where: "panel" | "sheet") => (
    <div className={`nm-info ${where}`} key={c.id}>
      <p className="nm-id">{String(idx + 1).padStart(2, "0")} / {String(CENTRES.length).padStart(2, "0")}{c.main ? " · Main centre" : ""}</p>
      <h3>{c.name}</h3>
      <address>{c.address}</address>
      {c.approx && <p className="nm-approx">{c.approxNote}</p>}
      <div className="nm-acts">
        <a className="btn btn-primary btn-sm" href={c.map} target="_blank" rel="noopener">Get directions</a>
        <a className="btn btn-ghost btn-sm" href={TEL}>Call {PHONE_DISPLAY}</a>
      </div>
      <div className="nm-links">
        <BookButton className="nm-link" preset={{ mode: "centre", centre: c.id }}>Book at this centre</BookButton>
        <Link className="nm-link" href={`/centres/${c.id}`}>Centre details →</Link>
      </div>
    </div>
  );

  return (
    <div ref={wrap} className={`nm ${entered ? "entered" : ""} is-${status}`}>
      <div className="nm-chips" role="group" aria-label="Choose a centre">
        {CENTRES.map((c) => <button key={c.id} type="button" aria-pressed={selected === c.id} onClick={() => choose(c.id)}>{c.name}</button>)}
      </div>

      <div className="nm-stage">
        <div ref={box} className="nm-canvas" role="application" aria-label="Map of Medcloud centres in south Karnataka" />
        {status !== "ready" && status !== "error" && <div className="nm-state" role="status"><span className="nm-spin" />Loading map…</div>}
        {status === "error" && (
          <div className="nm-state error" role="status">
            <b>The map could not load.</b>
            <span>Every address and directions link is in the centre list{" "}<span className="nm-here">beside this panel</span>.</span>
          </div>
        )}
        {status === "ready" && (
          <div className="nm-ctrl" role="group" aria-label="Map controls">
            <button type="button" aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn({ duration: reduced.current ? 0 : 300 })}>+</button>
            <button type="button" aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut({ duration: reduced.current ? 0 : 300 })}>−</button>
            <button type="button" aria-label="Show all centres" title="Show all centres" onClick={reset}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
            </button>
          </div>
        )}
        <p className="nm-legend"><i />Medcloud centre<i className="ref" />Reference city<span>Connecting lines are decorative, not routes.</span></p>

        <div className={`nm-sheet ${sheet ? "open" : ""}`} aria-hidden={!sheet}>
          <button type="button" className="nm-close" aria-label="Close centre details" onClick={() => setSheet(false)} tabIndex={sheet ? 0 : -1}>×</button>
          {info(cur, "sheet")}
        </div>
      </div>

      <aside className="nm-panel" aria-label="Medcloud centres">
        <ol className="nm-list">
          {CENTRES.map((c, i) => (
            <li key={c.id}>
              <button type="button" className={`${selected === c.id ? "on" : ""} ${hover === c.id ? "hot" : ""}`} aria-pressed={selected === c.id}
                onClick={() => choose(c.id)} onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(c.id)} onBlur={() => setHover(null)}>
                <span className="nm-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="nm-name">{c.name}{c.main && <small>Main centre</small>}{c.approx && <small>Approximate pin</small>}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ol>
        <div aria-live="polite">{info(cur, "panel")}</div>
        {/* Non-map alternative: every address and directions link, always in the page */}
        <ul className="nm-all">
          {CENTRES.filter((c) => c.id !== selected).map((c) => (
            <li key={c.id}><b>{c.name}</b><span>{c.address}</span><a href={c.map} target="_blank" rel="noopener">Directions</a></li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

/** Recolour the base style to the Medcloud palette: soft land, pale teal water, quiet roads, navy labels. */
function brandStyle(map: MlMap) {
  const set = (id: string, prop: string, value: unknown) => { try { (map as unknown as { setPaintProperty: (l: string, p: string, v: unknown) => void }).setPaintProperty(id, prop, value); } catch { /* layer or property not in this style */ } };
  for (const l of map.getStyle().layers ?? []) {
    const id = l.id;
    if (l.type === "background") set(id, "background-color", "#F3F7F8");
    else if (l.type === "fill" && /water/.test(id)) set(id, "fill-color", "#CDE6EA");
    else if (l.type === "fill" && /park|wood|landcover/.test(id)) { set(id, "fill-color", "#E2EFEA"); set(id, "fill-opacity", 0.7); }
    else if (l.type === "fill" && /residential/.test(id)) set(id, "fill-color", "#EBF1F3");
    else if (l.type === "fill" && /building/.test(id)) set(id, "fill-color", "#E3EBEF");
    else if (l.type === "line" && /waterway/.test(id)) set(id, "line-color", "#BBDDE3");
    else if (l.type === "line" && /motorway.*inner|major.*inner/.test(id)) set(id, "line-color", "#FFFFFF");
    else if (l.type === "line" && /casing/.test(id)) set(id, "line-color", "#D3DEE3");
    else if (l.type === "line" && /highway|road/.test(id)) set(id, "line-color", "#DDE6EA");
    else if (l.type === "line" && /railway/.test(id)) set(id, "line-color", "#D9E2E6");
    else if (l.type === "line" && /boundary/.test(id)) { set(id, "line-color", "#B9C9D0"); set(id, "line-opacity", 0.7); }
    else if (l.type === "symbol") {
      set(id, "text-color", /city|state|country/.test(id) ? "#123B50" : "#667785");
      set(id, "text-halo-color", "#FFFFFF"); set(id, "text-halo-width", 1.4);
    }
  }
}
