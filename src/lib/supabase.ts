import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // During build time, Next.js might try to pre-render pages.
    // We return a dummy client to prevent build-time crashes, 
    // but in production this will cause 'Failed to fetch' if keys are missing.
    return createBrowserClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'placeholder-key'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
