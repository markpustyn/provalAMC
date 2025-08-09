// import { NextResponse } from "next/server";
// import { renderToStream } from "@react-pdf/renderer";
// import { db } from "@/db/drizzle";
// import { pcrForms, s3AmcUploads } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { GeneratePdf } from "@/components/pdf/generatePdf";

// export const runtime = "nodejs"; // Not edge — must be Node for PDF streaming

// export async function GET(
//   _: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id;

//     // Fetch data
//     const [orderRecord] = await db
//       .select()
//       .from(pcrForms)
//       .where(eq(pcrForms.orderId, id))
//       .limit(1);

//     if (!orderRecord) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     const imageRecords = await db
//       .select()
//       .from(s3AmcUploads)
//       .where(eq(s3AmcUploads.propertyId, id));

//     const images: string[] = imageRecords
//       .map((img) => img.fileUrl)
//       .filter((url): url is string => typeof url === "string" && url.startsWith("https"));

//     // Render PDF to stream
//     // const stream = await renderToStream(
//     //   <GeneratePdf
//     //     orderDetails={orderRecord}
//     //     orderData={orderRecord}
//     //     images={images}
//     //   />
//     // );

//     // return new NextResponse(stream as any, {
//     //   status: 200,
//     //   headers: {
//     //     "Content-Type": "application/pdf",
//     //     "Content-Disposition": `attachment; filename=report-${id}.pdf`,
//     //   },
//     // });
//   } catch (error) {
//     console.error("Error generating PDF report:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
