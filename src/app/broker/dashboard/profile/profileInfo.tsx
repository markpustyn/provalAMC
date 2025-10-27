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
    <div className="mx-auto w-full">
      <Card className="shadow-xl rounded-3xl border border-muted p-6">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold tracking-tight">User Profile</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 text-base">
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

          <div>
            <span className="text-md font-medium text-black dark:text-white">License #</span>
            <p className="text-black dark:text-white">{user.licenseNum}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black dark:text-white">Address</span>
            <div className="text-black dark:text-white">{user.street}, <br />{user.city} {user.state} {user.zip}</div>
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
            <span className="text-md font-medium text-muted-foreground dark:text-white">Status</span>
            <p className="text-black dark:text-white">{user.statued}</p>
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
