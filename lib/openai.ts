import OpenAI from "openai"
import type { BusinessData } from "@/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type ConteudoGerado = Pick<
  BusinessData,
  | "nome"
  | "tagline"
  | "descricaoLonga"
  | "copyAnuncio"
  | "textoBio"
  | "categoria"
  | "corPrimaria"
  | "destaques"
  | "processo"
  | "faq"
  | "prova"
>

export async function gerarConteudo(
  data: Omit<
    BusinessData,
    | "nome"
    | "tagline"
    | "descricaoLonga"
    | "copyAnuncio"
    | "textoBio"
    | "categoria"
    | "corPrimaria"
    | "destaques"
    | "processo"
    | "faq"
    | "prova"
    | "criadoEm"
    | "expiraEm"
    | "pago"
  >
): Promise<ConteudoGerado> {
  const prompt = `Você é um copywriter brasileiro premium especializado em pequenos negócios.
Negócio: "${data.nomeLoja}" — ${data.descricao}.
Ação principal do site: ${data.acao}.

Escreva conteúdo COMPLETO, ESPECÍFICO e PROFISSIONAL — nada de clichês vazios. Cada texto deve falar diretamente da realidade desse negócio. Tom: confiante, direto, sofisticado. Sem exagero. Sem emojis (exceto na bio).

Retorne JSON exatamente com este formato:
{
  "nome": "${data.nomeLoja}",
  "tagline": "frase de impacto editorial até 12 palavras, fala da transformação real que o cliente vive",
  "descricaoLonga": "2-3 frases sofisticadas falando com o cliente: o que você entrega, para quem e por que importa. Tom de autoridade, sem 'somos especialistas'",
  "categoria": "1-2 palavras descrevendo o nicho (ex: Personal Trainer, Estúdio de Tatuagem, Confeitaria Artesanal)",
  "corPrimaria": "hex sofisticado que combine com o segmento — evite cores muito saturadas ou vibrantes demais. Prefira tons profundos e elegantes (ex: #1f2937, #0f766e, #7c2d12, #4338ca, #b45309)",
  "prova": "1 frase curta (até 90 chars) com um número/credencial real e específica do negócio que dê autoridade — pode ser anos de experiência, número de clientes atendidos, especialização, etc. Inferida da descrição",
  "destaques": [
    {"titulo": "nome curto do diferencial 1 (3-5 palavras)", "descricao": "1-2 frases concretas explicando esse diferencial. Específico ao negócio, nada genérico"},
    {"titulo": "diferencial 2", "descricao": "..."},
    {"titulo": "diferencial 3", "descricao": "..."}
  ],
  "processo": [
    {"titulo": "etapa 1 (2-4 palavras)", "descricao": "1 frase explicando essa etapa do ponto de vista do cliente"},
    {"titulo": "etapa 2", "descricao": "..."},
    {"titulo": "etapa 3", "descricao": "..."}
  ],
  "faq": [
    {"pergunta": "pergunta real que clientes desse nicho fazem", "resposta": "resposta clara e completa em 2-3 frases"},
    {"pergunta": "...", "resposta": "..."},
    {"pergunta": "...", "resposta": "..."},
    {"pergunta": "...", "resposta": "..."}
  ],
  "textoBio": "bio Instagram até 150 chars com 2-3 emojis: o que faz | para quem | resultado | CTA",
  "copyAnuncio": {
    "versao1": {"titulo": "título foco DOR máx 40 chars", "texto": "2 frases: dor + solução + CTA urgente"},
    "versao2": {"titulo": "título foco PROVA SOCIAL máx 40 chars", "texto": "2 frases: resultado + validação + CTA"},
    "versao3": {"titulo": "título foco OFERTA máx 40 chars", "texto": "2 frases: benefício + escassez + CTA"}
  }
}`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1600,
    response_format: { type: "json_object" },
  })

  return JSON.parse(response.choices[0].message.content!)
}
