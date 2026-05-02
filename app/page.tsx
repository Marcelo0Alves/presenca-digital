import Link from "next/link"
import { ArrowRight, Zap, Shield, TrendingUp, Check } from "lucide-react"

const exemplos = [
  { categoria: "Personal Trainer", nome: "FitLife SP", tagline: "Seu corpo dos sonhos em 90 dias, sem lesões" },
  { categoria: "Salão de Beleza", nome: "Studio Glow", tagline: "Transforme seu visual com quem realmente entende" },
  { categoria: "Psicólogo", nome: "Mente Clara", tagline: "Equilíbrio emocional para uma vida que vale a pena" },
  { categoria: "Chef Particular", nome: "Sabores Únicos", tagline: "Jantar inesquecível no conforto da sua casa" },
]

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="font-bold text-xl text-indigo-600">Presença Digital</span>
        <Link
          href="/criar"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Criar grátis
        </Link>
      </nav>

      <section className="flex flex-col items-center text-center px-6 py-20 bg-gradient-to-b from-indigo-50 to-white">
        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Grátis por 7 dias · Sem cartão de crédito
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 max-w-3xl leading-tight">
          Seu negócio digital<br />
          <span className="text-indigo-600">pronto em 5 minutos</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-xl">
          Página profissional, copy de anúncios, link do WhatsApp e pixel do Meta — tudo gerado por IA a partir de uma frase.
        </p>
        <Link
          href="/criar"
          className="mt-10 flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Criar minha presença agora
          <ArrowRight size={20} />
        </Link>
        <p className="mt-4 text-sm text-gray-400">Mais de 1.200 negócios criados essa semana</p>
      </section>

      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como funciona</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Descreve seu negócio", desc: "Uma frase é suficiente. A IA entende o resto." },
            { step: "02", title: "IA cria tudo", desc: "Página, copy de anúncios, bio e integração com WhatsApp." },
            { step: "03", title: "Compartilha o link", desc: "Um link bonito, profissional e pronto para mandar no WhatsApp." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-5xl font-bold text-indigo-100">{item.step}</span>
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Exemplos gerados pela IA</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {exemplos.map((ex) => (
              <div key={ex.nome} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{ex.categoria}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-3">{ex.nome}</h3>
                <p className="text-gray-500 mt-1">{ex.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">O que você recebe</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap size={24} className="text-indigo-600" />, title: "Página profissional", desc: "Design moderno gerado especificamente para o seu negócio." },
            { icon: <TrendingUp size={24} className="text-indigo-600" />, title: "3 copies de anúncio", desc: "Prontos para colar no Meta Ads. Testados para converter." },
            { icon: <Shield size={24} className="text-indigo-600" />, title: "Pixel configurado", desc: "Rastreamento de clientes automático sem precisar de dev." },
          ].map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-xl p-6">
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-600 px-6 py-20 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Simples assim</h2>
        <p className="text-indigo-200 mb-10 text-lg">Sem contratos, sem surpresas.</p>
        <div className="inline-flex flex-col items-center bg-white text-gray-900 rounded-2xl p-8 shadow-xl max-w-sm w-full mx-auto">
          <span className="text-sm font-medium text-indigo-600 mb-2">Plano completo</span>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-5xl font-bold">R$ 49</span>
            <span className="text-gray-400 mb-2">/mês</span>
          </div>
          <span className="text-sm text-gray-400 mb-6">7 dias grátis para testar</span>
          {[
            "Link permanente ativo",
            "Pixel do Meta configurado",
            "3 copies de anúncio",
            "Agendamento ou checkout",
            "Domínio próprio",
            "Suporte por WhatsApp",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 w-full mb-2">
              <Check size={16} className="text-indigo-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
          <Link
            href="/criar"
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center block"
          >
            Começar grátis
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-gray-400 border-t border-gray-100">
        © 2025 Presença Digital · Feito para quem não tem tempo a perder
      </footer>
    </main>
  )
}
