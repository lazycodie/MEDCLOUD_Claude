"use client";

import { ITEMS } from "@/lib/data";
import { useSlip, type BookingPreset } from "./SlipProvider";

/** Round +/✓ toggle used in every price row. */
export function AddButton({ id }: { id: string }) {
  const { has, toggle } = useSlip();
  const on = has(id);
  return (
    <button className="add" aria-pressed={on} aria-label={`${on ? "Remove" : "Add"} ${ITEMS[id].name}`} onClick={() => toggle(id)}>
      {on ? "✓" : "+"}
    </button>
  );
}

export function AddPackageButton({ id, primary }: { id: string; primary?: boolean }) {
  const { has, toggle } = useSlip();
  const on = has(id);
  return (
    <button className={`btn ${primary ? "btn-primary" : "btn-ghost"} btn-block`} style={{ marginTop: "auto" }} aria-pressed={on} onClick={() => toggle(id)}>
      {on ? "✓ Added to my tests" : "Add package to my tests"}
    </button>
  );
}

export function BookButton({ children, className = "btn btn-primary", preset }: { children: React.ReactNode; className?: string; preset?: BookingPreset }) {
  const { open } = useSlip();
  return <button className={className} onClick={() => open("book", preset)}>{children}</button>;
}

export function SlipButton({ className = "btn btn-ghost btn-sm slip-btn" }: { className?: string }) {
  const { open, slip } = useSlip();
  return (
    <button className={className} onClick={() => open("slip")}>
      My tests <span className="count" data-n={slip.length}>{slip.length}</span>
    </button>
  );
}

/** Adds the test (if it is not in the list yet) and opens the booking form. */
export function BookTestButton({ id, children, className = "btn btn-primary" }: { id: string; children: React.ReactNode; className?: string }) {
  const { has, toggle, open } = useSlip();
  return <button className={className} onClick={() => { if (!has(id)) toggle(id); open("book", ITEMS[id].dept === "radiology" ? { mode: "centre" } : {}); }}>{children}</button>;
}
