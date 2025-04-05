import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { db } from '@/db/drizzle';
import { desc, eq } from 'drizzle-orm';
import { billing, order } from '@/db/schema';
import { BillingStatus } from 'types';
import { billingColumns } from '../billingColumns';

type BillingListing = {};

export default async function BillingListing({}: BillingListing) {
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

  const billingDataRaw = await db.select()
  .from(billing)
  .leftJoin(order, eq(billing.propOrderId, order.orderId))
  
const billingData: BillingStatus[] = billingDataRaw.map(row => ({
    ...row.billing,
    ...row.order
  }));
  const totalProducts = billingData.length

  return (
    <ProductTable
      columns={billingColumns}
      data={billingData}
      totalItems={totalProducts}
    />
  );
}
