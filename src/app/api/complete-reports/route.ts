import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const Bucket = process.env.S3_COMPLETE_NAME!;
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
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: 'Error' }, { status: 400 });
    }

    const response = await s3.send(
      new ListObjectsCommand({
        Bucket,
        Prefix: `${orderId}/`,
      })
    );

    return NextResponse.json({ 
      objects: response.Contents || [],
      count: response.Contents?.length || 0 
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const orderId = (formData.get("orderId") as string) || null;
    const file = formData.get("file") as File | null;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const objectKey = `${orderId}/${Date.now()}-${crypto.randomUUID()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket,
        Key: objectKey,
        Body: buf,
        ContentType: file.type || "application/pdf",
        Metadata: { orderId, originalName: file.name },
      })
    );

    const url = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;

    await db
      .update(order)
      .set({
        completeUrl: url,
      })
      .where(eq(order.orderId, orderId));

    return NextResponse.json({ url }, { status: 201 });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}