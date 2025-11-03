import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { db } from '@/db/drizzle';
import {  eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { AuthCredentials } from 'types';
import { clientColumns } from '../clientColumnst';

type VendorListingPage = {};

export default async function ClientListingPage({}: VendorListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const vendors = (await db.select().from(users).where(eq(users.role, "client"))) as AuthCredentials[]
  const totalProducts = vendors.length

  return (
    <ProductTable
      columns={clientColumns}
      data={vendors}
      totalItems={totalProducts}
    />
  );
}
