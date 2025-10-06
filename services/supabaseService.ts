
import { EbookForm } from '../types';

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

  console.log("Simulando salvamento no Supabase com os seguintes dados:");
  console.log(dataToSave);

  // Simulating a successful API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};
