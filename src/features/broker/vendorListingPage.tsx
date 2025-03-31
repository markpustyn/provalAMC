import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { db } from '@/db/drizzle';
import { desc } from 'drizzle-orm';
import { order, users } from '@/db/schema';
import { AuthCredentials } from 'types';
import { vendorColumns } from '@/features/products/vendorColumns'
vendorColumns

type VendorListingPage = {};

export default async function VendorListingPage({}: VendorListingPage) {
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

  const vendors = (await db.select().from(users)) as AuthCredentials[]
  const totalProducts = vendors.length

  return (
    <ProductTable
      columns={vendorColumns}
      data={vendors}
      totalItems={totalProducts}
    />
  );
}
