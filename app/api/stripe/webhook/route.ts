import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { buscarPagina, salvarPagina } from "@/lib/blob"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ erro: "Assinatura inválida" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const slug = session.metadata?.slug

    if (slug) {
      const data = await buscarPagina(slug)
      if (data) {
        await salvarPagina({
          ...data,
          pago: true,
          expiraEm: new Date("2099-01-01").toISOString(),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        })
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object
    const customerId = sub.customer as string

    // Aqui num cenário real buscaria o slug pelo customerId
    // Por ora, logamos o evento
    console.log("Assinatura cancelada:", customerId)
  }

  return NextResponse.json({ recebido: true })
}
