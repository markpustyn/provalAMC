'use client';
import { Product } from '@/constants/data';
import { OpenOrder } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';


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
    accessorKey: "id",
    header: "Order Number",
  },
  {
    accessorKey: "PropAddress",
    header: "PropAddress",
  },
  {
    accessorKey: "PropCity",
    header: "PropCity",
  },
  {
    accessorKey: "PropZip",
    header: "PropZip",
  },
  {
    accessorKey: "PropState",
    header: "PropState",
  },
  {
    accessorKey: "Status",
    header: "Status",
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
