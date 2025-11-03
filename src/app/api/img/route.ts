import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { db } from "@/db/drizzle";
import { s3AmcUploads } from "@/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const Bucket = process.env.S3_BUCKET_NAME!;
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
      return NextResponse.json({error: 'Error'}, {status: 400})
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
  const formData = await request.formData();
  const files = formData.getAll("file") as File[];

  // propertyId and userId passed from the client
  const propertyId = formData.get("propertyId") as string | null;
  const userId = formData.get("userId") as string | null;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const results = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const Body = (await file.arrayBuffer()) as unknown as Buffer;

      const objectKey = `${propertyId}/${Date.now()}-${crypto.randomUUID()}-${file.name}`;

      // Upload to S3
      await s3.send(
        new PutObjectCommand({
          Bucket,
          Key: objectKey,
          Body,
          ContentType: file.type,
        })
      );

      const [row] = await db
        .insert(s3AmcUploads)
        .values({
          propertyId: propertyId,
          objectKey,
          fileUrl: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`,
          userId,
        })
        .returning();

      return row;
    })
  );

  return NextResponse.json(results);
}


