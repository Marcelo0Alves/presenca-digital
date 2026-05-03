"use client"

import { useState } from "react"
import type { BusinessData } from "@/types"

function ctaHref(data: BusinessData): string {
  if (data.acao === "whatsapp" && data.whatsapp) {
    return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`
  }
  if (data.acao === "agendamento") {
    if (data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}?text=Olá! Gostaria de agendar um horário.`
    if (data.instagram) return `https://instagram.com/${data.instagram}`
    if (data.telefone) return `tel:${data.telefone}`
  }
  if (data.acao === "compra") {
    if (data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}?text=Olá! Gostaria de fazer um pedido.`
    if (data.instagram) return `https://instagram.com/${data.instagram}`
  }
  if (data.contato === "instagram" && data.instagram) return `https://instagram.com/${data.instagram}`
  if (data.contato === "telefone" && data.telefone) return `tel:${data.telefone}`
  return "#"
}

function ctaLabel(acao: string): string {
  if (acao === "whatsapp") return "Falar no WhatsApp"
  if (acao === "agendamento") return "Agendar agora"
  if (acao === "compra") return "Comprar agora"
  return "Entrar em contato"
}

function AgendamentoModal({
  data,
  cor,
  onClose,
}: {
  data: BusinessData
  cor: string
  onClose: () => void
}) {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [horario, setHorario] = useState("")
  const [mensagem, setMensagem] = useState("")

  function confirmar() {
    if (!nome.trim() || !telefone.trim()) return
    const texto = `Olá, ${data.nome}! Gostaria de agendar um horário.\n\n👤 Nome: ${nome}\n📱 Telefone: ${telefone}${horario ? `\n🗓️ Horário preferido: ${horario}` : ""}${mensagem ? `\n💬 Observação: ${mensagem}` : ""}`
    const num = data.whatsapp?.replace(/\D/g, "") || data.telefone?.replace(/\D/g, "")
    if (num) {
      window.open(`https://wa.me/55${num}?text=${encodeURIComponent(texto)}`, "_blank")
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: cor }}>
          <div>
            <h3 className="text-lg font-bold text-white">Agendar horário</h3>
            <p className="text-white/70 text-sm">{data.nome}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Seu nome *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como você se chama?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 placeholder-gray-400"
              style={{ ["--tw-ring-color" as string]: cor }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Seu telefone / WhatsApp *</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Horário preferido</label>
            <input
              type="text"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              placeholder="Ex: Quinta-feira às 14h, ou qualquer dia pela manhã"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Observação</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Alguma dúvida ou detalhe que queira compartilhar?"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 placeholder-gray-400 resize-none"
            />
          </div>
          <button
            onClick={confirmar}
            disabled={!nome.trim() || !telefone.trim()}
            className="w-full py-4 rounded-2xl font-bold text-white text-base mt-1 transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: cor }}
          >
            Confirmar agendamento via WhatsApp →
          </button>
          <p className="text-center text-xs text-gray-400">Você será redirecionado para o WhatsApp com tudo preenchido.</p>
        </div>
      </div>
    </div>
  )
}

export default function BusinessPage({ data, preview = false }: { data: BusinessData; preview?: boolean }) {
  const cor = data.corPrimaria || "#6366f1"
  const corLight = `${cor}15`
  const corMid = `${cor}30`
  const isAgendamento = data.acao === "agendamento"
  const [modalAberto, setModalAberto] = useState(false)

  function handleCTA(e: React.MouseEvent) {
    if (isAgendamento && (data.whatsapp || data.telefone)) {
      e.preventDefault()
      setModalAberto(true)
    }
  }

  const href = ctaHref(data)
  const label = ctaLabel(data.acao)

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {data.pixelId && !preview && (
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${data.pixelId}');fbq('track','PageView');` }} />
      )}

      {modalAberto && <AgendamentoModal data={data} cor={cor} onClose={() => setModalAberto(false)} />}

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2.5">
          {data.fotoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
              <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ backgroundColor: cor }}>
              {data.nome.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-semibold text-gray-900 text-sm">{data.nome}</span>
        </div>
        <a href={href} onClick={handleCTA} target={!isAgendamento ? "_blank" : undefined} rel="noopener noreferrer"
          className="text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: cor }}>
          {label}
        </a>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32" style={{ background: `linear-gradient(135deg, ${corLight} 0%, #ffffff 70%)` }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/3" style={{ backgroundColor: cor }} />
        <div className="max-w-4xl mx-auto relative">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: corMid, color: cor }}>
            {data.categoria}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6 max-w-3xl">
            {data.tagline}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-xl mb-10">
            {data.descricaoLonga}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={href} onClick={handleCTA} target={!isAgendamento ? "_blank" : undefined} rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-white text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: cor, boxShadow: `0 8px 30px ${cor}40` }}>
              {label}
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            {data.instagram && (
              <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-base border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: cor, color: cor }}>
                @{data.instagram}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Foto destaque */}
      {data.fotoUrl && (
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${corMid}` }}>
            <img src={data.fotoUrl} alt={data.nome} className="w-full object-contain bg-white" style={{ maxHeight: 460 }} />
          </div>
        </section>
      )}

      {/* Stats visuais */}
      <section className="px-6 py-16" style={{ backgroundColor: corLight }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { valor: "100%", label: "Comprometimento" },
            { valor: "1h", label: "Resposta garantida" },
            { valor: "★★★★★", label: "Satisfação dos clientes" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl py-8 px-4 shadow-sm">
              <p className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: cor }}>{s.valor}</p>
              <p className="text-gray-500 text-xs md:text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block" style={{ color: cor }}>Sobre</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-5">{data.nome}</h2>
            <p className="text-gray-500 text-lg leading-relaxed">{data.descricaoLonga}</p>
            {data.whatsapp && (
              <a href={`https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold" style={{ color: cor }}>
                Conversar no WhatsApp →
              </a>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {[
              { n: "01", titulo: "Qualidade garantida", desc: "Cada entrega é feita com atenção e excelência em cada detalhe." },
              { n: "02", titulo: "Atendimento ágil", desc: "Resposta em até 1 hora no horário comercial, sem enrolação." },
              { n: "03", titulo: "Resultado real", desc: "Seu sucesso é nosso compromisso. Trabalhamos até o resultado ser alcançado." },
            ].map((item) => (
              <div key={item.n} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-gray-50">
                <span className="text-xs font-extrabold tracking-widest pt-0.5 flex-shrink-0" style={{ color: cor }}>{item.n}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{item.titulo}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden" style={{ backgroundColor: cor }}>
          <div className="relative p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl translate-x-1/3 -translate-y-1/3 bg-white" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3 bg-white" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Pronto para começar?</h2>
              <p className="text-white/70 text-lg mb-10">Entre em contato agora e dê o próximo passo.</p>
              <a href={href} onClick={handleCTA} target={!isAgendamento ? "_blank" : undefined} rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white font-extrabold px-10 py-5 rounded-2xl text-xl shadow-2xl hover:scale-105 transition-transform"
                style={{ color: cor }}>
                {label}
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {!preview && (
        <footer className="py-6 text-center text-xs text-gray-300 border-t border-gray-100">
          Página criada com{" "}
          <a href="https://negociopresencadigital.com.br" className="hover:underline text-gray-400">Presença Digital</a>
        </footer>
      )}
    </div>
  )
}
