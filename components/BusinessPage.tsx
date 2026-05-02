import Image from "next/image"
import type { BusinessData } from "@/types"

function ctaHref(data: BusinessData): string {
  if (data.acao === "whatsapp" && data.whatsapp) {
    return `https://wa.me/55${data.whatsapp.replace(/\D/g, "")}`
  }
  if (data.acao === "agendamento") return "#agendar"
  if (data.acao === "compra") return "#comprar"
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

export default function BusinessPage({
  data,
  preview = false,
}: {
  data: BusinessData
  preview?: boolean
}) {
  const cor = data.corPrimaria || "#6366f1"

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Pixel do Meta */}
      {data.pixelId && !preview && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${data.pixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* Hero */}
      <div
        className="relative py-20 px-6 text-white text-center"
        style={{ backgroundColor: cor }}
      >
        <div className="max-w-2xl mx-auto">
          {data.fotoUrl && (
            <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/30">
              <Image src={data.fotoUrl} alt={data.nome} fill className="object-cover" />
            </div>
          )}
          {!data.fotoUrl && (
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              {data.nome.charAt(0)}
            </div>
          )}
          <span
            className="text-xs font-semibold uppercase tracking-widest mb-3 block"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {data.categoria}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.nome}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">{data.tagline}</p>
          <a
            href={ctaHref(data)}
            target={data.acao === "whatsapp" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-block bg-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow"
            style={{ color: cor }}
          >
            {ctaLabel(data.acao)}
          </a>
        </div>
      </div>

      {/* Sobre */}
      <div className="py-16 px-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre</h2>
        <p className="text-gray-600 text-lg leading-relaxed">{data.descricaoLonga}</p>
      </div>

      {/* Contato */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vamos conversar?</h2>
          <a
            href={ctaHref(data)}
            target={data.acao === "whatsapp" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-block text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: cor }}
          >
            {ctaLabel(data.acao)}
          </a>

          {data.contato === "instagram" && data.instagram && (
            <p className="mt-4 text-gray-500">
              ou me siga no{" "}
              <a
                href={`https://instagram.com/${data.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: cor }}
              >
                @{data.instagram}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      {!preview && (
        <div className="py-6 text-center text-xs text-gray-400">
          Página criada com{" "}
          <a href="/" className="hover:underline" style={{ color: cor }}>
            Presença Digital
          </a>
        </div>
      )}
    </div>
  )
}
