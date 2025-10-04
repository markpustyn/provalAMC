"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MailIcon, HomeIcon, UserIcon, BuildingIcon } from "lucide-react";
import { OpenOrder } from "types";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteOrder } from "@/lib/admin/order";
import { OrderSchema } from "@/lib/schema/order_schema";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { pcrForms, s3AmcUploads, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ratingAssesment } from "@/lib/utils";
import { GeneratePdf } from "@/components/pdf/generatePdf";
import ReactPDF from '@react-pdf/renderer';
import { OrderProgress } from "./orderProgress";


export function PropertyDetails({ OrderDetails }: { OrderDetails: OpenOrder }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePrint = () => window.print();
    const onConfirm = async () => {};
    
    
      async function toDataUrl(url: string): Promise<string> {
      const res = await fetch(url, { mode: "cors" }); // must succeed (check S3 CORS)
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
      const blob = await ReactPDF.pdf(<GeneratePdf rating={rating} vendorDetails={orderRecord.vendor} orderDetails={OrderDetails} orderData={orderRecord.form} images={images} tags={tags} logoSrc="/blackLogo.png"/>).toBlob();
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

  const handleConfirmCancel = async () => {
    try {
        const defaultValues: z.infer<typeof OrderSchema> = {
        };
      const result = await deleteOrder(defaultValues, OrderDetails.orderId);
      if (result.success) {
        toast.success("Order Canceled!");
        router.push('/client/order')
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="space-y-16 w-full max-w-5xl mx-auto px-6 py-10">
      {/* Top Buttons */}
      <div className="flex justify-end gap-6 mb-6 print:hidden">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="text-lg px-6 py-3 bg-red-600 text-white"
              variant="outline"
            >
              Cancel Order
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the order as <b>canceled</b>. You can’t undo this action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Exit</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmCancel}
                disabled={loading}

              >
                {loading ? "Canceling…" : "Yes, cancel it"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button className="bg-blue-600 text-white text-md" variant={'outline'}>
          Contact Us
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
            ["Order Type", OrderDetails.mainProduct],
            ["Due Date", OrderDetails.requestedDueDate],
          ]}
        />
      </Section>

      {/* Borrower */}
      <Section icon={<UserIcon className="w-6 h-6" />} title="Borrower">
        <DetailGrid
          items={[
            ["Name", OrderDetails.borrowerName],
            ["Email", OrderDetails.borrowerEmail],
            ["Phone", `${OrderDetails.borrowerPhoneType || ""} ${OrderDetails.borrowerPhoneNumber || ""}`],
          ]}
        />
      </Section>
        <OrderProgress currentStatus={OrderDetails.status} />
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
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

function DetailGrid({ items }: { items: [string, string | undefined][] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
      {items.map(([label, value]) => (
        <div key={label}>
          <p className="text-base text-gray-600 font-semibold">{label}</p>
          <p className="text-lg font-medium text-gray-900">{value || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
