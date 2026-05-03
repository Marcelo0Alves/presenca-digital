import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { gerarConteudo } from "@/lib/openai"
import { salvarPagina, gerarSlug } from "@/lib/blob"
import type { BusinessData, ContactType, ActionType, LayoutType } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const nomeLoja = (formData.get("nomeLoja") as string) || ""
    const descricao = formData.get("descricao") as string
    const contato = formData.get("contato") as ContactType
    const acao = formData.get("acao") as ActionType
    const layout = ((formData.get("layout") as string) || "editorial") as LayoutType
    const whatsapp = (formData.get("whatsapp") as string) || ""
    const telefone = (formData.get("telefone") as string) || ""
    const instagram = (formData.get("instagram") as string) || ""
    const linkLoja = (formData.get("linkLoja") as string) || ""
    const temFoto = formData.get("temFoto") === "true"
    const foto = formData.get("foto") as File | null

    if (!descricao || !contato || !acao) {
      return NextResponse.json({ erro: "Dados incompletos" }, { status: 400 })
    }

    let fotoUrl: string | undefined

    if (temFoto && foto) {
      const buffer = await foto.arrayBuffer()
      const blob = await put(`fotos/${Date.now()}-${foto.name}`, buffer, {
        access: "public",
        contentType: foto.type,
      })
      fotoUrl = blob.url
    }

    const conteudo = await gerarConteudo({
      slug: "",
      nomeLoja,
      descricao,
      contato,
      acao,
      whatsapp,
      telefone,
      instagram,
      temFoto,
      fotoUrl,
    })

    const slug = gerarSlug(conteudo.nome)

    const agora = new Date()
    const expira = new Date(agora)
    expira.setDate(expira.getDate() + 3)

    const data: BusinessData = {
      slug,
      nomeLoja,
      descricao,
      contato,
      acao,
      layout,
      whatsapp,
      telefone,
      instagram,
      linkLoja,
      temFoto,
      fotoUrl,
      ...conteudo,
      criadoEm: agora.toISOString(),
      expiraEm: expira.toISOString(),
      pago: false,
    }

    await salvarPagina(data)

    return NextResponse.json({ slug })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ erro: "Erro interno ao gerar sua presença" }, { status: 500 })
  }
}
