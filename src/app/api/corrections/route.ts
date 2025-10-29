import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db/drizzle'
import { orderCorrections } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

    const { orderId, comments } = await req.json() as { orderId?: string; comments?: string }
    if (!orderId) return new NextResponse('Missing orderId', { status: 400 })

    await db
    .insert(orderCorrections)
    .values({ orderId, comments: comments ?? '' })

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