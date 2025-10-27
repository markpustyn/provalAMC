import { getUserProfile } from "@/lib/admin/order";
import { Session } from "next-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProfileDetailsProps = {
  session: Session;
};

export default async function ProfileDetails({ session }: ProfileDetailsProps) {
  const user = await getUserProfile(session);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground text-base">
        User not found.
      </div>
    );
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-6">
      <Card className="w-full shadow-xl rounded-3xl border border-muted p-8 md:p-10">
        <CardHeader className="border-b pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">
            User Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 pt-6 text-base">
          <div>
            <span className="text-md font-medium text-black dark:text-white">Name</span>
            <p className="text-black dark:text-white">{user.fname} {user.lname}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black dark:text-white">Email</span>
            <p className="text-black dark:text-white">{user.email}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black dark:text-white">Phone</span>
            <p className="text-black dark:text-white">{user.phone}</p>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <span className="text-md font-medium text-black dark:text-white">Address</span>
            <div className="text-black dark:text-white">
              {user.street},<br />
              {user.city} {user.state} {user.zip}
            </div>
          </div>

          <div>
            <span className="text-md font-medium text-black dark:text-white">Role</span>
            <div className="text-black dark:text-white">
              <Badge variant="secondary" className="text-md">{user.role}</Badge>
            </div>
          </div>

          <div>
            <span className="text-md font-medium text-black dark:text-white">Company</span>
            <p className="text-black dark:text-white">{user.companyName}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black dark:text-white">Last Active</span>
            <p className="text-black dark:text-white">{user.lastActivityDate?.toLocaleString() || "-"}</p>
          </div>
          <div>
            <span className="text-md font-medium text-muted-foreground dark:text-white">Created At</span>
            <p className="text-black dark:text-white">{formatDate(user.createdAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
