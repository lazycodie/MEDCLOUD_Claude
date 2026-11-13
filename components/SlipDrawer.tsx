"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CENTRES, DEPT_NAME, ITEMS, PHONE, PHONE_DISPLAY, TEL, rupee } from "@/lib/data";
import { useSlip } from "./SlipProvider";

type Form = { name: string; phone: string; mode: "home" | "centre"; centre: string; address: string; date: string; slot: string; note: string };
const isoDay = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const validPhone = (p: string) => /^[6-9]\d{9}$/.test(p.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, ""));

function Requisition({ removable }: { removable?: boolean }) {
  const { slip, remove, total, hasPackage } = useSlip();
  return (
    <div className="paper">
      <div className="paper-head"><h2>Test requisition</h2><span>{slip.length} item{slip.length === 1 ? "" : "s"}</span></div>
      <ul className="sl">
        {slip.map((id) => {
          const t = ITEMS[id];
          return (
            <li key={id}>
              <div className="nm">{t.name}<small>{t.dept === "package" ? "Health package" : DEPT_NAME[t.dept]}</small></div>
              <span className="price">{t.price == null ? "On call" : rupee(t.price)}</span>
              {removable && <button className="rm" aria-label={`Remove ${t.name}`} onClick={() => remove(id)}>×</button>}
            </li>
          );
        })}
      </ul>
      <div className="total"><span>Estimated total</span><span className="price">{rupee(total)}{hasPackage ? " +" : ""}</span></div>
      <p className="fine">{hasPackage ? "Package price is added when we confirm your booking. " : ""}Pay at the centre or at collection. Prices as listed by Medcloud.</p>
    </div>
  );
}

