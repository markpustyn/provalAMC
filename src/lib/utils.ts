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


export const ratingAssesment = (orderData: any) => {
  // --- helpers ---
  const val = (k: string) => (orderData?.[k] ?? orderData?.[k.replace(/\s+/g, '')] ?? '').toString();
  const norm = (s: any) => s?.toString().trim().toLowerCase() || '';
  const has = (s: string, needles: string[]) => {
    const n = norm(s);
    return needles.some(w => n.includes(w));
  };
  const push = (delta: number, reason: string) => { score += delta; reasons.push(`${delta >= 0 ? '+' : ''}${delta}: ${reason}`); };
  const clamp = (x: number) => Math.max(0, Math.min(100, x));

  // --- extract inputs (support either pretty keys or compact keys) ---
  const propertyType = norm(val('Property Type'));
  const stories       = norm(val('Stories'));
  const occupancy     = norm(val('Occupancy'));
  const neighborhood  = norm(val('Neighborhood'));
  const viewFactors   = norm(val('View Factors'));
  const condition     = norm(val('Subject Condition'));
  const conformity    = norm(val('Neighborhood Conformity'));
  const commonElems   = norm(val('Common Elements'));
  const repairs       = norm(val('Repairs Needed'));
  const notes         = norm(val('Notes') || val('notes'));

  // --- config / weights ---
  let score = 100;
  const reasons: string[] = [];
  const flags: string[] = [];

  // Damages via notes keywords (major/minor)
  const majorDamageWords = ['foundation', 'structural', 'fire', 'flood', 'mold', 'roof leak', 'roofleak', 'sinkhole'];
  const minorDamageWords = ['crack', 'leak', 'stain', 'water spot', 'dry rot', 'damaged', 'termite', 'pest'];

  const hasMajorDamage = has(notes, majorDamageWords);
  const hasMinorDamage = !hasMajorDamage && has(notes, minorDamageWords);

  if (hasMajorDamage) { push(-35, 'Major damage mentioned'); flags.push('major_damage'); }
  else if (hasMinorDamage) { push(-12, 'Minor damage mentioned'); flags.push('minor_damage'); }

  // Repairs
  if (repairs && !['none', 'no', 'na', 'n/a'].includes(repairs)) {
    if (has(repairs, ['major'])) { push(-30, `Repairs needed: ${repairs}`); flags.push('repairs_major'); }
    else if (has(repairs, ['minor'])) { push(-12, `Repairs needed: ${repairs}`); flags.push('repairs_minor'); }
    else { push(-10, `Repairs needed: ${repairs}`); flags.push('repairs_other'); }
  } else {
    push(+6, 'No repairs needed');
  }

  // Condition
  if (has(condition, ['new'])) push(+6, 'Condition: New');
  else if (has(condition, ['like new', 'likenew'])) push(+4, 'Condition: Like New');
  else if (has(condition, ['good'])) push(+1, 'Condition: Good');
  else if (has(condition, ['fair'])) { push(-10, 'Condition: Fair'); flags.push('condition_fair'); }
  else if (has(condition, ['poor', 'bad'])) { push(-25, 'Condition: Poor/Bad'); flags.push('condition_poor'); }

  // Occupancy
  if (has(occupancy, ['vacant'])) { push(-8, 'Vacant property'); flags.push('vacant'); }
  else if (has(occupancy, ['occupied'])) push(+2, 'Occupied');

  // Neighborhood conformity
  if (has(conformity, ['good'])) push(+3, 'Neighborhood conformity: Good');
  else if (has(conformity, ['average'])) push(-3, 'Neighborhood conformity: Average');
  else if (has(conformity, ['fair'])) { push(-8, 'Neighborhood conformity: Fair'); flags.push('conformity_fair'); }
  else if (has(conformity, ['poor'])) { push(-15, 'Neighborhood conformity: Poor'); flags.push('conformity_poor'); }

  // Views (adverse vs positive)
  const adverseViews = ['freeway', 'highway', 'rail', 'railroad', 'tracks', 'industrial', 'power line', 'powerline', 'substation', 'cemetery', 'airport', 'commercial'];
  const positiveViews = ['park', 'lake', 'mountain', 'greenbelt', 'open space'];
  if (viewFactors) {
    if (has(viewFactors, adverseViews)) { push(-10, `Adverse view: ${val('View Factors')}`); flags.push('adverse_view'); }
    else if (has(viewFactors, positiveViews)) { push(+4, `Positive view: ${val('View Factors')}`); }
  }

  // Neighborhood type (light-touch)
  if (has(neighborhood, ['industrial'])) { push(-12, 'Industrial neighborhood'); flags.push('industrial_area'); }
  else if (has(neighborhood, ['rural'])) { /* neutral */ }
  else if (has(neighborhood, ['urban'])) { /* neutral */ }
  else if (has(neighborhood, ['suburban'])) { /* neutral */ }

  // Stories (generally neutral; extreme heights could add complexity)
  if (has(stories, ['3', '4', '5'])) push(-2, '3+ stories (slightly less liquid)');

  // Common elements (tiny positive)
  if (has(commonElems, ['pool'])) push(+2, 'Amenity: Pool');

  // Property type (neutral for residential)
  if (propertyType && !has(propertyType, ['residential'])) { /* keep neutral unless you want to penalize */ }

  // --- Guarantee "Good" when no damages and no repairs, unless strong negatives exist ---
  const noDamages = !hasMajorDamage && !hasMinorDamage;
  const noRepairs = ['none', 'no', 'na', 'n/a', ''].includes(repairs);
  if (noDamages && noRepairs && score < 85) {
    // Nudge to Good floor, but don't mask severe flags
    const severe = flags.includes('adverse_view') || flags.includes('industrial_area') || flags.includes('condition_poor');
    if (!severe) {
      reasons.push('Floor to Good rating (no damages, no repairs)');
      score = Math.max(score, 85);
    }
  }

  // --- finalize ---
  score = clamp(score);
  const rating =
    score >= 85 ? 'Good' :
    score >= 70 ? 'Moderate' :
    score >= 50 ? 'Elevated' : 'High';

  return { score, rating, reasons, flags };
};
