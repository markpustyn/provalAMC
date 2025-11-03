import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { db } from '@/db/drizzle';
import { users, vendorFiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Details from '../details';
import { AuthCredentials } from 'types';
import OrdersList from '../ordersList';



const Page = async ({params}: {
  params:Promise<{id: string}>
}) => {
  const id = (await params).id

  const [vendorDetails] = 
  await db.select()
  .from(users).where(eq(users.id, id)).limit(1)

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
        <Details vendorDetails={vendorDetails as AuthCredentials}></Details>
        <OrdersList vendorDetails={vendorDetails as AuthCredentials}/>
        </Suspense>
      </div>
    </PageContainer>
  );
}
export default Page 