import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import ProductListingPage from '@/features/products/components/product-listing';
import ProductTableAction from '@/features/products/components/product-tables/product-table-action';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import BrokerListingPage from '@/features/broker/open-orders';



export const metadata = {
  title: 'Avalible Orders'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in");

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Avaliable Orders'
            description=''
          />
        </div>
        <Suspense
          // key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <BrokerListingPage session={session}/>
        </Suspense>
      </div>
    </PageContainer>
  );
}
