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

export function PropertyDetails({ OrderDetails }: { OrderDetails: OpenOrder }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePrint = () => window.print();

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
        <Button className="text-lg px-6 py-3 bg-blue-600 text-white" variant="outline" onClick={handlePrint}>
          Print Page
        </Button>

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
            ["Phone", `${OrderDetails.borrowerPhoneType || ""} ${OrderDetails.borrowerPhoneNumber || ""}`],
          ]}
        />
      </Section>

      {/* Lender */}
      <Section icon={<MailIcon className="w-6 h-6" />} title="Lender">
        <DetailGrid
          items={[
            ["Lender", OrderDetails.lender],
            ["Lender Address", `${OrderDetails.lenderAddress}, ${OrderDetails.lenderCity}, ${OrderDetails.lenderZip}`],
            ["Loan Officer", OrderDetails.loanOfficer],
            ["Officer Email", OrderDetails.loanOfficerEmail],
          ]}
        />
      </Section>
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
