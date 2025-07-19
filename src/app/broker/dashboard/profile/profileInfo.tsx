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
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-xl rounded-3xl border border-muted p-6">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4">
          <ProfileItem label="Name" value={`${user.fname} ${user.lname}`} />
          <ProfileItem label="Email" value={user.email} />
          <ProfileItem label="Phone" value={user.phone} />
          <ProfileItem label="Company" value={user.companyName} />
          <ProfileItem label="License #" value={user.licenseNum} />
          <ProfileItem label="Address" value={`${user.street}, ${user.city}, ${user.state} ${user.zip}`} />
          <ProfileItem label="Role" value={<Badge variant="outline">{user.role}</Badge>} />
          <ProfileItem label="Status" value={user.statued} />
          <ProfileItem label="Last Active" value={user.lastActivityDate?.toLocaleString()} />
          <ProfileItem label="Created At" value={formatDate(user.createdAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col text-base">
      <span className="font-semibold text-black">{label}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
