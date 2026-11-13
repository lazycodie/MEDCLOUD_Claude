import Image from "next/image";
import Link from "next/link";
import { CENTRES, DEPTS, PHONE_DISPLAY, SERVICES, TEL, WHATSAPP } from "@/lib/data";
import { BookButton, SlipButton } from "./Buttons";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <span className="flogo"><Image src="/logo-light.png" alt="Medcloud" width={172} height={100} /></span>
          <p>Advanced radiology and pathology, with state of the art facilities, in Mandya, Malavalli, Kunigal and Ramanagara.</p>
          <p className="fcall"><a href={TEL}>{PHONE_DISPLAY}</a></p>
        </div>
        <div><h4>Tests</h4><ul>{DEPTS.map((d) => <li key={d.slug}><Link href={`/tests/${d.slug}`}>{d.name}</Link></li>)}</ul></div>
        <div><h4>Services</h4><ul>
          {SERVICES.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.name}</Link></li>)}
          <li><Link href="/packages">Health packages</Link></li>
        </ul></div>
        <div><h4>Medcloud</h4><ul>
          <li><Link href="/about">About us</Link></li>
          <li><Link href="/centres">Centres: {CENTRES.map((c) => c.name).join(", ")}</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><a href="mailto:hello@medcloudlabs.com">hello@medcloudlabs.com</a></li>
          <li><a href={WHATSAPP} target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="https://medcloudlabs.com/privacy-policy/">Privacy policy</a></li>
        </ul></div>
      </div>
      <div className="wordmark" aria-hidden="true"><span>MEDCLOUD</span></div>
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
