import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BrokerListingPage from '@/features/broker/open-orders';
import MainProduct from '@/components/forms/mainProduct';



export const metadata = {
  title: 'Blue Grid Portal'
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
    <PageContainer scrollable={true}>

      <div className='flex flex-1 flex-col space-y-4 p-4'>
                {/* <Heading
          title='Create New Order'
          description=''
        /> */}
          <MainProduct/>
      </div>
    </PageContainer>
  );
}
