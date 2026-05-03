import Link from "next/link"
import { ArrowRight, Zap, TrendingUp, Shield, Check } from "lucide-react"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <span className="font-bold text-xl text-gray-900 tracking-tight">Presença Digital</span>
        <Link
          href="/criar"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          Começar grátis
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-24 pb-32 md:pt-32 md:pb-40 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          3 dias grátis · Sem cartão de crédito
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 max-w-4xl leading-[1.05] tracking-tight mb-8">
          Sua presença digital,<br />
          <span className="text-indigo-600">do jeito certo.</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-xl leading-relaxed mb-12">
          Página profissional, anúncios prontos e integração com WhatsApp —
          tudo criado a partir de uma frase sobre o seu negócio.
        </p>

        <Link
          href="/criar"
          className="flex items-center gap-2.5 bg-indigo-600 text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02]"
        >
          Criar minha presença agora
          <ArrowRight size={20} />
        </Link>

        <p className="mt-6 text-sm text-gray-400 italic">
          "Venha ter você também sua presença digital."
        </p>
      </section>

      {/* Proposta — Sem agência, você mesmo faz */}
      <section className="px-8 py-24 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-4">Para quem é isso</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Seu negócio digital<br />
                <span className="text-indigo-600">sem agência.</span><br />
                Você mesmo faz.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Agência cobra R$ 3.000 pra criar uma página, R$ 1.500/mês pra fazer anúncios, e você ainda fica dependente deles pra qualquer mudança.
                <br /><br />
                Com o Presença Digital você descreve o que faz em uma frase, e em 5 minutos tem tudo pronto — página, anúncios e integração com WhatsApp. <strong className="text-gray-700">Sem precisar entender de tecnologia.</strong>
              </p>
              <Link href="/criar"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-700 transition-all">
                Quero criar o meu <ArrowRight size={18} />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  antes: "Agência",
                  depois: "Você mesmo",
                  desc: "Criar sua página profissional",
                  precoAntes: "R$ 3.000",
                  precoDepois: "R$ 127/mês",
                },
                {
                  antes: "Redator",
                  depois: "Automático",
                  desc: "Textos de anúncio para o Meta Ads",
                  precoAntes: "R$ 800/mês",
                  precoDepois: "Incluso",
                },
                {
                  antes: "Dev / agência",
                  depois: "Automático",
                  desc: "Pixel do Meta configurado",
                  precoAntes: "R$ 500",
                  precoDepois: "Incluso",
                },
                {
                  antes: "Designer",
                  depois: "Automático",
                  desc: "Bio do Instagram otimizada",
                  precoAntes: "R$ 300",
                  precoDepois: "Incluso",
                },
              ].map((item) => (
                <div key={item.desc} className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between gap-4 border border-gray-100">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.desc}</p>
                    <p className="text-xs text-gray-400">Antes: {item.antes} · <span className="line-through">{item.precoAntes}</span></p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{item.precoDepois}</span>
                  </div>
                </div>
              ))}

              <div className="bg-indigo-600 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">Total que você economiza</p>
                  <p className="text-indigo-200 text-sm">Comparado com agência tradicional</p>
                </div>
                <span className="text-white font-black text-2xl">+ R$ 4.600</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="px-8 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-3">Como funciona</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Três passos. Cinco minutos.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Descreva seu negócio", desc: "Nome, o que você faz e para quem. Uma frase já é suficiente." },
              { n: "02", title: "Sua página é criada", desc: "Página completa, anúncios e bio do Instagram — gerados automaticamente." },
              { n: "03", title: "Compartilhe o link", desc: "Um link limpo e profissional. Pronto para anunciar e mandar no WhatsApp." },
            ].map((item) => (
              <div key={item.n} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <span className="text-4xl font-black text-indigo-100 block mb-4">{item.n}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-3">Tudo incluso</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">O que seu negócio precisa</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              O que custaria uma fortuna com designers e agências — entregue de forma simples.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={22} className="text-indigo-600" />,
                bg: "bg-indigo-50",
                title: "Página profissional",
                desc: "Design elegante e moderno, com cores e textos pensados para o seu tipo de negócio.",
              },
              {
                icon: <TrendingUp size={22} className="text-emerald-600" />,
                bg: "bg-emerald-50",
                title: "3 anúncios prontos",
                desc: "Textos pensados para converter. Prontos para colar no Facebook e Instagram Ads.",
              },
              {
                icon: <Shield size={22} className="text-purple-600" />,
                bg: "bg-purple-50",
                title: "Pixel do Meta",
                desc: "Rastreamento configurado automaticamente. Cada visita alimenta o algoritmo por você.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-8 border border-gray-100 bg-white shadow-sm">
                <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center mb-5`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como usar os anúncios */}
      <section className="px-8 py-24 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-3">Seus anúncios</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Anuncie sem agência</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Os 3 textos gerados já estão prontos para o Meta Ads. Copie, cole e comece a atrair clientes hoje.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "01", title: "Copie o texto", desc: "Escolha uma das 3 versões prontas — cada uma com um foco diferente para atingir públicos distintos." },
              { n: "02", title: "Cole no Meta Ads", desc: "Abra o Gerenciador de Anúncios, crie uma campanha e cole o título e o texto gerados." },
              { n: "03", title: "Use seu link", desc: "Coloque o link da sua página como destino. O Pixel já rastreia cada visita automaticamente." },
            ].map((item) => (
              <div key={item.n} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="text-3xl font-black text-white/10 block mb-3">{item.n}</span>
                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-gray-500 text-sm">
            Com R$ 10–20/dia em anúncios você já começa a receber contatos no primeiro dia.
          </p>
        </div>
      </section>

      {/* Exemplos */}
      <section className="px-8 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-3">Exemplos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Para qualquer negócio</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { categoria: "Personal Trainer", nome: "FitLife SP", tagline: "Seu corpo dos sonhos em 90 dias, sem lesões", cor: "#6366f1" },
              { categoria: "Salão de Beleza", nome: "Studio Glow", tagline: "Transforme seu visual com quem realmente entende", cor: "#ec4899" },
              { categoria: "Psicólogo", nome: "Mente Clara", tagline: "Equilíbrio emocional para uma vida que vale a pena", cor: "#10b981" },
              { categoria: "Chef Particular", nome: "Sabores Únicos", tagline: "Jantar inesquecível no conforto da sua casa", cor: "#f59e0b" },
            ].map((ex) => (
              <div key={ex.nome} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: ex.cor }}
                >
                  {ex.nome.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-semibold" style={{ color: ex.cor }}>{ex.categoria}</span>
                  <h3 className="font-bold text-gray-900">{ex.nome}</h3>
                  <p className="text-gray-400 text-sm">{ex.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-8 py-24">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-3">Preço</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simples assim</h2>
          <p className="text-gray-400 mb-12">Sem contratos. Cancele quando quiser.</p>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="text-6xl font-black text-gray-900">R$ 127</span>
              <span className="text-gray-400 mb-3 text-lg">/mês</span>
            </div>
            <p className="text-sm text-gray-400 mb-8">3 dias grátis. Sem cartão agora.</p>

            <div className="flex flex-col gap-3 mb-8 text-left">
              {[
                "Página profissional permanente",
                "3 textos de anúncio prontos",
                "Pixel do Meta configurado",
                "Link de WhatsApp direto",
                "Bio do Instagram otimizada",
                "Suporte por WhatsApp",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-indigo-600" />
                  </div>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/criar"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-4 rounded-full font-bold text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Começar grátis agora
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-gray-400 mt-3">Sem cartão. 3 dias grátis.</p>
          </div>
        </div>
      </section>

      <footer className="px-8 py-8 text-center text-sm text-gray-300 border-t border-gray-100">
        © 2025 Presença Digital · Feito para quem não tem tempo a perder
      </footer>
    </main>
  )
}
