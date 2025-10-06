
import React from 'react';
import { FontFamily } from '../types';

interface PreviewAreaProps {
  content: string;
  font: FontFamily;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ content, font }) => {
  const fontClass = {
    [FontFamily.INTER]: 'font-[Inter,sans-serif]',
    [FontFamily.ROBOTO]: 'font-[Roboto,sans-serif]',
    [FontFamily.LATO]: 'font-[Lato,sans-serif]',
    [FontFamily.MERRIWEATHER]: 'font-[Merriweather,serif]',
  }[font] || 'font-sans';

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Pré-visualização do E-book</h2>
      <div className={`w-full h-96 bg-gray-800 rounded-lg shadow-inner p-6 overflow-y-auto border border-gray-700 text-gray-300 whitespace-pre-wrap ${fontClass}`}>
        {content ? content : <p className="text-gray-500">O conteúdo do seu e-book aparecerá aqui após a geração...</p>}
      </div>
    </div>
  );
};
