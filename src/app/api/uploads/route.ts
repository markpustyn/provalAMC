import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/db/drizzle";
import { vendorFiles } from "@/db/schema";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";

const Bucket = process.env.S3_UPLOADS_NAME!;
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// GET /api/uploads?userId=...
// Returns rows already saved in DB for this user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const rows = await db
      .select({
        uploadId: vendorFiles.uploadId,
        userId: vendorFiles.userId,
        fileTag: vendorFiles.fileTag,
        fileUrl: vendorFiles.fileUrl,
        expiration: vendorFiles.expiration,
        objectKey: vendorFiles.objectKey,
        uploadTimestamp: vendorFiles.uploadTimestamp,
      })
      .from(vendorFiles)
      .where(eq(vendorFiles.userId, userId));

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/uploads error:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

// POST /api/uploads
// Body: FormData { userId, fileTag, expiration?, file }
// Behavior: if a file for the same tag exists for this user, delete old S3 object and update the row
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userId = (formData.get("userId") as string) || "";
    const fileTag = (formData.get("fileTag") as string) || "";
    const expiration = (formData.get("expiration") as string) || null;
    const file = formData.get("file") as File | null;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (!fileTag) {
      return NextResponse.json({ error: "fileTag is required" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // check if there is an existing row for this user and tag
    const existing = await db
      .select()
      .from(vendorFiles)
      .where(and(eq(vendorFiles.userId, userId), eq(vendorFiles.fileTag, fileTag)));

    // upload new object
    const buf = Buffer.from(await file.arrayBuffer());
    const objectKey = `${userId}/${Date.now()}-${crypto.randomUUID()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket,
        Key: objectKey,
        Body: buf,
        ContentType: file.type || "application/octet-stream",
        Metadata: { userId, originalName: file.name, fileTag },
      })
    );

    const fileUrl = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;

    // if exists, delete old S3 object and update row
    if (existing.length > 0) {
      const old = existing[0];
      if (old.objectKey) {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket,
              Key: old.objectKey,
            })
          );
        } catch (e) {
          // do not fail whole request if delete fails
          console.warn("Failed to delete old S3 object:", e);
        }
      }

      const [updated] = await db
        .update(vendorFiles)
        .set({
          objectKey,
          fileUrl,
          expiration,
          uploadTimestamp: new Date(),
        })
        .where(and(eq(vendorFiles.userId, userId), eq(vendorFiles.fileTag, fileTag)))
        .returning();

      return NextResponse.json(
        {
          action: "updated",
          uploadId: updated.uploadId,
          fileTag,
          fileUrl,
          expiration,
          size: buf.byteLength,
          contentType: file.type || null,
        },
        { status: 200 }
      );
    }

    // else insert a new row
    const [created] = await db
      .insert(vendorFiles)
      .values({
        userId,
        objectKey,
        fileTag,
        expiration,
        fileUrl,
        uploadTimestamp: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        action: "created",
        uploadId: created.uploadId,
        fileTag,
        fileUrl,
        expiration,
        size: buf.byteLength,
        contentType: file.type || null,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/uploads error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
