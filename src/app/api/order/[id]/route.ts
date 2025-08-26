import { db } from '@/db/drizzle';
import { order, pcrForms } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';


export async function PUT(req: Request, {params}: {params: {id:string}}) {
  const body = await req.json();
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

 const [existing] = await db
    .select()
    .from(pcrForms)
    .where(eq(pcrForms.orderId, id))
    .limit(1);

  if (existing) {
    await db
      .update(pcrForms)
      .set({ data: body , vendorId: session.user.id})
      .where(eq(pcrForms.orderId, id));
  } else {
    await db.insert(pcrForms).values({
      orderId: id,
      data: body,
      vendorId: session.user.id
    });
  }  

  return Response.json({ ok: true });
}

export async function GET(_:Request, {params}: {params: {id:string}}) {
  const { id } = await params
   const [existing] = await db
    .select()
    .from(pcrForms)
    .where(eq(pcrForms.orderId, id))
    .limit(1)

    if(!existing || !existing.data){
      return NextResponse.json({data: null})
    }

  return NextResponse.json({ data: existing.data});
}

export async function POST(_:Request, {params}: {params: {id:string}}) {
  const { id } = await params
  
   await db
    .update(order)
    .set({status: "submitted"})
    .where(eq(order.orderId, id))


  return NextResponse.json({ ok: true});
}
