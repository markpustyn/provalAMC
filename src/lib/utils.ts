import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { db } from '@/db/drizzle';
import { users, vendorZipCodes } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

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
  RushExterior: { label: "Rush Three Day Exterior", amountCents: 400 },
  Exterior:     { label: "Exterior Inspection",      amountCents: 3500 },
  Interior:     { label: "Interior Inspection",      amountCents: 7500 },
};
type ProductKey = keyof typeof PRODUCT_CATALOG;

const BROKER_FEES: Record<string, { label: string; amountCents: number }> = {
  RushExterior: { label: "Rush Three Day Exterior", amountCents: 2500 },
  Exterior:     { label: "Exterior Inspection",      amountCents: 2000 },
  Interior:     { label: "Interior Inspection",      amountCents: 5500 },
};
type BrokerFees = keyof typeof BROKER_FEES;

export function getBrokerFees(product: any): any | null {
  const key = Object.keys(BROKER_FEES).find(
    k => k.toLowerCase() === product.toLowerCase()
  ) as BrokerFees | undefined;

  if (!key) return null;
  return Math.trunc(BROKER_FEES[key].amountCents / 100);
}

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
  // --- unwrap & parse JSON safely ---
  const unwrap = (d: any) => {
    let raw = d?.form?.data ?? d?.data ?? d
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw) } catch {}
    }
    return raw ?? {}
  }

  const data = unwrap(orderData)

  const condition = data.subjectCondition ?? ""
  const damages = data.significantDamages ?? "None"

  let rating = "No Potential Risks Noted"
  let score = 0
  const reasons: string[] = []
  const flags: string[] = []

  // ---- CONDITION BASE RULE ----
  const isLowRiskCondition =
    condition.startsWith("C1") ||
    condition.startsWith("C2") ||
    condition.startsWith("C3")


  return {
    score,
    rating,
    reasons,
    flags,
  }
}


export const getVendorEmail = async (zip: string) => {
  const result = await db
    .select({ email: users.email })
    .from(users)
    .leftJoin(vendorZipCodes, eq(users.id, vendorZipCodes.userId))
    .where(eq(vendorZipCodes.zipCode, zip));

  return result.map((r) => r.email);
};