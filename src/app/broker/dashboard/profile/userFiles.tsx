'use client';

import { Session } from "next-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ProfileDetailsProps = { 
  session: Session;
  user: any;
};

type Tag = "license" | "w9" | "insurance" | "background";
type FilesState = Partial<Record<Tag, File>>;

type ExistingFile = {
  uploadId: string;
  fileTag: Tag;
  fileUrl: string | null;
  expiration: string | null;
  objectKey: string | null;
  uploadTimestamp: string | null;
};

export default function UserFiles({ session, user }: ProfileDetailsProps) {
  // files chosen in this form
  const [files, setFiles] = useState<FilesState>({});

  // existing files already on server
  const [existing, setExisting] = useState<ExistingFile[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // metadata (no “state”)
  const [meta, setMeta] = useState({
    licenseNumber: "",
    eodate: "",
    redate: "",
    ein: "",
    policyNumber: "",
    backgroundDate: "",
  });

  // map existing by tag
  const existingByTag = useMemo(() => {
    const map: Partial<Record<Tag, ExistingFile>> = {};
    for (const f of existing) map[f.fileTag] = f;
    return map;
  }, [existing]);

  const hasFile = (tag: Tag) => Boolean(existingByTag[tag]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return;
      try {
        setLoadingExisting(true);
        const res = await fetch(`/api/uploads?userId=${encodeURIComponent(session.user.id as string)}`);
        if (!res.ok) throw new Error(await res.text());
        const data: ExistingFile[] = await res.json();
        setExisting(data);
      } catch (e) {
        console.error(e);
        toast.error("Could not load existing files");
      } finally {
        setLoadingExisting(false);
      }
    };
    load();
  }, [session?.user?.id]);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FilesState
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const tagMeta = (tag: Tag) => {
    switch (tag) {
      case "license":
        return { expirationDate: meta.redate };
      case "insurance":
        return { expirationDate: meta.eodate };
      case "background":
        return { expirationDate: meta.backgroundDate };
      case "w9":
      default:
        return { expirationDate: "" };
    }
  };

  const handleSubmit = async () => {
    try {
      let file: File | undefined;
      let tag: Tag | undefined;

      if (files.license)        { file = files.license; tag = "license"; }
      else if (files.w9)        { file = files.w9;      tag = "w9"; }
      else if (files.insurance) { file = files.insurance; tag = "insurance"; }
      else if (files.background){ file = files.background; tag = "background"; }

      if (!file || !tag) {
        toast.error("Please select a file before uploading");
        return;
      }

      if (hasFile(tag)) {
        const ok = confirm(`A ${tag} file exists. Replace it?`);
        if (!ok) return;
      }

      const { expirationDate } = tagMeta(tag);
      if ((tag === "license" || tag === "insurance" || tag === "background") && !expirationDate) {
        toast.error("Please set the expiration date");
        return;
      }

      const body = new FormData();
      if (expirationDate) body.append("expiration", expirationDate);
      body.append("file", file);
      body.append("fileTag", tag);
      if (session?.user?.id) body.append("userId", session.user.id as string);

      const res = await fetch("/api/uploads", { method: "POST", body });
      if (!res.ok) {
        console.error("Upload failed:", await res.text());
        toast.error("Upload failed");
        return;
      }

      toast.success("Upload successful");
      setFiles({});

      // refresh existing after upload
      const refreshed = await fetch(`/api/uploads?userId=${encodeURIComponent(session!.user!.id as string)}`);
      if (refreshed.ok) setExisting(await refreshed.json());
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error occurred");
    }
  };

  const TagStatus = ({ tag }: { tag: Tag }) => {
    const ef = existingByTag[tag];
    if (loadingExisting) return <span className="text-xs text-muted-foreground">Checking…</span>;
    if (!ef) return <span className="text-xs text-gray-500">No file on record</span>;
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
        Uploaded
        </span>
        {ef.expiration && (
          <span className="text-gray-600">
            Exp {new Date(ef.expiration).toLocaleDateString()}
          </span>
        )}
        {ef.fileUrl && (
          <a
            href={ef.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        )}
      </div>
    );
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
          {/* License */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-black">Real Estate License</span>
              <TagStatus tag="license" />
            </div>
            <Input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
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
            {files.license && (
              <div className="text-xs text-muted-foreground">
                Selected: {files.license.name}
              </div>
            )}
          </div>

          {/* W 9 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-black">W 9 Form</span>
              <TagStatus tag="w9" />
            </div>
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

          {/* Insurance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-black">E and O Insurance</span>
              <TagStatus tag="insurance" />
            </div>
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

          {/* Background */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-black">Background Check</span>
              <TagStatus tag="background" />
            </div>
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
            <Button onClick={handleSubmit}>Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
