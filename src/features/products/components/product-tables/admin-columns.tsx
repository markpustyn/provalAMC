'use client';
import { OpenOrder } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import { AdminActions } from './admin-actions';
import { AdminOrderActions } from './admin-order-action';



export const AdminColumn: ColumnDef<OpenOrder>[] = [
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
//   {
//     accessorKey: "loanNumber",
//     header: "Loan Number",
//   },
  {
    accessorKey: "status",
    header: "Status",
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
    cell: ({ row }) => <AdminOrderActions data={row.original} />
  }
];
