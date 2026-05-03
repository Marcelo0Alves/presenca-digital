"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Upload, Loader2 } from "lucide-react"
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
  temFoto: boolean
  foto: File | null
}

export default function CriarPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const [form, setForm] = useState<FormData>({
    nomeLoja: "",
    descricao: "",
    contato: "",
    acao: "",
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
    try {
      const body = new FormData()
      body.append("descricao", form.descricao)
      body.append("nomeLoja", form.nomeLoja)
      body.append("contato", form.contato)
      body.append("acao", form.acao)
      body.append("whatsapp", form.whatsapp)
      body.append("telefone", form.telefone)
      body.append("instagram", form.instagram)
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
            </div>
          )}

          {/* Step 4 — Foto */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tem foto do seu trabalho?</h1>
                <p className="text-gray-500 mt-2">Uma imagem deixa sua página muito mais profissional.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setForm({ ...form, temFoto: true })}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    form.temFoto
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:border-indigo-300"
                  }`}
                >
                  Sim, vou enviar
                </button>
                <button
                  onClick={() => setForm({ ...form, temFoto: false, foto: null })}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    !form.temFoto
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:border-indigo-300"
                  }`}
                >
                  Usar foto genérica
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
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-indigo-400 transition-colors"
                  >
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-gray-500">
                      {form.foto ? form.foto.name : "Clique para selecionar a imagem"}
                    </span>
                  </button>
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
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Gerando sua presença...
                  </>
                ) : (
                  <>
                    Criar minha presença
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
