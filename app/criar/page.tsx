"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Upload } from "lucide-react"
import type { ContactType, ActionType } from "@/types"

type Step = 1 | 2 | 3 | 4

interface FormData {
  nomeLoja: string
  descricao: string
  contato: ContactType | ""
  acao: ActionType | ""
  whatsapp: string
  telefone: string
  instagram: string
  linkLoja: string
  temFoto: boolean
  foto: File | null
}

export default function CriarPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [pct, setPct] = useState(0)
  const [erro, setErro] = useState("")
  const [arrastando, setArrastando] = useState(false)

  const etapas = [
    { min: 0,  max: 15, label: "Analisando seu negócio..." },
    { min: 15, max: 40, label: "Criando sua página..." },
    { min: 40, max: 65, label: "Gerando os anúncios..." },
    { min: 65, max: 82, label: "Escrevendo a bio..." },
    { min: 82, max: 95, label: "Finalizando os detalhes..." },
    { min: 95, max: 99, label: "Quase pronto..." },
  ]

  useEffect(() => {
    if (!loading) return
    setPct(0)
    const interval = setInterval(() => {
      setPct((prev) => {
        if (prev >= 99) { clearInterval(interval); return 99 }
        const increment = prev < 40 ? 2.5 : prev < 75 ? 1.2 : 0.4
        return Math.min(prev + increment, 99)
      })
    }, 300)
    return () => clearInterval(interval)
  }, [loading])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setArrastando(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setForm((f) => ({ ...f, foto: file, temFoto: true }))
    }
  }, [])

  const [form, setForm] = useState<FormData>({
    nomeLoja: "",
    descricao: "",
    contato: "",
    acao: "",
    whatsapp: "",
    telefone: "",
    instagram: "",
    linkLoja: "",
    temFoto: false,
    foto: null,
  })

  function avancar() {
    if (step === 1 && !form.nomeLoja.trim()) {
      setErro("Digite o nome da sua loja ou empresa.")
      return
    }
    if (step === 1 && !form.descricao.trim()) {
      setErro("Descreve seu negócio para continuar.")
      return
    }
    if (step === 2 && !form.contato) {
      setErro("Escolha como as pessoas entram em contato.")
      return
    }
    if (step === 2 && form.contato === "whatsapp" && !form.whatsapp.trim()) {
      setErro("Digite seu número do WhatsApp para continuar.")
      return
    }
    if (step === 2 && form.contato === "instagram" && !form.instagram.trim()) {
      setErro("Digite seu @ do Instagram para continuar.")
      return
    }
    if (step === 2 && form.contato === "telefone" && !form.telefone.trim()) {
      setErro("Digite seu telefone para continuar.")
      return
    }
    if (step === 3 && !form.acao) {
      setErro("Escolha o que o cliente deve fazer na sua página.")
      return
    }
    if (step === 4 && form.temFoto && !form.foto) {
      setErro("Envie a logo ou imagem da empresa para continuar.")
      return
    }
    setErro("")
    if (step < 4) setStep((s) => (s + 1) as Step)
  }

  function voltar() {
    setErro("")
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  async function gerar() {
    setLoading(true)
    setErro("")
    setPct(0)
    try {
      const body = new FormData()
      body.append("descricao", form.descricao)
      body.append("nomeLoja", form.nomeLoja)
      body.append("contato", form.contato)
      body.append("acao", form.acao)
      body.append("whatsapp", form.whatsapp)
      body.append("telefone", form.telefone)
      body.append("instagram", form.instagram)
      body.append("linkLoja", form.linkLoja)
      body.append("temFoto", String(form.temFoto))
      if (form.foto) body.append("foto", form.foto)

      const res = await fetch("/api/gerar", { method: "POST", body })
      const data = await res.json()

      if (!res.ok) throw new Error(data.erro || "Erro ao gerar")

      router.push(`/preview/${data.slug}`)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro inesperado. Tente novamente.")
      setLoading(false)
    }
  }

  const progresso = (step / 4) * 100

  const etapaAtual = etapas.find((e) => pct >= e.min && pct < e.max) || etapas[etapas.length - 1]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Criando sua presença</p>
          <h2 className="text-white text-2xl font-bold mb-10">{etapaAtual.label}</h2>

          {/* Barra de progresso */}
          <div className="bg-white/20 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs">Processando...</span>
            <span className="text-white font-bold text-lg">{Math.round(pct)}%</span>
          </div>

          <div className="mt-10 flex flex-col gap-2">
            {etapas.slice(0, -1).map((e) => (
              <div key={e.label} className="flex items-center gap-3 text-left">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${pct >= e.max ? "bg-white" : pct >= e.min ? "bg-white/40 ring-2 ring-white" : "bg-white/10"}`}>
                  {pct >= e.max && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-all ${pct >= e.min ? "text-white" : "text-white/30"}`}>{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="font-bold text-xl text-indigo-600">Presença Digital</span>
        <span className="text-sm text-gray-400">Passo {step} de 4</span>
      </nav>

      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* Step 1 — Nome + Descrição */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Conta sobre seu negócio</h1>
                <p className="text-gray-500 mt-2">Quanto mais detalhes, melhor o resultado.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nome da loja ou empresa</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Bikes & Cia, Studio Glow, Dr. Ana Souza..."
                  value={form.nomeLoja}
                  onChange={(e) => setForm({ ...form, nomeLoja: e.target.value })}
                  maxLength={60}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Descreva o que você faz</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-500 bg-white text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Ex: Sou personal trainer em São Paulo e atendo mulheres acima de 40 anos que querem emagrecer sem lesões"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  maxLength={300}
                />
                <span className="text-xs text-gray-400 text-right">{form.descricao.length}/300</span>
              </div>
            </div>
          )}

          {/* Step 2 — Contato */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Como as pessoas te encontram?</h1>
                <p className="text-gray-500 mt-2">Escolha o principal canal de contato.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "whatsapp", label: "WhatsApp" },
                  { value: "instagram", label: "Instagram" },
                  { value: "telefone", label: "Telefone" },
                  { value: "sem_contato", label: "Ainda não tenho" },
                ].map((op) => (
                  <button
                    key={op.value}
                    onClick={() => setForm({ ...form, contato: op.value as ContactType })}
                    className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${
                      form.contato === op.value
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-700 hover:border-indigo-300"
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              {form.contato === "whatsapp" && (
                <input
                  type="tel"
                  className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Seu número com DDD (ex: 11999999999)"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              )}
              {form.contato === "instagram" && (
                <input
                  type="text"
                  className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Seu @ do Instagram (sem o @)"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                />
              )}
              {form.contato === "telefone" && (
                <input
                  type="tel"
                  className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Seu telefone com DDD"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              )}
            </div>
          )}

          {/* Step 3 — Ação */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">O que o cliente faz na página?</h1>
                <p className="text-gray-500 mt-2">Essa ação vira o botão principal da sua página.</p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { value: "whatsapp", label: "Me chamar no WhatsApp", desc: "Botão direto para conversa" },
                  { value: "agendamento", label: "Agendar um horário", desc: "Integração com calendário" },
                  { value: "compra", label: "Comprar um produto", desc: "Link para checkout ou loja" },
                ].map((op) => (
                  <button
                    key={op.value}
                    onClick={() => setForm({ ...form, acao: op.value as ActionType })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.acao === op.value
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900 block">{op.label}</span>
                    <span className="text-sm text-gray-500">{op.desc}</span>
                  </button>
                ))}
              </div>

              {form.acao === "compra" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Link da sua loja ou produto <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <input
                    type="url"
                    className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="Ex: shopee.com.br/loja, mercadolivre.com/..."
                    value={form.linkLoja}
                    onChange={(e) => setForm({ ...form, linkLoja: e.target.value })}
                  />
                  <span className="text-xs text-gray-400">Se não tiver, o botão vai direto para o WhatsApp.</span>
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Foto */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Logo ou foto do negócio</h1>
                <p className="text-gray-500 mt-2">Uma imagem profissional aumenta muito a credibilidade da página.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setForm({ ...form, temFoto: true })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.temFoto === true
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <span className={`font-medium block ${form.temFoto === true ? "text-indigo-700" : "text-gray-700"}`}>Sim, vou enviar minha logo</span>
                  <span className="text-sm text-gray-500">Logo da empresa, foto do produto ou do local</span>
                </button>
                <button
                  onClick={() => setForm({ ...form, temFoto: false, foto: null })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.temFoto === false
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <span className={`font-medium block ${form.temFoto === false ? "text-indigo-700" : "text-gray-700"}`}>Usar inicial do nome</span>
                  <span className="text-sm text-gray-500">Exibe a primeira letra do negócio com sua cor</span>
                </button>
              </div>

              {form.temFoto && (
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setForm({ ...form, foto: e.target.files?.[0] ?? null })}
                  />
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setArrastando(true) }}
                    onDragLeave={() => setArrastando(false)}
                    onDrop={onDrop}
                    className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                      arrastando
                        ? "border-indigo-500 bg-indigo-50"
                        : form.foto
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    <Upload size={24} className={form.foto ? "text-green-500" : "text-gray-400"} />
                    <span className={`text-sm text-center ${form.foto ? "text-green-700 font-medium" : "text-gray-500"}`}>
                      {form.foto
                        ? `✓ ${form.foto.name}`
                        : arrastando
                        ? "Solte a imagem aqui"
                        : "Arraste a logo ou clique para selecionar"}
                    </span>
                    {!form.foto && (
                      <span className="text-xs text-gray-400">PNG, JPG ou WEBP — recomendado fundo branco ou transparente</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Erro */}
          {erro && (
            <p className="mt-4 text-red-500 text-sm">{erro}</p>
          )}

          {/* Botões */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={voltar}
                className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} />
                Voltar
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={avancar}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Continuar
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={gerar}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-70"
              >
                Criar minha presença
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
