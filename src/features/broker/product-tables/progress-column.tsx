'use client';
import { OpenOrder } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import { OrderActions } from '@/features/products/components/product-tables/order-actions';


export const columns: ColumnDef<OpenOrder>[] = [
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
    accessorKey: "mainProduct",
    header: "Order Type",
  },
  {
    id: 'actions',
    cell: ({ row }) => <OrderActions data={row.original} />
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
    accessorKey: "status",
    header: "Status",
  },
];
