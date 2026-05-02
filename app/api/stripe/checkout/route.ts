import { NextRequest, NextResponse } from "next/server"
import { criarCheckout } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const { slug, email } = await req.json()
    if (!slug) return NextResponse.json({ erro: "Slug obrigatório" }, { status: 400 })

    const session = await criarCheckout(slug, email)
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ erro: "Erro ao criar sessão de pagamento" }, { status: 500 })
  }
}
