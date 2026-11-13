import raw from "@/data/tests.json";

export const PHONE = "918150815026";
export const PHONE_DISPLAY = "+91 81508 15026";
export const TEL = `tel:+${PHONE}`;
export const WHATSAPP = `https://wa.me/${PHONE}`;

export type Dept =
  | "haematology" | "biochemistry" | "serology" | "hormone-assays" | "clinical-pathology"
  | "microbiology" | "histopathology" | "cytology" | "radiology";

export const DEPTS: { slug: Dept; name: string; blurb: string }[] = [
  { slug: "haematology", name: "Haematology", blurb: "Cell counts and cell morphology to diagnose blood disorders, from simple infections to cancers." },
  { slug: "biochemistry", name: "Biochemistry", blurb: "Biochemical analysis of sugar, lipids, liver, kidney, vitamins and cardiac markers." },
  { slug: "serology", name: "Serology", blurb: "Antibody and antigen tests for infections such as dengue, hepatitis, HIV and typhoid." },
  { slug: "hormone-assays", name: "Hormone Assays", blurb: "Thyroid, fertility and other hormone levels, plus tumour markers." },
  { slug: "clinical-pathology", name: "Clinical Pathology", blurb: "Urine, stool and body-fluid analysis." },
  { slug: "microbiology", name: "Microbiology", blurb: "Cultures, sensitivity testing and stains to identify infections." },
  { slug: "histopathology", name: "Histopathology", blurb: "Biopsy specimens examined under the microscope." },
  { slug: "cytology", name: "Cytology", blurb: "Pap smears and fluid cytology." },
  { slug: "radiology", name: "Radiology", blurb: "CT, ultrasound, X-ray, mammography and cardiac imaging, read by experienced radiologists." },
];
export const DEPT_NAME = Object.fromEntries(DEPTS.map((d) => [d.slug, d.name])) as Record<Dept, string>;

export type Modality = "CT" | "Ultrasound" | "X-Ray" | "Mammography" | "Other";
export const MODALITIES: Modality[] = ["CT", "Ultrasound", "X-Ray", "Mammography", "Other"];

export type Item = {
  id: string;
  name: string;
  price: number | null; // null = package, priced on call
  dept: Dept | "package";
  mod: Modality | null;
  key: string;
};

const ACR = new Set(
  "ct hrct usg mri pns kub ecg esr aptt aec amh cbc cbp mch mchc mcv pcv rbc tc dc hb bt pt ige prp hcg tsh ft3 ft4 tf4 lh fsh cea tpha hiv hcv hbv dna vdrl crp afb csf fnac dct ict fus rus upt ppd abg alp bun ggt gh ldh lpt lft rft ogct ogtt ppbs rbs fbs ra tibc psa afp ana bnp ckmb hdl ldl vldl sgpt sgot alt ast ccp igg igm ns1ag hbsag hbeag hbc hav hev cmia elisa tvs bpp nt ivp hsg rgu 3d 2d ot g6pd e2 hco3 iii mp".split(" ")
);
/** The source site title-cases everything ("Ct Brain"); restore medical acronyms. */
const pretty = (s: string) =>
  s.replace(/[A-Za-z0-9]+/g, (w) => (ACR.has(w.toLowerCase()) ? w.toUpperCase() : w)).replace(/hba1c/gi, "HbA1c").replace(/\s+/g, " ").trim();

