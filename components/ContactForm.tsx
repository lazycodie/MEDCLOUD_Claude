"use client";

import { useState } from "react";
import { PHONE } from "@/lib/data";

/** Same fields as the current site's form. With no backend, the message is handed to WhatsApp. */
export default function ContactForm() {
  const [f, setF] = useState({ name: "", subject: "", phone: "", message: "" });
  const [err, setErr] = useState<{ name?: boolean; phone?: boolean }>({});
  const [sent, setSent] = useState<string | null>(null);
  const set = (k: keyof typeof f, v: string) => { setF((x) => ({ ...x, [k]: v })); setErr((e) => ({ ...e, [k]: false })); setSent(null); };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const bad = { name: !f.name.trim(), phone: !/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "")) };
    setErr(bad);
    if (bad.name) return document.getElementById("c-name")?.focus();
    if (bad.phone) return document.getElementById("c-phone")?.focus();
    const lines = ["Message for Medcloud", `Name: ${f.name.trim()}`, `Phone: ${f.phone.trim()}`];
    if (f.subject.trim()) lines.push(`Subject: ${f.subject.trim()}`);
    if (f.message.trim()) lines.push(f.message.trim());
    setSent(`https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join("\n"))}`);
  }

  return (
    <form className="book contact-form" noValidate onSubmit={submit}>
      <div className="fg"><label htmlFor="c-name">Your name</label><input className="field" id="c-name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />{err.name && <span className="err">Enter your name.</span>}</div>
      <div className="fg"><label htmlFor="c-phone">Phone number</label><input className="field" id="c-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />{err.phone && <span className="err">Enter a 10-digit mobile number so we can call you back.</span>}</div>
      <div className="fg"><label htmlFor="c-subject">Subject</label><input className="field" id="c-subject" placeholder="Home collection, a scan, a report…" value={f.subject} onChange={(e) => set("subject", e.target.value)} /></div>
      <div className="fg"><label htmlFor="c-message">Your message (optional)</label><textarea className="field" id="c-message" rows={4} value={f.message} onChange={(e) => set("message", e.target.value)} /></div>
      {sent ? (
        <div className="sent"><p><b>Your message is ready.</b> Send it to Medcloud on WhatsApp and we’ll call you back.</p><a className="btn btn-primary btn-block" href={sent} target="_blank" rel="noopener">Send on WhatsApp</a></div>
      ) : (
        <button className="btn btn-primary btn-block" type="submit">Prepare message</button>
      )}
    </form>
  );
}
