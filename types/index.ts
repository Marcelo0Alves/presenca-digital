export type ContactType = "whatsapp" | "instagram" | "telefone" | "sem_contato"
export type ActionType = "whatsapp" | "agendamento" | "compra"
export type LayoutType = "editorial" | "moderno" | "simples"

export interface BusinessData {
  slug: string
  nomeLoja: string
  descricao: string
  contato: ContactType
  acao: ActionType
  layout?: LayoutType
  whatsapp?: string
  telefone?: string
  instagram?: string
  temFoto: boolean
  fotoUrl?: string
  linkLoja?: string

  // gerado pela IA
  nome: string
  tagline: string
  descricaoLonga: string
  copyAnuncio: {
    versao1: { titulo: string; texto: string }
    versao2: { titulo: string; texto: string }
    versao3: { titulo: string; texto: string }
  }
  textoBio: string
  categoria: string
  corPrimaria: string
  destaques?: { titulo: string; descricao: string }[]
  processo?: { titulo: string; descricao: string }[]
  faq?: { pergunta: string; resposta: string }[]
  prova?: string
  servicosOferecidos?: { nome: string; descricao: string }[]

  // controle
  criadoEm: string
  expiraEm: string
  pago: boolean
  pixelId?: string
  dominioCustom?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}
