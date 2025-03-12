import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 shadow-lg max-w-md text-center bg-white rounded-2xl">
        <CardContent className="flex flex-col items-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h1 className="text-2xl font-bold">Too Many Requests</h1>
          <p className="text-gray-600 text-xl">You've sent too many requests. Please try again later.</p>
        </CardContent>
      </Card>
    </div>
  );
}
