import Image from "next/image";
import Link from "next/link";
import { DEPTS, PHONE_DISPLAY, TEL, WHATSAPP } from "@/lib/data";
import { BookButton, SlipButton } from "./Buttons";

const NAV = [["/tests", "Tests & prices"], ["/packages", "Packages"], ["/services", "Services"], ["/centres", "Centres"], ["/about", "About"]];

export function Header() {
  return (
    <>
      <div className="util"><div className="wrap">
        <span><span className="pulse" />Home sample collection in 30 minutes</span>
        <span>Call or WhatsApp <a href={TEL}>{PHONE_DISPLAY}</a></span>
      </div></div>
      <header className="site"><div className="wrap">
        <Link className="logo" href="/" aria-label="Medcloud home"><Image src="/logo.png" alt="Medcloud" width={172} height={100} priority /></Link>
        <nav className="main" aria-label="Main">{NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="head-actions">
          <SlipButton />
          <BookButton className="btn btn-primary btn-sm book-top">Book a test</BookButton>
        </div>
      </div></header>
    </>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div><span className="flogo"><Image src="/logo.png" alt="Medcloud" width={172} height={100} /></span><p>Advanced radiology and pathology, with state of the art facilities, in Mandya, Malavalli, Kunigal and Ramanagara.</p></div>
        <div><h4>Tests</h4><ul>{DEPTS.map((d) => <li key={d.slug}><Link href={`/tests/${d.slug}`}>{d.name}</Link></li>)}</ul></div>
        <div><h4>Medcloud</h4><ul>{NAV.slice(1).map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}<li><a href="https://medcloudlabs.com/privacy-policy/">Privacy policy</a></li></ul></div>
        <div><h4>Contact</h4><ul>
          <li><a href={TEL}>{PHONE_DISPLAY}</a></li>
          <li><a href="mailto:hello@medcloudlabs.com">hello@medcloudlabs.com</a></li>
          <li><a href="mailto:marketing@medcloudlabs.com">marketing@medcloudlabs.com</a></li>
          <li><a href={WHATSAPP} target="_blank" rel="noopener">WhatsApp</a></li>
        </ul></div>
      </div>
      <div className="legal"><div className="wrap"><span>© {new Date().getFullYear()} Medcloud</span><span>Redesign concept. Prices as listed on medcloudlabs.com; confirm at booking.</span></div></div>
    </footer>
  );
}

export function MobileBar() {
  return (
    <div className="mbar">
      <a className="btn btn-ghost" href={TEL}>Call</a>
      <SlipButton className="btn btn-ghost" />
      <BookButton>Book</BookButton>
    </div>
  );
}
