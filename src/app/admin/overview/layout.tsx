import PageContainer from '@/components/layout/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

const sampleStats = {
  openOrders: 24,
  existingOrders: 128,
  newOrders: 7,
  vendors: 36,
  completedReports: 89,
  pendingReview: 12,
  overdueOrders: 4,
  monthlyOrders: 52
}

export default async function AdminDashboardLayout({
  open_orders,
  existing_orders,
  new_orders,
  history,
  vendors,
  bar_stats,
  area_stats,
  pie_stats
}: {
  open_orders: React.ReactNode
  existing_orders: React.ReactNode
  new_orders: React.ReactNode
  history: React.ReactNode
  vendors: React.ReactNode
  bar_stats: React.ReactNode
  area_stats: React.ReactNode
  pie_stats: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) redirect('/sign-in')

  const isAdmin = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.role === 'admin')

  if (!isAdmin) redirect('/broker/dashboard')

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Blue Grid Admin Dashboard
          </h1>
          <p className='text-sm text-muted-foreground'>
            Manage orders, vendors, inspections, and report activity.
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Open Orders'
            value={sampleStats.openOrders}
            description='Orders currently in progress'
          />

          <StatsCard
            title='Existing Orders'
            value={sampleStats.existingOrders}
            description='Total active client orders'
          />

          <StatsCard
            title='New Orders'
            value={sampleStats.newOrders}
            description='Orders submitted today'
          />

          <StatsCard
            title='Vendors'
            value={sampleStats.vendors}
            description='Active inspection vendors'
          />

          <StatsCard
            title='Completed Reports'
            value={sampleStats.completedReports}
            description='Reports completed this month'
          />

          <StatsCard
            title='Pending Review'
            value={sampleStats.pendingReview}
            description='Reports waiting for admin review'
          />

          <StatsCard
            title='Overdue Orders'
            value={sampleStats.overdueOrders}
            description='Orders past the due date'
          />

          <StatsCard
            title='Monthly Orders'
            value={sampleStats.monthlyOrders}
            description='New orders created this month'
          />
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='lg:col-span-7'>{area_stats}</div>

          <div className='lg:col-span-4'>{open_orders}</div>
          <div className='lg:col-span-3'>{new_orders}</div>

          <div className='lg:col-span-4'>{existing_orders}</div>
          <div className='lg:col-span-3'>{vendors}</div>

          <div className='lg:col-span-7'>{history}</div>
        </div>
      </div>
    </PageContainer>
  )
}

function StatsCard({
  title,
  value,
  description
}: {
  title: string
  value: number
  description: string
}) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  )
}