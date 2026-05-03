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
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
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
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-300"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Observação</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={3}
              placeholder="Algum detalhe que queira compartilhar?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-300 resize-none"
            />
          </div>
          <button
            onClick={confirmar}
            disabled={!nome.trim() || !telefone.trim()}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: cor, color: corTexto }}
          >
            Confirmar via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LayoutSimples({ data, preview = false }: { data: BusinessData; preview?: boolean }) {
  const cor = data.corPrimaria || "#111827"
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
  const label = ctaLabel(data)
  const shortLabel = ctaShortLabel(data)
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

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden" style={{ fontFamily: "var(--font-geist), 'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .simp-fade { animation: fadeIn 0.5s ease-out backwards; }
      `}</style>

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
        className={`px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-xl border-b border-gray-100" : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          {data.fotoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
              <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: cor, color: corTextoBtn }}
            >
              {inicial}
            </div>
          )}
          <span className="font-semibold text-gray-900 text-[14px]">{data.nome}</span>
        </div>
        <a
          href={href}
          onClick={handleCTA}
          target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="font-semibold px-4 py-2 rounded-lg text-[13px] transition-all hover:opacity-90"
          style={{ backgroundColor: cor, color: corTextoBtn }}
        >
          {shortLabel}
        </a>
      </nav>

      {/* Hero — centralizado e limpo */}
      <section className="px-6 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-2xl mx-auto text-center simp-fade">
          {data.fotoUrl ? (
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 mx-auto mb-8">
              <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl mx-auto mb-8"
              style={{ backgroundColor: rgba(cor, 0.1), color: cor }}
            >
              {inicial}
            </div>
          )}

          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-5 px-3 py-1.5 rounded-full" style={{ backgroundColor: rgba(cor, 0.08), color: cor }}>
            {data.categoria}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            {data.tagline}
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            {data.descricaoLonga}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={href}
              onClick={handleCTA}
              target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl text-[15px] transition-all hover:opacity-90 hover:translate-y-[-1px]"
              style={{ backgroundColor: cor, color: corTextoBtn }}
            >
              {label}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {data.instagram && (
              <a
                href={`https://instagram.com/${instagramHandle(data.instagram)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                @{instagramHandle(data.instagram)}
              </a>
            )}
          </div>

          {data.prova && (
            <p className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full inline-flex items-center justify-center" style={{ backgroundColor: rgba(cor, 0.12) }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              {data.prova}
            </p>
          )}
        </div>
      </section>

      {/* Divisor */}
      <div className="border-t border-gray-100" />

      {/* Info bar */}
      <section className="bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Atendimento", valor: data.contato === "whatsapp" ? "WhatsApp" : data.contato === "instagram" ? "Instagram" : data.contato === "telefone" ? "Telefone" : "Direto" },
            { label: "Especialidade", valor: data.categoria },
            { label: "Resposta", valor: "Hoje mesmo" },
            { label: "Modelo", valor: data.acao === "compra" ? "Pedidos" : data.acao === "agendamento" ? "Agendamento" : "Sob demanda" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-1">{item.label}</p>
              <p className="font-semibold text-gray-800 text-sm">{item.valor}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Serviços */}
      {data.servicosOferecidos && data.servicosOferecidos.length > 0 && (
        <>
          <section className="px-6 md:px-8 py-16 md:py-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-8 text-center" style={{ color: cor }}>
                O que oferecemos
              </h2>
              <div className="flex flex-col gap-3">
                {data.servicosOferecidos.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: rgba(cor, 0.1), color: cor }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-[15px] mb-1">{s.nome}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="border-t border-gray-100" />
        </>
      )}

      {/* Sobre */}
      <section className="px-6 md:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-8 text-center" style={{ color: cor }}>
            Sobre
          </h2>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">{data.nome}</h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">{data.descricaoLonga}</p>
            <a
              href={href}
              onClick={handleCTA}
              target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-sm group"
              style={{ color: cor }}
            >
              <span className="border-b border-current pb-0.5">{label}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Destaques */}
      <section className="px-6 md:px-8 py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-8 text-center" style={{ color: cor }}>
            Por que escolher
          </h2>
          <div className="flex flex-col gap-4">
            {destaques.map((d, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: rgba(cor, 0.1) }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-[15px] mb-1">{d.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{d.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Processo */}
      <section className="px-6 md:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-8 text-center" style={{ color: cor }}>
            Como funciona
          </h2>
          <div className="flex flex-col gap-4">
            {processo.map((p, i) => (
              <div key={i} className="flex items-start gap-5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cor, color: corTextoBtn }}
                >
                  {i + 1}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-semibold text-gray-900 text-[15px] mb-1">{p.titulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* FAQ */}
      <section className="px-6 md:px-8 py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-8 text-center" style={{ color: cor }}>
            Dúvidas
          </h2>
          <div className="flex flex-col gap-2">
            {faq.map((f, i) => {
              const aberto = faqAberto === i
              return (
                <div key={i} className={`bg-white rounded-xl border transition-all ${aberto ? "border-gray-200" : "border-gray-100"}`}>
                  <button
                    onClick={() => setFaqAberto(aberto ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-gray-900 text-[15px]">{f.pergunta}</span>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform"
                      style={{ backgroundColor: rgba(cor, 0.08), color: cor, transform: aberto ? "rotate(45deg)" : "rotate(0)" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all"
                    style={{ maxHeight: aberto ? "400px" : "0", opacity: aberto ? 1 : 0 }}
                  >
                    <p className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">{f.resposta}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* CTA Final */}
      <section className="px-6 md:px-8 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Pronto para começar?</h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Entre em contato agora — sem compromisso. Conversamos sobre o que você precisa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={href}
              onClick={handleCTA}
              target={!isAgendamento && isExternal(href) ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:opacity-90"
              style={{ backgroundColor: cor, color: corTextoBtn }}
            >
              {label}
            </a>
            {data.instagram && (
              <a
                href={`https://instagram.com/${instagramHandle(data.instagram)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium px-7 py-4 rounded-xl text-sm text-gray-600 border border-gray-200 hover:border-gray-400 transition-all"
              >
                Ver no Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              {data.fotoUrl ? (
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-200">
                  <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: cor, color: corTextoBtn }}>
                  {inicial}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 text-sm">{data.nome}</p>
                <p className="text-xs text-gray-400">{data.categoria}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {data.whatsapp && (
                <a href={`https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">WhatsApp</a>
              )}
              {data.instagram && (
                <a href={`https://instagram.com/${instagramHandle(data.instagram)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Instagram</a>
              )}
              {data.telefone && (
                <a href={`tel:${data.telefone}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{data.telefone}</a>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} {data.nome}. Todos os direitos reservados.</p>
            {!preview && (
              <p className="text-xs text-gray-400">
                Criado com{" "}
                <a href="https://negociopresencadigital.com.br" className="hover:text-gray-700 underline-offset-2 hover:underline">Presença Digital</a>
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
          className="flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-[15px] w-full transition-all hover:opacity-90"
          style={{ backgroundColor: cor, color: corTextoBtn }}
        >
          {label}
        </a>
      </div>
      <div className="md:hidden h-24" aria-hidden="true" />
    </div>
  )
}
