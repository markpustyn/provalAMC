import ProfilePage from './profileInfo'
import { auth } from '@/lib/auth'
import { ServiceArea } from './serviceArea'
import { getUserProfile } from '@/lib/admin/order';
import { db } from '@/db/drizzle';
import { zipCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function Profile() {
   const session = await auth()
   const user = await getUserProfile(session!);
   const state = user?.state;

  
  if (!state) throw new Error("User state is missing");

  // Get all counties in the same state
  let counties = await db
    .selectDistinct({ county: zipCodes.countyName })
    .from(zipCodes)
    .where(eq(zipCodes.stateName, state));
  
  return (
    <div className='flex'>
      <ProfilePage session={session!}/>
      <ServiceArea counties={counties} sessionId={session?user.id: ''} />
      
      </div>
  )
}

export default Profile