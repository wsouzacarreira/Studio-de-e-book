import { createClient } from '@supabase/supabase-js';

// Certifique-se de que estas variáveis de ambiente estão configuradas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key não configurados nas variáveis de ambiente.');
  // Em um ambiente de produção, você pode querer lançar um erro ou lidar com isso de forma mais robusta.
  // Por enquanto, vamos apenas logar o erro e usar valores vazios para evitar quebrar o app.
  // Isso fará com que as chamadas ao Supabase falhem, mas o app não travará na inicialização.
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');