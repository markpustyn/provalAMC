import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '@/features/products/components/product-view-page';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { OpenOrder } from 'types';
import OrderDetails from '@/features/broker/order-details';
import PcrForm from '@/components/forms/pcrForm';


const Page = async ({params}: {
  params:Promise<{id: string}>
}) => {
  const id = (await params).id

  const [orderDetails] = await db.select().from(order).where(eq(order.orderId, id)).limit(1)

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        {/* <OrderDetails OrderDetails={orderDetails as OpenOrder}></OrderDetails> */}
        <PcrForm OrderDetails={orderDetails as OpenOrder}/>
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page