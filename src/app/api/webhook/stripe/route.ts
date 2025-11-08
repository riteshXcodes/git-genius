import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/server/db";
const stripe = new Stripe(process.env.STRIPE_API_KEY!, { apiVersion: '2025-10-29.clover' });

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = (await headers()).get('Stripe-Signature') as string
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        console.log(process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    const session = event.data.object as Stripe.Checkout.Session

    console.log(event.type);


    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
        const credits = Number(session.metadata?.['credits'])
        const userId = session.client_reference_id;
        if (!userId || !credits) {
            return NextResponse.json({ error: 'Missing userId or credits' }, { status: 400 })
        }
        await db.stripeTransaction.create({
            data: { userId, credits }
        })
        await db.user.update({
            where: { id: userId },
            data: {
                credits: {
                    increment: credits
                }
            }
        })
        return NextResponse.json({ message: 'Credits added successfully' }, { status: 200 })
    }
    return NextResponse.json({ message: 'Failed to add token' }, { status: 403 })
}
