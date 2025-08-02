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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileUploader } from "@/components/file-uploader";

type ImageKey = { Key: string };
type SignedUrlResponse = { src: string };

interface FileCardProps {
  fileKey: string;
  onRemove: () => void;
  progress?: number;
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

    const response = await fetch("/api/img", {
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

    // 👇 refresh immediately
    await fetchKeys();
  }

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/img/`);
      const data: ImageKey[] = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch image keys", err);
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
        maxFiles={10}
        accept={{ "image/*": [] }}
      />

      {/* ✅ Display uploaded images */}
      <div className="grid grid-cols-1 gap-6">
        {images.map((image) => (
          <FileCard
            key={image.Key}
            fileKey={image.Key}
            onRemove={() => handleRemove(image.Key)}
          />
        ))}
      </div>
    </div>
  );
}

function FileCard({ fileKey, progress, onRemove }: FileCardProps) {
  const [src, setSrc] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
      <div className="relative">
        <Image
          src={src}
          alt={fileKey}
          width={550}
          height={550}
          className="rounded-md object-cover"
        />
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

      <div className="flex-1">
        {progress ? <Progress value={progress} className="mt-1" /> : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
