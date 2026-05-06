import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import ProductTableAction from '@/features/products/components/product-tables/product-table-action';
import AdminListingPage from '@/features/products/components/admin-listing';

export const metadata = {
  title: 'My Orders: Products'
};


export default async function Page() {


  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Quality Control'
            description='Quality control orders and manage order details'
          />
        </div>
        <Separator />
        <ProductTableAction />
        <Suspense
          // key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <AdminListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
