'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user && pathname !== '/login') {
        router.push('/login')
      } else if (user) {
        if (pathname === '/login') {
          router.push('/')
        }
      }
      
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/login') {
        router.push('/login')
      } else if (session && pathname === '/login') {
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  if (loading && pathname !== '/login') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--background-base)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--accent-primary)] border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
