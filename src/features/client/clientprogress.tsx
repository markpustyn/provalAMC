import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { db } from '@/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { order, statusOrder, users } from '@/db/schema';
import { OpenOrder } from 'types';
import { auth } from '@/lib/auth';
import { clientColumns } from '../products/components/product-tables/clientColumn';

export default async function ClientProgress() {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) return null;

  const data = (await db
    .select()
    .from(order)
    .where(eq(order.clientId, sessionUserId))
    
  ) as OpenOrder[];

  const totalProducts = data.length;

  return (
    <ProductTable
      columns={clientColumns}
      data={data}
      totalItems={totalProducts}
    />
  );
}
