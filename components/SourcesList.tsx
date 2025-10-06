import React from 'react';
import { Source } from '../types';

interface SourcesListProps {
  sources: Source[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Fontes e Referências da Web</h2>
      <div className="bg-gray-800 rounded-lg shadow-inner p-6 border border-gray-700">
        <ul className="space-y-3">
          {sources.map((source, index) => (
            <li key={index} className="text-sm">
              <a
                href={source.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                title={source.web.title}
              >
                [{index + 1}] {source.web.title || source.web.uri}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
