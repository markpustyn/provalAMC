"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-700 mb-6">
        You dont have permission to view this page.
      </p>
      <div className="flex gap-4">
        <Button variant="default" onClick={() => router.push("/")}>
          Go Home
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
