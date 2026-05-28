import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "ATTENTION: Les variables d'environnement Supabase sont manquantes ! " +
      "Veuillez vérifier votre fichier .env.local ou les paramètres d'environnement sur Vercel."
    );
  }

  return createBrowserClient(
    url || 'https://placeholder-project.supabase.co',
    key || 'placeholder-anon-key'
  )
}

