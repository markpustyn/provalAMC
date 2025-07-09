import { NextResponse } from 'next/server';

let orders: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received form data:", body);

  // Save to in-memory orders list
  orders.push(body);

  return NextResponse.json({ message: "Report submitted successfully!" });
}

export async function GET() {
  return NextResponse.json({ orders });
}
