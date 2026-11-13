"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Key = { x: number; y: number; s: number; el: HTMLElement };
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * A glossy 3D "cell" with orbiting particles, fixed behind the page content.
 * It flies to a new spot for every section that carries data-orb="x,y,scale"
 * (x/y in viewport units, -1..1), holding still inside a section and gliding between them.
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
      try {
        THREE = await import("three");
        ({ RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js"));
      } catch { return; }
      if (dead) return;

      let renderer: import("three").WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.82;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 10);
      scene.add(new THREE.HemisphereLight(0xc8fff0, 0x061a33, 0.7));
      const warm = new THREE.DirectionalLight(0xffe2ad, 1.6); warm.position.set(3, 5, 6); scene.add(warm);
      const cool = new THREE.DirectionalLight(0x7fd8ff, 2); cool.position.set(-5, 1, -3); scene.add(cool);

      const flight = new THREE.Group();
      scene.add(flight);

      // core: a sphere whose surface slowly ripples
      const geo = new THREE.SphereGeometry(1, 96, 96);
      const base = (geo.attributes.position.array as Float32Array).slice();
      const core = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
        color: 0x1b8f7c, roughness: 0.2, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12,
        iridescence: 0.55, iridescenceIOR: 1.45, sheen: 0.2, sheenColor: new THREE.Color(0x7fe6cc),
        emissive: 0x06403c, emissiveIntensity: 0.3, envMapIntensity: 0.4,
      }));
      flight.add(core);

      // halo behind the core
      const hc = document.createElement("canvas"); hc.width = hc.height = 256;
      const hx = hc.getContext("2d")!;
      const hg = hx.createRadialGradient(128, 128, 0, 128, 128, 128);
      hg.addColorStop(0, "rgba(99,216,187,.38)"); hg.addColorStop(0.45, "rgba(60,170,180,.12)"); hg.addColorStop(1, "rgba(0,0,0,0)");
      hx.fillStyle = hg; hx.fillRect(0, 0, 256, 256);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      halo.scale.setScalar(5.6); halo.position.z = -1; flight.add(halo);

      // orbit rings
      const rings = [
        { r: 1.5, tube: 0.007, rx: 1.15, ry: 0.3, sp: 0.25, c: 0xffffff, o: 0.55 },
        { r: 1.85, tube: 0.005, rx: 1.4, ry: -0.7, sp: -0.18, c: 0x74e2c5, o: 0.6 },
        { r: 2.2, tube: 0.004, rx: 0.5, ry: 1.0, sp: 0.12, c: 0xf6d391, o: 0.4 },
      ].map((d) => {
        const m = new THREE.Mesh(new THREE.TorusGeometry(d.r, d.tube, 8, 200), new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: d.o }));
        m.rotation.set(d.rx, d.ry, 0); flight.add(m);
        return { m, sp: d.sp };
      });

      // satellites
      const satMat = [0x74e2c5, 0xf6d391, 0xffffff].map((c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.2, clearcoat: 1, envMapIntensity: 1 }));
      const sats = Array.from({ length: 16 }, (_, i) => {
        const r = 0.035 + Math.random() * 0.085;
        const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), satMat[i % 3]);
        flight.add(m);
        return { m, R: 1.35 + Math.random() * 1.0, sp: (0.25 + Math.random() * 0.5) * (i % 2 ? 1 : -1), ph: Math.random() * 6.28, tilt: (Math.random() - 0.5) * 2.2 };
      });

      let keys: Key[] = [];
      const readKeys = () => {
        keys = [...document.querySelectorAll<HTMLElement>("[data-orb]")].map((el) => {
          const [x, y, s] = (el.dataset.orb || "0,0,1").split(",").map(Number);
          return { x, y, s, el };
        });
      };
      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      readKeys(); resize();

      const target = () => {
        if (!keys.length) return { x: 0, y: 0, s: 1, moving: 0, fade: 0 };
        const mid = window.innerHeight / 2;
        const cs = keys.map((k) => { const r = k.el.getBoundingClientRect(); return r.top + r.height / 2; });
        let i = 0;
        while (i < keys.length - 2 && cs[i + 1] < mid) i++;
        const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
        const span = cs[Math.min(i + 1, keys.length - 1)] - cs[i] || 1;
        const t = ease(clamp((clamp((mid - cs[i]) / span) - 0.12) / 0.76));
        const last = keys[keys.length - 1].el.getBoundingClientRect();
        const fade = clamp(1 - (mid - (last.top + last.height / 2)) / (window.innerHeight * 0.7));
        const mobile = window.innerWidth < 760;
        return {
          x: lerp(a.x, b.x, t) * (mobile ? 0.25 : 1),
          y: lerp(a.y, b.y, t) + Math.sin(t * Math.PI) * -0.16 + (mobile ? 0.34 : 0),
          s: lerp(a.s, b.s, t) * (1 + Math.sin(t * Math.PI) * 0.1) * (mobile ? 0.55 : 1),
          moving: Math.sin(t * Math.PI), fade,
        };
      };

      const cur = { ...target() };
      const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
      const onMove = (e: PointerEvent) => { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -((e.clientY / window.innerHeight) * 2 - 1); };
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new THREE.Clock();
      const pos = geo.attributes.position;
      let raf = 0;

      const frame = () => {
        const dt = Math.min(clock.getDelta(), 0.05), t = still ? 0 : clock.elapsedTime;
        const tg = target();
        const k = still ? 1 : 1 - Math.exp(-dt * 3);
        cur.x += (tg.x - cur.x) * k; cur.y += (tg.y - cur.y) * k; cur.s += (tg.s - cur.s) * k; cur.fade += (tg.fade - cur.fade) * k;
        mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 2)); mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 2));
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z, halfW = halfH * camera.aspect;
        flight.position.set(cur.x * halfW + mouse.sx * 0.18, cur.y * halfH + Math.sin(t * 1.1) * 0.08 + mouse.sy * 0.12, 0);
        flight.scale.setScalar(halfH * 0.5 * cur.s);
        flight.rotation.set(mouse.sy * -0.25 + Math.sin(t * 0.4) * 0.1, t * 0.18 + mouse.sx * 0.4, 0);
        canvas.style.opacity = String(cur.fade);

        const arr = pos.array as Float32Array, amp = 0.035 + tg.moving * 0.03;
        for (let i = 0; i < arr.length; i += 3) {
          const x = base[i], y = base[i + 1], z = base[i + 2];
          const d = 1 + amp * (Math.sin(3.1 * x + t * 1.3) + Math.sin(4.2 * y + t * 1.1 + 1.7) + Math.sin(5.3 * z + t * 0.9 + 0.6));
          arr[i] = x * d; arr[i + 1] = y * d; arr[i + 2] = z * d;
        }
        pos.needsUpdate = true; geo.computeVertexNormals();
        rings.forEach((r) => { r.m.rotation.z = t * r.sp; });
        sats.forEach((s) => {
          const a = t * s.sp + s.ph;
          s.m.position.set(Math.cos(a) * s.R, Math.sin(a) * s.R * Math.sin(s.tilt), Math.sin(a) * s.R * Math.cos(s.tilt));
        });
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
