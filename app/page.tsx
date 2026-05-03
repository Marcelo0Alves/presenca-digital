import Link from "next/link"
import { ArrowRight, Zap, TrendingUp, Shield, Check, Star } from "lucide-react"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <span className="font-bold text-xl text-indigo-600">Presença Digital</span>
        <Link
          href="/criar"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Criar grátis →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 md:py-36 flex flex-col items-center text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="inline-flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
          Grátis por 7 dias · Sem cartão de crédito
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 max-w-4xl leading-[1.05] tracking-tight">
          Seu negócio na internet<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            em 5 minutos
          </span>
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed">
          Descreva o que você faz. A IA cria sua página profissional,{" "}
          <span className="text-gray-700 font-medium">anúncios prontos</span> e integração com{" "}
          <span className="text-gray-700 font-medium">WhatsApp e Meta Pixel</span> — tudo automaticamente.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/criar"
            className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 active:scale-100"
          >
            Criar minha presença agora
            <ArrowRight size={20} />
          </Link>
          <span className="text-sm text-gray-400">Sem precisar de designer ou agência</span>
        </div>

        {/* Social proof strip */}
        <div className="mt-14 flex items-center gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-2 text-sm text-gray-500 font-medium">
            "Levei 4 minutos e minha página ficou melhor que a do concorrente"
          </span>
        </div>
      </section>

      {/* Como funciona */}
      <section className="px-6 py-24 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Como funciona</h2>
          <p className="mt-3 text-gray-500 text-lg">Três passos. Cinco minutos. Página no ar.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Descreve seu negócio",
              desc: "Escreva uma frase sobre o que você faz, para quem e onde. A IA entende o resto.",
              color: "from-indigo-500 to-indigo-600",
            },
            {
              step: "02",
              title: "IA gera tudo",
              desc: "Página completa, 3 textos de anúncio, bio do Instagram e integração com WhatsApp.",
              color: "from-purple-500 to-purple-600",
            },
            {
              step: "03",
              title: "Compartilha o link",
              desc: "Um link bonito e profissional. Mande no WhatsApp, coloque nos anúncios e na bio.",
              color: "from-pink-500 to-pink-600",
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center bg-gradient-to-br ${item.color} text-white font-bold text-sm mb-4`}>
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que você recebe */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tudo que seu negócio precisa</h2>
            <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
              O que custaria R$ 3.000+ com designer, redator e agência — gerado em 5 minutos.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={28} className="text-indigo-600" />,
                bg: "bg-indigo-50",
                title: "Página profissional",
                desc: "Design moderno com cores, copy e layout gerados especificamente para o seu tipo de negócio.",
              },
              {
                icon: <TrendingUp size={28} className="text-emerald-600" />,
                bg: "bg-emerald-50",
                title: "3 anúncios prontos",
                desc: "Textos criados para converter no Meta Ads. Ângulo de dor, prova social e oferta irresistível.",
              },
              {
                icon: <Shield size={28} className="text-purple-600" />,
                bg: "bg-purple-50",
                title: "Pixel do Meta",
                desc: "Rastreamento automático configurado. Cada visita e clique na sua página já começa a alimentar o algoritmo.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como usar os anúncios */}
      <section className="px-6 py-24 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp size={26} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Anúncie sem agência</h2>
              <p className="text-white/80 text-lg">Os 3 textos gerados já estão prontos para o Meta Ads. É só copiar e colar.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "01", title: "Copie o texto", desc: "Escolha uma das 3 versões — cada uma com um ângulo diferente: dor, prova social ou oferta." },
              { n: "02", title: "Cole no Meta Ads", desc: "Abra o Gerenciador de Anúncios, crie a campanha e cole o título e texto gerados." },
              { n: "03", title: "Use seu link como destino", desc: "O Pixel já está configurado. Cada visita ao seu anúncio alimenta o algoritmo automaticamente." },
            ].map((item) => (
              <div key={item.n} className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <span className="text-4xl font-black text-white/20 block mb-2">{item.n}</span>
                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-white/70 text-sm">
            💡 Com R$ 10–20/dia em anúncios você já começa a receber contatos no primeiro dia.
          </p>
        </div>
      </section>

      {/* Exemplos */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Exemplos de páginas geradas</h2>
            <p className="mt-3 text-gray-500 text-lg">Para qualquer tipo de negócio local ou autônomo.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { categoria: "Personal Trainer", nome: "FitLife SP", tagline: "Seu corpo dos sonhos em 90 dias, sem lesões", cor: "#6366f1" },
              { categoria: "Salão de Beleza", nome: "Studio Glow", tagline: "Transforme seu visual com quem realmente entende", cor: "#ec4899" },
              { categoria: "Psicólogo", nome: "Mente Clara", tagline: "Equilíbrio emocional para uma vida que vale a pena", cor: "#10b981" },
              { categoria: "Chef Particular", nome: "Sabores Únicos", tagline: "Jantar inesquecível no conforto da sua casa", cor: "#f59e0b" },
            ].map((ex) => (
              <div key={ex.nome} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xl"
                  style={{ backgroundColor: ex.cor }}
                >
                  {ex.nome.charAt(0)}
                </div>
                <div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${ex.cor}18`, color: ex.cor }}
                  >
                    {ex.categoria}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{ex.nome}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{ex.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Simples assim</h2>
          <p className="text-gray-500 text-lg mb-12">Sem contratos. Cancele quando quiser.</p>

          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-8 shadow-xl shadow-indigo-100">
            <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">Plano completo</span>
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="text-6xl font-black text-gray-900">R$ 49</span>
              <span className="text-gray-400 mb-3 text-lg">/mês</span>
            </div>
            <p className="text-sm text-gray-400 mb-8">7 dias grátis para testar. Sem cartão agora.</p>

            <div className="flex flex-col gap-3 mb-8 text-left">
              {[
                "Página profissional permanente",
                "3 textos de anúncio gerados por IA",
                "Pixel do Meta configurado",
                "Link de WhatsApp direto",
                "Bio do Instagram otimizada",
                "Suporte por WhatsApp",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-indigo-600" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/criar"
              className="block w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
            >
              Começar grátis agora
            </Link>
            <p className="text-xs text-gray-400 mt-3">Sem cartão de crédito. 7 dias grátis.</p>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-gray-400 border-t border-gray-100">
        © 2025 Presença Digital · Feito para quem não tem tempo a perder
      </footer>
    </main>
  )
}
