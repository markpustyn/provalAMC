import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import { db } from '@/db/drizzle';
import { and, eq, not, exists } from 'drizzle-orm';
import { order, vendorZipCodes, statusOrder } from '@/db/schema';
import { OpenOrder } from 'types';
import { Session } from "next-auth";
import { getUserProfile } from '@/lib/admin/order';

type BrokerOpenListing = {
  session: Session;
};

export default async function BrokerOpenListing({ session }: BrokerOpenListing) {
  const user = await getUserProfile(session);
  if (!user) return null;

  const orders = (
    await db
      .select()
      .from(order)
      .innerJoin(vendorZipCodes, eq(order.propertyZip, vendorZipCodes.zipCode))
      .where(
        and(
          eq(vendorZipCodes.userId, user.id),
          eq(order.status, 'Unassigned'),
          not(
            exists(
              db
                .select()
                .from(statusOrder)
                .where(
                  and(
                    eq(statusOrder.vendorId, user.id),
                    eq(statusOrder.propOrderId, order.orderId),
                    eq(statusOrder.propStatus, 'declined')
                  )
                )
            )
          )
        )
      )
  ).map((entry) => entry.order) as OpenOrder[];

  return (
    <ProductTable
      columns={columns}
      data={orders}
      totalItems={orders.length}
    />
  );
}
