import ProfilePage from './profileInfo';
import { auth } from '@/lib/auth';
import { getUserProfile } from '@/lib/admin/order';
import { db } from '@/db/drizzle';
import { zipCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';

import PageContainer from '@/components/layout/page-container';

async function Profile() {
  const session = await auth();
  const user = await getUserProfile(session!);
  const state = user?.state;

  if (!state) throw new Error("User state is missing");

  const counties = await db
    .selectDistinct({ county: zipCodes.countyName })
    .from(zipCodes)
    .where(eq(zipCodes.stateName, state));

  return (
        <PageContainer scrollable={true}>
          <div className='flex flex-1 flex-col space-y-4'>
            <ProfilePage session={session!} />
          </div>
        </PageContainer>
  );
}

export default Profile;
