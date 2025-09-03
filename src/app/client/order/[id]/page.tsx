import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { OpenOrder } from 'types';

import PcrForm from '@/components/forms/pcrForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FetchImages } from '../upload/fetchImg';
import { auth } from '@/lib/auth';
import { PropertyDetails } from './clientpropertyDetails';



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
        <PropertyDetails OrderDetails={orderDetails as OpenOrder}></PropertyDetails>
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page