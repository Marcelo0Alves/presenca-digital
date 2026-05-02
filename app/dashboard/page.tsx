import { redirect } from "next/navigation"
import { buscarPagina } from "@/lib/blob"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; sucesso?: string }>
}) {
  const { slug, sucesso } = await searchParams

  if (!slug) redirect("/criar")

  const data = await buscarPagina(slug)
  if (!data) redirect("/criar")

  return <DashboardClient data={data} sucesso={sucesso === "1"} />
}
