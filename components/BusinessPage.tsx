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
  const isWhatsapp = data.acao === "whatsapp"

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
      <nav className="px-8 py-5 flex items-center justify-between border-b border-gray-100/80 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          {data.fotoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 flex-shrink-0">
              <img src={data.fotoUrl} alt={data.nome} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cor }}
            >
              <span className="text-white font-bold text-sm">{data.nome.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span className="font-semibold text-gray-900 text-sm tracking-tight">{data.nome}</span>
        </div>
        <a
          href={ctaHref(data)}
          target={isWhatsapp ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: cor }}
        >
          {ctaLabel(data.acao)}
        </a>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: cor }}>
            {data.categoria}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-8 max-w-3xl">
            {data.tagline}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mb-10">
            {data.descricaoLonga}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <a
              href={ctaHref(data)}
              target={isWhatsapp ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-semibold px-8 py-4 rounded-full text-base text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: cor }}
            >
              {ctaLabel(data.acao)}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            {data.contato === "instagram" && data.instagram && (
              <a
                href={`https://instagram.com/${data.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium px-8 py-4 rounded-full text-base border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                @{data.instagram}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Imagem destaque — só se tiver foto e não for preview minúsculo */}
      {data.fotoUrl && (
        <section className="px-8 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100" style={{ maxHeight: 480 }}>
              <img
                src={data.fotoUrl}
                alt={data.nome}
                className="w-full h-full object-contain"
                style={{ maxHeight: 480 }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Sobre */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: cor }}>Sobre</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">{data.nome}</h2>
            <p className="text-gray-500 leading-relaxed text-lg">{data.descricaoLonga}</p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { n: "01", titulo: "Qualidade garantida", desc: "Excelência em cada detalhe do trabalho entregue." },
              { n: "02", titulo: "Atendimento ágil", desc: "Respostas rápidas e comunicação sempre clara." },
              { n: "03", titulo: "Resultado real", desc: "Compromisso total com o seu resultado." },
            ].map((item) => (
              <div key={item.n} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                <span className="text-xs font-bold tracking-widest mt-0.5" style={{ color: cor }}>{item.n}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{item.titulo}</p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ backgroundColor: cor }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                Pronto para começar?
              </h2>
              <p className="text-white/70 text-lg">
                Entre em contato agora e dê o próximo passo.
              </p>
            </div>
            <a
              href={ctaHref(data)}
              target={isWhatsapp ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2.5 bg-white font-bold px-8 py-4 rounded-full text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ color: cor }}
            >
              {ctaLabel(data.acao)}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </section>

      {!preview && (
        <footer className="py-6 text-center text-xs text-gray-300 border-t border-gray-100">
          Página criada com{" "}
          <a href="https://negociopresencadigital.com.br" className="hover:underline text-gray-400">
            Presença Digital
          </a>
        </footer>
      )}
    </div>
  )
}
