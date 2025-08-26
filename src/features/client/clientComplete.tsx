import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { db } from '@/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { order, statusOrder, users } from '@/db/schema';
import { OpenOrder } from 'types';
import { auth } from '@/lib/auth';
import { clientCompleteColumns } from '../products/components/product-tables/clientCompleteColumns';


export default async function ClientComplete() {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) return null;

  const data = (await db
    .select()
    .from(order)
    .where(and(eq(order.clientId, sessionUserId), eq(order.status, 'submitted')))
    
  ) as OpenOrder[];
  console.log(data)

  const totalProducts = data.length;

  return (
    <ProductTable
      columns={clientCompleteColumns}
      data={data}
      totalItems={totalProducts}
    />
  );
}
