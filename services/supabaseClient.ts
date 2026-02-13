import { createClient } from '@supabase/supabase-js';

// Prefira configurar as chaves via variáveis de ambiente em produção.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://snxpdzgfyzkazbnnmegt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNueHBkemdmeXprYXpibm5tZWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzkyNzAsImV4cCI6MjA4NjUxNTI3MH0.r91Z4_uTveHKhASBdnBxlTq-tzg9M9UbinJBAsQymO4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
