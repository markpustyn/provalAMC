"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  MailIcon,
  HomeIcon,
  UserIcon,
  BuildingIcon,
} from "lucide-react";
import { InspectionForm, OpenOrder } from "types";
import { db } from "@/db/drizzle";
import { order, pcrForms, s3AmcUploads, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GeneratePdf } from "@/components/pdf/generatePdf";
import { renderToStream } from "@react-pdf/renderer";
import ReactPDF from '@react-pdf/renderer';
import { toast } from "sonner";
import { ratingAssesment } from "@/lib/utils";


export function PropertyDetails({ OrderDetails }: { OrderDetails: OpenOrder }) {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleReport = () => {
    router.push(`/broker/dashboard/order/report/${OrderDetails.orderId}`);
  };
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


const generateReport = async (id: string) => {
  try {
    const [orderRecord] = await db
      .select({ form: pcrForms, vendor: users })
      .from(pcrForms)
      .leftJoin(users, eq(users.id, pcrForms.vendorId))
      .where(eq(pcrForms.orderId, id))
      .limit(1)
      const form = orderRecord?.form;
      const vendor = orderRecord?.vendor || null;
    const imageRecords = await db
      .select()
      .from(s3AmcUploads)
      .where(eq(s3AmcUploads.propertyId, id));


    const imageUrls = imageRecords
      .map(r => r.fileUrl)
      .filter((u): u is string => !!u)
      .map(u => encodeURI(u));


    const tags: string[] = imageRecords.map(r => r.imgTag ?? '')

    const rating = ratingAssesment(orderRecord)
    
    const images = await Promise.all(imageUrls.map(toDataUrl));
    const blob = await ReactPDF.pdf(<GeneratePdf rating={rating} vendorDetails={vendor} orderDetails={OrderDetails} orderData={form} images={images} tags={tags} logoSrc="/blackLogo.png"/>).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`${OrderDetails.propertyAddress} Report Downloaded!`)
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div className="space-y-16 w-full max-w-5xl mx-auto px-6 py-10">
      {/* Top Buttons */}
      <div className="flex justify-end gap-6 mb-6 print:hidden">
        <Button className="text-lg px-6 py-3" variant="outline" onClick={handlePrint}>
          Print Page
        </Button>
        <Button className="text-lg px-6 py-3" onClick={handleReport}>
          Report Page
        </Button>
        <Button className="text-lg px-6 py-3" onClick={() => generateReport(OrderDetails.orderId!)}>
          Generate Report
        </Button>
      </div>

      {/* Address */}
      <Section icon={<HomeIcon className="w-6 h-6" />} title="Property Address">
        <p className="text-lg text-muted-foreground">
          {OrderDetails.propertyAddress}, {OrderDetails.propertyCity}, {OrderDetails.propertyState} {OrderDetails.propertyZip}
        </p>
      </Section>

      {/* Order Info */}
      <Section icon={<BuildingIcon className="w-6 h-6" />} title="Order Info">
        <DetailGrid
          items={[
            ["Order Type", OrderDetails.orderType],
            ["Due Date", OrderDetails.requestedDueDate],
            ["Property Type", OrderDetails.propertyType],
            ["Occupancy", OrderDetails.presentOccupancy],
            ["Loan Purpose", OrderDetails.loanPurpose],
            ["Loan Type", OrderDetails.loanType],
            ["Main Product", OrderDetails.mainProduct],
          ]}
        />
      </Section>

      {/* Borrower */}
      <Section icon={<UserIcon className="w-6 h-6" />} title="Borrower">
        <DetailGrid
          items={[
            ["Name", OrderDetails.borrowerName],
            ["Email", OrderDetails.borrowerEmail],
            [
              "Phone",
              `${OrderDetails.borrowerPhoneType || ""} ${OrderDetails.borrowerPhoneNumber || ""}`,
            ],
          ]}
        />
      </Section>

      {/* Lender */}
      <Section icon={<MailIcon className="w-6 h-6" />} title="Lender">
        <DetailGrid
          items={[
            ["Lender", OrderDetails.lender],
            [
              "Lender Address",
              `${OrderDetails.lenderAddress}, ${OrderDetails.lenderCity}, ${OrderDetails.lenderZip}`,
            ],
            ["Loan Officer", OrderDetails.loanOfficer],
            ["Officer Email", OrderDetails.loanOfficerEmail],
          ]}
        />
      </Section>
    </div>
  );
}

// Section Component
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="text-2xl font-bold text-black">{title}</h2>
      </div>
      <Separator className="mb-6" />
      {children}
    </div>
  );
}

// Grid for Detail Rows
function DetailGrid({ items }: { items: [string, string | undefined][] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
      {items.map(([label, value]) => (
        <div key={label}>
          <p className="text-base text-gray-600 font-semibold">{label}</p>
          <p className="text-lg font-medium text-gray-900">
            {value || "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
}
