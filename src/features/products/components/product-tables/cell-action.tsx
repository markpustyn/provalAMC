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
import { pcrForms, s3AmcUploads } from '@/db/schema';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { GeneratePdf } from '@/components/pdf/generatePdf';
import ReactPDF from '@react-pdf/renderer';
import { toast } from 'sonner';


interface CellActionProps {
  data: OpenOrder;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
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
        .select()
        .from(pcrForms)
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
      console.log(tags)
      
      const images = await Promise.all(imageUrls.map(toDataUrl));
      const blob = await ReactPDF.pdf(<GeneratePdf orderDetails={data} orderData={orderRecord} images={images} tags={tags}/>).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${data.propertyAddress} Report Downloaded! `)
      
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
            <Download className='mr-2 h-4 w-4' /> Report
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/order/${data.orderId}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
              onClick={() => {
                setOpen(true);
              }}>
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
