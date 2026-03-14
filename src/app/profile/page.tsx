'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Sidebar } from "@/components/sidebar"
import { createClient } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Log for debugging
        console.log('Fetching profile for user:', user.id)
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error fetching profile:', error)
          setMessage({ type: 'error', text: 'Failed to load profile data.' })
        } else if (data) {
          console.log('Profile found in DB:', data)
          setProfile({ ...data, user_email: user.email })
          setFullName(data.full_name || '')
        } else {
          console.log('No profile row found for user ID:', user.id)
          setProfile({ user_email: user.email })
        }
      }
      setLoading(false)
    }

    getProfile()
  }, [supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage({ type: '', text: '' })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage({ type: 'error', text: 'Session expired. Please log in again.' })
      setUpdating(false)
      return
    }

    const updatedName = fullName.trim()
    if (!updatedName) {
      setMessage({ type: 'error', text: 'Display name cannot be empty.' })
      setUpdating(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: updatedName })
      .eq('user_id', user.id)

    if (error) {
      console.error('Update error:', error)
      setMessage({ type: 'error', text: 'Error updating profile: ' + error.message })
    } else {
      console.log('Update successful, refreshing local state...')
      setProfile({ ...profile, full_name: updatedName })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <Sidebar>
        <div className="flex flex-col items-center justify-center h-full text-[color:var(--text-tertiary)]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--accent-primary)] border-t-transparent mb-4" />
          <p className="text-sm">Loading your profile...</p>
        </div>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 border border-[color:var(--border-subtle)]"
        >
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[color:var(--border-subtle)]">
            <div className="h-20 w-20 rounded-full bg-[color:var(--background-overlay)] flex items-center justify-center font-bold text-3xl border border-[color:var(--border-subtle)] text-[color:var(--accent-primary)]">
              {fullName ? fullName[0] : '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">My Profile</h1>
              <p className="text-sm text-[color:var(--text-secondary)]">Manage your personal information and hub settings.</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
                Display Name
              </label>
              <div className="input-shell px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-[color:var(--text-tertiary)]">This is how other founders will see you in the hub.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
                Email Address
              </label>
              <div className="input-shell px-4 py-2.5 bg-gray-50/50 opacity-60">
                <input
                  type="email"
                  value={profile?.email || profile?.user_email || 'Authenticated user'}
                  disabled
                  className="w-full bg-transparent text-sm text-[color:var(--text-primary)] cursor-not-allowed focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-[color:var(--text-tertiary)]">Your email address is managed through authentication settings.</p>
            </div>

            {message.text && (
              <div className={`text-xs p-3 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={updating}
                className="btn-primary w-full py-2.5 text-sm font-bold disabled:opacity-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {updating ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Sidebar>
  )
}
