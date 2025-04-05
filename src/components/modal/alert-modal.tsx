'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { deleteOrder } from '@/lib/admin/order';
import { OrderSchema } from '@/lib/schema/order_schema';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  orderId: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  loading, 
  orderId
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const router = useRouter()
  const onConfirm = async () => {
    const defaultValues: z.infer<typeof OrderSchema> = {
    };
    try {
      const result = await deleteOrder(defaultValues, orderId);
      if (result.success) {
        toast.success("Order deleted successfully!");
        router.push('/admin/product')
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
