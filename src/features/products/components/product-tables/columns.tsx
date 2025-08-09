'use client';
import { OpenOrder } from 'types';
import { ColumnDef } from '@tanstack/react-table';
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
    accessorKey: "status",
    header: "Order Status",
  },
  {
    accessorKey: "loanNumber",
    header: "Loan Number",
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
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
