import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { OpenOrder } from 'types';
import OrderDetails from '@/features/broker/order-details';
import PcrForm from '@/components/forms/pcrForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FetchImages } from '../upload/fetchImg';
import { auth } from '@/lib/auth';


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
        {/* <OrderDetails OrderDetails={orderDetails as OpenOrder}></OrderDetails> */}
        <PcrForm OrderDetails={orderDetails as OpenOrder}/>
        <FetchImages userId={session?.user?.id!} propId={orderDetails.orderId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page