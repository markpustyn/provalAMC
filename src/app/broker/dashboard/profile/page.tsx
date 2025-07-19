import ProfilePage from './profileInfo'
import { auth } from '@/lib/auth'

async function Profile() {
   const session = await auth()
  
  return (
    <div><ProfilePage session={session!}/></div>
  )
}

export default Profile