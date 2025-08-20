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
            <span className="text-md font-medium text-black">Name</span>
            <p className="text-black">{user.fname} {user.lname}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black">Email</span>
            <p className="text-black">{user.email}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black">Phone</span>
            <p className="text-black">{user.phone}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black">License #</span>
            <p className="text-black">{user.licenseNum}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black">Address</span>
            <div className="text-black">{user.street}, <br />{user.city} {user.state} {user.zip}</div>
          </div>

          <div>
            <span className="text-md font-medium text-black">Role</span>
            <div className="text-black">
              <Badge variant="secondary" className="text-md">{user.role}</Badge>
            </div>
          </div>

          <div>
            <span className="text-md font-medium text-black">Company</span>
            <p className="text-black">{user.companyName}</p>
          </div>

          <div>
            <span className="text-md font-medium text-black">Last Active</span>
            <p className="text-black">{user.lastActivityDate?.toLocaleString() || "-"}</p>
          </div>

          <div>
            <span className="text-md font-medium text-muted-foreground">Status</span>
            <p className="text-black">{user.statued}</p>
          </div>

          <div>
            <span className="text-md font-medium text-muted-foreground">Created At</span>
            <p className="text-black">{formatDate(user.createdAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
