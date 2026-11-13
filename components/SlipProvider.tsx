"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ITEMS } from "@/lib/data";

export type DrawerView = "slip" | "book" | "done";
export type BookingPreset = { mode?: "home" | "centre"; centre?: string };
type Toast = { msg: string; action?: { label: string; run: () => void } };

type Ctx = {
  slip: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  hasPackage: boolean;
  view: DrawerView | null;
  preset: BookingPreset;
  open: (view: DrawerView, preset?: BookingPreset) => void;
  close: () => void;
  toast: Toast | null;
  notify: (msg: string, action?: Toast["action"]) => void;
};

const SlipContext = createContext<Ctx | null>(null);
const KEY = "mc-slip";

export function SlipProvider({ children }: { children: React.ReactNode }) {
  const [slip, setSlip] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<DrawerView | null>(null);
  const [preset, setPreset] = useState<BookingPreset>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setSlip(saved.filter((id) => ITEMS[id]));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(slip)); } catch {}
  }, [slip, loaded]);

  const notify = useCallback((msg: string, action?: Toast["action"]) => {
    setToast({ msg, action });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const open = useCallback((v: DrawerView, p: BookingPreset = {}) => { setPreset(p); setView(v); }, []);
  const close = useCallback(() => setView(null), []);

  const toggle = useCallback((id: string) => {
    const name = ITEMS[id].name;
    if (slip.includes(id)) {
      setSlip(slip.filter((x) => x !== id));
      notify(`Removed ${name}`);
    } else {
      setSlip([...slip, id]);
      notify(`Added ${name}`, { label: "View my tests", run: () => open("slip") });
    }
  }, [slip, notify, open]);

  const remove = useCallback((id: string) => setSlip((s) => s.filter((x) => x !== id)), []);
  const clear = useCallback(() => {
    const old = slip;
    setSlip([]);
    notify("List cleared", { label: "Undo", run: () => setSlip(old) });
  }, [slip, notify]);

  const value = useMemo<Ctx>(() => ({
    slip,
    has: (id) => slip.includes(id),
    toggle, remove, clear,
    total: slip.reduce((s, id) => s + (ITEMS[id].price ?? 0), 0),
    hasPackage: slip.some((id) => ITEMS[id].price == null),
    view, preset, open, close, toast, notify,
  }), [slip, toggle, remove, clear, view, preset, open, close, toast, notify]);

  return <SlipContext.Provider value={value}>{children}</SlipContext.Provider>;
}

export function useSlip() {
  const ctx = useContext(SlipContext);
  if (!ctx) throw new Error("useSlip must be used inside <SlipProvider>");
  return ctx;
}
