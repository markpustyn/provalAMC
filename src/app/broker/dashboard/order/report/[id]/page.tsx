import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { OpenOrder } from 'types';

import NewForm30 from '@/components/forms/form30';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/lib/auth';


const Page = async ({params}: { params: {id: string}}) => {
  const session = await auth()
  const id = (await params).id


  const [orderDetails] = await db.select().from(order).where(eq(order.orderId, id)).limit(1)

    if (!orderDetails) {
    return <div className="p-6 text-xl text-red-500">Order not found.</div>;
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        {/* <PropertyDetails OrderDetails={orderDetails as OpenOrder}></PropertyDetails> */}
        <NewForm30 OrderDetails={orderDetails as OpenOrder} session={session}/>
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page