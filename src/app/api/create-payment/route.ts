import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

const PRODUCT_PRICES: Record<string, number> = {
  RushExterior: 4000,
  Exterior: 3500,
  Interior: 7500,
};



export async function POST(req: NextRequest){

  try{
    const { product, order } = await req.json()

    const amount = PRODUCT_PRICES[product]
    
    const paymentIntents = await stripe.paymentIntents.create({
    amount: Number(amount),
    currency: 'usd',
    payment_method_types: ['card', 'klarna'], 
    metadata: {order: String(order)}
  })
      
    return NextResponse.json({clientSecret: paymentIntents.client_secret})
  } catch(error){
    console.error(error)
    return NextResponse.json({error: `Internal error ${error}`, status: 500})
  }
}






