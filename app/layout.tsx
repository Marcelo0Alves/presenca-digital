import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "Presença Digital — Seu negócio online em 5 minutos",
  description: "Crie sua página profissional, copy de anúncios e presença digital completa em minutos. Sem precisar de designer, dev ou agência.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900" style={{ fontFamily: "var(--font-geist), sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
