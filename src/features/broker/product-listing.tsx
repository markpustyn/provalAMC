import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { db } from '@/db/drizzle';
import { desc } from 'drizzle-orm';
import { order } from '@/db/schema';
import { OpenOrder } from 'types';

type BrokerListingPage = {};

export default async function BrokerListingPage({}: BrokerListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  // const page = searchParamsCache.get('page');
  // const search = searchParamsCache.get('q');
  // const pageLimit = searchParamsCache.get('limit');
  // const categories = searchParamsCache.get('categories');

  // const filters = {
  //   page,
  //   limit: pageLimit,
  //   ...(search && { search }),
  //   ...(categories && { categories: categories })
  // };

  const orders = (await db.select().from(order)) as OpenOrder[]
  const totalProducts = orders.length
  return (
    <ProductTable
      columns={columns}
      data={orders}
      totalItems={totalProducts}
    />
  );
}
