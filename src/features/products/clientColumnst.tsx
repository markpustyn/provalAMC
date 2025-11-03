'use client';
import { AuthCredentials } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import { AdminActions } from './components/product-tables/admin-actions';
import { ClientsAdminActions } from './components/product-tables/clients-admin-actions';

export const clientColumns: ColumnDef<AuthCredentials>[] = [
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
    accessorKey: "fname",
    header: "Name",
  },
  {
    accessorKey: "lname",
    header: "",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
  },
  // {
  //   accessorKey: "Status",
  //   header: "Status",
  // },
  {
    id: 'actions',
    cell: ({ row }) => <ClientsAdminActions data={row.original} />
  }
];
