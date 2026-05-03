"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Upload } from "lucide-react"
import type { ContactType, ActionType, LayoutType } from "@/types"

type Step = 1 | 2 | 3 | 4 | 5

interface Servico {
  nome: string
  descricao: string
}

interface FormData {
  nomeLoja: string
  descricao: string
  servicos: Servico[]
  contato: ContactType | ""
  acao: ActionType | ""
  layout: LayoutType
  whatsapp: string
  telefone: string
  instagram: string
  temFoto: boolean
  foto: File | null
}

const layouts: { value: LayoutType; nome: string; descricao: string; preview: React.ReactNode }[] = [
  {
    value: "editorial",
    nome: "Editorial",
    descricao: "Sofisticado e premium. Layout revista com destaque para o seu brand.",
    preview: (
      <svg viewBox="0 0 160 110" className="w-full h-full" fill="none">
        <rect width="160" height="110" rx="6" fill="#fafaf9" />
        {/* nav */}
        <rect x="10" y="8" width="20" height="4" rx="2" fill="#171717" />
        <rect x="120" y="7" width="30" height="6" rx="3" fill="#4338ca" />
        {/* hero 2 colunas */}
        <rect x="10" y="22" width="55" height="3" rx="1.5" fill="#171717" />
        <rect x="10" y="28" width="65" height="8" rx="2" fill="#171717" opacity="0.9" />
        <rect x="10" y="39" width="55" height="2" rx="1" fill="#9ca3af" />
        <rect x="10" y="43" width="45" height="2" rx="1" fill="#9ca3af" />
        <rect x="10" y="50" width="32" height="7" rx="3.5" fill="#4338ca" />
        {/* card hero direita */}
        <rect x="90" y="18" width="60" height="46" rx="8" fill="#4338ca" opacity="0.85" />
        <rect x="97" y="53" width="30" height="3" rx="1.5" fill="white" opacity="0.7" />
        <rect x="97" y="58" width="20" height="2" rx="1" fill="white" opacity="0.4" />
        {/* info bar */}
        <rect x="0" y="70" width="160" height="12" fill="white" />
        <rect x="10" y="73" width="25" height="2" rx="1" fill="#6b7280" />
        <rect x="50" y="73" width="25" height="2" rx="1" fill="#6b7280" />
        <rect x="90" y="73" width="25" height="2" rx="1" fill="#6b7280" />
        <rect x="130" y="73" width="20" height="2" rx="1" fill="#6b7280" />
        {/* destaques 3 col */}
        <rect x="10" y="88" width="42" height="16" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="59" y="88" width="42" height="16" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="108" y="88" width="42" height="16" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
      </svg>
    ),
  },
  {
    value: "moderno",
    nome: "Moderno",
    descricao: "Corporativo e impactante. Split com foto, título em bloco colorido e elementos geométricos.",
    preview: (
      <svg viewBox="0 0 160 110" className="w-full h-full" fill="none">
        <rect width="160" height="110" rx="6" fill="white" />
        {/* nav */}
        <rect x="8" y="7" width="18" height="4" rx="1" fill="#1f2937" />
        <rect x="50" y="8" width="12" height="2.5" rx="1" fill="#9ca3af" />
        <rect x="67" y="8" width="10" height="2.5" rx="1" fill="#9ca3af" />
        <rect x="82" y="8" width="14" height="2.5" rx="1" fill="#9ca3af" />
        <rect x="100" y="8" width="12" height="2.5" rx="1" fill="#9ca3af" />
        <rect x="127" y="6" width="25" height="7" rx="0" fill="#2563eb" />
        <line x1="0" y1="18" x2="160" y2="18" stroke="#e5e7eb" strokeWidth="0.8" />
        {/* hero split */}
        {/* coluna esquerda */}
        <rect x="8" y="26" width="6" height="1.5" rx="0.75" fill="#2563eb" />
        <rect x="8" y="33" width="62" height="10" rx="0" fill="#2563eb" />
        <rect x="8" y="45" width="62" height="7" rx="0" fill="#dbeafe" />
        <rect x="8" y="56" width="50" height="2" rx="1" fill="#9ca3af" />
        <rect x="8" y="60" width="40" height="2" rx="1" fill="#9ca3af" />
        <rect x="8" y="67" width="30" height="8" rx="0" fill="#2563eb" />
        {/* decoração pontos */}
        {[0,1,2,3].map(r => [0,1,2,3].map(c => (
          <circle key={`${r}-${c}`} cx={78 + c * 5} cy={24 + r * 5} r={0.8} fill="#2563eb" fillOpacity={0.3} />
        )))}
        {/* coluna direita — foto */}
        <rect x="82" y="18" width="78" height="70" fill="#dbeafe" />
        <rect x="82" y="18" width="4" height="70" fill="#2563eb" opacity="0.3" />
        {/* divisor colorido */}
        <rect x="0" y="88" width="160" height="2" fill="#2563eb" />
        {/* cards info */}
        <rect x="8" y="93" width="42" height="13" rx="0" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="59" y="93" width="42" height="13" rx="0" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="110" y="93" width="42" height="13" rx="0" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        <rect x="11" y="96" width="8" height="7" rx="0" fill="#dbeafe" />
        <rect x="62" y="96" width="8" height="7" rx="0" fill="#dbeafe" />
        <rect x="113" y="96" width="8" height="7" rx="0" fill="#dbeafe" />
      </svg>
    ),
  },
  {
    value: "simples",
    nome: "Simples",
    descricao: "Limpo e direto. Foco no texto e na conversão, sem distração.",
    preview: (
      <svg viewBox="0 0 160 110" className="w-full h-full" fill="none">
        <rect width="160" height="110" rx="6" fill="white" />
        {/* nav minimal */}
        <rect x="10" y="8" width="18" height="3" rx="1.5" fill="#111827" />
        <line x1="0" y1="18" x2="160" y2="18" stroke="#f3f4f6" strokeWidth="1" />
        {/* hero centralizado */}
        <rect x="30" y="26" width="100" height="3" rx="1.5" fill="#6b7280" />
        <rect x="20" y="32" width="120" height="10" rx="2" fill="#111827" />
        <rect x="25" y="45" width="110" height="2" rx="1" fill="#9ca3af" />
        <rect x="35" y="49" width="90" height="2" rx="1" fill="#9ca3af" />
        <rect x="55" y="55" width="50" height="8" rx="4" fill="#111827" />
        {/* divisor */}
        <line x1="10" y1="70" x2="150" y2="70" stroke="#f3f4f6" strokeWidth="1" />
        {/* serviços lista */}
        <rect x="10" y="75" width="140" height="6" rx="2" fill="#f9fafb" />
        <rect x="10" y="83" width="140" height="6" rx="2" fill="#f9fafb" />
        <rect x="10" y="91" width="140" height="6" rx="2" fill="#f9fafb" />
        <rect x="10" y="99" width="140" height="6" rx="2" fill="#f9fafb" />
      </svg>
    ),
  },
]

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
    servicos: [{ nome: "", descricao: "" }],
    contato: "",
    acao: "",
    layout: "editorial",
    whatsapp: "",
    telefone: "",
    instagram: "",
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
    if (step < 5) setStep((s) => (s + 1) as Step)
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
      body.append("layout", form.layout)
      body.append("whatsapp", form.whatsapp)
      body.append("telefone", form.telefone)
      body.append("instagram", form.instagram)
      body.append("servicos", JSON.stringify(form.servicos))
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

  const progresso = (step / 5) * 100

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
        <span className="text-sm text-gray-400">Passo {step} de 5</span>
      </nav>

      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* Step 1 — Nome + Descrição + Serviços */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Conte mais sobre seu negócio</h1>
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

              {/* Serviços */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Seus serviços ou produtos <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <p className="text-xs text-gray-400 mt-0.5">Aparecem em destaque na sua página. Adicione até 4.</p>
                </div>
                {form.servicos.map((s, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Ex: ${["Corte feminino", "Consultoria online", "Aula particular", "Massagem relaxante"][i] || "Serviço"}`}
                        value={s.nome}
                        onChange={(e) => {
                          const novo = [...form.servicos]
                          novo[i] = { ...novo[i], nome: e.target.value }
                          setForm({ ...form, servicos: novo })
                        }}
                        maxLength={50}
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Descrição curta (opcional)"
                        value={s.descricao}
                        onChange={(e) => {
                          const novo = [...form.servicos]
                          novo[i] = { ...novo[i], descricao: e.target.value }
                          setForm({ ...form, servicos: novo })
                        }}
                        maxLength={100}
                      />
                    </div>
                    {form.servicos.length > 1 && (
                      <button
                        onClick={() => setForm({ ...form, servicos: form.servicos.filter((_, j) => j !== i) })}
                        className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    )}
                  </div>
                ))}
                {form.servicos.length < 4 && (
                  <button
                    onClick={() => setForm({ ...form, servicos: [...form.servicos, { nome: "", descricao: "" }] })}
                    className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors w-fit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Adicionar serviço
                  </button>
                )}
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
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-xl p-4 pl-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 bg-white w-full"
                    placeholder="seuperfil"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value.replace(/^@+/, "") })}
                  />
                </div>
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
                  {
                    value: "whatsapp",
                    label: form.contato === "instagram" ? "Me contatar no Instagram"
                         : form.contato === "telefone"  ? "Me ligar"
                         : "Me chamar no WhatsApp",
                    desc: form.contato === "instagram" ? "Botão direto para o seu perfil no Instagram"
                        : form.contato === "telefone"  ? "Botão para ligar diretamente"
                        : "Botão direto para conversa no WhatsApp",
                  },
                  { value: "agendamento", label: "Agendar um horário", desc: "Formulário de agendamento integrado" },
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

          {/* Step 5 — Layout */}
          {step === 5 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Escolha o visual da página</h1>
                <p className="text-gray-500 mt-2">Você pode trocar depois, mas escolha o que mais combina com o seu negócio.</p>
              </div>
              <div className="flex flex-col gap-4">
                {layouts.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setForm({ ...form, layout: l.value })}
                    className={`rounded-2xl border-2 text-left transition-all overflow-hidden ${
                      form.layout === l.value
                        ? "border-indigo-600 ring-2 ring-indigo-100"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {/* Preview visual */}
                    <div className={`w-full h-40 p-3 transition-colors ${form.layout === l.value ? "bg-indigo-50/50" : "bg-gray-50"}`}>
                      {l.preview}
                    </div>
                    {/* Info */}
                    <div className={`px-4 py-3 flex items-center justify-between border-t transition-colors ${form.layout === l.value ? "border-indigo-200 bg-white" : "border-gray-100 bg-white"}`}>
                      <div>
                        <span className={`font-semibold block text-sm ${form.layout === l.value ? "text-indigo-700" : "text-gray-900"}`}>{l.nome}</span>
                        <span className="text-xs text-gray-500">{l.descricao}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 transition-all ${form.layout === l.value ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}>
                        {form.layout === l.value && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
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

            {step < 5 ? (
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
