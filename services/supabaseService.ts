import { EbookForm } from '../types';
import { supabase } from '../src/lib/supabaseClient'; // Caminho corrigido

export const saveEbook = async (formData: EbookForm, content: string): Promise<{ success: true }> => {
  const dataToSave = {
    titulo: formData.subject,
    publico: formData.audience,
    tom: formData.tone,
    capitulos: formData.chapters,
    paginas: formData.pages,
    conteudo: content,
    autor: formData.authorName,
    especialidade: formData.authorSpecialty,
    dedicatoria: formData.dedication,
    data_criacao: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('ebooks') // Nome da tabela no Supabase
      .insert([dataToSave]);

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      throw new Error(`Falha ao salvar o e-book: ${error.message}`);
    }

    console.log("E-book salvo com sucesso no Supabase:", data);
    return { success: true };
  } catch (err: any) {
    console.error("Erro inesperado ao salvar e-book:", err);
    throw new Error(err.message || 'Ocorreu um erro desconhecido ao salvar o e-book.');
  }
};