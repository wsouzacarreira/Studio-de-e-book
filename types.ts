export enum ToneOfVoice {
  PROFISSIONAL = 'Profissional',
  AMIGAVEL = 'Amigável',
  INSPIRADOR = 'Inspirador',
  TECNICO = 'Técnico',
  CRIATIVO = 'Criativo',
}

export enum FontFamily {
  INTER = 'Inter',
  ROBOTO = 'Roboto',
  LATO = 'Lato',
  MERRIWEATHER = 'Merriweather',
}

export interface EbookForm {
  subject: string;
  audience: string;
  tone: ToneOfVoice;
  authorName: string;
  authorSpecialty: string;
  dedication: string;
  font: FontFamily;
  chapters: number;
  pages: number;
}

// Removed Source type definition