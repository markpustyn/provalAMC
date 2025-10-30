'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { OpenOrder } from "types"
import { Edit, MoreHorizontal, Trash, Download  } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { pcrForms, s3AmcUploads, users } from '@/db/schema';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { GeneratePdf } from '@/components/pdf/generatePdf';
import ReactPDF from '@react-pdf/renderer';
import { toast } from 'sonner';
import { ratingAssesment } from '@/lib/utils';
import { OrderSchema } from '@/lib/schema/order_schema';
import { z } from 'zod';
import { deleteOrder } from '@/lib/admin/order';



interface CellActionProps {
  data: OpenOrder;
}


export const AdminOrderActions: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  
    const onConfirm = async () => {
    const defaultValues: z.infer<typeof OrderSchema> = {
    };
    try {
      const result = await deleteOrder(defaultValues, data.orderId);
      if (result.success) {
        toast.success("Order canceled successfully!");
        router.push('/admin/order')
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }finally {
      setLoading(false);
    }
  };
  
    const handlePrint = () => {
      window.print();
    };
  
async function toDataUrl(url: string): Promise<string> {
        const res = await fetch(url, { 
      mode: "no-cors",
      cache: "no-cache"
    });
    
    // If no-cors doesn't work, try without mode specification
    if (!res.ok || res.type === 'opaque') {
      const res2 = await fetch(url, { cache: "no-cache" });
      if (!res2.ok) throw new Error(`Image fetch failed: ${url}`);
      const blob = await res2.blob();
      return await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
      });
    }
  if (!res.ok) throw new Error(`Image fetch failed: ${url}`);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}
  

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        orderId={data.orderId!}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => {
            if (!data.orderId) return toast.error("Missing order id.");
            return router.push(`/admin/order/${data.orderId}`);
          }}>
            <Edit className="mr-2 h-4 w-4" /> Open Order
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => {
            if (!data.orderId) return toast.error("Missing order id.");
            setOpen(true);
          }}>
            <Trash className="mr-2 h-4 w-4" /> Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};