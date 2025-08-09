import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '@/features/products/components/product-view-page';
import { db } from '@/db/drizzle';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProductForm from '@/components/forms/product-form';



const Page = async ({params}: {params:Promise<{product: string}>}) => {
      let product = null;
      let pageTitle = 'New Order';

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        <ProductForm initialData={product} pageTitle={pageTitle} />;
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page