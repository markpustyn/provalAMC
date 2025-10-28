import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { OpenOrder } from 'types';

import { auth } from '@/lib/auth';
import { CompleteReport } from './completeReport';

const Page = async ({params}: {
  params:Promise<{id: string}>
}) => {
  const id = (await params).id
  const session = await auth()

  const [orderDetails] = await db.select().from(order).where(eq(order.orderId, id)).limit(1)

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        <CompleteReport OrderDetails={orderDetails as OpenOrder}></CompleteReport>
        {/* <PcrForm OrderDetails={orderDetails as OpenOrder} session={session}/> */}
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page