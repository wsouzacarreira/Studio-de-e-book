
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

// FIX: Add Source type definition for web references. This resolves the error in SourcesList.tsx.
export interface Source {
  web: {
    uri: string;
    title: string;
  };
}
