import { NextRequest, NextResponse } from "next/server"
import { buscarPagina, salvarPagina } from "@/lib/blob"

export async function POST(req: NextRequest) {
  try {
    const { slug, pixelId } = await req.json()
    const data = await buscarPagina(slug)
    if (!data) return NextResponse.json({ erro: "Página não encontrada" }, { status: 404 })
    if (!data.pago) return NextResponse.json({ erro: "Recurso do plano pago" }, { status: 403 })

    await salvarPagina({ ...data, pixelId })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ erro: "Erro ao salvar pixel" }, { status: 500 })
  }
}
