"use client";

import { useState } from "react";
import { CENTRES, PHONE, PHONE_DISPLAY } from "@/lib/data";

const TYPES = ["Home sample collection", "Book a scan", "Book a lab test", "Health package", "Specialist consultation", "Something else"];

/** With no backend, the message is handed to WhatsApp. The form says so and shows what happens next. */
export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", type: TYPES[0], centre: "", message: "" });
  const [err, setErr] = useState<{ name?: boolean; phone?: boolean }>({});
  const [step, setStep] = useState<"form" | "ready" | "sent">("form");
  const set = (k: keyof typeof f, v: string) => { setF((x) => ({ ...x, [k]: v })); setErr((e) => ({ ...e, [k]: false })); setStep("form"); };

  const lines = ["Message for Medcloud", `Name: ${f.name.trim()}`, `Phone: ${f.phone.trim()}`, `About: ${f.type}`];
  if (f.centre) lines.push(`Nearest centre: ${f.centre}`);
  if (f.message.trim()) lines.push(f.message.trim());
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const bad = { name: !f.name.trim(), phone: !/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "")) };
    setErr(bad);
    if (bad.name) return document.getElementById("c-name")?.focus();
    if (bad.phone) return document.getElementById("c-phone")?.focus();
    setStep("ready");
  }

  if (step === "sent") {
    return (
      <div className="sent big" role="status">
        <h3>Request sent</h3>
        <p>Your message is with Medcloud on WhatsApp. Our team will call {f.phone.trim()} to follow up. If WhatsApp did not open, call {PHONE_DISPLAY}.</p>
        <button className="btn btn-ghost" onClick={() => setStep("form")}>Send another message</button>
      </div>
    );
  }
  return (
    <form className="book contact-form" noValidate onSubmit={submit}>
      <div className="fg"><label htmlFor="c-type">What do you need?</label>
        <select className="field" id="c-type" value={f.type} onChange={(e) => set("type", e.target.value)}>{TYPES.map((x) => <option key={x}>{x}</option>)}</select></div>
      <div className="two">
        <div className="fg"><label htmlFor="c-name">Your name</label><input className="field" id="c-name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />{err.name && <span className="err">Enter your name.</span>}</div>
        <div className="fg"><label htmlFor="c-phone">Mobile number</label><input className="field" id="c-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />{err.phone && <span className="err">Enter a 10-digit mobile number so we can call you back.</span>}</div>
      </div>
      <div className="fg"><label htmlFor="c-centre">Nearest centre (optional)</label>
        <select className="field" id="c-centre" value={f.centre} onChange={(e) => set("centre", e.target.value)}><option value="">Not sure</option>{CENTRES.map((c) => <option key={c.id}>{c.name}</option>)}</select></div>
      <div className="fg"><label htmlFor="c-message">Your message (optional)</label><textarea className="field" id="c-message" rows={3} value={f.message} onChange={(e) => set("message", e.target.value)} /></div>
      {step === "ready" ? (
        <div className="sent"><p><b>Your message is ready.</b> Tap below to open WhatsApp and press send. Our team calls you back.</p>
          <a className="btn btn-primary btn-block" href={href} target="_blank" rel="noopener" onClick={() => setTimeout(() => setStep("sent"), 600)}>Open WhatsApp and send</a></div>
      ) : (
        <button className="btn btn-primary btn-block" type="submit">Continue</button>
      )}
      <p className="privacy-note">This site does not store your details. They go to Medcloud only in the WhatsApp message you send.</p>
    </form>
  );
}
