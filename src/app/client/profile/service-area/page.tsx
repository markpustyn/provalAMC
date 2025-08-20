
import { auth } from '@/lib/auth';
import { getUserProfile } from '@/lib/admin/order';
import { db } from '@/db/drizzle';
import { zipCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PageContainer from '@/components/layout/page-container';
import { ListedZips } from '../listedZips';
import { ServiceArea } from '../serviceArea';

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
            <div className='flex items-start justify-between'>
                <div className="w-full px-6" >
                  <div className="flex flex-col lg:flex-row gap-6 w-full">
                    {/* Left side: Profile + Service Area */}
                    <div className="flex flex-col w-full lg:w-1/2 gap-6">
                      <ServiceArea counties={counties} sessionId={user?.id ?? ''} />
                    </div>

                    {/* Right side: Listed Zips */}
                    <div className="w-full lg:w-1/2">
                      <ListedZips sessionId={user?.id ?? ''} />
                    </div>
                  </div>
                </div>
          </div>
          </div>
        </PageContainer>
  );
}

export default Profile;
