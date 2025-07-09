import { SearchParams } from 'nuqs/server';
import ProfileViewPage from '@/features/profile/components/profile-view-page';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import OrdersList from '../orders/ordersList';


type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'My Orders : Profile'
};

export default async function Page({ searchParams }: pageProps) {
  const session = await auth()
      if (!session?.user?.id) redirect("/sign-in");
      
      const isAdmin = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .then((res) => res[0]?.role === "admin");
    
      if (!isAdmin) redirect("/broker/dashboard");
  return <OrdersList />;
}
