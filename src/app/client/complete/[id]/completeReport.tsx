"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OpenOrder } from "types";
import { z } from "zod";
import { OrderSchema } from "@/lib/schema/order_schema";
import { deleteOrder } from "@/lib/admin/order";
import { db } from "@/db/drizzle";
import { pcrForms, s3AmcUploads, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ratingAssesment } from "@/lib/utils";
import { GeneratePdf } from "@/components/pdf/generatePdf";
import ReactPDF from "@react-pdf/renderer";

/**
 * Combined UI + PDF generation in one file
 * - <CompleteReport /> handles data loading, preview, and download
 * - <PropertyReport /> is the on-page visual report (regular React)
 */

// ---------- Types ----------
export type PropertyReportProps = {
  orderDetails: any;
  rating: { score?: number; rating?: "Good" | "Moderate" | "Elevated" | "High" | string } | any;
  vendorDetails: any;
  orderData: any;
  images: string[]; // normal URLs for on-screen preview
  tags: string[];
  logoSrc?: string;
};

// ---------- Helpers ----------
const colorMap: Record<string, { bg: string; fg: string }> = {
  Good: { bg: "bg-green-50", fg: "text-green-700" },
  Moderate: { bg: "bg-orange-50", fg: "text-orange-700" },
  Elevated: { bg: "bg-red-50", fg: "text-red-700" },
  High: { bg: "bg-rose-50", fg: "text-rose-700" },
  Unknown: { bg: "bg-gray-100", fg: "text-gray-600" },
};

function safeParse(data: any): Record<string, any> {
  try {
    if (typeof data === "string") return JSON.parse(data);
    if (typeof data?.data === "string") return JSON.parse(data.data);
    if (data?.data) return data.data;
    return typeof data === "object" && data ? data : {};
  } catch {
    return {};
  }
}

