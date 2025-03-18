import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { after } from 'next/server';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};


export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const session = await auth()
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  after(async() => {
    if(!session?.user?.id) return

    const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1)

    if(user[0].lastActivityDate == new Date().toISOString().slice(0,10))
      return;

    await db.update(users).set({lastActivityDate: new Date().toISOString()
      .slice(0,10)})
      .where(eq(users.id, session?.user?.id))
  })
  
  

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
