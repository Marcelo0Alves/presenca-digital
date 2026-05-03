import { notFound } from "next/navigation"
import { buscarPagina } from "@/lib/blob"
import BusinessPageSelector from "@/components/BusinessPageSelector"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await buscarPagina(slug)
  if (!data) return { title: "Página não encontrada" }
  return {
    title: `${data.nome} — ${data.tagline}`,
    description: data.descricaoLonga,
    openGraph: {
      title: data.nome,
      description: data.tagline,
      images: data.fotoUrl ? [data.fotoUrl] : [],
    },
  }
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await buscarPagina(slug)

  if (!data) notFound()

  const expirado = new Date(data.expiraEm) < new Date() && !data.pago
  if (expirado) notFound()

  return <BusinessPageSelector data={data} />
}
