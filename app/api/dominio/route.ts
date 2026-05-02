import { NextRequest, NextResponse } from "next/server"
import { buscarPagina, salvarPagina } from "@/lib/blob"

export async function POST(req: NextRequest) {
  try {
    const { slug, dominio } = await req.json()
    const data = await buscarPagina(slug)
    if (!data) return NextResponse.json({ erro: "Página não encontrada" }, { status: 404 })
    if (!data.pago) return NextResponse.json({ erro: "Recurso do plano pago" }, { status: 403 })

    await salvarPagina({ ...data, dominioCustom: dominio })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ erro: "Erro ao salvar domínio" }, { status: 500 })
  }
}
