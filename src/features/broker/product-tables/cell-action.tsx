'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { DeclineAlertModal } from '@/components/modal/decline-modal';
import { AcceptAlertModal } from '@/components/modal/accept-modal'; // Import the new modal
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { OpenOrder } from "types";

interface CellActionProps {
  data: OpenOrder;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDecline, setOpenDecline] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);

  return (
    <>
      <AcceptAlertModal
        isOpen={openAccept}
        onClose={() => setOpenAccept(false)}
        loading={loading}
        order={data}
      />

      <DeclineAlertModal
        isOpen={openDecline}
        onClose={() => setOpenDecline(false)}
        loading={loading}
        order={data}
      />

      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => setOpenAccept(true)}
          className="h-8 bg-green-500 hover:bg-green-600"
        >
          Accept Order
        </Button>

        <Button
          variant="outline"
          onClick={() => setOpenDecline(true)}
          className="h-8 bg-red-500 hover:bg-red-600"
        >
          Decline Order
        </Button>
      </div>
    </>
  );
};
