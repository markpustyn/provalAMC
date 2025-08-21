import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { db } from '@/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { order, statusOrder, users } from '@/db/schema';
import { OpenOrder } from 'types';
import { auth } from '@/lib/auth';
import { columns } from '../products/components/product-tables/columns';

export default async function ClientProgress() {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) return null;

  const data = (await db
    .select()
    .from(order)
    .innerJoin(statusOrder, eq(order.orderId, statusOrder.propOrderId))
    .innerJoin(users, eq(users.id, statusOrder.vendorId))
    .where(
      and(
        eq(statusOrder.vendorId, sessionUserId),
        eq(order.status, 'assigned')
      )
    )
  ) as OpenOrder[];

  const orders = data.map(item => item.order);
  const totalProducts = orders.length;

  return (
    <ProductTable
      columns={columns}
      data={orders}
      totalItems={totalProducts}
    />
  );
}
