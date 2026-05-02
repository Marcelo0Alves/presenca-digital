import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
})

export const PRICE_ID = "price_1TSm1wFupgT75bEh1nLGGByS"

export async function criarCheckout(slug: string, email?: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?slug=${slug}&sucesso=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview/${slug}`,
    customer_email: email,
    metadata: { slug },
  })
  return session
}
