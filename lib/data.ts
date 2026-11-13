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
  s.replace(/[A-Za-z0-9]+/g, (w) => (ACR.has(w.toLowerCase()) ? w.toUpperCase() : w)).replace(/\s+/g, " ").trim();

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

export type Centre = { id: string; name: string; address: string; map: string; main?: boolean; x: number; y: number; lx: number; ly: number; anchor: "start" | "end" };
export const CENTRES: Centre[] = [
  { id: "mandya", name: "Mandya", main: true, address: "GVFX+743 Medcloud building, Double concrete road, Ashok Nagar, Mandya, Karnataka 571401", map: "https://maps.app.goo.gl/pLwQ45ocVc3Sce5n9", x: 160, y: 234, lx: -12, ly: -14, anchor: "end" },
  { id: "malavalli", name: "Malavalli", address: "Ground floor, Kullegowda Complex, in front of Government Hospital, Malavalli 571430", map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Medcloud Kullegowda Complex Malavalli 571430"), x: 224, y: 286, lx: 14, ly: 5, anchor: "start" },
  { id: "kunigal", name: "Kunigal", address: "22F9+5PQ, Kunigal Town Rd, Kunigal, Karnataka 572130", map: "https://maps.app.goo.gl/PZEDwXdFaVNKTdX2A", x: 212, y: 34, lx: -14, ly: 5, anchor: "end" },
  { id: "ramanagara", name: "Ramanagara", address: "Bangalore, Mysore Rd, Rayaradoddi, Karnataka 562159", map: "https://maps.app.goo.gl/w22putqujDA3DPGLA", x: 312, y: 154, lx: 14, ly: 18, anchor: "start" },
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
