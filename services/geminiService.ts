
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// FIX: Import Source type to be used in the return value.
import { EbookForm, Source } from '../types';

// FIX: Update function to return content and sources from Google Search grounding.
export const generateEbookContent = async (formData: EbookForm): Promise<{ content: string, sources: Source[] }> => {
  if (!process.env.API_KEY) {
    // In a real deployed environment, this might be handled differently,
    // but for local dev, it's a useful check.
    // FIX: Update mock response to match the new return type.
    return Promise.resolve({
      content: "API Key não configurada. Por favor, adicione sua chave API para testar a funcionalidade. Este é um conteúdo de exemplo para demonstração, gerado com a nova estrutura.\n\nCapa\n\nTítulo: Um Guia de Exemplo\n\nSubtítulo: Demonstrando a nova estrutura de prompt\n\nPrefácio\n\nEste e-book serve como uma demonstração da estrutura aprimorada...",
      sources: []
    });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const tema = `
- Assunto Principal: ${formData.subject}
- Público-alvo: ${formData.audience}
- Tom de Voz: ${formData.tone}`;

  const autor = `
- Nome do Autor: ${formData.authorName}
- Especialidade do Autor: ${formData.authorSpecialty}
- Dedicatória: ${formData.dedication || 'Nenhuma'}`;

  const estrutura = `
- Número de Capítulos: ${formData.chapters}
- Número Aproximado de Páginas: ${formData.pages}`;

  const prompt = `
    Você é um gerador de e-books didáticos.
    Sua tarefa é criar um e-book bem estruturado, organizado e pronto para diagramação.
    Use as informações abaixo preenchidas pelo usuário:

    📖 Tema: ${tema}

    ✍️ Autor/Estilo: ${autor}

    📌 Estrutura desejada: ${estrutura}

    ### Estrutura obrigatória do e-book:
    1.  **Capa (título e subtítulo sugestivos)**
    2.  **Prefácio**
        - Texto em terceira pessoa, institucional e motivacional.
        - Não cite nomes reais.
    3.  **Índice numerado**
    4.  **Capítulos**
        - Cada capítulo deve conter:
          - Introdução curta
          - Conteúdo claro e didático
          - Exemplo prático ou analogia
          - Pergunta de reflexão ao final
    5.  **Conclusão**
        - Síntese geral do conteúdo
        - Checklist prático com principais aprendizados
    6.  **Versículos, frases ou citações** (se o tema permitir)
    7.  **Referências** (liste livros, artigos e especialistas relevantes com seus nomes e títulos, não apenas links. Use a pesquisa web para encontrar esta informação, mas formate-a como uma bibliografia.)

    ### Regras de escrita:
    - Linguagem clara, envolvente e acessível.
    - Estrutura bem organizada, com títulos e subtítulos.
    - Não invente dados ou números falsos.
    - Evite citações de pessoas reais (exceto autores ou fontes citadas nas referências).
    - Use a pesquisa na web para encontrar e citar autores, livros, artigos ou especialistas relevantes como referências.
    - Revise o texto final para garantir que não há palavras estranhas ou erros de digitação (ex: "alegras" em vez de "alegrias"). A criatividade é bem-vinda, mas o texto deve ser coeso e fazer sentido.

    ### Regras de Formatação de Saída:
    - O texto de saída deve ser puro (plain text), sem nenhum caractere de formatação markdown.
    - NÃO use asteriscos (*) para negrito, itálico ou listas.
    - NÃO use cerquilhas (#) para títulos. Em vez disso, use quebras de linha e letras maiúsculas para indicar seções.

    O resultado deve estar pronto para ser salvo em banco de dados e exportado como PDF.
    Gere o texto completo do e-book em português, seguindo estritamente esta estrutura e as regras de escrita.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });
    
    // FIX: Extract sources from grounding metadata and return both content and sources.
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as Source[]) || [];
    return { content: response.text, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Falha ao gerar o conteúdo do e-book. Por favor, tente novamente.");
  }
};