export type ContactType = "whatsapp" | "instagram" | "telefone" | "sem_contato"
export type ActionType = "whatsapp" | "agendamento" | "compra"

export interface BusinessData {
  slug: string
  nomeLoja: string
  descricao: string
  contato: ContactType
  acao: ActionType
  whatsapp?: string
  telefone?: string
  instagram?: string
  temFoto: boolean
  fotoUrl?: string

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

  // controle
  criadoEm: string
  expiraEm: string
  pago: boolean
  pixelId?: string
  dominioCustom?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}
