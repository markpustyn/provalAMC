"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type ImageKey = { Key: string };
type SignedUrlResponse = { src: string };

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 max-w-5xl mx-auto text-left space-y-6">
      {images.map((image) => (
        <div>
          <S3Image key={image.Key} Key={image.Key} />
            {/* <FormItem>
                  <FormLabel>Phone Type</FormLabel>
                  <Select
                      // onValueChange={field.onChange}
                      // value={field.value}
                    >
                  <SelectTrigger>
                      <SelectValue placeholder='' />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value='mobile'>Mobile</SelectItem>
                    <SelectItem value='home'>Home</SelectItem>
                    <SelectItem value='work'>Work</SelectItem>
                  </SelectContent></Select>
                  <FormMessage />
                </FormItem> */}
              </div>
      ))}
    </div>
  );
}

function S3Image({ Key }: { Key: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSignedUrl() {
      try {
        const res = await fetch(`/api/img/${encodeURIComponent(Key)}`);
        const data: SignedUrlResponse = await res.json();
        setSrc(data.src);
      } catch (err) {
        console.error(`Failed to fetch signed URL for ${Key}`, err);
      }
    }

    fetchSignedUrl();
  }, [Key]);

  if (!src) return <p>cant find source</p>;

  return (
    <Image
      src={src}
      alt={Key}
      width={500}
      height={500}
      className="rounded border"
    />
  );
}
