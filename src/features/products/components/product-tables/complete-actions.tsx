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



interface CellActionProps {
  data: OpenOrder;
}


export const CompleteCell: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  
  const onConfirm = async () => {};
  
    const handlePrint = () => {
      window.print();
    };
  
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
    const blob = await ReactPDF.pdf(<GeneratePdf rating={rating} vendorDetails={orderRecord.vendor} orderDetails={data} orderData={orderRecord.form} images={images} tags={tags} logoSrc="/mainLogo.png"/>).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`${data.propertyAddress} Report Downloaded!`)
  } catch (error) {
    console.error("Error:", error);
  }
};
  

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
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => generateReport(data.orderId!)}
          >
            <Download className='mr-2 h-4 w-4' /> Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            if (!data.orderId) return toast.error("Missing order id.");
            return router.push(`/client/complete/${data.orderId}`);
          }}>
            <Edit className="mr-2 h-4 w-4" /> Open Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
