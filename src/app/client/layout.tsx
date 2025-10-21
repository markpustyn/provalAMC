import KBar from '@/components/kbar';
import SidebarWrapper from '@/components/layout/sidebar-wrapper';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import ClientSideBar from '@/components/layout/client-sidebar';
import { redirect } from 'next/navigation';


export const metadata: Metadata = {
  title: 'Blue Grid Client',
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
  if(session?.user.role !== 'client'){
    redirect('/')
  }

  return (
    <KBar>
      <SidebarProvider 
      // defaultOpen={defaultOpen}
      >
        <ClientSideBar session={session} pathname={''} />
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