export default function SlipDrawer() {
  const { view, preset, open, close, slip, clear, total, hasPackage, notify } = useSlip();
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [form, setForm] = useState<Form>({ name: "", phone: "", mode: "home", centre: "mandya", address: "", date: "", slot: "Morning", note: "" });
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});
  const today = isoDay(new Date());

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (view && !d.open) d.showModal();
    if (!view && d.open) d.close();
  }, [view]);
  useEffect(() => {
    if (view === "book") setForm((f) => ({ ...f, date: f.date || today, ...preset }));
  }, [view, preset, today]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: false })); // clear a field's error as soon as it is edited
  };

  function review() {
    const e = { name: !form.name.trim(), phone: !validPhone(form.phone), address: form.mode === "home" && !form.address.trim() };
    setErrors(e);
    const first = (["name", "phone", "address"] as const).find((k) => e[k]);
    if (first) { document.getElementById(`b-${first}`)?.focus(); return; }
    open("done");
  }

  const centre = CENTRES.find((c) => c.id === form.centre) ?? CENTRES[0];
  const message = (() => {
    const when = form.date ? new Date(form.date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "";
    const lines = ["Booking request — Medcloud", `Name: ${form.name.trim()}`, `Mobile: ${form.phone.trim()}`,
      form.mode === "home" ? `Home collection: ${form.address.trim()}` : `Centre visit: ${centre.name}`, `When: ${when}, ${form.slot}`];
    if (slip.length) {
      lines.push("Tests:");
      slip.forEach((id) => lines.push(`• ${ITEMS[id].name}${ITEMS[id].price != null ? " — " + rupee(ITEMS[id].price!) : " (package)"}`));
      lines.push(`Estimated total: ${rupee(total)}${hasPackage ? " + package" : ""}`);
    }
    if (form.note.trim()) lines.push(`Note: ${form.note.trim()}`);
    return lines.join("\n");
  })();

  const title = view === "book" ? "Book your tests" : view === "done" ? "Send your request" : "My tests";

  return (
    <dialog className="drawer" ref={ref} aria-labelledby="dr-title" onClose={close} onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className="dr">
        <div className="dr-head"><h2 id="dr-title">{title}</h2><button className="x" aria-label="Close" onClick={close}>×</button></div>

        {view === "slip" && (slip.length === 0 ? (
          <>
            <div className="dr-body"><div className="empty"><b>No tests added yet</b>Search the price list and tap + on the tests you need. Not sure what to pick? Book anyway and tell us what the doctor prescribed.</div></div>
            <div className="dr-foot">
              <button className="btn btn-primary btn-block" onClick={() => { close(); router.push("/tests"); }}>Browse tests</button>
              <button className="btn btn-ghost btn-block" onClick={() => open("book")}>Book without choosing tests</button>
            </div>
          </>
        ) : (
          <>
            <div className="dr-body"><Requisition removable /></div>
            <div className="dr-foot">
              <button className="btn btn-primary btn-block" onClick={() => open("book")}>Continue to booking</button>
              <button className="btn btn-ghost btn-block" onClick={clear}>Clear list</button>
            </div>
          </>
        ))}

        {view === "book" && (
          <>
            <div className="dr-body">
              <form className="book" noValidate onSubmit={(e) => { e.preventDefault(); review(); }}>
                <div className="fg">
                  <label htmlFor="b-name">Patient name</label>
                  <input className="field" id="b-name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <span className="err">Enter the patient’s name.</span>}
                </div>
                <div className="fg">
                  <label htmlFor="b-phone">Mobile number</label>
                  <input className="field" id="b-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  {errors.phone && <span className="err">Enter a 10-digit mobile number so we can call to confirm.</span>}
                </div>
                <fieldset className="fg">
                  <legend>Where should we take the sample?</legend>
                  <div className="seg">
                    <div><input type="radio" name="mode" id="m-home" checked={form.mode === "home"} onChange={() => set("mode", "home")} /><label htmlFor="m-home">At home<small>Pickup in 30 minutes</small></label></div>
                    <div><input type="radio" name="mode" id="m-centre" checked={form.mode === "centre"} onChange={() => set("mode", "centre")} /><label htmlFor="m-centre">At a centre<small>Needed for scans</small></label></div>
                  </div>
                </fieldset>
                {form.mode === "home" ? (
                  <div className="fg">
                    <label htmlFor="b-address">Home address</label>
                    <textarea className="field" id="b-address" rows={2} autoComplete="street-address" placeholder="House, street, area, town" value={form.address} onChange={(e) => set("address", e.target.value)} />
                    {errors.address && <span className="err">Enter the address for home collection.</span>}
                  </div>
                ) : (
                  <div className="fg">
                    <label htmlFor="b-centre">Centre</label>
                    <select className="field" id="b-centre" value={form.centre} onChange={(e) => set("centre", e.target.value)}>
                      {CENTRES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="two">
                  <div className="fg"><label htmlFor="b-date">Preferred date</label><input className="field" id="b-date" type="date" min={today} value={form.date} onChange={(e) => set("date", e.target.value)} /></div>
                  <div className="fg"><label htmlFor="b-slot">Time of day</label>
                    <select className="field" id="b-slot" value={form.slot} onChange={(e) => set("slot", e.target.value)}>
                      {["Morning", "Afternoon", "Evening"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="fg">
                  <label htmlFor="b-note">Anything we should know? (optional)</label>
                  <textarea className="field" id="b-note" rows={2} placeholder="Doctor’s name, tests on the prescription, fasting since…" value={form.note} onChange={(e) => set("note", e.target.value)} />
                </div>
                {slip.length ? <Requisition /> : <p className="fine" style={{ padding: 0 }}>No tests selected. Tell us the tests in the note above, or we’ll ask when we call.</p>}
              </form>
            </div>
            <div className="dr-foot">
              <button className="btn btn-primary btn-block" id="review" onClick={review}>Review request</button>
              <button className="btn btn-ghost btn-block" onClick={() => open("slip")}>{slip.length ? "Edit my tests" : "Add tests"}</button>
            </div>
          </>
        )}

        {view === "done" && (
          <>
            <div className="dr-body">
              <div className="done">
                <h3>Almost done, {form.name.trim().split(" ")[0]}</h3>
                <p>Send this request to Medcloud on WhatsApp. Our team calls you on {form.phone.trim()} to confirm the slot.</p>
                <pre id="msg">{message}</pre>
              </div>
            </div>
            <div className="dr-foot">
              <a className="btn btn-primary btn-block" href={`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener">Send on WhatsApp</a>
              <div className="two">
                <a className="btn btn-ghost" href={TEL}>Call {PHONE_DISPLAY.slice(4)}</a>
                <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(message).then(() => notify("Request copied"), () => notify("Select the text above to copy"))}>Copy request</button>
              </div>
              <button className="btn btn-ghost btn-block" onClick={() => open("book")}>Edit details</button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

export function Toast() {
  const { toast } = useSlip();
  return (
    <div className={`toast ${toast ? "on" : ""}`} role="status">
      {toast && <><span>{toast.msg}</span>{toast.action && <button onClick={toast.action.run}>{toast.action.label}</button>}</>}
    </div>
  );
}
