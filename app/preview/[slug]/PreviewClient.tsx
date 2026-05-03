"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, AlertTriangle, Crown } from "lucide-react"
import type { BusinessData } from "@/types"
import BusinessPage from "@/components/BusinessPage"

type Tab = "pagina" | "copy" | "bio" | "pixel"

export default function PreviewClient({ data, expirado }: { data: BusinessData; expirado: boolean }) {
  const [tab, setTab] = useState<Tab>("copy")
  const [copiado, setCopiado] = useState("")
  const [pixelId, setPixelId] = useState(data.pixelId || "")

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  const link = `${appUrl}/${data.slug}`

  async function copiar(texto: string, id: string) {
    await navigator.clipboard.writeText(texto)
    setCopiado(id)
    setTimeout(() => setCopiado(""), 2000)
  }

  async function assinar() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: data.slug }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  async function salvarPixel() {
    await fetch("/api/pixel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: data.slug, pixelId }),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl text-indigo-600">Presença Digital</span>
        {!data.pago && (
          <button
            onClick={assinar}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Crown size={16} />
            Manter por R$ 49/mês
          </button>
        )}
      </div>

      {/* Banner expirado */}
      {expirado && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2 text-red-700">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">Sua página expirou. Assine para reativar.</span>
          <button onClick={assinar} className="ml-auto text-sm font-semibold underline">
            Assinar agora
          </button>
        </div>
      )}

      {/* Banner trial */}
      {!data.pago && !expirado && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2 text-amber-700">
          <AlertTriangle size={16} />
          <span className="text-sm">
            Seu link fica ativo por 7 dias gratuitamente. Para manter para sempre,{" "}
            <button onClick={assinar} className="font-semibold underline">assine o plano.</button>
          </span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
        {/* Preview da página */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Sua página</h2>
            <a
              href={`/${data.slug}`}
              target="_blank"
              className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
            >
              Ver em tela cheia
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Link */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3 mb-4">
            <span className="text-sm text-gray-500 truncate flex-1">{link}</span>
            <button
              onClick={() => copiar(link, "link")}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex-shrink-0"
            >
              {copiado === "link" ? <Check size={16} /> : <Copy size={16} />}
              {copiado === "link" ? "Copiado!" : "Copiar"}
            </button>
          </div>

          {/* Mockup */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-400 flex-1 text-center truncate">{link}</span>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
              <BusinessPage data={data} preview />
            </div>
          </div>
        </div>

        {/* Abas laterais */}
        <div>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white mb-4">
            {(["copy", "bio", "pixel"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-medium transition-colors capitalize ${
                  tab === t ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {t === "copy" ? "Anúncios" : t === "bio" ? "Bio" : "Pixel Meta"}
              </button>
            ))}
          </div>

          {/* Copy */}
          {tab === "copy" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">3 versões prontas para colar no Meta Ads.</p>
              {(["versao1", "versao2", "versao3"] as const).map((v, i) => (
                <div key={v} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                      Versão {i + 1}
                    </span>
                    <button
                      onClick={() => copiar(`${data.copyAnuncio[v].titulo}\n\n${data.copyAnuncio[v].texto}`, v)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600"
                    >
                      {copiado === v ? <Check size={14} /> : <Copy size={14} />}
                      {copiado === v ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900">{data.copyAnuncio[v].titulo}</p>
                  <p className="text-gray-500 text-sm mt-1">{data.copyAnuncio[v].texto}</p>
                </div>
              ))}
            </div>
          )}

          {/* Bio */}
          {tab === "bio" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm text-gray-500 mb-4">Texto otimizado para a bio do Instagram.</p>
              <p className="text-gray-900 text-lg leading-relaxed">{data.textoBio}</p>
              <button
                onClick={() => copiar(data.textoBio, "bio")}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {copiado === "bio" ? <Check size={16} /> : <Copy size={16} />}
                {copiado === "bio" ? "Copiado!" : "Copiar texto"}
              </button>
            </div>
          )}

          {/* Pixel */}
          {tab === "pixel" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-sm text-gray-500 mb-4">
                Configure o Pixel do Meta para rastrear visitantes da sua página automaticamente.
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pixel ID</label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder="Ex: 1234567890123456"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              />
              <button
                onClick={salvarPixel}
                disabled={!data.pago}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {data.pago ? "Salvar Pixel" : "Disponível no plano pago"}
              </button>
              {!data.pago && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  <button onClick={assinar} className="underline">Assine por R$ 49/mês</button> para ativar.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
