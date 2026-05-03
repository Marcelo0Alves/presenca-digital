"use client"

import { useState } from "react"
import type { BusinessData } from "@/types"

function ctaHref(data: BusinessData): string {
  if (data.acao === "whatsapp" && data.whatsapp) return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`
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

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

function ctaLabel(acao: string): string {
  if (acao === "whatsapp") return "Falar no WhatsApp"
  if (acao === "agendamento") return "Agendar agora"
  if (acao === "compra") return "Comprar agora"
  return "Entrar em contato"
}

function AgendamentoModal({ data, cor, onClose }: { data: BusinessData; cor: string; onClose: () => void }) {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [horario, setHorario] = useState("")
  const [mensagem, setMensagem] = useState("")

  function confirmar() {
    if (!nome.trim() || !telefone.trim()) return
    const texto = `Olá, ${data.nome}! Gostaria de agendar um horário.\n\n👤 Nome: ${nome}\n📱 Telefone: ${telefone}${horario ? `\n🗓️ Horário preferido: ${horario}` : ""}${mensagem ? `\n💬 Observação: ${mensagem}` : ""}`
    const num = data.whatsapp?.replace(/\D/g, "") || data.telefone?.replace(/\D/g, "")
    if (num) window.open(`https://wa.me/55${num}?text=${encodeURIComponent(texto)}`, "_blank")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: cor }}>
          <div>
            <h3 className="text-lg font-bold text-white">Agendar horário</h3>
            <p className="text-white/70 text-sm">{data.nome}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {[
            { label: "Seu nome *", value: nome, set: setNome, placeholder: "Como você se chama?", type: "text" },
            { label: "WhatsApp *", value: telefone, set: setTelefone, placeholder: "(00) 00000-0000", type: "tel" },
            { label: "Horário preferido", value: horario, set: setHorario, placeholder: "Ex: Quinta às 14h", type: "text" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-300" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Observação</label>
            <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2}
              placeholder="Algum detalhe que queira compartilhar?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-300 resize-none" />
          </div>
          <button onClick={confirmar} disabled={!nome.trim() || !telefone.trim()}
            className="w-full py-4 rounded-2xl font-bold text-white text-base mt-1 transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
            style={{ backgroundColor: cor }}>
            Confirmar via WhatsApp →
          </button>
          <p className="text-center text-xs text-gray-300">Você será redirecionado para o WhatsApp.</p>
        </div>
      </div>
    </div>
  )
}

export default function BusinessPage({ data, preview = false }: { data: BusinessData; preview?: boolean }) {
  const cor = data.corPrimaria || "#6366f1"
  const corLight = `${cor}12`
  const corMid = `${cor}25`
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
  const inicial = data.nome.charAt(0).toUpperCase()
  const marqueeText = `${data.nome}  ·  ${data.tagline}  ·  ${data.categoria}  ·  `

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-3deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-reverse { animation: floatReverse 5s ease-in-out infinite; }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
        }
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid currentColor;
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      {data.pixelId && !preview && (
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${data.pixelId}');fbq('track','PageView');` }} />
      )}

      {modalAberto && <AgendamentoModal data={data} cor={cor} onClose={() => setModalAberto(false)} />}

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3">
          {data.fotoUrl ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-white">
              <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: cor }}>
              {inicial}
            </div>
          )}
          <span className="font-bold text-gray-900">{data.nome}</span>
        </div>
        <a href={href} onClick={handleCTA} target={!isAgendamento && isExternal(href) ? "_blank" : undefined} rel="noopener noreferrer"
          className="font-bold px-6 py-2.5 rounded-full text-sm text-white transition-all hover:opacity-90 hover:shadow-lg"
          style={{ backgroundColor: cor }}>
          {label}
        </a>
      </nav>

      {/* Hero — split layout */}
      <section className="relative min-h-[90vh] flex items-center px-6 py-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${corLight} 0%, #ffffff 50%, ${corLight} 100%)` }}>

        {/* Background blobs */}
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full blur-3xl opacity-30 animate-float" style={{ backgroundColor: cor }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 animate-float-reverse" style={{ backgroundColor: cor }} />

        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Texto */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: corMid, color: cor }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: cor }} />
              {data.categoria}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6">
              {data.tagline}
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
              {data.descricaoLonga}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={href} onClick={handleCTA} target={!isAgendamento && isExternal(href) ? "_blank" : undefined} rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-white text-lg transition-all hover:scale-105"
                style={{ backgroundColor: cor, boxShadow: `0 12px 40px ${cor}50` }}>
                {label}
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
              {data.instagram && (
                <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-base border-2 bg-white/70 backdrop-blur-sm transition-all hover:bg-white"
                  style={{ borderColor: cor, color: cor }}>
                  @{data.instagram}
                </a>
              )}
            </div>
          </div>

          {/* Visual element */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Anel externo animado */}
              <div className="absolute inset-0 rounded-full opacity-20 animate-float" style={{ backgroundColor: cor, transform: "scale(1.3)" }} />

              {/* Card principal */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] shadow-2xl overflow-hidden flex items-center justify-center animate-float"
                style={{ backgroundColor: data.fotoUrl ? "white" : cor, border: `3px solid ${cor}30` }}>
                {data.fotoUrl ? (
                  <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain p-6" />
                ) : (
                  <span className="text-[8rem] font-black select-none" style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>
                    {inicial}
                  </span>
                )}
              </div>

              {/* Badge flutuante 1 */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2.5 shadow-xl animate-float-reverse border border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Avaliação</p>
                <p className="font-extrabold text-gray-900">★★★★★</p>
              </div>

              {/* Badge flutuante 2 */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-xl animate-float border border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Resposta</p>
                <p className="font-extrabold text-gray-900" style={{ color: cor }}>em até 1h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee banner */}
      <div className="py-4 overflow-hidden border-y" style={{ backgroundColor: cor }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-white/90 font-semibold text-sm tracking-wide mx-4 flex-shrink-0">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* Sobre + diferenciais */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-4" style={{ color: cor }}>Sobre nós</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">{data.nome}</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">{data.descricaoLonga}</p>
            <a href={href} onClick={handleCTA} target={!isAgendamento && isExternal(href) ? "_blank" : undefined} rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full border-2 transition-all hover:text-white"
              style={{ borderColor: cor, color: cor }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = cor }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent" }}>
              {label} →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { n: "01", titulo: "Qualidade garantida", desc: "Excelência em cada detalhe, do primeiro ao último contato.", icon: "✦" },
              { n: "02", titulo: "Atendimento ágil", desc: "Resposta rápida e comunicação clara em todo o processo.", icon: "⚡" },
              { n: "03", titulo: "Resultado real", desc: "Seu objetivo é o nosso compromisso até o final.", icon: "🎯" },
            ].map((item) => (
              <div key={item.n} className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-transparent transition-all hover:shadow-lg cursor-default"
                style={{ ["--hover-bg" as string]: corLight }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: corMid }}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">{item.titulo}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16" style={{ background: `linear-gradient(135deg, ${corLight}, #ffffff)` }}>
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { valor: "100%", label: "Comprometimento" },
            { valor: "< 1h", label: "Tempo de resposta" },
            { valor: "★ 5.0", label: "Satisfação" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl py-10 px-4 shadow-sm border border-white">
              <p className="text-3xl md:text-4xl font-black mb-2" style={{ color: cor }}>{s.valor}</p>
              <p className="text-gray-400 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] p-12 md:p-20 text-center animate-gradient"
            style={{ background: `linear-gradient(135deg, ${cor}, ${cor}cc, ${cor}ee)` }}>
            {/* Decorações */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white opacity-5 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white opacity-5 translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white opacity-5" />

            <div className="relative z-10">
              <p className="text-white/60 text-sm font-semibold uppercase tracking-[0.2em] mb-4">{data.nome}</p>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Pronto para começar?
              </h2>
              <p className="text-white/70 text-xl mb-12 max-w-lg mx-auto">
                Entre em contato agora e dê o próximo passo.
              </p>
              <a href={href} onClick={handleCTA} target={!isAgendamento && isExternal(href) ? "_blank" : undefined} rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white font-extrabold px-10 py-5 rounded-2xl text-xl shadow-2xl transition-all hover:scale-105 hover:shadow-3xl"
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
