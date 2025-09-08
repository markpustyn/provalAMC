import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}
export const getInitials = (name: string): string => 
  name
    .split(" ")
    .map((part) => part[0]) 
    .join("")
    .toUpperCase()
    .slice(0,2);

export function formatDateMDY(
  input: Date | string | number = new Date(),
  timeZone = "America/Los_Angeles"
): string {
  const d = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(d);
}
const PRODUCT_CATALOG: Record<string, { label: string; amountCents: number }> = {
  RushExterior: { label: "Rush Three Day Exterior", amountCents: 3500 },
  Exterior:     { label: "Exterior Inspection",      amountCents: 3000 },
  Interior:     { label: "Interior Inspection",      amountCents: 7500 },
};
type ProductKey = keyof typeof PRODUCT_CATALOG;

export function getProductFeeDollars(product: string): number | null {
  const key = Object.keys(PRODUCT_CATALOG).find(
    k => k.toLowerCase() === product.toLowerCase()
  ) as ProductKey | undefined;

  if (!key) return null;
  return Math.trunc(PRODUCT_CATALOG[key].amountCents / 100);
}

export function getAllProductFeesDollars(): Record<ProductKey, number> {
  return Object.fromEntries(
    Object.entries(PRODUCT_CATALOG).map(([k, v]) => [k, Math.trunc(v.amountCents / 100)])
  ) as Record<ProductKey, number>;
}


export const ratingAssesment = (orderData: any) => {
  // --- unwrap & parse JSON safely (supports: form.data | data | raw string/object) ---
  const unwrap = (d: any) => {
    let raw = d?.form?.data ?? d?.data ?? d;
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw); } catch { /* leave as string */ }
    }
    return raw ?? {};
  };
  const raw = unwrap(orderData);

  // --- build a case/space-insensitive index of fields ---
  const keyNorm = (k: string) => k.toString().toLowerCase().replace(/[\s_]/g, '');
  const index: Record<string, any> = {};
  Object.entries(raw).forEach(([k, v]) => { index[keyNorm(k)] = v; });

  // helper to read by friendly key name regardless of shape/case
  const val = (k: string): string => {
    const v = index[keyNorm(k)];
    if (Array.isArray(v)) return v.join(', ');
    if (v === null || v === undefined) return '';
    return String(v);
  };

  // --- tiny text utils ---
  const norm = (s: any) => s?.toString().trim().toLowerCase() || '';
  const has = (s: string, needles: string[]) => {
    const n = norm(s);
    return needles.some(w => n.includes(w));
  };

  // --- extract inputs uniformly ---
  const propertyType = norm(val('Property Type'));
  const stories       = norm(val('Stories'));
  const occupancy     = norm(val('Occupancy'));
  const neighborhood  = norm(val('Neighborhood'));
  const viewFactors   = norm(val('View Factors'));
  const condition     = norm(val('Subject Condition'));
  const conformity    = norm(val('Neighborhood Conformity'));
  const commonElems   = norm(val('Common Elements'));
  const repairs       = norm(val('Repairs Needed'));
  const notes         = norm(val('Notes'));

  // --- scoring ---
  let score = 100;
  const reasons: string[] = [];
  const flags: string[] = [];
  const push = (delta: number, reason: string) => { score += delta; reasons.push(`${delta >= 0 ? '+' : ''}${delta}: ${reason}`); };
  const clamp = (x: number) => Math.max(0, Math.min(100, x));

  const majorDamageWords = ['foundation','structural','fire','flood','mold','roof leak','roofleak','sinkhole'];
  const minorDamageWords = ['crack','leak','stain','water spot','dry rot','damaged','termite','pest'];

  const hasMajorDamage = has(notes, majorDamageWords);
  const hasMinorDamage = !hasMajorDamage && has(notes, minorDamageWords);

  if (hasMajorDamage) { push(-35,'Major damage mentioned'); flags.push('major_damage'); }
  else if (hasMinorDamage) { push(-12,'Minor damage mentioned'); flags.push('minor_damage'); }

  if (repairs && !['none','no','na','n/a'].includes(repairs)) {
    if (has(repairs, ['major']))       { push(-30,`Repairs needed: ${repairs}`); flags.push('repairs_major'); }
    else if (has(repairs, ['minor']))  { push(-12,`Repairs needed: ${repairs}`); flags.push('repairs_minor'); }
    else                               { push(-10,`Repairs needed: ${repairs}`); flags.push('repairs_other'); }
  } else {
    push(+6,'No repairs needed');
  }

  if (has(condition, ['new'])) push(+6,'Condition: New');
  else if (has(condition, ['like new','likenew'])) push(+4,'Condition: Like New');
  else if (has(condition, ['good'])) push(+1,'Condition: Good');
  else if (has(condition, ['fair'])) { push(-10,'Condition: Fair'); flags.push('condition_fair'); }
  else if (has(condition, ['poor','bad'])) { push(-25,'Condition: Poor/Bad'); flags.push('condition_poor'); }

  if (has(occupancy, ['vacant'])) { push(-8,'Vacant property'); flags.push('vacant'); }
  else if (has(occupancy, ['occupied'])) push(+2,'Occupied');

  if (has(conformity, ['good'])) push(+3,'Neighborhood conformity: Good');
  else if (has(conformity, ['average'])) push(-3,'Neighborhood conformity: Average');
  else if (has(conformity, ['fair'])) { push(-8,'Neighborhood conformity: Fair'); flags.push('conformity_fair'); }
  else if (has(conformity, ['poor'])) { push(-15,'Neighborhood conformity: Poor'); flags.push('conformity_poor'); }

  const adverseViews = ['freeway','highway','rail','railroad','tracks','industrial','power line','powerline','substation','cemetery','airport','commercial'];
  const positiveViews = ['park','lake','mountain','greenbelt','open space'];
  if (viewFactors) {
    if (has(viewFactors, adverseViews)) { push(-10,`Adverse view: ${val('View Factors')}`); flags.push('adverse_view'); }
    else if (has(viewFactors, positiveViews)) { push(+4,`Positive view: ${val('View Factors')}`); }
  }

  if (has(neighborhood, ['industrial'])) { push(-12,'Industrial neighborhood'); flags.push('industrial_area'); }
  if (has(stories, ['3','4','5'])) push(-2,'3+ stories (slightly less liquid)');
  if (has(commonElems, ['pool'])) push(+2,'Amenity: Pool');

  const noDamages = !hasMajorDamage && !hasMinorDamage;
  const noRepairs = ['none','no','na','n/a',''].includes(repairs);
  if (noDamages && noRepairs && score < 85) {
    const severe = flags.includes('adverse_view') || flags.includes('industrial_area') || flags.includes('condition_poor');
    if (!severe) { reasons.push('Floor to Good rating (no damages, no repairs)'); score = Math.max(score, 85); }
  }

  score = clamp(score);
  const rating = score >= 85 ? 'Good' : score >= 70 ? 'Moderate' : score >= 50 ? 'Elevated' : 'High';
  return { score, rating, reasons, flags };
};
