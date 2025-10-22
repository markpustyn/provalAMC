'use client';

import { getUserProfile } from "@/lib/admin/order";
import { Session } from "next-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ProfileDetailsProps = { 
  session: Session 
  user: any;
};

type FilesPayload = {
  license?: File;
  w9?: File;
  insurance?: File;
  background?: File;
};


export default function UserFiles({ session, user }: ProfileDetailsProps) {

  // files
  const [files, setFiles] = useState<{
    license?: File;
    w9?: File;
    insurance?: File;
    background?: File;
  }>({});

  // metadata (4 inputs)
  const [meta, setMeta] = useState({
    licenseNumber: "",
    state: "",
    eodate: "",
    redate: "",
    ein: "",
    policyNumber: "",
    backgroundDate: "",
  });



  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof files
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const tagMeta = (tag: "license" | "w9" | "insurance" | "background") => {
  switch (tag) {
    case "license":
      return {
        expirationDate: meta.redate,          // Real Estate license exp
        extras: { licenseNumber: meta.licenseNumber, state: meta.state },
      };
    case "insurance":
      return {
        expirationDate: meta.eodate,          // E&O exp
        extras: { policyNumber: meta.policyNumber },
      };
    case "background":
      return {
        expirationDate: meta.backgroundDate,  // Background exp
        extras: {},
      };
    case "w9":
      return { expirationDate: "", extras: { ein: meta.ein } }; // typically no exp
    default:
      return { expirationDate: "", extras: {} };
  }
};

const handleSubmit = async () => {
    try {
    let file: File | undefined;
    let tag: "license" | "w9" | "insurance" | "background" | undefined;

    if (files.license)      { file = files.license; tag = "license"; }
    else if (files.w9)      { file = files.w9;      tag = "w9"; }
    else if (files.insurance){ file = files.insurance; tag = "insurance"; }
    else if (files.background){ file = files.background; tag = "background"; }

    if (!file || !tag) {
      toast.error("Please select a file before uploading");
      return;
    }
    
    const { expirationDate, extras } = tagMeta(tag);

    if ((tag === "license" || tag === "insurance" || tag === "background") && !expirationDate) {
      toast.error("Please set the expiration date");
      return;
    }

    const body = new FormData();
    if (expirationDate) body.append("expiration", expirationDate);
    body.append("file", file);
    body.append("fileTag", tag);
    

    if (session?.user?.id) {
      body.append("userId", session.user.id as string);
    }

    const res = await fetch("/api/uploads", {
      method: "POST",
      body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload failed:", errorText);
      toast.error("Upload failed");
      return;
    }

    const result = await res.json();
    toast.success("Upload successful!");

    setFiles({}); // reset files
  } catch (err) {
    console.error("Unexpected error:", err);
    toast.error("Unexpected error occurred");
  }
};



  return (
    <div className="mx-auto w-full">
      <Card className="shadow-xl rounded-3xl border border-muted p-6">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Upload Documents
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-4 text-base">
          {/* License + License # */}
          <div className="space-y-2">
            <span className="text-xl font-medium text-black">Real Estate License</span>
            <Input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,"
              onChange={(e) => handleUpload(e, "license")}
            />
            <Input
              placeholder="License Number"
              value={meta.licenseNumber}
              onChange={(e) => setMeta(m => ({ ...m, licenseNumber: e.target.value }))}
            />
            <p>Expiration Date</p>
            <Input
              type="date"
              value={meta.redate}
              onChange={(e) => setMeta(m => ({ ...m, redate: e.target.value }))}
            />
            {files.insurance && (
              <div className="text-xs text-muted-foreground">
                Selected: {files.insurance.name}
              </div>
            )}
            {files.license && (
              <div className="text-xs text-muted-foreground">
                Selected: {files.license.name}
              </div>
            )}
          </div>

          {/* W-9 + EIN */}
          <div className="space-y-2">
            <span className="text-xl font-medium text-black">W-9 Form</span>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleUpload(e, "w9")}
            />
            <Input
              placeholder="SSN"
              value={meta.ein}
              onChange={(e) => setMeta(m => ({ ...m, ein: e.target.value }))}
            />
            {files.w9 && (
              <div className="text-xs text-muted-foreground">
                Selected: {files.w9.name}
              </div>
            )}
          </div>

          {/* E&O + Policy # */}
          <div className="space-y-2">
            <span className="text-xl font-medium text-black">E&O Insurance</span>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleUpload(e, "insurance")}
            />
            <p>Expiration Date</p>
            <Input
              type="date"
              value={meta.eodate}
              onChange={(e) => setMeta(m => ({ ...m, eodate: e.target.value }))}
            />
            {files.insurance && (
              <div className="text-xs text-muted-foreground">
                Selected: {files.insurance.name}
              </div>
            )}
          </div>

          {/* Background + Date */}
          <div className="space-y-2">
            <span className="text-xl font-medium text-black">Background Check</span>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleUpload(e, "background")}
            />
            <p>Expiration Date</p>
            <Input
              type="date"
              value={meta.backgroundDate}
              onChange={(e) => setMeta(m => ({ ...m, backgroundDate: e.target.value }))}
            />
            {files.background && (
              <div className="text-xs text-muted-foreground">
                Selected: {files.background.name}
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <span className="text-[18px] font-medium text-black">Billing Address</span>
            <div className="text-black"> 
              {user.street}<br />
              {user.city} {user.state} {user.zip}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setFiles({})}>
              Clear
            </Button>
            <Button onClick={() => handleSubmit()}>Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
