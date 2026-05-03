import OpenAI from "openai"
import type { BusinessData } from "@/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function gerarConteudo(
  data: Omit<BusinessData, "nome" | "tagline" | "descricaoLonga" | "copyAnuncio" | "textoBio" | "categoria" | "corPrimaria" | "criadoEm" | "expiraEm" | "pago">
): Promise<Pick<BusinessData, "nome" | "tagline" | "descricaoLonga" | "copyAnuncio" | "textoBio" | "categoria" | "corPrimaria">> {
  const prompt = `Você é um especialista em marketing digital e copywriting brasileiro com 15 anos de experiência criando campanhas de alta conversão para pequenos negócios.

Com base nessas informações do negócio:
- Nome da loja/empresa: ${data.nomeLoja}
- Descrição: ${data.descricao}
- Tipo de contato: ${data.contato}
- Ação principal do site: ${data.acao}

Gere um JSON com exatamente esta estrutura (sem markdown, só o JSON):
{
  "nome": "Use exatamente o nome informado: ${data.nomeLoja}",
  "tagline": "Frase de impacto de até 10 palavras que resolve a principal dor do cliente ideal, com linguagem direta e emocional",
  "descricaoLonga": "Texto de 3-4 frases falando diretamente com o cliente: qual transformação ele vai ter, por que escolher este negócio, e o que o diferencia. Use linguagem próxima, pessoal e persuasiva.",
  "categoria": "categoria do negócio em 1-2 palavras (ex: Personal Trainer, Salão de Beleza)",
  "corPrimaria": "uma cor hex que combina com o setor e transmite a emoção certa para o negócio (ex: #6366f1)",
  "textoBio": "Bio completa para o Instagram com até 150 caracteres. Inclua: o que faz, para quem, resultado entregue, e um CTA. Use emojis relevantes para tornar visualmente atrativa. Exemplo de formato: 💪 Personal trainer | Mulheres 40+ | Emagreça sem lesões ✅ | Agende sua aula grátis 👇",
  "copyAnuncio": {
    "versao1": {
      "titulo": "Título do anúncio ativando a DOR principal do cliente ideal (máx 40 chars, sem ponto final)",
      "texto": "Anúncio completo de 2-3 frases: comece com a dor, apresente a solução específica deste negócio, finalize com CTA urgente. Máx 125 chars."
    },
    "versao2": {
      "titulo": "Título baseado em PROVA SOCIAL e resultados reais (máx 40 chars, sem ponto final)",
      "texto": "Anúncio de 2-3 frases: mencione resultados concretos ou número de clientes, valide com detalhe específico do negócio, CTA claro. Máx 125 chars."
    },
    "versao3": {
      "titulo": "Título com OFERTA irresistível ou benefício imediato (máx 40 chars, sem ponto final)",
      "texto": "Anúncio de 2-3 frases: destaque o benefício exclusivo, crie senso de oportunidade ou escassez, CTA direto para ação. Máx 125 chars."
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
