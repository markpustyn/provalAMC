import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmailButton from './emailbtn'

export default async function Page() {
  const session = await auth()

  if (!session?.user?.id) redirect('/sign-in')

  const user = await db
    .select({
      id: users.id,
      fname: users.fname,
      lname: users.lname,
      email: users.email,
      phone: users.phone,
      companyName: users.companyName,
      licenseNum: users.licenseNum,
      street: users.street,
      city: users.city,
      state: users.state,
      zip: users.zip,
      role: users.role,
      statued: users.statued,
      lastActivityDate: users.lastActivityDate,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0])

  if (!user) redirect('/sign-in')

  if (user.role !== 'admin') redirect('/broker/dashboard')

  return (
    <div className='space-y-6 px-12'>
      <div>
        <h1 className='text-2xl font-bold'>Admin Profile</h1>
        <p className='text-sm text-muted-foreground'>
          View your account, company, and contact information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2'>
          <ProfileItem label='First Name' value={user.fname} />
          <ProfileItem label='Last Name' value={user.lname} />
          <ProfileItem label='Email' value={user.email} />
          <ProfileItem label='Phone' value={user.phone} />
          <ProfileItem label='Role' value={user.role} />
          <ProfileItem label='Status' value={user.statued} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2'>
          <ProfileItem label='Company Name' value={user.companyName} />
          <ProfileItem label='License Number' value={user.licenseNum} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2'>
          <ProfileItem label='Street' value={user.street} />
          <ProfileItem label='City' value={user.city} />
          <ProfileItem label='State' value={user.state} />
          <ProfileItem label='Zip Code' value={user.zip} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Activity</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2'>
          <ProfileItem
            label='Last Activity'
            value={user.lastActivityDate?.toString()}
          />
          <ProfileItem
            label='Created At'
            value={user.createdAt?.toLocaleString()}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileItem({
  label,
  value
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className='space-y-1'>
      <p className='text-sm font-medium text-muted-foreground'>{label}</p>
      <p className='text-base font-semibold'>{value || 'Not provided'}</p>
    </div>
  )
}