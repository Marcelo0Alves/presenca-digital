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
  if (data.contato === "instagram" && data.instagram) {
    return `https://instagram.com/${data.instagram}`
  }
  if (data.contato === "telefone" && data.telefone) {
    return `tel:${data.telefone}`
  }
  return "#"
}

function ctaLabel(acao: string): string {
  if (acao === "whatsapp") return "Falar no WhatsApp"
  if (acao === "agendamento") return "Agendar agora"
  if (acao === "compra") return "Comprar agora"
  return "Entrar em contato"
}

export default function BusinessPage({ data, preview = false }: { data: BusinessData; preview?: boolean }) {
  const cor = data.corPrimaria || "#6366f1"
  const corEscura = `${cor}22`

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {data.pixelId && !preview && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${data.pixelId}');fbq('track','PageView');`,
          }}
        />
      )}

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="font-bold text-lg" style={{ color: cor }}>{data.nome}</span>
        <a
          href={ctaHref(data)}
          target={data.acao === "whatsapp" ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: cor }}
        >
          {ctaLabel(data.acao)}
        </a>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24" style={{ background: `linear-gradient(135deg, ${corEscura} 0%, #ffffff 60%)` }}>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-left">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: corEscura, color: cor }}
            >
              {data.categoria}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              {data.nome}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              {data.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={ctaHref(data)}
                target={data.acao === "whatsapp" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-lg text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: cor }}
              >
                {ctaLabel(data.acao)}
              </a>
              {data.contato === "instagram" && data.instagram && (
                <a
                  href={`https://instagram.com/${data.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-2xl text-lg border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: cor, color: cor }}
                >
                  @{data.instagram}
                </a>
              )}
            </div>
          </div>

          {/* Avatar/Foto */}
          <div className="flex-shrink-0">
            {data.fotoUrl ? (
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl">
                <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center text-7xl font-black shadow-2xl"
                style={{ backgroundColor: cor, color: "rgba(255,255,255,0.9)" }}
              >
                {data.nome.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full" style={{ backgroundColor: cor }} />
          <h2 className="text-2xl font-bold text-gray-900">Sobre</h2>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{data.descricaoLonga}</p>
      </section>

      {/* Diferenciais */}
      <section className="px-6 py-12" style={{ backgroundColor: corEscura }}>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "✅", titulo: "Qualidade garantida", desc: "Trabalho com excelência em cada detalhe" },
            { emoji: "⚡", titulo: "Atendimento rápido", desc: "Resposta em até 1 hora no horário comercial" },
            { emoji: "🤝", titulo: "Compromisso total", desc: "Seu resultado é nossa responsabilidade" },
          ].map((item) => (
            <div key={item.titulo} className="bg-white rounded-2xl p-6 shadow-sm">
              <span className="text-3xl mb-3 block">{item.emoji}</span>
              <h3 className="font-bold text-gray-900 mb-1">{item.titulo}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-20 text-center" style={{ backgroundColor: cor }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Entre em contato agora e dê o próximo passo.
          </p>
          <a
            href={ctaHref(data)}
            target={data.acao === "whatsapp" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-block bg-white font-extrabold px-10 py-5 rounded-2xl text-xl shadow-xl hover:shadow-2xl transition-shadow"
            style={{ color: cor }}
          >
            {ctaLabel(data.acao)}
          </a>
        </div>
      </section>

      {!preview && (
        <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100">
          Página criada com{" "}
          <a href="/" className="hover:underline" style={{ color: cor }}>
            Presença Digital
          </a>
        </footer>
      )}
    </div>
  )
}
