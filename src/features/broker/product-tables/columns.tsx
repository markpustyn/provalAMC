'use client';
import { OpenOrder } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Button } from '@/components/ui/button';


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
    accessorKey: 'orderFee',
    header: 'Fee',
    cell: ({ getValue }) => {
      const v = getValue<number | string | null>();
      return v == null ? '' : `$${v}`;
    },
  },
  {
    id: 'Status',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
