"use client"

import { useEffect, useState } from "react"
import type { BusinessData } from "@/types"

function ctaHref(data: BusinessData): string {
  if (data.acao === "whatsapp" && data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`
  if (data.acao === "agendamento") {
    if (data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}?text=Olá! Gostaria de agendar um horário.`
    if (data.instagram) return `https://instagram.com/${data.instagram}`
    if (data.telefone) return `tel:${data.telefone}`
  }
  if (data.acao === "compra") {
    if (data.linkLoja) return data.linkLoja.startsWith("http") ? data.linkLoja : `https://${data.linkLoja}`
    if (data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}?text=Olá! Gostaria de fazer um pedido.`
    if (data.instagram) return `https://instagram.com/${data.instagram}`
  }
  if (data.contato === "instagram" && data.instagram) return `https://instagram.com/${data.instagram}`
  if (data.contato === "telefone" && data.telefone) return `tel:${data.telefone}`
  return "#"
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

function ctaLabel(acao: string): string {
  if (acao === "whatsapp") return "Falar no WhatsApp"
  if (acao === "agendamento") return "Agendar agora"
  if (acao === "compra") return "Comprar agora"
  return "Entrar em contato"
}

function ctaShortLabel(acao: string): string {
  if (acao === "whatsapp") return "Falar agora"
  if (acao === "agendamento") return "Agendar"
  if (acao === "compra") return "Comprar"
  return "Contato"
}

function hexToRgb(hex: string) {
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

/* Decoração: grade de pontos */
function DotGrid({ size = 5, gap = 10, color = "#e5e7eb" }: { size?: number; gap?: number; color?: string }) {
  const cols = size
  const rows = size
  return (
    <svg width={cols * gap} height={rows * gap} viewBox={`0 0 ${cols * gap} ${rows * gap}`} fill="none">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={c * gap + gap / 2} cy={r * gap + gap / 2} r={1.5} fill={color} />
        ))
      )}
    </svg>
  )
}

/* Decoração: linhas diagonais */
function DiagLines({ color = "#e5e7eb", size = 60 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {[0, 10, 20, 30, 40, 50].map((o) => (
        <line key={o} x1={o} y1={0} x2={o + 60} y2={60} stroke={color} strokeWidth="1.5" />
      ))}
    </svg>
  )
}