function classNames(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

const tagPriority: Record<string, number> = {
  Front: 1,
  "Left Side": 2,
  "Right Side": 3,
  "Street Left": 4,
  "Street Right": 5,
  Address: 6,
  "Across the Street": 7,
  "Street Sign": 8,
};

function sortByPriority(images: string[], tags: string[]) {
  return images
    .map((image, i) => ({ image, tag: tags?.[i] ?? "", idx: i }))
    .sort((a, b) => {
      const pa = tagPriority[a.tag] ?? 99;
      const pb = tagPriority[b.tag] ?? 99;
      return pa === pb ? a.idx - b.idx : pa - pb;
    });
}

async function toDataUrl(url: string): Promise<string> {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`Image fetch failed: ${url}`);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

// ---------- Regular React Report ----------
export function PropertyReport({
  orderDetails,
  rating,
  vendorDetails,
  orderData,
  images,
  tags,
  logoSrc,
}: PropertyReportProps) {
  const parsed = safeParse(orderData);
  const gv = (k: string) => parsed?.[k] ?? "N/A";
  const rLabel = String(rating?.rating || "Unknown");
  const palette = colorMap[rLabel] || colorMap.Unknown;
  const sorted = sortByPriority(images, tags);
  const front = sorted[0];

  return (
    <div className="mx-auto max-w-4xl p-6 bg-white text-black">

      {/* ADDRESS */}
      <section className="border-b border-black pb-4 mb-4">
        <h2 className="text-2xl font-bold text-black pl-2 border-l-4 border-[#256ccb] mb-3">Address</h2>
        <div className="space-y-1 text-md">
          <div className="flex justify-between"><span className="font-semibold text-gray-600">Street:</span><span>{orderDetails?.propertyAddress || "N/A"}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-600">City/State/Zip:</span><span>{`${orderDetails?.propertyCity || "N/A"}, ${orderDetails?.propertyState || "N/A"} ${orderDetails?.propertyZip || "N/A"}`}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-600">Inspection Date:</span><span>{orderDetails?.requestedDueDate || "N/A"}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-600">Order Type:</span><span>{orderDetails?.mainProduct || "N/A"} PCR</span></div>
        </div>
      </section>

      {/* RATING + FRONT PHOTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl border border-black p-4">
          <h3 className="text-2xl font-semibold text-black mb-2">Overall Rating</h3>
          <div className="flex flex-col items-center justify-center mt-4">
            <span className={classNames("mt-2 text-3xl px-3 py-1 rounded-full", palette.bg, palette.fg)}>
              {rLabel}
            </span>
          </div>
          <div className="mt-4 space-y-1 text-md text-gray-600">
            <div>
              Type: {gv("propertyType")} • Stories: {gv("stories")}
            </div>
            <div>
              Condition: {gv("subjectCondition")} • Repairs: {gv("repairsNeeded")}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black p-3 flex items-center justify-center min-h-[175px]">
          {front?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={front.image} alt={front.tag || "Front"} className="h-72 w-full object-cover rounded-xl" />
          ) : (
            <div className="text-sm text-gray-500">No image</div>
          )}
        </div>
      </div>

      {/* PROPERTY INFORMATION */}
      <section className="border-b border-black pb-4 mb-4">
        <h2 className="text-2xl font-bold text-black pl-2 border-l-4 border-[#256ccb] mb-3">Property Information</h2>
        <div className="space-y-1 text-md">
          {([
            ["Property Type", gv("propertyType")],
            ["Stories", gv("stories")],
            ["Occupancy", gv("occupancy")],
            ["Neighborhood", gv("neighborhood")],
            ["View Factors", gv("viewFactors")],
            ["Subject Condition", gv("subjectCondition")],
            ["Neighborhood Conformity", gv("neighborhoodConformity")],
            ["Common Elements", gv("commonElements")],
            ["Repairs Needed", gv("repairsNeeded")],
            ["Items", gv("items")],
            ["Date Assigned", gv("date")],
          ] as const).map(([label, value], i) => (
            <div key={i} className="flex justify-between">
              <span className="font-semibold text-gray-600">{label}:</span>
              <span className="text-gray-900">{String(value)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* VENDOR INFO */}
      <section className="border-b border-black pb-4 mb-4">
        <h2 className="text-2xl font-bold text-black pl-2 border-l-4 border-[#256ccb] mb-3">Vendor Information</h2>
        <div className="space-y-1 text-md">
          <div className="flex justify-between"><span className="font-semibold text-gray-600">Name</span><span>{vendorDetails?.fname} {vendorDetails?.lname}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-600">License</span><span>{vendorDetails?.licenseNum} {vendorDetails?.state}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-gray-600">Company</span><span>{vendorDetails?.companyName}</span></div>
        </div>
      </section>

      {/* IMAGES */}
      <section className="border-b border-black pb-2">
        <h2 className="text-2xl font-bold text-black pl-2 border-l-4 border-[#256ccb] mb-3">Property Photos</h2>
        <div className="space-y-6">
          {sorted.map((it, i) => (
            <figure key={`${it.idx}-${i}`} className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt={it.tag || `Photo ${i + 1}`} className="w-full h-[350px] object-contain rounded-xl border" />
              <figcaption className="mt-2 text-center text-md font-medium">{it.tag || ""}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- Container that loads data + renders preview + downloads PDF ----------
export function CompleteReport({ OrderDetails }: { OrderDetails: OpenOrder }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // preview state
  const [vendor, setVendor] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [rating, setRating] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Load preview content once
  useEffect(() => {
    (async () => {
      try {
        const [orderRecord] = await db
          .select({ form: pcrForms, vendor: users })
          .from(pcrForms)
          .leftJoin(users, eq(users.id, pcrForms.vendorId))
          .where(eq(pcrForms.orderId, OrderDetails.orderId!))
          .limit(1);

        const imageRecords = await db
          .select()
          .from(s3AmcUploads)
          .where(eq(s3AmcUploads.propertyId, OrderDetails.orderId!));

        const urls = imageRecords
          .map((r) => r.fileUrl)
          .filter((u): u is string => !!u)
          .map((u) => encodeURI(u));

        setVendor(orderRecord?.vendor || null);
        setFormData(orderRecord?.form || null);
        setRating(ratingAssesment(orderRecord));
        setImageUrls(urls);
        setTags(imageRecords.map((r) => r.imgTag ?? ""));
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OrderDetails.orderId]);

  const generateReport = async (id: string) => {
    try {
      setLoading(true);

      const [orderRecord] = await db
        .select({ form: pcrForms, vendor: users })
        .from(pcrForms)
        .leftJoin(users, eq(users.id, pcrForms.vendorId))
        .where(eq(pcrForms.orderId, id))
        .limit(1);

      const imageRecords = await db
        .select()
        .from(s3AmcUploads)
        .where(eq(s3AmcUploads.propertyId, id));

      const urls = imageRecords
        .map((r) => r.fileUrl)
        .filter((u): u is string => !!u)
        .map((u) => encodeURI(u));

      const base64Images = await Promise.all(urls.map(toDataUrl));
      const tags: string[] = imageRecords.map((r) => r.imgTag ?? "");
      const rating = ratingAssesment(orderRecord);

      const blob = await ReactPDF
        .pdf(
          <GeneratePdf
            rating={rating}
            vendorDetails={orderRecord.vendor}
            orderDetails={OrderDetails}
            orderData={orderRecord.form}
            images={base64Images}
            tags={tags}
            logoSrc="/blackLogo.png"
          />
        )
        .toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${OrderDetails.propertyAddress} Report Downloaded!`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-10 w-full max-w-5xl mx-auto px-6 py-10">
      {/* Top Buttons */}
      <div className="flex justify-end gap-4 mb-6 print:hidden">
        <Button
          variant="outline"
          className="text-black"
          onClick={() => generateReport(OrderDetails.orderId!)}
          disabled={loading}
        >
          {loading ? "Building…" : "Download Report"}
        </Button>
        <Button className="bg-blue-600 text-white" variant="outline">
          Contact Us
        </Button>
      </div>
      {vendor && (
        <PropertyReport
          orderDetails={OrderDetails}
          rating={rating}
          vendorDetails={vendor}
          orderData={formData}
          images={imageUrls}
          tags={tags}
          logoSrc="/blackLogo.png"
        />
      )}
    </div>
  );
}

// Named exports are available for flexible imports
export default CompleteReport;
