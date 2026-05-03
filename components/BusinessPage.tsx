"use client"

import { useEffect, useState } from "react"
import type { BusinessData } from "@/types"

function ctaHref(data: BusinessData): string {
  if (data.acao === "whatsapp" && data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`
  if (data.acao === "agendamento") {
    if (data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}?text=Olá! Gostaria de agendar um horário.`
    if (data.instagram) return `https://instagram.com/${instagramHandle(data.instagram)}`
    if (data.telefone) return `tel:${data.telefone}`
  }
  if (data.acao === "compra") {
    if (data.linkLoja) return data.linkLoja.startsWith("http") ? data.linkLoja : `https://${data.linkLoja}`
    if (data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}?text=Olá! Gostaria de fazer um pedido.`
    if (data.instagram) return `https://instagram.com/${instagramHandle(data.instagram)}`
  }
  if (data.contato === "instagram" && data.instagram) return `https://instagram.com/${instagramHandle(data.instagram)}`
  if (data.contato === "telefone" && data.telefone) return `tel:${data.telefone}`
  return "#"
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

function ctaLabel(data: BusinessData): string {
  if (data.acao === "agendamento") return "Agendar agora"
  if (data.acao === "compra") return "Comprar agora"
  if (data.whatsapp) return "Falar no WhatsApp"
  if (data.instagram) return "Ver no Instagram"
  if (data.telefone) return "Ligar agora"
  return "Entrar em contato"
}

function ctaShortLabel(data: BusinessData): string {
  if (data.acao === "agendamento") return "Agendar"
  if (data.acao === "compra") return "Comprar"
  if (data.whatsapp) return "Falar agora"
  if (data.instagram) return "Instagram"
  if (data.telefone) return "Ligar"
  return "Contato"
}

function instagramHandle(handle?: string): string {
  return (handle || "").replace(/^@+/, "")
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "")
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function isLight(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex)
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

function rgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function AgendamentoModal({ data, cor, onClose }: { data: BusinessData; cor: string; onClose: () => void }) {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [horario, setHorario] = useState("")
  const [mensagem, setMensagem] = useState("")
  const corTexto = isLight(cor) ? "#0a0a0a" : "#ffffff"

  function confirmar() {
    if (!nome.trim() || !telefone.trim()) return
    const texto = `Olá! Gostaria de agendar um horário.\n\nNome: ${nome}\nTelefone: ${telefone}${horario ? `\nHorário preferido: ${horario}` : ""}${mensagem ? `\nObservação: ${mensagem}` : ""}`
    const num = data.whatsapp?.replace(/\D/g, "") || data.telefone?.replace(/\D/g, "")
    if (num) window.open(`https://wa.me/55${num}?text=${encodeURIComponent(texto)}`, "_blank")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,10,10,0.55)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden animate-modalIn">
        <div className="px-7 py-6 flex items-center justify-between border-b border-neutral-100">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: cor }}>Reserva</p>
            <h3 className="text-xl font-semibold text-neutral-900 mt-1">Agendar com {data.nome}</h3>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="p-7 flex flex-col gap-5">
          {[
            { label: "Seu nome", value: nome, set: setNome, placeholder: "Como você se chama?", type: "text", required: true },
            { label: "WhatsApp", value: telefone, set: setTelefone, placeholder: "(00) 00000-0000", type: "tel", required: true },
            { label: "Horário preferido", value: horario, set: setHorario, placeholder: "Ex: Quinta às 14h", type: "text", required: false },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.15em] block mb-2">
                {f.label} {f.required && <span style={{ color: cor }}>*</span>}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 placeholder-neutral-300 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.15em] block mb-2">Observação</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={3}
              placeholder="Algum detalhe que queira compartilhar?"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 placeholder-neutral-300 resize-none transition-colors"
            />
          </div>
          <button
            onClick={confirmar}
            disabled={!nome.trim() || !telefone.trim()}
            className="w-full py-4 rounded-xl font-semibold text-base mt-2 transition-all hover:opacity-90 hover:translate-y-[-1px] disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ backgroundColor: cor, color: corTexto, boxShadow: `0 8px 24px ${rgba(cor, 0.25)}` }}
          >
            Confirmar via WhatsApp
          </button>
          <p className="text-center text-[11px] text-neutral-400">Você será redirecionado para o WhatsApp para finalizar.</p>
        </div>
      </div>
    </div>
  )
}

