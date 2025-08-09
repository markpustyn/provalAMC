import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '@/features/products/components/product-view-page';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { OpenOrder } from 'types';
import { PropertyDetails } from './propertyDetails';
import { notFound } from 'next/navigation';


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const [row] = await db.select().from(order).where(eq(order.orderId, id)).limit(1);
  if (!row) notFound();

  const orderDetails = row as OpenOrder;



  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        <PropertyDetails OrderDetails={orderDetails as OpenOrder} ></PropertyDetails>
        </Suspense>
      </div>
    </PageContainer>
  );
}
