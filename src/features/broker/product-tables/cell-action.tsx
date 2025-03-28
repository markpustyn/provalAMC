'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { DeclineAlertModal } from '@/components/modal/decline-modal';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OpenOrder } from "types";

interface CellActionProps {
  data: OpenOrder;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  return (
    <>
      <DeclineAlertModal
        isOpen={open}
        onClose={() => setOpen(false)} 
        loading={loading}
        orderId={data.loanNumber!}
      />
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/broker/dashboard/product/${data.loanNumber}`)}
          className="h-8 bg-green-500 hover:bg-green-600"
        >
          Accept Order
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-8 bg-red-500 hover:bg-red-600"

        >
          Decline Order
        </Button>
      </div>
    </>
  );
};