const destaquesFallback = [
  { titulo: "Atendimento dedicado", descricao: "Cada cliente recebe atenção exclusiva, com escuta atenta e resposta rápida do início ao fim." },
  { titulo: "Resultado consistente", descricao: "Trabalho realizado com método e padrão de qualidade que pode ser percebido em cada detalhe." },
  { titulo: "Confiança e clareza", descricao: "Comunicação transparente, prazos cumpridos e nenhuma surpresa ao longo do processo." },
]

const processoFallback = [
  { titulo: "Conversa inicial", descricao: "Você conta o que precisa e tiramos todas as dúvidas sobre como podemos ajudar." },
  { titulo: "Plano sob medida", descricao: "Montamos a melhor proposta para o seu objetivo, com tudo combinado antes de começar." },
  { titulo: "Execução com excelência", descricao: "Acompanhamento próximo até a entrega, com qualidade e atenção em cada etapa." },
]

const faqFallback = [
  { pergunta: "Como funciona o atendimento?", resposta: "É só entrar em contato pelo botão da página. Respondemos rapidamente e marcamos uma conversa para entender o que você precisa." },
  { pergunta: "Atendem na minha região?", resposta: "Sim. Entre em contato para confirmar a disponibilidade e combinar os detalhes do atendimento." },
  { pergunta: "Quais formas de pagamento?", resposta: "Aceitamos as principais formas de pagamento. Os detalhes são combinados durante a conversa inicial." },
]

