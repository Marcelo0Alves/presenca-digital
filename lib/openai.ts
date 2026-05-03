import OpenAI from "openai"
import type { BusinessData } from "@/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function gerarConteudo(
  data: Omit<BusinessData, "nome" | "tagline" | "descricaoLonga" | "copyAnuncio" | "textoBio" | "categoria" | "corPrimaria" | "criadoEm" | "expiraEm" | "pago">
): Promise<Pick<BusinessData, "nome" | "tagline" | "descricaoLonga" | "copyAnuncio" | "textoBio" | "categoria" | "corPrimaria">> {
  const prompt = `Copywriter BR expert. Negócio: "${data.nomeLoja}" — ${data.descricao}. Ação: ${data.acao}.

Retorne JSON exato:
{"nome":"${data.nomeLoja}","tagline":"frase de impacto até 10 palavras, emocional, resolve dor do cliente","descricaoLonga":"2-3 frases persuasivas falando com o cliente sobre transformação e diferencial","categoria":"1-2 palavras ex: Personal Trainer","corPrimaria":"hex que combina com o negócio","textoBio":"bio Instagram até 150 chars com emojis: o que faz | para quem | resultado | CTA","copyAnuncio":{"versao1":{"titulo":"título foco DOR máx 40 chars","texto":"2 frases: dor + solução + CTA urgente"},"versao2":{"titulo":"título foco PROVA SOCIAL máx 40 chars","texto":"2 frases: resultado + validação + CTA"},"versao3":{"titulo":"título foco OFERTA máx 40 chars","texto":"2 frases: benefício + escassez + CTA"}}}`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 600,
    response_format: { type: "json_object" },
  })

  return JSON.parse(response.choices[0].message.content!)
}
