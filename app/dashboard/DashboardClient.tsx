"use client"

import { useState } from "react"
import Link from "next/link"
import { Copy, Check, ExternalLink, Crown, Globe, MessageCircle, BarChart2 } from "lucide-react"
import type { BusinessData } from "@/types"

export default function DashboardClient({ data, sucesso }: { data: BusinessData; sucesso: boolean }) {
  const [copiado, setCopiado] = useState(false)
  const [dominio, setDominio] = useState(data.dominioCustom || "")
  const [salvandoDominio, setSalvandoDominio] = useState(false)
  const [mensagem, setMensagem] = useState("")

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  const link = `${appUrl}/${data.slug}`

  async function copiar() {
    await navigator.clipboard.writeText(link)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function salvarDominio() {
    setSalvandoDominio(true)
    await fetch("/api/dominio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: data.slug, dominio }),
    })
    setMensagem("Domínio salvo! Aponte um CNAME para cname.vercel-dns.com no seu provedor.")
    setSalvandoDominio(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl text-indigo-600">Presença Digital</span>
        <Link href={`/preview/${data.slug}`} className="text-sm text-gray-500 hover:text-gray-700">
          Ver preview
        </Link>
      </nav>

      {sucesso && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4 text-center">
          <p className="text-green-700 font-semibold">🎉 Pagamento confirmado! Sua presença está ativa para sempre.</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{data.nome}</h2>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              data.pago ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}>
              {data.pago ? "Ativo" : "Trial — 7 dias"}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-4">{data.tagline}</p>

          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <span className="text-sm text-gray-600 truncate flex-1">{link}</span>
            <button onClick={copiar} className="flex items-center gap-1 text-sm font-medium text-indigo-600">
              {copiado ? <Check size={16} /> : <Copy size={16} />}
              {copiado ? "Copiado!" : "Copiar"}
            </button>
            <a href={`/${data.slug}`} target="_blank" className="text-gray-400 hover:text-indigo-600">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <MessageCircle size={22} className="text-indigo-600" />, label: "Compartilhar no WhatsApp", href: `https://wa.me/?text=Olha%20minha%20p%C3%A1gina%3A%20${encodeURIComponent(link)}`, external: true },
            { icon: <ExternalLink size={22} className="text-indigo-600" />, label: "Ver minha página", href: `/${data.slug}`, external: true },
            { icon: <BarChart2 size={22} className="text-indigo-600" />, label: "Ver copy e anúncios", href: `/preview/${data.slug}`, external: false },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-indigo-300 transition-colors"
            >
              {item.icon}
              <span className="text-xs text-gray-600 font-medium">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Domínio próprio */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={20} className="text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Domínio próprio</h3>
            {!data.pago && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-auto">Plano pago</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Use seu próprio domínio (ex: seunegocio.com.br) em vez do link padrão.
          </p>
          <input
            type="text"
            value={dominio}
            onChange={(e) => setDominio(e.target.value)}
            disabled={!data.pago}
            placeholder="seunegocio.com.br"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3 disabled:bg-gray-50 disabled:text-gray-400"
          />
          {mensagem && <p className="text-xs text-green-600 mb-3">{mensagem}</p>}
          <button
            onClick={salvarDominio}
            disabled={!data.pago || salvandoDominio || !dominio}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvandoDominio ? "Salvando..." : "Conectar domínio"}
          </button>
        </div>

        {/* Upgrade */}
        {!data.pago && (
          <div className="bg-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} />
              <h3 className="font-semibold">Mantenha sua presença ativa</h3>
            </div>
            <p className="text-indigo-200 text-sm mb-4">
              Seu link expira em 7 dias. Assine por R$ 49/mês para manter ativo, ativar o pixel do Meta e conectar seu domínio próprio.
            </p>
            <a
              href={`/api/stripe/checkout`}
              onClick={async (e) => {
                e.preventDefault()
                const res = await fetch("/api/stripe/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ slug: data.slug }),
                })
                const { url } = await res.json()
                window.location.href = url
              }}
              className="block w-full text-center bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Assinar por R$ 49/mês
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
