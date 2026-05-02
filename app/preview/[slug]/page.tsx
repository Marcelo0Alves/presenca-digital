import { notFound } from "next/navigation"
import { buscarPagina } from "@/lib/blob"
import PreviewClient from "./PreviewClient"

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await buscarPagina(slug)

  if (!data) notFound()

  const expirado = new Date(data.expiraEm) < new Date() && !data.pago

  return <PreviewClient data={data} expirado={expirado} />
}
