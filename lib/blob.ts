import { put, get, del } from "@vercel/blob"
import type { BusinessData } from "@/types"

export async function salvarPagina(data: BusinessData): Promise<void> {
  await put(`pages/${data.slug}.json`, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  })
}

export async function buscarPagina(slug: string): Promise<BusinessData | null> {
  try {
    const url = `${process.env.BLOB_BASE_URL}/pages/${slug}.json`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function deletarPagina(slug: string): Promise<void> {
  try {
    await del(`${process.env.BLOB_BASE_URL}/pages/${slug}.json`)
  } catch {}
}

export function gerarSlug(texto: string): string {
  return (
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 30) +
    "-" +
    Math.random().toString(36).slice(2, 6)
  )
}
