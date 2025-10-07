"use client";

import React, { useState } from 'react';
import { supabase } from '../src/lib/supabaseClient';
import { InputField } from './InputField';
import { ActionButton } from './ActionButton';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        setMessage('Login realizado com sucesso!');
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar.');
      }
      onAuthSuccess(); 
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
        <InputField
          label="Senha"
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          required
        />
        <ActionButton
          type="submit"
          color="blue"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
        </ActionButton>
      </form>
      {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      <p className="text-gray-400 mt-6 text-center">
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 hover:underline ml-1"
          disabled={loading}
        >
          {isLogin ? 'Cadastre-se' : 'Faça login'}
        </button>
      </p>
    </div>
  );
};