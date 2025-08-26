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
import ClientComplete from '@/features/client/clientComplete';


export const metadata = {
  title: 'Completed Orders'
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
            title='Completed Orders'
            description=''
          />
        </div>
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ClientComplete/>
        </Suspense>
      </div>
    </PageContainer>
  );
}
