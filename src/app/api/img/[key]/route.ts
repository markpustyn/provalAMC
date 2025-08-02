import { NextResponse } from "next/server";
import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/db/drizzle";
import { s3AmcUploads } from "@/db/schema";
import { eq } from "drizzle-orm";

const Bucket = process.env.S3_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(_: Request, { params }: { params: { key : string } }) {
  const paramsKey = await params
  const command = new GetObjectCommand({ Bucket, Key: paramsKey.key });
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return NextResponse.json({ src });
}


export async function DELETE(_: Request, { params }: { params: { key: string } }) {
  try {
    const paramsKey = await params
    const command = new DeleteObjectCommand({
      Bucket,
      Key: paramsKey.key,
    });

    await s3.send(command);

    await db
      .delete(s3AmcUploads)
      .where(eq( s3AmcUploads.objectKey, paramsKey.key,))
      .returning();

    return NextResponse.json({ success: true, key: paramsKey.key });
  } catch (error) {
    console.error("Failed to delete image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}