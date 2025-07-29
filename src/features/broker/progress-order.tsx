import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/progress-column';
import { db } from '@/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { order, statusOrder, users } from '@/db/schema';
import { OpenOrder } from 'types';
import { auth } from '@/lib/auth';

export default async function BrokerProgress() {
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
        eq(statusOrder.propStatus, 'assigned')
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
