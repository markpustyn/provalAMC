import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";

export async function RecentSales() {
  // total vendors
  const [{ total }] = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.role, "broker"));

  // 4 most recent vendors
  const vendors = await db
    .select({
      id: users.id,
      fname: users.fname,
      lname: users.lname,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, "broker"))
    .orderBy(desc(users.createdAt))
    .limit(6);

  return (
    <Card className="relative">
      {/* count badge in top left */}
      <span className="absolute right-3 top-3 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
        {total} total
      </span>

      <CardHeader>
        <CardTitle>Vendors</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {vendors.map((v) => (
            <div key={v.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={""} alt={"Avatar"} />
                <AvatarFallback>
                  {(v.fname ?? "NA")
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="ml-4 space-y-0.5">
                <p className="text-sm font-medium leading-none">
                  {v.fname ?? "Unknown User"}{v.lname ?? "Unknown User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {v.email ?? "no email"}
                </p>
              </div>

              <div className="ml-auto text-xs text-muted-foreground">
                {v.createdAt
                  ? new Date(v.createdAt).toLocaleDateString()
                  : ""}
              </div>
            </div>
          ))}

          {vendors.length === 0 && (
            <p className="text-sm text-muted-foreground">No vendors yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
