"use client";

import { FileUploader } from "@/components/file-uploader";

export function ImagePicker({ userId, propId }: { userId: string; propId: string }) {
  async function handleUpload(files: File[]) {
    const body = new FormData();

    // append metadata
    body.append("userId", userId);
    body.append("propertyId", propId);

    // append each file
    files.forEach((file) => {
      body.append("file", file, file.name);
    });

    const response = await fetch("/api/img", {
      method: "POST",
      body,
    });

    if (!response.ok) {
      throw new Error("Failed to upload");
    }

    const result = await response.json();
    console.log("Uploaded:", result);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold">Photos Upload</h2>
      <FileUploader
        onUpload={handleUpload}
        multiple
        maxFiles={10}
        accept={{ "image/*": [] }}
      />
    </div>
  );
}
