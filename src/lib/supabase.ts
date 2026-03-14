import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
      console.error('Supabase keys are missing in the browser environment!')
    }
    return createBrowserClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'placeholder-key'
    )
  }

  // Diagnostic for DNS resolution issue
  if (typeof window !== 'undefined') {
    console.log('Hub attempting to reach Supabase at:', supabaseUrl)
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
