'use client';
import { OpenOrder } from "types";
import { ClipboardPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: OpenOrder;
}

export const OrderActions: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="flex space-x-2">
      <button className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" 
        onClick={() => router.push(`/broker/dashboard/order/${data.orderId}`)}>
        <ClipboardPlus className="w-5 h-5" />
        Order
      </button>
    </div>
  );
};
