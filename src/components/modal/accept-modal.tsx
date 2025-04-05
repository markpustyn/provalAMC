'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { acceptOrder, billOrder } from '@/lib/admin/order';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BillingStatus, OpenOrder, StatusOrder } from 'types';
import { paymentEnum } from '@/db/schema';
interface AcceptAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  order: OpenOrder
}

export const AcceptAlertModal: React.FC<AcceptAlertModalProps> = ({
  isOpen,
  onClose,
  // loading,
  order
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const session = useSession();

  const onConfirm = async () => {
    if (!session.data?.user?.id) {
      toast.error("User session not found.");
      return;
    }
    const params: StatusOrder = {
        propStatus: "assigned",
        propOrderId: order.orderId!,
        vendorId: session.data?.user?.id,
      };
    const bill: BillingStatus = {
      vendorId:  session.data?.user?.id,
      propOrderId:  order.orderId!,
      amount: "60",
      vendorFee: "40",

      };
    try {
        console.log(bill)
        const result = await acceptOrder(params);
        const billOrders = await billOrder(bill);
        
        if (result.success && billOrders.success) { 
          toast.success("Order accepted successfully!");
          router.push('/broker/dashboard/order');
        }
    } catch (error) {
      toast.error("An error occurred while accepting the order.");
    }
  };
  if (!isMounted) return null;

  return (
    <Modal
      title="Accept This Order?"
      description="Confirm that you want to accept this order. Review the order details below before proceeding."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Order Details */}
        <div className="border p-4 rounded-md bg-gray-100">
          <p className="text-sm font-bold">Order ID: <span className="">{order.propertyAddress} {order.propertyCity},  {order.propertyState} {order.propertyZip}</span></p>
          <p className="text-sm font-bold">Customer: <span className="">{order.borrowerName}</span></p>
          <p className="text-sm font-bold">Amount: $<span className="">50</span></p>
          <p className="text-sm font-bold">Order Date: <span className="">{order.requestedDueDate}</span></p>
          <p className="text-sm font-bold">Type: <span className="">{order.mainProduct}</span></p>
        </div>

        {/* Buttons */}
        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" className='bg-green-500' onClick={onConfirm}>
            Confirm Acceptance
          </Button>
        </div>
      </div>
    </Modal>
  );
};
