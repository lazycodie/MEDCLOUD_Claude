"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEPTS, PHONE_DISPLAY, SERVICES, TEL, TESTS, WHATSAPP, deptFrom, rupee } from "@/lib/data";
import { BookButton, SlipButton } from "./Buttons";

type Menu = "tests" | "services" | null;
const LINKS: { href: string; label: string; menu?: Exclude<Menu, null> }[] = [
  { href: "/tests", label: "Tests & prices", menu: "tests" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Services", menu: "services" },
  { href: "/centres", label: "Centres" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const path = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMenu(null); setMobile(false); }, [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(null); setMobile(false); } };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [mobile]);

  const active = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <>
      <div className="util"><div className="wrap">
        <span><span className="pulse" />Home sample collection in 30 minutes</span>
        <span>Call or WhatsApp <a href={TEL}>{PHONE_DISPLAY}</a></span>
      </div></div>

      <header className={`site ${scrolled ? "scrolled" : ""}`} onMouseLeave={() => setMenu(null)}>
        <div className="wrap">
          <Link className="logo" href="/" aria-label="Medcloud home"><Image src="/logo.png" alt="Medcloud" width={172} height={100} priority /></Link>
          <nav className="main" aria-label="Main">
            {LINKS.map((l) => l.menu ? (
              <div key={l.href} className="nav-item" onMouseEnter={() => setMenu(l.menu!)}>
                <Link href={l.href} className={active(l.href) ? "on" : ""} aria-haspopup="true" aria-expanded={menu === l.menu}
                  onFocus={() => setMenu(l.menu!)}>{l.label}<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></Link>
              </div>
            ) : (
              <Link key={l.href} href={l.href} className={active(l.href) ? "on" : ""} onMouseEnter={() => setMenu(null)} onFocus={() => setMenu(null)}>{l.label}</Link>
            ))}
          </nav>
          <div className="head-actions">
            <SlipButton />
            <BookButton className="btn btn-primary btn-sm book-top">Book a test</BookButton>
            <button className="burger" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} onClick={() => setMobile(!mobile)}>
              <span className={mobile ? "is-open" : ""} />
            </button>
          </div>
        </div>

        <div className={`mega ${menu ? "open" : ""}`} aria-hidden={!menu}>
          <div className="wrap">
            {menu === "tests" && (
              <div className="mega-grid">
                <div className="mega-lead">
                  <p className="eyebrow">Tests &amp; prices</p>
                  <h3>{TESTS.length} tests, every price upfront</h3>
                  <Link className="btn btn-primary btn-sm" href="/tests">Open the full price list</Link>
                </div>
                <ul className="mega-links cols-3">
                  {DEPTS.map((d) => (
                    <li key={d.slug}><Link href={`/tests/${d.slug}`} tabIndex={menu ? 0 : -1}>
                      <b>{d.name}</b><span>{TESTS.filter((t) => t.dept === d.slug).length} tests · from {rupee(deptFrom(d.slug))}</span>
                    </Link></li>
                  ))}
                </ul>
              </div>
            )}
            {menu === "services" && (
              <div className="mega-grid">
                <div className="mega-lead">
                  <p className="eyebrow">Services</p>
                  <h3>Lab, scans and specialists in one place</h3>
                  <Link className="btn btn-primary btn-sm" href="/services">All services</Link>
                </div>
                <ul className="mega-links cols-2">
                  {SERVICES.map((s) => (
                    <li key={s.slug}><Link href={`/services/${s.slug}`} tabIndex={menu ? 0 : -1}><b>{s.name}</b><span>{s.short}</span></Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="progress" aria-hidden="true" />
      </header>

      <div className={`mnav ${mobile ? "open" : ""}`} aria-hidden={!mobile}>
        <nav aria-label="Mobile">
          {LINKS.map((l, i) => (
            <div key={l.href} className="mnav-group" style={{ "--i": i } as React.CSSProperties}>
              <Link href={l.href} className={`mnav-top ${active(l.href) ? "on" : ""}`} tabIndex={mobile ? 0 : -1}>{l.label}</Link>
              {l.menu === "tests" && <div className="mnav-sub">{DEPTS.map((d) => <Link key={d.slug} href={`/tests/${d.slug}`} tabIndex={mobile ? 0 : -1}>{d.name}</Link>)}</div>}
              {l.menu === "services" && <div className="mnav-sub">{SERVICES.map((s) => <Link key={s.slug} href={`/services/${s.slug}`} tabIndex={mobile ? 0 : -1}>{s.name}</Link>)}</div>}
            </div>
          ))}
        </nav>
        <div className="mnav-foot">
          <a className="btn btn-ghost" href={TEL}>Call {PHONE_DISPLAY}</a>
          <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener">WhatsApp us</a>
        </div>
      </div>
    </>
  );
}
