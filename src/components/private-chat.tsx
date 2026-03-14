'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function PrivateChat() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const recipientName = searchParams.get('recipient')
  
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [activeRecipientId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. Initial Load: Get current user and all profiles
  useEffect(() => {
    async function initChat() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get current user's profile ID
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setCurrentUserProfile(myProfile)

      // Get all profiles for the sidebar
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .order('full_name')

      setProfiles(allProfiles || [])

      // Fetch unread counts for all profiles
      if (myProfile && allProfiles) {
        const { data: unreadData } = await supabase
          .from('private_messages')
          .select('sender_id')
          .eq('recipient_id', myProfile.id)
          .eq('is_read', false)

        const counts: Record<string, number> = {}
        unreadData?.forEach((m: any) => {
          counts[m.sender_id] = (counts[m.sender_id] || 0) + 1
        })
        setUnreadCounts(counts)
      }

      // If recipient in URL, select them (check both ID and name)
      const recipientParam = searchParams.get('recipient')
      if (recipientParam && allProfiles) {
        const target = allProfiles.find((p: any) => 
          p.id === recipientParam || 
          p.full_name?.toLowerCase() === recipientParam.toLowerCase()
        )
        if (target) {
          setActiveId(target.id)
        }
      }
      setLoading(false)
    }

    initChat()
  }, [supabase, searchParams])

  // 2. Fetch messages when active recipient changes
  useEffect(() => {
    if (!currentUserProfile || !activeRecipientId) return

    async function fetchMessages() {
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserProfile.id},recipient_id.eq.${activeRecipientId}),and(sender_id.eq.${activeRecipientId},recipient_id.eq.${currentUserProfile.id})`)
        .order('created_at', { ascending: true })

      if (error) console.error('Error fetching messages:', error)
      else setMessages(data || [])

      // Mark as read
      if (activeRecipientId) {
        await supabase
          .from('private_messages')
          .update({ is_read: true })
          .eq('sender_id', activeRecipientId!)
          .eq('recipient_id', currentUserProfile!.id)
          .eq('is_read', false)
        
        // Update local unread counts
        setUnreadCounts(prev => ({ ...prev, [activeRecipientId!]: 0 }))
      }
    }

    fetchMessages()

    // 3. Real-time subscription
    const channel = supabase
      .channel(`private_chat_global_${currentUserProfile.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages',
        filter: `recipient_id=eq.${currentUserProfile.id}`, 
      }, (payload: any) => {
        // If message is from the currently active person, add it and mark read
        if (payload.new.sender_id === activeRecipientId) {
          setMessages(prev => [...prev, payload.new])
          supabase
            .from('private_messages')
            .update({ is_read: true })
            .eq('id', payload.new.id)
            .then()
        } else {
          // Update unread count for other senders
          setUnreadCounts(prev => ({
            ...prev,
            [payload.new.sender_id]: (prev[payload.new.sender_id] || 0) + 1
          }))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentUserProfile, activeRecipientId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUserProfile || !activeRecipientId) return

    const messageData = {
      sender_id: currentUserProfile.id,
      recipient_id: activeRecipientId,
      content: newMessage.trim()
    }

    // Optimistically add to UI
    const tempId = Date.now().toString()
    setMessages(prev => [...prev, { ...messageData, id: tempId, created_at: new Date().toISOString() }])
    setNewMessage('')

    const { error } = await supabase
      .from('private_messages')
      .insert([messageData])

    if (error) {
      console.error('Error sending message:', error)
      // Rollback optimistic update if error (optional)
    }
  }

  const activeChat = profiles.find(p => p.id === activeRecipientId)

  if (loading) return <div className="p-8 animate-pulse text-[color:var(--text-tertiary)]">Initializing private channel...</div>

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)]">
      {/* Sidebar for conversations */}
      <div className="w-64 border-r border-[color:var(--border-subtle)] p-4 flex flex-col gap-2 overflow-y-auto">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-tertiary)] mb-2 px-2">Members</h3>
        {profiles.length === 0 ? (
          <p className="px-2 text-xs text-[color:var(--text-tertiary)] italic">No other founders yet</p>
        ) : (
          profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeRecipientId === p.id 
                  ? 'bg-[color:var(--accent-primary)] text-white' 
                  : 'hover:bg-[color:var(--background-overlay)] text-[color:var(--text-secondary)]'
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-[color:var(--border-subtle)] flex items-center justify-center font-bold">
                {p.full_name?.[0] || '?'}
              </div>
              <span className="font-medium truncate flex-1">{p.full_name || 'Anonymous'}</span>
              {unreadCounts[p.id] > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                >
                  {unreadCounts[p.id]}
                </motion.div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[color:var(--background-overlay)]">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-[color:var(--border-subtle)]">
              <h2 className="font-semibold text-[color:var(--text-primary)]">{activeChat.full_name}</h2>
              <p className="text-xs text-[color:var(--text-tertiary)] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                End-to-end encrypted discussion
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[color:var(--text-tertiary)] opacity-50">
                  <p>Secure connection established.</p>
                  <p className="text-xs">Say hello to start the trade.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.sender_id === currentUserProfile.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                        m.sender_id === currentUserProfile.id 
                          ? 'bg-[color:var(--accent-primary)] text-white rounded-br-none' 
                          : 'glass-panel text-[color:var(--text-primary)] rounded-bl-none border border-[color:var(--border-subtle)]'
                      }`}>
                        <p>{m.content}</p>
                        <p className={`text-[9px] mt-1 opacity-50 ${m.sender_id === currentUserProfile.id ? 'text-right' : 'text-left'}`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[color:var(--border-subtle)] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${activeChat.full_name}...`}
                className="flex-1 bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] text-[color:var(--text-primary)]"
              />
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded-lg text-sm font-bold shadow-lg"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[color:var(--text-tertiary)] gap-4">
            <div className="h-16 w-16 rounded-full bg-[color:var(--background-overlay)] flex items-center justify-center border border-[color:var(--border-subtle)]">
              <svg className="h-8 w-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>Select a founder to open a secure channel</p>
          </div>
        )}
      </div>
    </div>
  )
}
