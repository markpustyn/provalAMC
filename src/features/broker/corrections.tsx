import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/progress-column';
import { db } from '@/db/drizzle';
import {  eq } from 'drizzle-orm';
import { order, statusOrder, users } from '@/db/schema';
import { OpenOrder } from 'types';
import { auth } from '@/lib/auth';

export default async function Corrections() {
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
  const session = await auth()
  const sessionUserId = session?.user?.id
  const data = (await db
    .select()
    .from(order)
    .leftJoin(statusOrder, eq(order.orderId, statusOrder.propOrderId))
    .leftJoin(users, eq(users.id, statusOrder.vendorId))
    .where(eq(users.id, sessionUserId!))) as OpenOrder[];

  
  const orders = data.map(item => item.order);
  const totalProducts = orders.length
  console.log(orders)
  return (
    <ProductTable
      columns={columns}
      data={orders}
      totalItems={totalProducts}
    />
  );
}
