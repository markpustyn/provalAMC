'use client'
import { Session } from 'next-auth';
import AppSidebar from './app-sidebar';
import { usePathname } from 'next/navigation';


interface SidebarWrapperProps {
  session: Session | null;
}

export default function SidebarWrapper({ session }: SidebarWrapperProps) {
  const pathname = usePathname()

  
  return <AppSidebar session={session} pathname={pathname} />;
} 