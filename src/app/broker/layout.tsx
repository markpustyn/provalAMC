import KBar from '@/components/kbar';
import BrokerSideBar from '@/components/layout/broker-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export const metadata: Metadata = {
  title: 'AMC Broker',
  description: 'Basic dashboard with Next.js and Shadcn'
};


export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  // const session = await auth()
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';  
   const session = await auth()
    if(session?.user.role !== 'broker'){
      redirect('/')
    }

  

  return (
    <KBar>
      <SidebarProvider 
      // defaultOpen={defaultOpen}
      >
        <BrokerSideBar session={session} pathname={''} />
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
