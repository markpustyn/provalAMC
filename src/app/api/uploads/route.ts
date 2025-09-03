import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { db } from "@/db/drizzle";
import { s3AmcUploads, vendorFiles } from "@/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const Bucket = process.env.S3_UPLOADS_NAME!;
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const propId = searchParams.get("propId");

    const response = await s3.send(
      new ListObjectsCommand({
        Bucket,
        Prefix: `${propId}/`,
      })
    );

    if(!propId){
      return NextResponse.json({error: 'Missing Data'}, {status: 400})
    }

    const data = 
      await db 
      .select()
      .from(s3AmcUploads)
      .where(eq(s3AmcUploads.propertyId, propId))
    

      const s3Objects = response.Contents ?? [];

      // Merge DB rows into S3 objects
      const merged = s3Objects.map((obj) => {
        const match = data.find((row) => row.objectKey === obj.Key);
        return {
          Key: obj.Key,
          imgTag: match?.imgTag ?? "", // default empty if none
        };
      });
      if (!response.Contents || response.Contents.length === 0) {
          return NextResponse.json([]);
        }

      return NextResponse.json(merged);

  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userId = (formData.get("userId") as string) || null;
    const expiration = (formData.get("expiration") as string) || null;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Support single or multiple "file" fields
    const filesFromAll = (formData.getAll("file") as File[]).filter(Boolean);
    const single = formData.get("file") as File | null;
    const files: File[] = filesFromAll.length ? filesFromAll : single ? [single] : [];
    const fileTag = formData.get("fileTag") as string;
    if (!files.length) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const buf = Buffer.from(await file.arrayBuffer());
        const objectKey = `${userId}/${Date.now()}-${crypto.randomUUID()}-${file.name}`;

        await s3.send(
          new PutObjectCommand({
            Bucket,
            Key: objectKey,
            Body: buf,
            ContentType: file.type || "application/octet-stream",
            Metadata: { userId, originalName: file.name },
          })
        );
        
        const [row] = await db
        .insert(vendorFiles)
        .values({
            userId: userId,
            objectKey,
            fileTag: fileTag,
            expiration: expiration,
            fileUrl: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`,
        })
        .returning();

        return {
          key: objectKey,
          name: file.name,
          size: buf.byteLength,
          contentType: file.type || null,
        };
      })
    );

    return NextResponse.json(results, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
