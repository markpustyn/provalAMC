'use client'

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { db } from "@/db/drizzle";
import { order, statusOrder } from "@/db/schema";
import { eq } from "drizzle-orm";
import {useRouter } from "next/navigation";
import { useState } from "react";
import { OpenOrder } from "types";

interface OrderDetailsProps {
  OrderDetails: OpenOrder;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ OrderDetails }) => {
  const [openSave, setOpenSave] = useState(false);
  const [openValidate, setOpenValidate] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const router = useRouter()
  const id = OrderDetails.orderId

const handleSubmit = async () => {
  if (!OrderDetails?.orderId) {
    console.error("Missing orderId");
    return;
  }

  // Show the modal
  setOpenSubmit(true);

  // Update order status
  await db
    .update(statusOrder)
    .set({ propStatus: "submitted" })
    .where(eq(statusOrder.propOrderId, OrderDetails.orderId));

  // Navigate after delay
  setTimeout(() => {
    router.push("/broker/dashboard");
  }, 1500);
};


  if (!OrderDetails) return <div className="text-center text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      {/* Save Modal */}
      <Modal
        title="Order Saved"
        description="The order has been successfully saved."
        isOpen={openSave}
        onClose={() => setOpenSave(false)}
      />

      {/* Validate Modal */}
      <Modal
        title="Order Validated"
        description="The order has passed all validation checks."
        isOpen={openValidate}
        onClose={() => setOpenValidate(false)}
      />

      {/* Submit Modal */}
      <Modal
        title="Order Submitted"
        description="The order has been submitted for processing."
        isOpen={openSubmit}
        onClose={() => setOpenSubmit(false)}
      />

      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Order Details</h2>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">First Name</p>
          <p className="font-medium">{OrderDetails.borrowerName || "N/A"}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{OrderDetails.borrowerEmail || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">{OrderDetails.borrowerPhoneNumber || "N/A"}</p>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-md font-bold text-gray-700 border-b pb-1">Address</h3>
        <div className="text-md mt-1">
          <p className="font-medium">
            {OrderDetails.propertyAddress} {OrderDetails.propertyCity}, {OrderDetails.propertyState} {OrderDetails.propertyZip}
          </p>
        </div>
      </div>

      {/* Role & Status */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Other Details</h3>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Order Type</p>
            <p className="font-medium">{OrderDetails.mainProduct || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Property</p>
            <p className="font-medium">{OrderDetails.orderType || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="secondary" onClick={() => setOpenSave(true)}>
          Save
        </Button>
        <Button onClick={() => setOpenValidate(true)}>
          Validate
        </Button>
        <Button onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
