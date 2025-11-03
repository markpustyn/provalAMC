import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { db } from '@/db/drizzle';
import { billing } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Details from '../details';
import { BillingStatus } from 'types';



const Page = async ({params}: {
  params:Promise<{id: string}>
}) => {
  const id = (await params).id

  const [paymentDetails] = await db.select().from(billing);

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        {/* <Details BillingDetails={paymentDetails as BillingStatus}></Details> */}
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page 