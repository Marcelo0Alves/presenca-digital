"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, AlertTriangle, Crown } from "lucide-react"
import type { BusinessData } from "@/types"
import BusinessPageSelector from "@/components/BusinessPageSelector"

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

  const [erroPagamento, setErroPagamento] = useState("")

  async function assinar() {
    setErroPagamento("")
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: data.slug }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) {
        setErroPagamento("Erro ao iniciar pagamento. Tente novamente ou fale com o suporte.")
        return
      }
      window.location.href = json.url
    } catch {
      setErroPagamento("Erro de conexão. Verifique sua internet e tente novamente.")
    }
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
            Manter por R$ 127/mês
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

      {/* Erro pagamento */}
      {erroPagamento && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2 text-red-700">
          <span className="text-sm">{erroPagamento}</span>
          <button onClick={() => setErroPagamento("")} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Banner trial */}
      {!data.pago && !expirado && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2 text-amber-700">
          <AlertTriangle size={16} />
          <span className="text-sm">
            Seu link fica ativo por 3 dias gratuitamente. Para manter para sempre,{" "}
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
              <BusinessPageSelector data={data} preview />
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
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-sm text-indigo-700 font-medium">3 anúncios prontos para o Meta Ads</p>
                <p className="text-xs text-indigo-500 mt-0.5">Copie e cole direto no Gerenciador de Anúncios do Facebook/Instagram.</p>
              </div>
              {(["versao1", "versao2", "versao3"] as const).map((v, i) => (
                <div key={v} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Versão {i + 1}</span>
                    <button
                      onClick={() => copiar(`${data.copyAnuncio[v].titulo}\n\n${data.copyAnuncio[v].texto}`, v)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      {copiado === v ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copiado === v ? "Copiado!" : "Copiar tudo"}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Título</p>
                    <p className="font-bold text-gray-900 text-base mb-3">{data.copyAnuncio[v].titulo}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Texto do anúncio</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{data.copyAnuncio[v].texto}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bio */}
          {tab === "bio" && (
            <div className="flex flex-col gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-sm text-indigo-700 font-medium">Bio para o Instagram</p>
                <p className="text-xs text-indigo-500 mt-0.5">Cole direto no campo de biografia do seu perfil.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Mockup Instagram */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                    style={{ backgroundColor: data.corPrimaria || "#6366f1" }}
                  >
                    {data.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{data.nome.toLowerCase().replace(/\s+/g, "_")}</p>
                    <p className="text-xs text-gray-400">Perfil profissional</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-line">{data.textoBio}</p>
                  <p className="text-xs text-gray-400 mt-3">{data.textoBio.length} / 150 caracteres</p>
                </div>
              </div>
              <button
                onClick={() => copiar(data.textoBio, "bio")}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-indigo-200 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                {copiado === "bio" ? <Check size={16} /> : <Copy size={16} />}
                {copiado === "bio" ? "Copiado!" : "Copiar bio"}
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
