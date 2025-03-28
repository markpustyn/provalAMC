import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '@/features/products/components/product-view-page';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Details from './details';
import { OpenOrder } from 'types';



const Page = async ({params}: {
  params:Promise<{product: string}>
}) => {
  const id = (await params).product

  const [orderDetails] = await db.select().from(order).where(eq(order.loanNumber, id)).limit(1)

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        <Details orderDetails={orderDetails as OpenOrder}></Details>
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page