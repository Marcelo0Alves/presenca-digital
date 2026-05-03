import OpenAI from "openai"
import type { BusinessData } from "@/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function gerarConteudo(
  data: Omit<BusinessData, "nome" | "tagline" | "descricaoLonga" | "copyAnuncio" | "textoBio" | "categoria" | "corPrimaria" | "criadoEm" | "expiraEm" | "pago">
): Promise<Pick<BusinessData, "nome" | "tagline" | "descricaoLonga" | "copyAnuncio" | "textoBio" | "categoria" | "corPrimaria">> {
  const prompt = `Você é um especialista em marketing digital e copywriting brasileiro.

Com base nessas informações do negócio:
- Nome da loja/empresa: ${data.nomeLoja}
- Descrição: ${data.descricao}
- Tipo de contato: ${data.contato}
- Ação principal do site: ${data.acao}

Gere um JSON com exatamente esta estrutura (sem markdown, só o JSON):
{
  "nome": "Use exatamente o nome informado: ${data.nomeLoja}",
  "tagline": "Frase de impacto de uma linha que resolve a dor do cliente",
  "descricaoLonga": "Parágrafo de 2-3 linhas sobre o negócio, falando com o cliente",
  "categoria": "categoria do negócio em 1-2 palavras (ex: Personal Trainer, Salão de Beleza)",
  "corPrimaria": "uma cor hex que combina com o negócio (ex: #6366f1)",
  "textoBio": "Texto para bio do Instagram em até 150 caracteres com emoji",
  "copyAnuncio": {
    "versao1": {
      "titulo": "Título do anúncio focado na dor (máx 40 chars)",
      "texto": "Texto do anúncio focado na dor (máx 120 chars)"
    },
    "versao2": {
      "titulo": "Título focado em prova social (máx 40 chars)",
      "texto": "Texto focado em prova social (máx 120 chars)"
    },
    "versao3": {
      "titulo": "Título focado em oferta (máx 40 chars)",
      "texto": "Texto focado em oferta/CTA (máx 120 chars)"
    }
  }
}`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    response_format: { type: "json_object" },
  })

  return JSON.parse(response.choices[0].message.content!)
}