function AgendamentoModal({ data, cor, onClose }: { data: BusinessData; cor: string; onClose: () => void }) {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [horario, setHorario] = useState("")
  const [mensagem, setMensagem] = useState("")
  const corTexto = isLight(cor) ? "#0a0a0a" : "#ffffff"

  function confirmar() {
    if (!nome.trim() || !telefone.trim()) return
    const texto = `Olá, ${data.nome}! Gostaria de agendar um horário.\n\nNome: ${nome}\nTelefone: ${telefone}${horario ? `\nHorário preferido: ${horario}` : ""}${mensagem ? `\nObservação: ${mensagem}` : ""}`
    const num = data.whatsapp?.replace(/\D/g, "") || data.telefone?.replace(/\D/g, "")
    if (num) window.open(`https://wa.me/55${num}?text=${encodeURIComponent(texto)}`, "_blank")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100" style={{ borderTop: `4px solid ${cor}` }}>
          <h3 className="text-lg font-bold text-gray-900">Agendar com {data.nome}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {[
            { label: "Seu nome", value: nome, set: setNome, placeholder: "Como você se chama?", type: "text", required: true },
            { label: "WhatsApp", value: telefone, set: setTelefone, placeholder: "(00) 00000-0000", type: "tel", required: true },
            { label: "Horário preferido", value: horario, set: setHorario, placeholder: "Ex: Quinta às 14h", type: "text", required: false },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none placeholder-gray-300 transition-colors"
                style={{ focusBorderColor: cor } as React.CSSProperties}
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Observação</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={3}
              placeholder="Algum detalhe que queira compartilhar?"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none placeholder-gray-300 resize-none"
            />
          </div>
          <button
            onClick={confirmar}
            disabled={!nome.trim() || !telefone.trim()}
            className="w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: cor, color: corTexto }}
          >
            Confirmar via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LayoutModerno({ data, preview = false }: { data: BusinessData; preview?: boolean }) {
  const cor = data.corPrimaria || "#2563eb"
  const corTextoBtn = isLight(cor) ? "#0a0a0a" : "#ffffff"
  const isAgendamento = data.acao === "agendamento"
  const [modalAberto, setModalAberto] = useState(false)
  const [faqAberto, setFaqAberto] = useState<number | null>(null)
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
  const label = ctaLabel(data.acao)
  const shortLabel = ctaShortLabel(data.acao)
  const inicial = data.nome.charAt(0).toUpperCase()

  const destaques = data.destaques?.length ? data.destaques.slice(0, 3) : [
    { titulo: "Atendimento dedicado", descricao: "Cada cliente recebe atenção exclusiva e resposta rápida." },
    { titulo: "Resultado consistente", descricao: "Trabalho realizado com método e padrão de qualidade." },
    { titulo: "Confiança e clareza", descricao: "Comunicação transparente, prazos cumpridos, sem surpresas." },
  ]
  const processo = data.processo?.length ? data.processo.slice(0, 3) : [
    { titulo: "Conversa inicial", descricao: "Você conta o que precisa e tiramos todas as dúvidas." },
    { titulo: "Plano sob medida", descricao: "Montamos a melhor proposta para o seu objetivo." },
    { titulo: "Execução com excelência", descricao: "Acompanhamento próximo até a entrega." },
  ]
  const faq = data.faq?.length ? data.faq.slice(0, 4) : [
    { pergunta: "Como funciona o atendimento?", resposta: "É só entrar em contato pelo botão da página. Respondemos rapidamente." },
    { pergunta: "Atendem na minha região?", resposta: "Sim. Entre em contato para confirmar a disponibilidade." },
    { pergunta: "Quais formas de pagamento?", resposta: "Aceitamos as principais formas de pagamento. Detalhes na conversa inicial." },
  ]

  const icones = [
    <svg key="a" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    <svg key="b" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    <svg key="c" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden" style={{ fontFamily: "var(--font-geist), 'Inter', system-ui, sans-serif" }}>
      {data.pixelId && !preview && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${data.pixelId}');fbq('track','PageView');`,
          }}
        />
      )}

      {modalAberto && <AgendamentoModal data={data} cor={cor} onClose={() => setModalAberto(false)} />}

      {/* Nav */}
      <nav
        className={`px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-40 bg-white transition-all duration-300 ${
          scrolled ? "shadow-sm border-b border-gray-100" : "border-b border-gray-100"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          {data.fotoUrl ? (
            <div className="w-10 h-10 rounded overflow-hidden border border-gray-200 flex-shrink-0">
              <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ backgroundColor: cor, color: corTextoBtn }}
            >
              {inicial}
            </div>
          )}
          <span className="font-black text-gray-900 text-[15px] uppercase tracking-wide">{data.nome}</span>
        </div>

        {/* Links (desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500 uppercase tracking-widest">
          <span className="hover:text-gray-900 cursor-default transition-colors">Início</span>
          <span className="hover:text-gray-900 cursor-default transition-colors">Sobre</span>
          <span className="hover:text-gray-900 cursor-default transition-colors">Serviços</span>
          <span className="hover:text-gray-900 cursor-default transition-colors">Contato</span>
        </div>

        {/* Redes + CTA */}
        <div className="flex items-center gap-3">
          {data.instagram && (
            <a
              href={`https://instagram.com/${data.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex w-8 h-8 rounded items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
            </a>
          )}
          {data.whatsapp && (
            <a
              href={`https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex w-8 h-8 rounded items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4l-2.6-1.2c-.4-.2-.8-.1-1.1.2l-.7.7c-1.4-.7-2.5-1.8-3.2-3.2l.7-.7c.3-.3.4-.7.2-1.1L9.6 6.5c-.2-.4-.7-.6-1.1-.4-1 .3-2 1-2.4 1.9-.5 1.5-.1 3.4 1.4 5.7 1.6 2.4 3.4 4.2 5.5 5.4 1.5.9 2.7 1.1 3.6 1.1.4 0 .8 0 1.1-.1.9-.4 1.6-1.4 1.9-2.4.1-.4-.1-.9-.5-1.1z"/></svg>
            </a>
          )}
          <a
            href={href}
            onClick={handleCTA}
            target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="font-bold px-5 py-2.5 text-[13px] uppercase tracking-widest transition-all hover:opacity-90"
            style={{ backgroundColor: cor, color: corTextoBtn }}
          >
            {shortLabel}
          </a>
        </div>
      </nav>

      {/* Hero — split */}
      <section className="relative overflow-hidden bg-white">
        <div className="grid lg:grid-cols-2 min-h-[540px] md:min-h-[600px]">

          {/* Coluna esquerda — conteúdo */}
          <div className="relative flex flex-col justify-center px-8 md:px-12 py-16 md:py-20 z-10">
            {/* Decoração: pontos topo-esquerda */}
            <div className="absolute top-6 right-8 opacity-50 hidden md:block">
              <DotGrid size={6} gap={10} color={rgba(cor, 0.25)} />
            </div>

            {/* Categoria badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-0.5" style={{ backgroundColor: cor }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">{data.categoria}</span>
            </div>

            {/* Título em bloco colorido */}
            <div className="mb-6 inline-block">
              <div className="inline-block px-5 py-3 mb-1" style={{ backgroundColor: cor }}>
                <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black uppercase leading-tight tracking-tight" style={{ color: corTextoBtn }}>
                  {data.tagline.split(" ").slice(0, Math.ceil(data.tagline.split(" ").length / 2)).join(" ")}
                </h1>
              </div>
              <div className="block">
                <div className="inline-block px-5 py-3" style={{ backgroundColor: rgba(cor, 0.12) }}>
                  <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black uppercase leading-tight tracking-tight" style={{ color: cor }}>
                    {data.tagline.split(" ").slice(Math.ceil(data.tagline.split(" ").length / 2)).join(" ")}
                  </h1>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-sm">
              {data.descricaoLonga}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={href}
                onClick={handleCTA}
                target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold px-6 py-3.5 text-sm uppercase tracking-[0.15em] transition-all hover:opacity-90"
                style={{ backgroundColor: cor, color: corTextoBtn }}
              >
                {label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Decoração: pontos baixo-esquerda */}
            <div className="absolute bottom-8 left-4 opacity-40">
              <DotGrid size={4} gap={9} color={rgba(cor, 0.4)} />
            </div>
          </div>

          {/* Coluna direita — foto ou monograma */}
          <div className="relative hidden lg:block">
            {/* Decoração: linhas diagonais topo-direita */}
            <div className="absolute top-0 right-0 opacity-30 overflow-hidden w-24 h-24">
              <DiagLines color={cor} />
            </div>
            {/* Decoração: círculo */}
            <div
              className="absolute bottom-12 left-8 w-16 h-16 rounded-full opacity-20"
              style={{ backgroundColor: cor }}
            />
            <div
              className="absolute top-1/2 right-8 -translate-y-1/2 w-8 h-8 rounded-full opacity-40 border-4"
              style={{ borderColor: cor }}
            />

            {/* Imagem ou placeholder */}
            {data.fotoUrl ? (
              <div className="absolute inset-0" style={{ backgroundColor: rgba(cor, 0.04) }}>
                <img
                  src={data.fotoUrl}
                  alt={data.nome}
                  className="w-full h-full object-cover object-center"
                />
                {/* Overlay sutil no canto */}
                <div
                  className="absolute bottom-0 left-0 w-2/3 h-1/3 opacity-30"
                  style={{ background: `linear-gradient(to top right, ${cor}, transparent)` }}
                />
              </div>
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${rgba(cor, 0.08)} 0%, ${rgba(cor, 0.02)} 100%)` }}
              >
                <span
                  className="font-black text-[10rem] leading-none select-none"
                  style={{ color: rgba(cor, 0.15) }}
                >
                  {inicial}
                </span>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: cor }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Faixa decorativa inferior */}
        <div className="h-1 w-full" style={{ backgroundColor: cor }} />

        {/* Cards de destaque — abaixo do hero */}
        <div className="px-8 md:px-12 py-10 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {destaques.map((d, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded flex items-center justify-center flex-shrink-0 border"
                  style={{ borderColor: rgba(cor, 0.25), color: cor, backgroundColor: rgba(cor, 0.06) }}
                >
                  {icones[i % icones.length]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1 leading-snug">{d.titulo}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{d.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre — split invertido */}
      <section className="px-8 md:px-12 py-20 md:py-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Visual */}
          <div className="relative order-2 md:order-1">
            <div
              className="relative overflow-hidden"
              style={{ backgroundColor: rgba(cor, 0.06), border: `2px solid ${rgba(cor, 0.15)}` }}
            >
              {data.fotoUrl ? (
                <img src={data.fotoUrl} alt={data.nome} className="w-full h-64 md:h-80 object-contain p-8" />
              ) : (
                <div className="h-64 md:h-80 flex items-center justify-center">
                  <span className="font-black text-[6rem] leading-none select-none" style={{ color: rgba(cor, 0.2) }}>{inicial}</span>
                </div>
              )}
              {/* Barra colorida lateral */}
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: cor }} />
            </div>
            {/* Decoração: pontos */}
            <div className="absolute -bottom-5 -right-5 opacity-40">
              <DotGrid size={5} gap={9} color={rgba(cor, 0.4)} />
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-0.5" style={{ backgroundColor: cor }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Sobre</span>
            </div>
            <h2 className="text-3xl md:text-[2.4rem] font-black text-gray-900 leading-tight uppercase tracking-tight mb-5">
              {data.nome}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6">{data.descricaoLonga}</p>
            {data.prova && (
              <div className="flex items-center gap-3 mb-6 p-4" style={{ backgroundColor: rgba(cor, 0.06), borderLeft: `3px solid ${cor}` }}>
                <p className="text-sm font-medium text-gray-700">{data.prova}</p>
              </div>
            )}
            <a
              href={href}
              onClick={handleCTA}
              target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-[0.15em] px-6 py-3 transition-all hover:opacity-90"
              style={{ backgroundColor: cor, color: corTextoBtn }}
            >
              {label}
            </a>
          </div>
        </div>
      </section>

      {/* Serviços */}
      {data.servicosOferecidos && data.servicosOferecidos.length > 0 && (
        <section className="px-8 md:px-12 py-20 md:py-24" style={{ backgroundColor: rgba(cor, 0.04) }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-0.5" style={{ backgroundColor: cor }} />
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Serviços</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {data.servicosOferecidos.map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-6 border-t-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderTopColor: i === 0 ? cor : rgba(cor, 0.5 - i * 0.1) }}
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em] mb-4 block" style={{ color: cor }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug uppercase">{s.nome}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Processo */}
      <section className="px-8 md:px-12 py-20 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-0.5" style={{ backgroundColor: cor }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Como funciona</span>
              <div className="w-6 h-0.5" style={{ backgroundColor: cor }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Simples do começo ao fim.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-7 left-[18%] right-[18%] h-px bg-gray-200" />
            {processo.map((p, i) => (
              <div key={i} className="flex md:flex-col gap-5 md:gap-5 items-start">
                <div
                  className="w-14 h-14 flex items-center justify-center font-black text-xl flex-shrink-0 relative z-10 border-4 border-white"
                  style={{ backgroundColor: cor, color: corTextoBtn }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-2 uppercase tracking-wide">{p.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="px-8 md:px-12 py-16 md:py-20 relative overflow-hidden" style={{ backgroundColor: cor }}>
        <div className="absolute top-0 right-0 opacity-10">
          <DiagLines color="white" size={120} />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <DotGrid size={8} gap={12} color="white" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] mb-4" style={{ color: corTextoBtn, opacity: 0.6 }}>
            {data.nome}
          </p>
          <p className="text-2xl md:text-4xl font-black uppercase leading-tight tracking-tight" style={{ color: corTextoBtn }}>
            &ldquo;{data.tagline}&rdquo;
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 md:px-12 py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-0.5" style={{ backgroundColor: cor }} />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Dúvidas frequentes</span>
              <div className="w-6 h-0.5" style={{ backgroundColor: cor }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Tudo que você quer saber.
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {faq.map((f, i) => {
              const aberto = faqAberto === i
              return (
                <div key={i} className={`border-l-4 transition-all ${aberto ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`} style={{ borderLeftColor: aberto ? cor : "transparent" }}>
                  <button
                    onClick={() => setFaqAberto(aberto ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left border-b border-gray-100"
                  >
                    <span className="font-bold text-gray-900 text-[15px]">{f.pergunta}</span>
                    <span
                      className="w-7 h-7 flex items-center justify-center flex-shrink-0 font-black text-xl transition-transform"
                      style={{ color: cor, transform: aberto ? "rotate(45deg)" : "rotate(0)" }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all"
                    style={{ maxHeight: aberto ? "400px" : "0", opacity: aberto ? 1 : 0 }}
                  >
                    <p className="px-5 py-4 text-gray-500 text-sm leading-relaxed">{f.resposta}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-8 md:px-12 py-20 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gray-900 p-10 md:p-16 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            {/* Decoração */}
            <div className="absolute top-0 right-0 opacity-10">
              <DiagLines color="white" size={100} />
            </div>
            <div className="absolute bottom-0 left-0 opacity-5">
              <DotGrid size={10} gap={12} color="white" />
            </div>
            {/* Barra colorida lateral */}
            <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: cor }} />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4" style={{ color: cor }}>Vamos começar</p>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-4">
                Pronto para o próximo passo?
              </h2>
              <p className="text-white/50 text-base leading-relaxed">
                Entre em contato agora — sem compromisso. Conversamos sobre o que você precisa.
              </p>
            </div>
            <div className="relative flex flex-col gap-3">
              <a
                href={href}
                onClick={handleCTA}
                target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 font-bold px-8 py-4 text-sm uppercase tracking-widest transition-all hover:opacity-90"
                style={{ backgroundColor: cor, color: corTextoBtn }}
              >
                {label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              {data.instagram && (
                <a
                  href={`https://instagram.com/${data.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-sm text-white/70 border border-white/15 hover:bg-white/5 hover:text-white transition-all"
                >
                  Ver no Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t-4" style={{ borderTopColor: cor }}>
        <div className="max-w-5xl mx-auto px-8 md:px-12 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {data.fotoUrl ? (
                  <div className="w-10 h-10 overflow-hidden border border-white/10">
                    <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center font-black" style={{ backgroundColor: cor, color: corTextoBtn }}>
                    {inicial}
                  </div>
                )}
                <div>
                  <p className="font-black text-white text-sm uppercase tracking-wide">{data.nome}</p>
                  <p className="text-xs text-white/30">{data.categoria}</p>
                </div>
              </div>
              <p className="text-sm text-white/30 leading-relaxed">{data.tagline}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Contato</p>
              <div className="flex flex-col gap-2.5">
                {data.whatsapp && (
                  <a href={`https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">WhatsApp</a>
                )}
                {data.instagram && (
                  <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">@{data.instagram}</a>
                )}
                {data.telefone && (
                  <a href={`tel:${data.telefone}`} className="text-sm text-white/50 hover:text-white transition-colors">{data.telefone}</a>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Atendimento</p>
              <p className="text-sm text-white/30 leading-relaxed">Resposta no mesmo dia para novos clientes.</p>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/20">© {new Date().getFullYear()} {data.nome}. Todos os direitos reservados.</p>
            {!preview && (
              <p className="text-xs text-white/20">
                Criado com{" "}
                <a href="https://negociopresencadigital.com.br" className="hover:text-white/50 transition-colors">Presença Digital</a>
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* CTA fixo mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-white via-white/95 to-transparent pt-8">
        <a
          href={href}
          onClick={handleCTA}
          target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 font-bold px-6 py-4 text-[14px] w-full uppercase tracking-widest transition-all hover:opacity-90"
          style={{ backgroundColor: cor, color: corTextoBtn }}
        >
          {label}
        </a>
      </div>
      <div className="md:hidden h-24" aria-hidden="true" />
    </div>
  )
}
