'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { acceptOrder, deleteOrder } from '@/lib/admin/order';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useSession } from 'next-auth/react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  orderId: string;
}

export const DeclineAlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  loading, 
  orderId
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [reason, setReason] = useState('');
  const [additionalFee, setAdditionalFee] = useState('');
  const [message, setMessage] = useState('');

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
    console.log(orderId, session.data.user.id)

    try {
      const result = await acceptOrder(orderId, session.data.user.id);
      if (result.success) {
        toast.success("Order updated successfully!");
        router.push('/broker/dashboard');
      } else {
        toast.error("Failed to update order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Decline this job?'
      description='You are choosing to decline this order. Please select a reason and provide any additional details below.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Reason for Declining */}
        <div>
          <label className="block text-sm font-medium">Reason for Declining</label>
          <Select onValueChange={setReason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="out_of_area">Out of Service Area</SelectItem>
              <SelectItem value="too_busy">Too Busy</SelectItem>
              <SelectItem value="price_issue">Pricing Issue</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Fee Request */}
        <div>
          <label className="block text-sm font-medium">Request Additional Fee (Optional)</label>
          <Input 
            type="number" 
            placeholder="0" 
            value={additionalFee} 
            onChange={(e) => setAdditionalFee(e.target.value)} 
          />
        </div>

        {/* Message Box */}
        <div>
          <label className="block text-sm font-medium">Additional Message (Optional)</label>
          <Textarea 
            placeholder="Provide more details if necessary..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className='flex w-full items-center justify-end space-x-2 pt-6'>
          <Button disabled={loading} variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} variant='destructive' onClick={onConfirm}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};
