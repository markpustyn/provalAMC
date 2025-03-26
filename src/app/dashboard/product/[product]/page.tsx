import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '@/features/products/components/product-view-page';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';



const Page = async ({params}: {
  params:Promise<{product: string}>
}) => {
  const id = (await params).product
  console.log("loadnNUm" + id)

  const [orderDetails] = await db.select().from(order).where(eq(order.loanNumber, id)).limit(1)

    console.log(orderDetails)
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        {/* <Suspense fallback={<FormCardSkeleton />}>
          <ProductViewPage productId={(await params).product} />
        </Suspense> */}
      {orderDetails.borrowerName}
      {orderDetails.mainProduct}
      {orderDetails.propertyState}
      {orderDetails.propertyZip}
      </div>
    </PageContainer>
  );
}
export default Page