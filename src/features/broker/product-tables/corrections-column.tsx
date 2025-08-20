'use client';
import { OpenOrder } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import { ClipboardPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QcActions({ data }: {data: OpenOrder}) {
  const router = useRouter();

  return (
    <div className="flex space-x-2">
      <button className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" 
        onClick={() => router.push(`/broker/dashboard/order/${data.orderId}`)}>
        <ClipboardPlus className="w-5 h-5" />
        Order
      </button>
    </div>
  );
};


export const correctionscolumns: ColumnDef<OpenOrder>[] = [
  // {
  //   accessorKey: 'photo_url',
  //   header: 'IMAGE',
  //   cell: ({ row }) => {
  //     return (
  //       <div className='relative aspect-square'>
  //         <Image
  //           src={row.getValue('photo_url')}
  //           alt={row.getValue('name')}
  //           fill
  //           className='rounded-lg'
  //         />
  //       </div>
  //     );
  //   }
  // },
  {
    id: 'actions',
    cell: ({ row }) => <QcActions data={row.original} />
  },
  {
    accessorKey: "propertyAddress",
    header: "Address",
  },
  {
    accessorKey: "propertyCity",
    header: "City",
  },
  {
    accessorKey: "propertyZip",
    header: "Zip",
  },
  {
    accessorKey: "propertyState",
    header: "State",
  },
  {
    accessorKey: "requestedDueDate",
    header: "Due Date",
  },
  {
    accessorKey: "mainProduct",
    header: "Order Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
