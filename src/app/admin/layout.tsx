import KBar from '@/components/kbar';
import SidebarWrapper from '@/components/layout/sidebar-wrapper';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { after } from 'next/server';


export const metadata: Metadata = {
  title: 'Blue Grid Admin',
};


export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const session = await auth()
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  
  if (!session?.user?.id) redirect("/sign-in");
  
  const isAdmin = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.role === "admin");

  if (!isAdmin) redirect("/broker/dashboard");

  // if(users[0].lastActivityDate == new Date().toISOString().slice(0,10))
  //   return;

  // await db.update(users).set({lastActivityDate: new Date().toISOString()
  //   .slice(0,10)})
  //   .where(eq(users.id, session?.user?.id))
  
  

  return (
    <KBar>
      <SidebarProvider 
      // defaultOpen={defaultOpen}
      >
        <SidebarWrapper session={session} />
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
