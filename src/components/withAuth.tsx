'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function withAuth(Component: React.ComponentType<any>) {
  return function AuthenticatedComponent(props: any) {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
      const checkUser = async () => {
        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          router.push('/login')
        }
      }
      checkUser()
    }, [supabase, router])

    return <Component {...props} />
  }
}