function modality(n: string): Modality {
  n = n.toLowerCase();
  if (/x[- ]?ray/.test(n)) return "X-Ray";
  if (/mammo/.test(n) && !/sono/.test(n)) return "Mammography";
  if (/\bct\b|hrct|h r c t/.test(n)) return "CT";
  if (/usg|ultrasound|obstetric|tiffa|doppler|echo|sono|scan|fetal|\bnt\b/.test(n)) return "Ultrasound";
  return "Other";
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const TESTS: Item[] = (raw as [string, number, Dept][]).map(([n, p, d]) => ({
  id: `${d}/${slug(n)}`,
  name: pretty(n),
  price: p,
  dept: d,
  mod: d === "radiology" ? modality(n) : null,
  key: n.toLowerCase(),
}));

export type Tube = "edta" | "cit" | "flu" | "ser" | "uri";
export const TUBES: Record<Tube, { color: string; label: string }> = {
  edta: { color: "#a98bd6", label: "EDTA tube" },
  cit: { color: "#2a2a2a", label: "Citrate tube" },
  flu: { color: "#9aa3ad", label: "Fluoride tube" },
  ser: { color: "#e0b23c", label: "Serum tube" },
  uri: { color: "#f3e36b", label: "Urine container" },
};
export type Pack = { id: string; name: string; forWho: string; feature?: boolean; tags: string[]; items: { name: string; tube?: Tube }[] };
const plain = (xs: string[]) => xs.map((name) => ({ name }));
export const PACKS: Pack[] = [
  {
    id: "package/annual-health-checkup", name: "Annual Health Checkup", feature: true, tags: ["10 tests", "Blood + urine"],
    forWho: "A yearly baseline for blood, sugar, liver, kidney and cholesterol.",
    items: [
      { name: "Complete Blood Picture (CBP)", tube: "edta" }, { name: "Erythrocyte Sedimentation Rate (ESR)", tube: "cit" },
      { name: "Glucose Fasting (FBS)", tube: "flu" }, { name: "Cholesterol Total", tube: "ser" }, { name: "Triglycerides", tube: "ser" },
      { name: "Creatinine", tube: "ser" }, { name: "Aspartate Aminotransferase (AST/SGOT)", tube: "ser" },
      { name: "Alanine Aminotransferase (ALT/SGPT)", tube: "ser" }, { name: "Bilirubin Total", tube: "ser" },
      { name: "Complete Urine Examination (CUE)", tube: "uri" },
    ],
  },
  {
    id: "package/essential-package", name: "Essential Package", tags: ["11 lab tests", "3 scans"],
    forWho: "A fuller review that adds thyroid, HbA1c, ECG, ultrasound and a chest X-ray.",
    items: plain(["Complete Blood Count (CBC)", "ESR", "Fasting Blood Sugar (FBS)", "Post Prandial Blood Sugar (PPBS)", "HbA1c (Glycosylated Haemoglobin)", "Lipid Profile Test (LPT)", "Liver Function Test (LFT)", "Serum Creatinine", "Blood Urea", "TSH", "Complete Urine Analysis", "ECG", "USG Abdomen Pelvis", "X-Ray Chest"]),
  },
  {
    id: "package/major-surgical-profile", name: "Major Surgical Profile", tags: ["13 lab tests", "2 scans"],
    forWho: "The work-up surgeons ask for before an operation: clotting, blood group, infection screen.",
    items: plain(["Complete Blood Count (CBC)", "ESR", "Blood Group & Rh Type", "Prothrombin Time (PT)", "Active Partial Thromboplastin Time (APTT)", "Random Blood Sugar (RBS)", "Blood Urea", "Serum Creatinine", "Serum Electrolytes", "Complete Urine Analysis", "HIV 1 & 2", "HCV (Card Test)", "Hepatitis B Surface Antigen (HBsAg) (Card)", "X-Ray Chest", "ECG"]),
  },
];

export const ITEMS: Record<string, Item> = Object.fromEntries([
  ...TESTS.map((t) => [t.id, t] as const),
  ...PACKS.map((p) => [p.id, { id: p.id, name: p.name, price: null, dept: "package", mod: null, key: p.name.toLowerCase() } as Item] as const),
]);

const POPULAR_KEYS = ["haemoglobin (hb)", "complete blood count(cbc)", "fasting blood sugar (fbs)", "serum creatinine", "complete urine analysis", "platelet count", "thyroid profile - (ft3, ft4,tsh)", "lipid profile test (lpt)"];
export const POPULAR = POPULAR_KEYS.map((k) => TESTS.find((t) => t.key === k)).filter((t): t is Item => !!t);

export const CONCERNS: Record<string, RegExp> = {
  Diabetes: /sugar|hba1c|glucose|insulin/i,
  Thyroid: /tsh|ft3|ft4|thyro|\bt4\b/i,
  Fever: /dengue|malaria|widal|c-reactive|weil|chikungunya|leptospira/i,
  Heart: /troponin|lipid|cholesterol|echo|ecg|cardiac|ckmb|bnp/i,
  Liver: /liver|sgot|sgpt|bilirubin|ggt|alkaline|albumin/i,
  Kidney: /renal|creatinine|urea|kub|electrolytes|microalbumin/i,
  Pregnancy: /hcg|obstetric|tiffa|pregnancy|\bnt scan|fetal|double marker|quadruple/i,
  Vitamins: /vitamin|folic|ferritin|iron/i,
};

/* ---------- centres ----------
   Coordinates are [latitude, longitude] here; the map converts to GeoJSON's [lng, lat].
   `approx: true` means the pin is a nearby landmark, not the surveyed building. */
export type Centre = {
  id: string; name: string; address: string; map: string; main?: boolean;
  lat: number; lng: number; approx?: boolean; approxNote?: string;
};
export const CENTRES: Centre[] = [
  {
    id: "mandya", name: "Mandya", main: true, lat: 12.5231435, lng: 76.8977764,
    address: "GVFX+743 Medcloud building, Double Concrete Road, Ashok Nagar, Mandya, Karnataka 571401",
    map: "https://maps.app.goo.gl/pLwQ45ocVc3Sce5n9",
  },
  {
    id: "malavalli", name: "Malavalli", lat: 12.38487, lng: 77.05986, approx: true,
    approxNote: "Pin shows the Government Hospital opposite the centre. The exact building is not yet verified.",
    address: "Ground Floor, Kullegowda Complex, opposite Government Hospital, Malavalli, Karnataka 571430",
    map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Medcloud, Kullegowda Complex, opposite Government Hospital, Malavalli, Karnataka 571430"),
  },
  {
    id: "kunigal", name: "Kunigal", lat: 13.0229375, lng: 77.0193125,
    address: "22F9+5PQ, Kunigal Town Road, Kunigal, Karnataka 572130",
    map: "https://maps.app.goo.gl/PZEDwXdFaVNKTdX2A",
  },
  {
    // TODO(verify): confirm the facility name on this directions listing before launch.
    id: "ramanagara", name: "Ramanagara", lat: 12.7289423, lng: 77.2753684,
    address: "Bangalore–Mysore Road, Rayaradoddi, Karnataka 562159",
    map: "https://maps.app.goo.gl/w22putqujDA3DPGLA",
  },
];
/** Shown on the map for orientation only. These are not Medcloud centres. */
export const REFERENCE_CITIES = [
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Mysuru", lat: 12.2958, lng: 76.6394 },
];

export const rupee = (n: number) => "₹" + n.toLocaleString("en-IN");

export function searchTests(query: string, pool: Item[] = TESTS): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  const wordStart = new RegExp("\\b" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return pool
    .map((t) => {
      const hay = `${t.key} ${t.dept !== "package" ? DEPT_NAME[t.dept].toLowerCase() : ""} ${(t.mod ?? "").toLowerCase()}`;
      if (!words.every((w) => hay.includes(w))) return null;
      const rank = t.key.startsWith(q) ? 0 : wordStart.test(t.key) ? 1 : 2;
      return { t, s: rank + t.key.length / 1000 };
    })
    .filter((x): x is { t: Item; s: number } => !!x)
    .sort((a, b) => a.s - b.s)
    .map((x) => x.t);
}

/* ---------- lookups ---------- */
export const testHref = (t: Item) => `/tests/${t.id}`;
export const deptTests = (d: Dept) => TESTS.filter((t) => t.dept === d);
export const deptFrom = (d: Dept) => Math.min(...deptTests(d).map((t) => t.price!));
/** "Complete Blood Count(Cbc)" and "Complete Blood Count" are the same test listed twice on the source site. */
export const nameKey = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
export function relatedTests(t: Item, n = 6): Item[] {
  const first = t.key.split(/[^a-z0-9]+/).filter((w) => w.length > 2)[0];
  const seen = new Set([nameKey(t.key)]);
  const same = TESTS.filter((x) => {
    if (x.dept !== t.dept || x.id === t.id) return false;
    const k = nameKey(x.key);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const score = (x: Item) => (first && x.key.includes(first) ? 0 : 1) + (x.mod === t.mod ? 0 : 1);
  return [...same].sort((a, b) => score(a) - score(b) || Math.abs(a.price! - t.price!) - Math.abs(b.price! - t.price!)).slice(0, n);
}

/* ---------- per-test facts ----------
   Written from general medical knowledge and the test's own name. Medcloud's clinical team
   should review every line before launch; nothing here is lab-supplied. */
const ABOUT: Record<string, string> = {
  "haemoglobin": "Measures haemoglobin, the protein in red blood cells that carries oxygen. It is the usual check for anaemia.",
  "haemglobin": "Measures haemoglobin, the protein in red blood cells that carries oxygen. It is the usual check for anaemia.",
  "complete blood count": "Counts red cells, white cells and platelets and measures haemoglobin. A broad first check for anaemia, infection and other blood conditions.",
  "complete haemogram": "A complete blood count with additional red-cell measurements, used to look into anaemia, infection and other blood conditions.",
  "platelet count": "Measures the number of platelets in a small sample of blood. Platelets help blood to clot, so abnormal counts can point to bleeding or clotting disorders.",
  "differential count": "Shows the share of each type of white blood cell, which helps indicate the kind of infection or inflammation present.",
  "esr": "Measures how quickly red blood cells settle in a tube. It is a general marker of inflammation.",
  "fasting blood sugar": "Measures blood glucose after an overnight fast. Used to screen for and monitor diabetes.",
  "post prandial blood sugar": "Measures blood glucose about two hours after a meal. Used with the fasting test to monitor diabetes.",
  "random blood sugar": "Measures blood glucose at any time of day, without fasting.",
  "hba1c": "Reflects average blood glucose over roughly the past two to three months. Used to diagnose and monitor diabetes.",
  "serum creatinine": "Measures creatinine, a waste product filtered by the kidneys. Used to assess kidney function.",
  "blood urea": "Measures urea, a waste product cleared by the kidneys. Used with creatinine to assess kidney function.",
  "renal function test": "A group of blood tests that together assess how well the kidneys are working.",
  "liver function test": "A group of blood tests, including bilirubin, liver enzymes and proteins, that assess how the liver is working.",
  "lipid profile test": "Measures total cholesterol, HDL, LDL and triglycerides to assess the risk of heart disease.",
  "total cholesterol": "Measures the total amount of cholesterol in the blood.",
  "triglycerides": "Measures triglycerides, a type of fat in the blood linked to heart-disease risk.",
  "tsh": "Measures thyroid stimulating hormone. It is the usual first test of thyroid function.",
  "thyroid profile": "Measures free T3, free T4 and TSH together to assess thyroid function.",
  "ft3 tf4 tsh": "Measures free T3, free T4 and TSH together to assess thyroid function.",
  "complete urine analysis": "Examines urine for sugar, protein, cells and other substances. Used to check for urinary infection, kidney problems and diabetes.",
  "serum uric acid": "Measures uric acid in the blood. Raised levels are linked to gout.",
  "vitamin b 12": "Measures the level of vitamin B12 in the blood.",
  "vitamin d": "Measures 25-hydroxy vitamin D, the standard marker of vitamin D status.",
  "blood group rh type": "Identifies your ABO blood group and Rh type.",
  "widal": "A blood test used in the evaluation of typhoid fever.",
  "dengue ns1 antigen rapid method": "Detects the dengue NS1 antigen, which can be found early in a dengue infection.",
  "c reactive protein": "Measures CRP, a protein that rises with inflammation or infection.",
  "hiv 1 2": "Screens for antibodies to HIV 1 and HIV 2.",
  "ecg": "Records the electrical activity of the heart.",
  "ct brain": "A CT scan that produces cross-sectional images of the brain.",
  "h r c t chest": "A high-resolution CT scan that shows fine detail of the lungs.",
  "mammogram": "X-ray imaging of the breast, used for screening and diagnosis.",
};

export type TestInfo = {
  abbr: string | null; about: string | null; sample: string; prep: string; home: boolean; where: string;
  packages: Pack[];
};
export function testInfo(t: Item): TestInfo {
  const k = t.key, nk = nameKey(k);
  const abbrM = t.name.match(/\(([A-Za-z0-9 ,/&+\-]{2,14})\)\s*$/);
  const scan = t.dept === "radiology";
  let sample = "Blood sample", home = true;
  if (scan) { sample = "No sample needed"; home = false; }
  else if (/tuberculin|skin test/.test(k)) { sample = "Skin test"; home = false; }
  else if (/biopsy|fnac|pap smear|aspiration|prp/.test(k) || t.dept === "histopathology") { sample = "Tissue or cell specimen, collected by a doctor"; home = false; }
  else if (/csf|ascitic|pleural|fluid/.test(k)) { sample = "Body fluid, collected by a doctor"; home = false; }
  else if (/urine|upt/.test(k)) sample = "Urine sample";
  else if (/stool/.test(k)) sample = "Stool sample";
  else if (/sputum/.test(k)) sample = "Sputum sample";
  else if (/semen/.test(k)) { sample = "Semen sample"; home = false; }
  else if (/swab|pus/.test(k)) { sample = "Swab or pus sample"; home = false; }
  const prep = /fasting/.test(k) ? "Fasting needed. Our team confirms the number of hours when you book."
    : /post prandial/.test(k) ? "Taken about two hours after a meal."
    : scan ? "Preparation depends on the scan. Our team tells you what to do when you book."
    : "No special preparation is listed. Our team confirms when you book.";
  return {
    abbr: abbrM ? abbrM[1] : null,
    about: ABOUT[nk] ?? null,
    sample, prep, home,
    where: scan ? "At a Medcloud centre. Call to check which centre offers this scan." : home ? "At home, or at any Medcloud centre." : "At a Medcloud centre.",
    packages: PACKS.filter((p) => p.items.some((it) => PACK_ALIAS(it.name) === PACK_ALIAS(t.name))),
  };
}
const ALIAS: Record<string, string> = { "complete blood picture": "complete blood count", "glucose fasting": "fasting blood sugar", "erythrocyte sedimentation rate": "esr", "creatinine": "serum creatinine", "complete urine examination": "complete urine analysis", "cholesterol total": "total cholesterol", "x ray chest": "x ray chest pa", "bilirubin total": "serum bilirubin", "aspartate aminotransferase": "asparate aminotransferase" };
export function PACK_ALIAS(name: string) { const k = nameKey(name); return ALIAS[k] ?? k; }
/** Packages in the list that already include this test. */
export const coveredBy = (id: string, slip: string[]) => {
  const t = ITEMS[id];
  if (!t || t.dept === "package") return null;
  const p = PACKS.find((p) => slip.includes(p.id) && p.items.some((it) => PACK_ALIAS(it.name) === PACK_ALIAS(t.name)));
  return p ?? null;
};

/* ---------- services (copy from medcloudlabs.com) ---------- */
export type Service = {
  slug: string; name: string; short: string; intro: string[]; pills: string[];
  parts: { title: string; body: string }[]; dept?: Dept; cta: string;
};
export const SERVICES: Service[] = [
  {
    slug: "home-collection", name: "Home sample collection", cta: "Request home collection",
    short: "Call us and we collect your sample at home in 30 minutes.",
    intro: ["Home collection in 30 minutes. Call us now, or send your test list on WhatsApp, and skip the trip to the centre.", "The 30-minute pickup depends on your area and the time of day. Our team confirms the collection time when they call you back. Scans and some specimens are taken at a centre."],
    pills: ["30-minute pickup", "Blood & urine samples", "Call or WhatsApp"],
    parts: [
      { title: "Tell us the tests", body: "Add tests from the price list or read out your prescription on a call to +91 81508 15026." },
      { title: "We come to you", body: "Share your address and a time of day. Our team calls back to confirm the pickup." },
      { title: "Sample goes to the lab", body: "Your sample is processed at a Medcloud lab with the same equipment and quality control as a centre visit." },
    ],
  },
  {
    slug: "diagnostic", name: "Diagnostic lab", dept: "haematology", cta: "Book a lab test",
    short: "Routine blood counts to cancer markers and hormone assays, with stringent quality control.",
    intro: [
      "At Medcloud we take pride in delivering high-quality services focused on preventing and accurately detecting diseases. Our commitment to excellence is reflected in the utilization of cutting-edge technology, advanced equipment, and stringent quality control measures.",
      "Within our facilities, patients have access to a comprehensive range of services, spanning from routine Complete Blood Count (CBP) and Blood Glucose tests to specialized examinations for infectious diseases, cancer markers, hormonal assays, and more.",
    ],
    pills: ["Haematology", "Biochemistry", "Serology", "Microbiology", "Histopathology"],
    parts: [
      { title: "Platelet count", body: "Platelet count is a crucial component of a complete blood count (CBC) test, measuring the number of platelets in a small sample of blood. Abnormal platelet counts can indicate potential bleeding or clotting disorders, making it a valuable diagnostic tool in assessing overall health." },
      { title: "Blood test", body: "A blood test analyzes a sample of blood to assess various aspects of health, including red and white blood cell counts, platelet levels, and biochemical markers. Blood tests are essential for detecting and monitoring medical conditions." },
      { title: "Urine test", body: "A urine test analyzes a sample of urine to assess the health of the urinary system and overall well-being. It detects substances like proteins, glucose, and red or white blood cells, providing insights into kidney function, diabetes, and potential infections." },
    ],
  },
  {
    slug: "imaging-centres", name: "Imaging centres", dept: "radiology", cta: "Book a scan",
    short: "3T MRI, MDCT and ultrasound, read by highly qualified and experienced radiologists.",
    intro: [
      "Dependable radiology services are crucial for ensuring precise diagnoses. With our facility, you can trust in the utilization of state-of-the-art technology, including 3T MRI, ultrasound, and MDCT, coupled with oversight from a team of highly qualified and experienced Radiologists.",
      "Advanced imaging technology combined with experienced radiologists supports reliable diagnostic assessment. Medcloud runs the first fetal imaging center in Mandya to conduct fetal interventions.",
    ],
    pills: ["3T MRI", "CT scan", "Ultrasound", "X-Ray", "Fetal imaging"],
    parts: [
      { title: "MRI (3T)", body: "Medcloud offers 3T MRI. Studies listed include MRI brain, dorsal and lumbar spine, knee, foot and a stroke protocol. Call us for MRI prices, preparation and the centre that offers your scan." },
      { title: "CT scan", body: "Our CT scan services utilize cutting-edge technology to produce detailed cross-sectional images of the body, aiding in the accurate diagnosis of various medical conditions. Swift and precise imaging lets our experienced radiologists provide valuable insights into your health." },
      { title: "X-Ray", body: "Our advanced imaging technology captures detailed images of internal structures, aiding in the prompt detection and evaluation of various health conditions. Led by skilled radiologists, our X-ray services provide a foundation for precise medical assessments." },
      { title: "Ultrasound", body: "Utilizing high-frequency sound waves, we create detailed images of internal structures, offering valuable insights for diagnostic purposes. Ultrasound is a reliable and non-invasive tool for assessing various medical conditions." },
    ],
  },
  {
    slug: "specialist-consultation", name: "Specialist consultation", cta: "Book a consultation",
    short: "Visiting specialists in ultrasound, radiology and fetal intervention.",
    intro: [
      "Our Specialist Consultation services bring together a team of expert professionals dedicated to providing specialized care in ultrasounds, radiology, fetal intervention, and various other visiting specialties.",
      "Our visiting specialists are leaders in their respective fields, equipped with extensive experience and a commitment to delivering precise and compassionate care.",
    ],
    pills: ["Radiology", "Ultrasound", "Fetal intervention", "Visiting specialties"],
    parts: [
      { title: "Comprehensive diagnostics", body: "Whether you require detailed imaging through ultrasounds or radiology services, or you’re seeking fetal intervention expertise, we have you covered." },
      { title: "Insights that matter", body: "We understand the importance of accurate diagnostics in your healthcare journey, and our team is dedicated to providing insights that matter." },
      { title: "A reassuring visit", body: "From advanced equipment to a patient-centric approach, we strive to create an environment where you feel confident in the expertise of our specialists." },
    ],
  },
];

export const WHY = [
  { title: "High quality lab", body: "Cutting-edge technology, advanced equipment and stringent quality control measures." },
  { title: "Unmatched expertise", body: "A trusted choice among physicians, with 350+ referring doctors and 50+ network hospitals." },
  { title: "Precise result", body: "Accurate results with clinical relevance in the interpretations you receive." },
  { title: "Qualified staff", body: "20 expert staff, led by a radiologist and a pathologist." },
];

export const FAQS = [
  { q: "How do I book a test?", a: "Add tests from the price list to “My tests”, fill in your name and number, and send the request on WhatsApp. You can also call +91 81508 15026 and read out your prescription. Our team calls back to confirm." },
  { q: "Do you collect samples at home?", a: "Yes. Call us for home collection in 30 minutes, subject to your area and the time of day; our team confirms the pickup time on call. Scans such as CT, MRI, ultrasound and X-ray are done at our centres." },
  { q: "How much do tests cost?", a: "Every test and scan is listed with its price on this site. Annual health packages start at ₹999*; call us for the current price of each package." },
  { q: "Where are your centres?", a: "Medcloud has four healthcare centres: Mandya, Malavalli, Kunigal and Ramanagara. Each centre page has the address and directions." },
  { q: "Which scans do you offer?", a: "CT (MDCT), 3T MRI, ultrasound, X-ray, mammography, ECG and echo. Medcloud also runs the first fetal imaging center in Mandya to conduct fetal interventions." },
  { q: "Can I see a specialist at Medcloud?", a: "Yes. Visiting specialists in ultrasound, radiology and fetal intervention consult at our centres. Call to book a consultation." },
];

export const MARQUEE = ["3T MRI", "MDCT", "Ultrasound", "Fetal imaging", "Haematology", "Biochemistry", "Serology", "Hormone assays", "Histopathology", "Microbiology", "Cytology", "Clinical pathology", "Home collection in 30 minutes"];
