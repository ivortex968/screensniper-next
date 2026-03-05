"use server"

import Stripe from "stripe"
import { headers } from "next/headers"

export interface CheckoutItem {
    name: string
    amount: number // In INR
    quantity: number
}

export async function createCheckoutSession(items: CheckoutItem[], metadata: any) {
    try {
        const stripeSecret = process.env.STRIPE_SECRET_KEY
        if (!stripeSecret) {
            console.error("STRIPE_SECRET_KEY is missing from environment variables")
            throw new Error("Stripe configuration error")
        }

        const stripe = new Stripe(stripeSecret)

        const headerList = await headers()
        const origin = headerList.get("origin")

        console.log("Creating Stripe session with items:", JSON.stringify(items, null, 2))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map(item => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.amount * 100), // Ensure integer for paise
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            metadata: metadata,
            success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/movies/${metadata.movieId}/booking`,
        })

        console.log("Stripe session created successfully:", session.id)
        return { sessionId: session.id, url: session.url }
    } catch (error) {
        console.error("Stripe session error:", error)
        throw error
    }
}
