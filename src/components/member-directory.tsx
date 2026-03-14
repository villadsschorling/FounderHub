'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'

export function MemberDirectory() {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfiles() {
      setError(null)
      try {
        // Try to fetch with subscription_status filter
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('subscription_status', 'active')
          .order('created_at', { ascending: false })

        if (fetchError) {
          // If column doesn't exist, fetch all profiles (fallback for development)
          console.warn('Subscription status column may not exist, fetching all profiles:', fetchError)
          const { data: allProfiles, error: allError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (allError) {
            console.error('Error fetching all profiles:', allError)
            setError(allError.message)
          } else {
            setProfiles(allProfiles || [])
          }
        } else {
          setProfiles(data || [])
        }
      } catch (err: any) {
        console.error('Unexpected error:', err)
        setError(err.message || 'An unexpected error occurred')
      }
      setLoading(false)
    }

    fetchProfiles()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[color:var(--text-tertiary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--accent-primary)] border-t-transparent mb-4" />
        <p className="text-sm">Fetching elite operators...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg font-semibold">Error Loading Members</p>
        <p className="text-sm opacity-80">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[color:var(--accent-primary)] text-white rounded-lg text-xs font-bold"
        >
          Try Refreshing
        </button>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[color:var(--text-tertiary)]">
        <p className="text-lg">No members found yet.</p>
        <p className="text-sm">They will appear here once they join the hub.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <div key={profile.id} className="flex items-center justify-between rounded-md border border-[color:var(--border-subtle)] p-4 glass-panel">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[color:var(--background-overlay)] flex items-center justify-center font-bold text-xl border border-[color:var(--border-subtle)]">
              {profile.full_name ? profile.full_name[0] : '?'}
            </div>
            <div>
              <p className="font-semibold text-[color:var(--text-primary)]">
                {profile.full_name || 'Anonymous Founder'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {profile.role && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--accent-primary)] px-1.5 py-0.5 rounded bg-[color:var(--accent-primary)]/5 border border-[color:var(--accent-primary)]/10">
                    {profile.role}
                  </span>
                )}
                {profile.industry && (
                  <span className="text-[10px] font-medium text-[color:var(--text-tertiary)]">
                    {profile.industry}
                  </span>
                )}
                {profile.mrr && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[color:var(--border-subtle)]" />
                    <span className="text-[10px] font-bold text-[color:var(--text-secondary)]">
                      ${(profile.mrr / 1000).toFixed(0)}k MRR
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-[color:var(--text-tertiary)] mt-1">
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link href={`/private?recipient=${profile.id}`}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'var(--accent-primary)', color: 'white' }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md border border-[color:var(--accent-primary)] px-4 py-1.5 text-xs font-bold text-[color:var(--accent-primary)] transition-all"
            >
              Message
            </motion.button>
          </Link>
        </div>
      ))}
    </div>
  )
}