export default function BusinessPage({ data, preview = false }: { data: BusinessData; preview?: boolean }) {
  const cor = data.corPrimaria || "#171717"
  const corTextoBtn = isLight(cor) ? "#0a0a0a" : "#ffffff"
  const isAgendamento = data.acao === "agendamento"
  const [modalAberto, setModalAberto] = useState(false)
  const [faqAberto, setFaqAberto] = useState<number | null>(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleCTA(e: React.MouseEvent) {
    if (isAgendamento && (data.whatsapp || data.telefone)) {
      e.preventDefault()
      setModalAberto(true)
    }
  }

  const href = ctaHref(data)
  const label = ctaLabel(data)
  const shortLabel = ctaShortLabel(data)
  const inicial = data.nome.charAt(0).toUpperCase()
  const monograma = data.nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("")

  const destaques = data.destaques?.length ? data.destaques.slice(0, 3) : destaquesFallback
  const processo = data.processo?.length ? data.processo.slice(0, 3) : processoFallback
  const faq = data.faq?.length ? data.faq.slice(0, 4) : faqFallback

  const dotPattern = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='1.5' cy='1.5' r='1' fill='${cor}' fill-opacity='0.18'/></svg>`
  )}`

  return (
    <div className="min-h-screen bg-[#fafaf9] text-neutral-900 overflow-x-hidden" style={{ fontFamily: "var(--font-geist), 'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes blob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-30px) scale(1.06); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .animate-blob { animation: blob 14s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease-out backwards; }
        .animate-modalIn { animation: modalIn 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
        .grain { position: relative; }
        .grain::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.035;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        details[open] .faq-icon-plus { display: none; }
        details:not([open]) .faq-icon-minus { display: none; }
      `}</style>

      {data.pixelId && !preview && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${data.pixelId}');fbq('track','PageView');`,
          }}
        />
      )}

      {modalAberto && <AgendamentoModal data={data} cor={cor} onClose={() => setModalAberto(false)} />}

      {/* Topo informativo (linha fina) */}
      <div className="hidden md:block border-b border-neutral-200/70 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-8 py-2 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Disponível para novos clientes</span>
          </div>
          <div className="flex items-center gap-4 uppercase tracking-[0.18em]">
            <span>{data.categoria}</span>
            {data.instagram && <span>·</span>}
            {data.instagram && <span>@{instagramHandle(data.instagram)}</span>}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        className={`px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-xl border-b border-neutral-200/70" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          {data.fotoUrl ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 bg-white">
              <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 border"
              style={{ backgroundColor: cor, color: corTextoBtn, borderColor: rgba(cor, 0.2) }}
            >
              {inicial}
            </div>
          )}
          <div className="leading-tight">
            <p className="font-semibold text-neutral-900 text-[15px] tracking-tight">{data.nome}</p>
            <p className="text-[11px] text-neutral-400 -mt-0.5 hidden sm:block">{data.categoria}</p>
          </div>
        </div>
        <a
          href={href}
          onClick={handleCTA}
          target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="font-semibold px-5 py-2.5 rounded-full text-[13px] transition-all hover:translate-y-[-1px]"
          style={{ backgroundColor: cor, color: corTextoBtn, boxShadow: `0 6px 20px ${rgba(cor, 0.22)}` }}
        >
          {shortLabel}
        </a>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-8 pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Padrão de pontos */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url("${dotPattern}")`,
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse at top, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at top, black 30%, transparent 75%)",
          }}
        />
        {/* Blob decorativo */}
        <div
          className="absolute -top-20 -right-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-25 animate-blob pointer-events-none"
          style={{ backgroundColor: cor }}
        />

        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center relative">
          {/* Coluna texto */}
          <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <span
              className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full mb-7 border"
              style={{ borderColor: rgba(cor, 0.25), color: cor, backgroundColor: rgba(cor, 0.06) }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cor }} />
              {data.categoria}
            </span>

            <h1 className="text-[2.5rem] sm:text-5xl md:text-[3.75rem] lg:text-[4.25rem] font-extrabold text-neutral-900 leading-[1.02] tracking-[-0.025em] mb-7">
              {data.tagline}
            </h1>

            <p className="text-lg md:text-xl text-neutral-500 leading-relaxed mb-9 max-w-xl font-light">
              {data.descricaoLonga}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a
                href={href}
                onClick={handleCTA}
                target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-semibold px-7 py-4 rounded-full text-[15px] transition-all hover:translate-y-[-2px]"
                style={{ backgroundColor: cor, color: corTextoBtn, boxShadow: `0 14px 38px ${rgba(cor, 0.32)}` }}
              >
                {label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              {data.instagram && (
                <a
                  href={`https://instagram.com/${instagramHandle(data.instagram)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium px-6 py-4 rounded-full text-[14px] text-neutral-700 border border-neutral-300 bg-white/70 backdrop-blur-sm hover:border-neutral-900 hover:text-neutral-900 transition-all"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" /></svg>
                  @{instagramHandle(data.instagram)}
                </a>
              )}
            </div>

            {data.prova && (
              <div className="flex items-start gap-3 max-w-md">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: rgba(cor, 0.1) }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed pt-0.5">{data.prova}</p>
              </div>
            )}
          </div>

          {/* Coluna visual */}
          <div className="animate-fade-up flex items-center justify-center lg:justify-end" style={{ animationDelay: "0.15s" }}>
            <div className="relative">
              {/* Card principal */}
              <div
                className="relative w-72 h-80 sm:w-80 sm:h-96 md:w-[22rem] md:h-[26rem] rounded-[2rem] overflow-hidden grain"
                style={{
                  background: data.fotoUrl
                    ? "white"
                    : `linear-gradient(150deg, ${cor} 0%, ${rgba(cor, 0.85)} 100%)`,
                  boxShadow: `0 30px 80px -25px ${rgba(cor, 0.5)}, 0 0 0 1px ${rgba(cor, 0.08)}`,
                }}
              >
                {data.fotoUrl ? (
                  <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-white via-neutral-50 to-white">
                    <img src={data.fotoUrl} alt={data.nome} className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-10 relative">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='2' cy='2' r='1' fill='white' fill-opacity='0.6'/></svg>`)}")`,
                      backgroundSize: "20px 20px",
                    }} />
                    <span
                      className="font-black select-none relative z-10 leading-none tracking-tighter"
                      style={{ fontSize: "8.5rem", color: corTextoBtn, opacity: 0.95 }}
                    >
                      {monograma || inicial}
                    </span>
                    <div className="absolute bottom-8 left-8 right-8 z-10">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: corTextoBtn, opacity: 0.6 }}>
                        Estabelecimento
                      </p>
                      <p className="text-2xl font-bold leading-tight" style={{ color: corTextoBtn }}>{data.nome}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Badge categoria flutuante */}
              <div className="absolute -top-3 -left-3 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.25)] border border-neutral-100 max-w-[180px]">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-0.5">Categoria</p>
                <p className="font-bold text-neutral-900 text-sm leading-tight">{data.categoria}</p>
              </div>

              {/* Badge contato flutuante */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.25)] border border-neutral-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: rgba(cor, 0.12) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.18em]">Falar agora</p>
                  <p className="font-bold text-neutral-900 text-xs">Resposta rápida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faixa de informações chave */}
      <section className="border-y border-neutral-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {[
            { label: "Atendimento", valor: data.contato === "whatsapp" ? "WhatsApp" : data.contato === "instagram" ? "Instagram" : data.contato === "telefone" ? "Telefone" : "Direto" },
            { label: "Especialidade", valor: data.categoria },
            { label: "Tempo de resposta", valor: "Hoje mesmo" },
            { label: "Modelo", valor: data.acao === "compra" ? "Pedidos" : data.acao === "agendamento" ? "Agendamento" : "Sob demanda" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">{item.label}</p>
              <p className="font-semibold text-neutral-900 text-sm">{item.valor}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre — editorial */}
      <section className="px-6 md:px-8 py-24 md:py-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-20">
          <div className="md:sticky md:top-32 md:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: cor }}>
              Sobre
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-[1.1] tracking-tight">
              {data.nome}
            </h2>
            <div className="w-12 h-[2px] mt-6" style={{ backgroundColor: cor }} />
          </div>
          <div>
            <p className="text-2xl md:text-[1.7rem] text-neutral-900 leading-[1.4] font-light mb-10 tracking-tight">
              {data.descricaoLonga}
            </p>
            <a
              href={href}
              onClick={handleCTA}
              target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-sm group"
              style={{ color: cor }}
            >
              <span className="border-b-2 pb-0.5" style={{ borderColor: rgba(cor, 0.4) }}>{label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="px-6 md:px-8 py-24 md:py-28 bg-white border-y border-neutral-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: cor }}>
              Por que escolher
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-[1.05] tracking-tight">
              O que diferencia o nosso trabalho.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-neutral-200/70 border border-neutral-200/70 rounded-3xl overflow-hidden">
            {destaques.map((d, i) => (
              <div key={i} className="bg-white p-8 md:p-10 flex flex-col gap-5 hover:bg-neutral-50/50 transition-colors group">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold tracking-[0.2em] uppercase"
                    style={{ color: cor }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: rgba(cor, 0.08) }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 tracking-tight leading-snug">{d.titulo}</h3>
                <p className="text-neutral-500 text-[15px] leading-relaxed">{d.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="px-6 md:px-8 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: cor }}>
              Como funciona
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-[1.05] tracking-tight">
              Simples do começo ao fim.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Linha conectora desktop */}
            <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-neutral-200" />
            {processo.map((p, i) => (
              <div key={i} className="relative flex md:flex-col gap-5 md:gap-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 relative z-10 border-4 border-[#fafaf9]"
                  style={{ backgroundColor: cor, color: corTextoBtn }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg mb-2 tracking-tight">{p.titulo}</h3>
                  <p className="text-neutral-500 text-[15px] leading-relaxed">{p.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços / O que oferecemos */}
      {data.servicosOferecidos && data.servicosOferecidos.length > 0 && (
        <section className="px-6 md:px-8 py-24 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: cor }}>
                O que oferecemos
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-[1.05] tracking-tight">
                Serviços e produtos.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.servicosOferecidos.map((s, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl border border-neutral-200/80 bg-white hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-sm font-bold"
                    style={{ backgroundColor: rgba(cor, 0.1), color: cor }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-base mb-2 leading-snug">{s.nome}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{s.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statement / brand color band */}
      <section className="px-6 md:px-8 py-20 md:py-28 grain relative overflow-hidden" style={{ backgroundColor: cor }}>
        <div className="absolute -bottom-40 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-30" style={{ backgroundColor: corTextoBtn === "#ffffff" ? "white" : "black" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-6" style={{ color: corTextoBtn, opacity: 0.6 }}>
            {data.nome}
          </p>
          <p className="text-3xl md:text-[2.6rem] font-medium leading-[1.2] tracking-tight" style={{ color: corTextoBtn }}>
            &ldquo;{data.tagline}&rdquo;
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-8 py-24 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: cor }}>
              Dúvidas frequentes
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-[1.05] tracking-tight">
              Tudo que você quer saber.
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faq.map((f, i) => {
              const aberto = faqAberto === i
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all ${
                    aberto ? "bg-neutral-50 border-neutral-200" : "bg-white border-neutral-200/70 hover:border-neutral-300"
                  }`}
                >
                  <button
                    onClick={() => setFaqAberto(aberto ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-neutral-900 text-[16px] leading-snug">{f.pergunta}</span>
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform"
                      style={{ backgroundColor: rgba(cor, 0.1), color: cor, transform: aberto ? "rotate(45deg)" : "rotate(0)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all"
                    style={{ maxHeight: aberto ? "500px" : "0", opacity: aberto ? 1 : 0 }}
                  >
                    <p className="px-6 pb-5 text-neutral-500 text-[15px] leading-relaxed">{f.resposta}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-20 grain"
            style={{
              background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`,
            }}
          >
            <div className="absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-40" style={{ backgroundColor: cor }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: cor }} />

            <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-5" style={{ color: cor }}>
                  Vamos começar
                </p>
                <h2 className="text-4xl md:text-[3.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6">
                  Pronto para o próximo passo?
                </h2>
                <p className="text-white/60 text-lg max-w-md leading-relaxed">
                  Entre em contato agora — sem compromisso. Conversamos sobre o que você precisa e como podemos ajudar.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={href}
                  onClick={handleCTA}
                  target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-5 rounded-full text-base transition-all hover:translate-y-[-2px]"
                  style={{ backgroundColor: cor, color: corTextoBtn, boxShadow: `0 18px 50px ${rgba(cor, 0.4)}` }}
                >
                  {label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                {data.instagram && (
                  <a
                    href={`https://instagram.com/${instagramHandle(data.instagram)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 font-medium px-8 py-5 rounded-full text-sm text-white/80 border border-white/15 hover:bg-white/5 hover:text-white transition-all"
                  >
                    Ver no Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {data.fotoUrl ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 bg-white">
                    <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                    style={{ backgroundColor: cor, color: corTextoBtn }}
                  >
                    {inicial}
                  </div>
                )}
                <div>
                  <p className="font-bold text-neutral-900">{data.nome}</p>
                  <p className="text-xs text-neutral-400">{data.categoria}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">{data.tagline}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-4">Contato</p>
              <div className="flex flex-col gap-2.5">
                {data.whatsapp && (
                  <a href={`https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-2 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-400 group-hover:text-emerald-600"><path d="M17.5 14.4l-2.6-1.2c-.4-.2-.8-.1-1.1.2l-.7.7c-1.4-.7-2.5-1.8-3.2-3.2l.7-.7c.3-.3.4-.7.2-1.1L9.6 6.5c-.2-.4-.7-.6-1.1-.4-1 .3-2 1-2.4 1.9-.5 1.5-.1 3.4 1.4 5.7 1.6 2.4 3.4 4.2 5.5 5.4 1.5.9 2.7 1.1 3.6 1.1.4 0 .8 0 1.1-.1.9-.4 1.6-1.4 1.9-2.4.1-.4-.1-.9-.5-1.1z" /></svg>
                    WhatsApp
                  </a>
                )}
                {data.instagram && (
                  <a href={`https://instagram.com/${instagramHandle(data.instagram)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>
                    @{instagramHandle(data.instagram)}
                  </a>
                )}
                {data.telefone && (
                  <a href={`tel:${data.telefone}`} className="text-sm text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    {data.telefone}
                  </a>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-4">Atendimento</p>
              <p className="text-sm text-neutral-700 mb-2">Resposta no mesmo dia</p>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                Estamos disponíveis para tirar dúvidas e atender novos clientes através dos canais ao lado.
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-200/70 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-neutral-400">© {new Date().getFullYear()} {data.nome}. Todos os direitos reservados.</p>
            {!preview && (
              <p className="text-xs text-neutral-400">
                Página criada com{" "}
                <a href="https://negociopresencadigital.com.br" className="hover:text-neutral-700 underline-offset-2 hover:underline">Presença Digital</a>
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* CTA fixo mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-[#fafaf9] via-[#fafaf9]/95 to-transparent pt-10">
        <a
          href={href}
          onClick={handleCTA}
          target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-full text-[15px] w-full transition-all"
          style={{ backgroundColor: cor, color: corTextoBtn, boxShadow: `0 14px 38px ${rgba(cor, 0.4)}` }}
        >
          {label}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div className="md:hidden h-24" aria-hidden="true" />
    </div>
  )
}
