"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type Shape = "cell" | "dna" | "scanner" | "cross" | "tube";
type Key = { x: number; y: number; s: number; shape: Shape; el: HTMLElement };
const SHAPES: Shape[] = ["cell", "dna", "scanner", "cross", "tube"];
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * A fixed 3D stage behind the page content. Every section carrying
 * data-orb="x,y,scale" (viewport units, -1..1) and data-shape="cell|dna|scanner|cross|tube"
 * is a stop: the object holds there, then glides to the next stop and morphs into its shape.
 *   cell    – the Medcloud "cell" with orbiting particles (home hero, about)
 *   dna     – double helix (diagnostic lab, pathology prices)
 *   scanner – CT/MRI gantry with a sweeping scan light (imaging, radiology prices)
 *   cross   – medical cross (specialist consultation, services)
 *   tube    – blood sample tube with a lavender EDTA cap (home collection, packages)
 */
export default function Orb() {
  const ref = useRef<HTMLCanvasElement>(null);
  // Rendered into <body>: an animated ancestor (the route transition) would otherwise
  // become the containing block and stretch this fixed canvas to the full page height.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let dead = false;
    let cleanup = () => {};
    (async () => {
      const canvas = ref.current;
      if (!canvas) return;
      let THREE: typeof import("three");
      let RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment;
      let RoundedBoxGeometry: typeof import("three/examples/jsm/geometries/RoundedBoxGeometry.js").RoundedBoxGeometry;
      try {
        THREE = await import("three");
        ({ RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js"));
        ({ RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js"));
      } catch { return; }
      if (dead) return;

      let renderer: import("three").WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 10);
      scene.add(new THREE.HemisphereLight(0xc8fff0, 0x061a33, 0.75));
      const warm = new THREE.DirectionalLight(0xffe2ad, 1.7); warm.position.set(3, 5, 6); scene.add(warm);
      const cool = new THREE.DirectionalLight(0x7fd8ff, 2); cool.position.set(-5, 1, -3); scene.add(cool);

      const flight = new THREE.Group();
      scene.add(flight);
      const phys = (color: number, o: Partial<import("three").MeshPhysicalMaterialParameters> = {}) =>
        new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.5, ...o });
      const MINT = 0x2b9a94, PEACH = 0xdef2f1, WHITE = 0xf4fbfa;
      // materials that must contrast with the page: pale on dark, ink on the day theme
      const contrast: import("three").MeshPhysicalMaterial[] = [];
      const accent = () => { const m = phys(PEACH); contrast.push(m); return m; };
      const groups = {} as Record<Shape, import("three").Group>;
      SHAPES.forEach((s) => { groups[s] = new THREE.Group(); groups[s].scale.setScalar(0); flight.add(groups[s]); });

      // soft halo behind every shape
      const hc = document.createElement("canvas"); hc.width = hc.height = 256;
      const hx = hc.getContext("2d")!;
      const hg = hx.createRadialGradient(128, 128, 0, 128, 128, 128);
      hg.addColorStop(0, "rgba(58,175,169,.34)"); hg.addColorStop(0.45, "rgba(58,175,169,.1)"); hg.addColorStop(1, "rgba(0,0,0,0)");
      hx.fillStyle = hg; hx.fillRect(0, 0, 256, 256);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      halo.scale.setScalar(5.6); halo.position.z = -1; flight.add(halo);

      /* ---- cell ---- */
      const geo = new THREE.SphereGeometry(1, 64, 64);
      const base = (geo.attributes.position.array as Float32Array).slice();
      groups.cell.add(new THREE.Mesh(geo, phys(MINT, { iridescence: 0.55, iridescenceIOR: 1.45, sheen: 0.2, sheenColor: new THREE.Color(0x7fe6cc), emissive: 0x124a48, emissiveIntensity: 0.3, envMapIntensity: 0.45 })));
      const ring = (r: number, tube: number, c: number, o: number) => new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, 200), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o }));
      const rings = [
        { r: 1.5, tube: 0.007, rx: 1.15, ry: 0.3, sp: 0.25, c: 0x2b7a78, o: 0.6 },
        { r: 1.85, tube: 0.005, rx: 1.4, ry: -0.7, sp: -0.18, c: 0x74e2c5, o: 0.6 },
        { r: 2.2, tube: 0.004, rx: 0.5, ry: 1.0, sp: 0.12, c: 0x3aafa9, o: 0.5 },
      ].map((d) => { const m = ring(d.r, d.tube, d.c, d.o); m.rotation.set(d.rx, d.ry, 0); groups.cell.add(m); return { m, sp: d.sp }; });
      const satMat = [phys(0x74e2c5), accent(), phys(0xffffff)];
      const sats = Array.from({ length: 14 }, (_, i) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.035 + Math.random() * 0.085, 20, 20), satMat[i % 3]);
        groups.cell.add(m);
        return { m, R: 1.35 + Math.random() * 1.0, sp: (0.25 + Math.random() * 0.5) * (i % 2 ? 1 : -1), ph: Math.random() * 6.28, tilt: (Math.random() - 0.5) * 2.2 };
      });

      /* ---- dna: two strands of beads joined by rungs ---- */
      const helix = new THREE.Group(); groups.dna.add(helix);
      const bead = new THREE.SphereGeometry(0.105, 20, 20), rung = new THREE.CylinderGeometry(0.018, 0.018, 1.1, 8);
      const mA = phys(0x3aafa9, { emissive: 0x0f4a48, emissiveIntensity: 0.4 }), mB = accent(), mR = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });
      const N = 24;
      for (let i = 0; i < N; i++) {
        const a = i * 0.52, y = (i - (N - 1) / 2) * 0.155;
        const p1 = new THREE.Mesh(bead, mA); p1.position.set(Math.cos(a) * 0.55, y, Math.sin(a) * 0.55);
        const p2 = new THREE.Mesh(bead, mB); p2.position.set(-Math.cos(a) * 0.55, y, -Math.sin(a) * 0.55);
        const r = new THREE.Mesh(rung, mR); r.position.set(0, y, 0); r.rotation.set(0, -a, Math.PI / 2);
        helix.add(p1, p2, r);
      }
      groups.dna.rotation.z = 0.38;

      /* ---- scanner: gantry ring, patient table, sweeping scan light ---- */
      const gantry = new THREE.Group(); groups.scanner.add(gantry);
      gantry.add(new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.42, 40, 120), phys(WHITE, { roughness: 0.3 })));
      const bore = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.035, 12, 120), new THREE.MeshBasicMaterial({ color: 0x3aafa9 }));
      gantry.add(bore);
      const sweep = new THREE.Group(); gantry.add(sweep);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff })); lamp.position.x = 0.8; sweep.add(lamp);
      const fan = new THREE.Mesh(new THREE.CircleGeometry(0.8, 32, -0.35, 0.7), new THREE.MeshBasicMaterial({ color: 0x63d8bb, transparent: true, opacity: 0.22, side: THREE.DoubleSide })); sweep.add(fan);
      const table = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.09, 3.4, 4, 0.04), phys(0x12313f, { roughness: 0.4 })); table.position.y = -0.36; groups.scanner.add(table);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 1.5, 8, 16), phys(0x74e2c5, { roughness: 0.35 })); body.rotation.x = Math.PI / 2; body.position.y = -0.14; groups.scanner.add(body);
      groups.scanner.rotation.set(0.18, 0.95, 0);

      /* ---- cross ---- */
      const crossM = phys(MINT, { emissive: 0x06403c, emissiveIntensity: 0.35, iridescence: 0.4 });
      const plus = new THREE.Group(); groups.cross.add(plus);
      plus.add(new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.66, 0.5, 6, 0.16), crossM), new THREE.Mesh(new RoundedBoxGeometry(0.66, 2.0, 0.5, 6, 0.16), crossM));
      const cr1 = ring(1.75, 0.006, 0x2b7a78, 0.55); cr1.rotation.x = 1.25; groups.cross.add(cr1);
      const cr2 = ring(2.05, 0.005, 0x3aafa9, 0.5); cr2.rotation.set(0.5, 0.9, 0); groups.cross.add(cr2);
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), accent()); groups.cross.add(pulse);

      /* ---- tube: glass, blood sample, lavender cap, a 30-minute dial ---- */
      const tube = new THREE.Group(); groups.tube.add(tube);
      tube.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.7, 12, 32), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.26, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.2, depthWrite: false })));
      const blood = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.8, 12, 32), phys(0xc8364f, { emissive: 0x5a0f1d, emissiveIntensity: 0.5, roughness: 0.3 })); blood.position.y = -0.42; tube.add(blood);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.42, 40), phys(0xa98bd6, { roughness: 0.45 })); cap.position.y = 1.18; tube.add(cap);
      tube.rotation.z = -0.5;
      const dial = ring(1.7, 0.008, 0x2b7a78, 0.55); groups.tube.add(dial);
      const hand = new THREE.Group(); groups.tube.add(hand);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), accent()); tip.position.y = 1.7; hand.add(tip);
      for (let i = 0; i < 12; i++) { const t = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), mR); t.position.set(Math.sin(i * 0.5236) * 1.7, Math.cos(i * 0.5236) * 1.7, 0); groups.tube.add(t); }

      /* ---- scroll stops ---- */
      let keys: Key[] = [];
      const readKeys = () => {
        keys = [...document.querySelectorAll<HTMLElement>("[data-orb]")].map((el) => {
          const [x, y, s] = (el.dataset.orb || "0,0,1").split(",").map(Number);
          return { x, y, s, shape: (el.dataset.shape as Shape) || "cell", el };
        });
      };
      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      readKeys(); resize();

      const target = () => {
        const w = { cell: 0, dna: 0, scanner: 0, cross: 0, tube: 0 } as Record<Shape, number>;
        if (!keys.length) return { x: 0, y: 0, s: 1, moving: 0, fade: 0, w };
        const ih = window.innerHeight, mid = ih / 2, n = keys.length - 1;
        const cs = keys.map((k) => { const r = k.el.getBoundingClientRect(); return r.top + r.height / 2; });
        let i = 0;
        while (i < n - 1 && cs[i + 1] < mid) i++;
        const a = keys[i], b = keys[Math.min(i + 1, n)];
        const span = cs[Math.min(i + 1, n)] - cs[i] || 1;
        const t = n ? ease(clamp((clamp((mid - cs[i]) / span) - 0.12) / 0.76)) : 0;
        w[a.shape] += 1 - t; w[b.shape] += t;
        // before the first stop and after the last one, ride along with that section
        const ride = mid < cs[0] ? (cs[0] - mid) / mid : mid > cs[n] ? (cs[n] - mid) / mid : 0;
        const fade = clamp(1.6 - Math.abs(ride));
        const mobile = window.innerWidth < 760, solo = n === 0;
        return {
          x: lerp(a.x, b.x, t) * (mobile ? (solo ? 0.85 : 0.25) : 1),
          y: lerp(a.y, b.y, t) + Math.sin(t * Math.PI) * -0.12 - ride + (mobile ? (solo ? 0.3 : 0.34) : 0),
          s: lerp(a.s, b.s, t) * (1 + Math.sin(t * Math.PI) * 0.08) * (mobile ? 0.55 : 1),
          moving: Math.sin(t * Math.PI), fade, w,
        };
      };

      const first = target();
      const cur = { x: first.x, y: first.y, s: first.s, fade: first.fade };
      const weight = { ...first.w };
      const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
      const onMove = (e: PointerEvent) => { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -((e.clientY / window.innerHeight) * 2 - 1); };
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new THREE.Clock();
      const pos = geo.attributes.position;
      let raf = 0;

      let themed = "";
      const applyTheme = () => {
        const th = document.documentElement.dataset.theme === "light" ? "light" : "dark";
        if (th === themed) return;
        themed = th;
        contrast.forEach((m) => m.color.setHex(th === "light" ? 0x17252a : 0xdef2f1));
        halo.material.opacity = th === "light" ? 0.35 : 1;
      };

      const frame = () => {
        applyTheme();
        const dt = Math.min(clock.getDelta(), 0.05), t = still ? 0 : clock.elapsedTime;
        const tg = target();
        const k = still ? 1 : 1 - Math.exp(-dt * 3.2);
        cur.x += (tg.x - cur.x) * k; cur.y += (tg.y - cur.y) * (still ? 1 : 1 - Math.exp(-dt * 9)); cur.s += (tg.s - cur.s) * k; cur.fade += (tg.fade - cur.fade) * k;
        mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 2)); mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 2));
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z, halfW = halfH * camera.aspect;
        flight.position.set(cur.x * halfW + mouse.sx * 0.18, cur.y * halfH + Math.sin(t * 1.1) * 0.08 + mouse.sy * 0.12, 0);
        flight.scale.setScalar(halfH * 0.5 * cur.s);
        flight.rotation.set(mouse.sy * -0.22, mouse.sx * 0.35, 0);
        canvas.style.opacity = String(clamp(cur.fade));

        SHAPES.forEach((s) => {
          weight[s] += (tg.w[s] - weight[s]) * (still ? 1 : 1 - Math.exp(-dt * 5));
          const v = clamp(weight[s]);
          groups[s].visible = v > 0.02;
          groups[s].scale.setScalar(v * v * (3 - 2 * v));
        });

        if (groups.cell.visible) {
          const arr = pos.array as Float32Array, amp = 0.035 + tg.moving * 0.03;
          for (let i = 0; i < arr.length; i += 3) {
            const x = base[i], y = base[i + 1], z = base[i + 2];
            const d = 1 + amp * (Math.sin(3.1 * x + t * 1.3) + Math.sin(4.2 * y + t * 1.1 + 1.7) + Math.sin(5.3 * z + t * 0.9 + 0.6));
            arr[i] = x * d; arr[i + 1] = y * d; arr[i + 2] = z * d;
          }
          pos.needsUpdate = true; geo.computeVertexNormals();
          groups.cell.rotation.y = t * 0.18;
          rings.forEach((r) => { r.m.rotation.z = t * r.sp; });
          sats.forEach((s) => { const a = t * s.sp + s.ph; s.m.position.set(Math.cos(a) * s.R, Math.sin(a) * s.R * Math.sin(s.tilt), Math.sin(a) * s.R * Math.cos(s.tilt)); });
        }
        helix.rotation.y = t * 0.7;
        sweep.rotation.z = t * 2.4; bore.scale.setScalar(1 + Math.sin(t * 3) * 0.015);
        body.position.z = Math.sin(t * 0.6) * 0.5;
        plus.rotation.y = Math.sin(t * 0.6) * 0.7; plus.rotation.x = Math.sin(t * 0.4) * 0.15;
        cr1.rotation.z = t * 0.3; cr2.rotation.z = -t * 0.22;
        pulse.position.set(Math.cos(t * 0.9) * 1.75, Math.sin(t * 0.9) * 1.75 * Math.cos(1.25), Math.sin(t * 0.9) * 1.75 * Math.sin(1.25));
        tube.rotation.y = t * 0.5; tube.position.y = Math.sin(t * 1.4) * 0.05;
        hand.rotation.z = -t * 0.8;

        if (cur.fade > 0.01) renderer.render(scene, camera);
        if (!still) raf = requestAnimationFrame(frame);
      };

      const onScroll = () => { if (still) frame(); };
      const onResize = () => { resize(); readKeys(); if (still) frame(); };
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      canvas.classList.add("ready");
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        pmrem.dispose(); geo.dispose(); renderer.dispose();
      };
      if (dead) cleanup();
    })();
    return () => { dead = true; cleanup(); };
  }, [mounted]);

  return mounted ? createPortal(<canvas ref={ref} className="orb" aria-hidden="true" />, document.body) : null;
}
