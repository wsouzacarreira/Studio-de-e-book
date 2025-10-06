
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gerador de E-book com IA
        </h1>
        <p className="text-gray-400 mt-2">Crie e-books completos com o poder da Inteligência Artificial</p>
    </header>
  );
};
