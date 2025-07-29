'use client';

import { getUserProfile } from "@/lib/admin/order";
import { Session } from "next-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

type ProfileDetailsProps = {
  session: Session;
};

export default function UserFiles({ session }: ProfileDetailsProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const profile = await getUserProfile(session);
      setUser(profile);
    }
    fetchUser();
  }, [session]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(`Uploading ${label}:`, file);
    // TODO: Add upload logic here
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground text-base">
        User not found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <Card className="shadow-xl rounded-3xl border border-muted p-6">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold tracking-tight">Upload Documents</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 text-base">
          <div>
            <span className="text-md font-medium text-black">Real Estate License</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm"
              onChange={(e) => handleUpload(e, "License")}
            />
          </div>

          <div>
            <span className="text-md font-medium text-black">W9 Form</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm"
              onChange={(e) => handleUpload(e, "W9 Form")}
            />
          </div>

          <div>
            <span className="text-md font-medium text-black">E&O Insurance</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm"
              onChange={(e) => handleUpload(e, "E&O Insurance")}
            />
          </div>

          <div>
            <span className="text-md font-medium text-black">Background Check</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm"
              onChange={(e) => handleUpload(e, "Other")}
            />
          </div>

          <div className="md:col-span-2">
            <span className="text-md font-medium text-black">Billing Address</span>
            <div className="text-black">
              {user.street},<br />
              {user.city} {user.state} {user.zip}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
