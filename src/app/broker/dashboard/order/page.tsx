import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BrokerProgress from '@/features/broker/progress-order';


export const metadata = {
  title: 'Orders In Progress'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in");

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Orders In Progress'
            description=''
          />
        </div>
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
        >
          <BrokerProgress/>
        </Suspense>
      </div>
    </PageContainer>
  );
}
