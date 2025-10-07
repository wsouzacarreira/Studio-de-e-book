import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { EbookForm } from '../types'; // Removed Source from import

export const generateEbookContent = async (formData: EbookForm): Promise<{ content: string }> => { // Adjusted return type
  if (!process.env.API_KEY) {
    return Promise.resolve({
      content: "API Key não configurada. Por favor, adicione sua chave API para testar a funcionalidade. Este é um conteúdo de exemplo para demonstração, gerado com a nova estrutura.\n\nCapa\n\nTítulo: Um Guia de Exemplo\n\nSubtítulo: Demonstrando a nova estrutura de prompt\n\nPrefácio\n\nEste e-book serve como uma demonstração da estrutura aprimorada...",
      // Removed sources from the mock return
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

  // Modificado para enfatizar a quantidade de páginas
  const estrutura = `
- Número de Capítulos: ${formData.chapters}
- O conteúdo total deve ter aproximadamente ${formData.pages} páginas.`;

  const prompt = `
    Você é um gerador de e-books didáticos.
    Sua tarefa é criar um e-book bem estruturado, organizado e pronto para diagramação.
    O conteúdo deve ser detalhado e abrangente, visando preencher aproximadamente ${formData.pages} páginas.
    Cada capítulo deve ser substancial para contribuir para o total de páginas.
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
          - O conteúdo de cada capítulo deve ser extenso e detalhado para contribuir para o número total de páginas solicitado.
    5.  **Conclusão**
        - Síntese geral do conteúdo
        - Checklist prático com principais aprendizados
    6.  **Referências** (liste apenas livros relevantes com seus nomes e títulos, não apenas links. Use a pesquisa web para encontrar esta informação, mas formate-a como uma bibliografia.)

    ### Regras de escrita:
    - Linguagem clara, envolvente e acessível.
    - Estrutura bem organizada, com títulos e subtítulos.
    - Não invente dados ou números falsos.
    - Evite citações de pessoas reais (exceto autores ou fontes citadas nas referências).
    - Use a pesquisa na web para encontrar e citar livros relevantes como referências.
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
    
    // Removed sources extraction
    return { content: response.text };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Falha ao gerar o conteúdo do e-book. Por favor, tente novamente.");
  }
};