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

type ImageKey = { Key: string };
type SignedUrlResponse = { src: string };

interface FileCardProps {
  fileKey: string;
  onRemove: () => void;
  progress?: number;
}

export function FetchImages() {
  const [images, setImages] = useState<ImageKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKeys() {
      try {
        const res = await fetch("/api/img");
        const data: ImageKey[] = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch image keys", err);
      } finally {
        setLoading(false);
      }
    }

    fetchKeys();
  }, []);

  const handleRemove = async (fileKey: string) => {
    try {
      // Call DELETE API
      const res = await fetch(`/api/img/${encodeURIComponent(fileKey)}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete image");

      // Update UI state
      setImages((prev) => prev.filter((img) => img.Key !== fileKey));
      toast('Image Deleted Successfully!')
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto text-left">
      {images.map((image) => (
        <FileCard
          key={image.Key}
          fileKey={image.Key}
          onRemove={() => handleRemove(image.Key)}
        />
      ))}
    </div>
  );
}

function FileCard({ fileKey, progress, onRemove }: FileCardProps) {
  const [src, setSrc] = useState<string | null>(null);

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
      {/* Preview */}
        <div className="relative">
          <Image
            src={src}
            alt={fileKey}
            width={500}
            height={500}
            className="rounded-md object-cover"
          />

          {/* Overlay remove button */}
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


      {/* File info + progress */}
      <div className="flex-1">
        {/* <p className="line-clamp-1 text-sm font-medium text-foreground/80">
          {fileKey}
        </p> */}
        {progress ? <Progress value={progress} className="mt-1" /> : null}

        {/* Tag selection */}
        <Select>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select Image Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="streetSign">Street Sign</SelectItem>
            <SelectItem value="leftSide">Left Side</SelectItem>
            <SelectItem value="rightSide">Right Side</SelectItem>
            <SelectItem value="front">Front</SelectItem>
            <SelectItem value="address">Address</SelectItem>
            <SelectItem value="streetleft">Street Left</SelectItem>
            <SelectItem value="streetright">Street Right</SelectItem>
            <SelectItem value="across">Across the Street</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
