import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db/drizzle'
import { order, orderCorrections, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from "resend";
import Email from "@/app/emails/new-orderEmail";
import { statusOrder } from 'drizzle/schema'
import CorrectionsNeededEmail from '@/app/emails/correction-email'

const resend = new Resend(process.env.RESEND_TOKEN);

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

    const { orderId, comments } = (await req.json()) as {
      orderId?: string
      comments?: string
    }
    if (!orderId) return new NextResponse('Missing orderId', { status: 400 })

    await db.insert(orderCorrections).values({ orderId, comments: comments ?? '' })

    // 2) update order status
    await db.update(order).set({ status: 'Corrections' }).where(eq(order.orderId, orderId))

    // 3) pull the order for template fields
    const [ord] = await db.select().from(order).where(eq(order.orderId, orderId))
    if (!ord) return new NextResponse('Order not found', { status: 404 })

    // 4) join statusOrder -> users to get vendor emails for this order
    const [user] = await db
      .select({email: users.email})
      .from(statusOrder)
      .innerJoin(users, eq(users.id, statusOrder.vendorId))
      .where(eq(statusOrder.propId, orderId))

      if(!users?.email){
        console.warn('No vendor email found for this order')
        return NextResponse.json({ ok: false, message: 'No vendor email found' })
      }

    const subject = `Corrections Request for property in ${ord.propertyCity ?? 'order'} `

    await resend.emails.send({
      from: 'Blue Grid Valuations <noreply@app.bluegridvaluations.com>',
      to: user.email,
      subject,
      react: CorrectionsNeededEmail({
        propertyAddress: ord.propertyAddress!,
        propertyCity: ord.propertyCity!,
        propertyState: ord.propertyState!,
        propertyZip: ord.propertyZip!,
        comments: comments!
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('POST /api/corrections failed:', err)
    return new NextResponse(err?.message ?? 'Internal Server Error', { status: 500 })
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return new NextResponse('Missing id', { status: 400 })

    const rows = await db
      .select()
      .from(orderCorrections)
      .where(eq(orderCorrections.orderId, id))

    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}