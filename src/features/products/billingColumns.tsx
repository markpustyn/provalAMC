'use client';
import { BillingStatus } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import { VendorActions } from './components/product-tables/vendor-actions';


export const billingColumns: ColumnDef<BillingStatus>[] = [
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
    accessorKey: "vendorId",
    header: "Vendor",
  },
  {
    accessorKey: "propertyAddress",
    header: "Property",
  },
  {
    accessorKey: "propertyCity",
    header: "Property",
  },
  {
    accessorKey: "propertyState",
    header: "Property",
  },
  {
    accessorKey: "propertyZip",
    header: "Property",
  },
  {
    accessorKey: "amount",
    header: "Total Fee",
  },
  {
    accessorKey: "vendorFee",
    header: "Vendor Fee",
  },
  {
    accessorKey: "billingStatus",
    header: "Status",
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
  },
//   {
//     id: 'actions',
//     cell: ({ row }) => <VendorActions data={row.original} />
//   }
];
