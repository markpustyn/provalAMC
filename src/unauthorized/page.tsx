"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UnauthorizedPage() {
  const params = useSearchParams();
  const router = useRouter();

  // expected values: "client" or "broker"
  const required = params.get("required") ?? "client";
  const have = params.get("have") ?? "guest";

  const title = "Access denied";
  const lines = {
    client: "This page is for clients",
    broker: "This page is for brokers",
  } as const;

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <Card className="w-full max-w-lg shadow-xl rounded-3xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl">{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            You are signed in as{" "}
            <Badge variant="secondary" className="mx-1">
              {have}
            </Badge>
            but this page requires{" "}
            <Badge className="mx-1">{required}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-base">
            {required === "client" ? lines.client : lines.broker}. If you think this is a mistake, try reloading or contact support.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.back()}>Go back</Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Go to dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/switch-role?to=${required}`)}
            >
              Switch to {required}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Need both roles? Ask an admin to grant access.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
