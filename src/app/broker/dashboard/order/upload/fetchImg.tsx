"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { FileUploader } from "@/components/file-uploader";
import { Textarea } from "@/components/ui/textarea";


type ImageKey = { Key: string; imgTag?: string };
type SignedUrlResponse = { src: string };

interface FileCardProps {
  fileKey: string;
  onRemove: () => void;
  progress?: number;
  imgTag?: string;
}

const formSchema = z.object({
  tag: z.string().min(2, {
    message: "Select Tag"
  })
});

export function FetchImages({ userId, propId }: { userId: string; propId: string }) {
  const [images, setImages] = useState<ImageKey[]>([]);
  const [loading, setLoading] = useState(true);
  
  

  async function handleUpload(files: File[]) {
    const body = new FormData();
    body.append("userId", userId);
    body.append("propertyId", propId);

    files.forEach((file) => {
      body.append("file", file, file.name);
    });

    const response = await fetch(`/api/img/`, {
      method: "POST",
      body,
    });

    if (!response.ok) {
      toast.error("Upload failed");
      return;
    }

    const result = await response.json();
    console.log("Uploaded:", result);
    toast.success("Upload successful!");


    await fetchKeys();
  }

    const fetchKeys = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/img?propId=${propId}`);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server error:", res.status, errorText);
          toast.error("Server error fetching images.");
          return;
        }
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Network error fetching image keys", err);
        toast.error("Network error fetching images.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleRemove = async (fileKey: string) => {
    try {
      const res = await fetch(`/api/img/${encodeURIComponent(fileKey)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete image");

      setImages((prev) => prev.filter((img) => img.Key !== fileKey));
      toast.success("Image Deleted Successfully!");
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold">Photos Upload</h2>

      {/* ✅ Single uploader at top */}
      <FileUploader
        onUpload={handleUpload}
        multiple
        maxFiles={20}
        accept={{ "image/*": [] }}
      />

      {/* ✅ Display uploaded images */}
      <div className="grid grid-cols-1 gap-6">
        {images.map((image) => (
          <FileCard
            key={image.Key}
            fileKey={image.Key}
            imgTag={image.imgTag}
            onRemove={() => handleRemove(image.Key)} />
        ))}
      </div>
    </div>
  );
}

function FileCard({ fileKey, progress, onRemove, imgTag }: FileCardProps) {
  const [src, setSrc] = useState<string | null>(null);
const predefinedTags = [
  "Street Sign",
  "Left Side",
  "Right Side",
  "Front",
  "Address",
  "Street Left",
  "Street Right",
  "Across the Street",
];

const [selectedValue, setSelectedValue] = useState(
  imgTag && !predefinedTags.includes(imgTag) ? "Other" : imgTag || ""
);

const [customValue, setCustomValue] = useState(
  imgTag && !predefinedTags.includes(imgTag) ? imgTag : ""
);


  useEffect(() => {
    async function fetchSignedUrl() {
      try {
        const res = await fetch(`/api/img/${encodeURIComponent(fileKey)}`);
        const data: SignedUrlResponse = await res.json();
        setSrc(data.src);
      } catch (err) {
        console.error(`Failed to fetch signed URL for ${fileKey}`, err);
      }
    }
    fetchSignedUrl();
  }, [fileKey]);

  


  if (!src) return <p>Loading image...</p>;

  return (
    <div className="relative flex items-center space-x-4 border p-4 rounded-md shadow-sm">
      {/* image */}
      <div className="relative">
        <Image src={src} alt={fileKey} width={550} height={550} className="rounded-md object-cover h-auto" />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 size-7 rounded-full bg-white shadow-md"
          onClick={onRemove}
        >
          <Trash2Icon className="size-4 text-red-600" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>

      {/* tag selector */}
      <div className="flex-1">
        {progress ? <Progress value={progress} className="mt-1" /> : null}
        <Select
          value={selectedValue}
          onValueChange={async (value) => {
            setSelectedValue(value);
            const finalTag = value === "Other" ? customValue : value;
            try {
              const res = await fetch("/api/img/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileKey, tag: finalTag }),
              });
              
              if (!res.ok) throw new Error("Failed to update");
              // toast.success("Tag updated!");
            } catch (err) {
              console.error("Failed to update tag", err);
              toast.error("Failed to update tag");
            }
          }}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select Image Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Street Sign">Street Sign</SelectItem>
            <SelectItem value="Left Side">Left Side</SelectItem>
            <SelectItem value="Right Side">Right Side</SelectItem>
            <SelectItem value="Front">Front</SelectItem>
            <SelectItem value="Address">Address</SelectItem>
            <SelectItem value="Street Left">Street Left</SelectItem>
            <SelectItem value="Street Right">Street Right</SelectItem>
            <SelectItem value="Across the Street">Across the Street</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <div className="my-2">
            {selectedValue === "Other" && (
              <div>
                <Textarea
                  placeholder="Comments"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                />
                <Button
                  className="mt-2"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/img/tags", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          fileKey,
                          tag: customValue, // use the textarea value
                        }),
                      });

                      if (!res.ok) throw new Error("Failed to update");
                      toast.success("Custom tag updated!");
                    } catch (err) {
                      console.error("Failed to update tag", err);
                      toast.error("Failed to update tag");
                    }
                  }}
                >
                  Update
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
