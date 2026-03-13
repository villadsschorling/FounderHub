'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const initialConversations = [
  {
    id: 1,
    name: 'John Doe',
    messages: [
      { id: 1, sender: 'John Doe', text: 'Hey! This is our private channel.' },
      { id: 2, sender: 'You', text: 'Perfect, only we can see this.' },
    ]
  },
  {
    id: 2,
    name: 'Jane Doe',
    messages: [
      { id: 1, sender: 'Jane Doe', text: 'Did you check the new benchmarks?' },
    ]
  }
]

export function PrivateChat() {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeId, setActiveId] = useState(1)
  const [newMessage, setNewMessage] = useState('')

  const activeChat = conversations.find(c => c.id === activeId)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const updated = conversations.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [...c.messages, { id: Date.now(), sender: 'You', text: newMessage }]
        }
      }
      return c
    })
    setConversations(updated)
    setNewMessage('')
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)]">
      {/* Sidebar for conversations */}
      <div className="w-64 border-r border-[color:var(--border-subtle)] p-4 flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-tertiary)] mb-2 px-2">Messages</h3>
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeId === c.id 
                ? 'bg-[color:var(--accent-primary)] text-white' 
                : 'hover:bg-[color:var(--background-overlay)] text-[color:var(--text-secondary)]'
            }`}
          >
            <div className="h-8 w-8 rounded-full bg-[color:var(--border-subtle)] flex items-center justify-center font-bold">
              {c.name[0]}
            </div>
            <span className="font-medium">{c.name}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[color:var(--background-overlay)]">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-[color:var(--border-subtle)]">
              <h2 className="font-semibold text-[color:var(--text-primary)]">{activeChat.name}</h2>
              <p className="text-xs text-[color:var(--text-tertiary)] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Private encrypted channel
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {activeChat.messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                      m.sender === 'You' 
                        ? 'bg-[color:var(--accent-primary)] text-white rounded-br-none' 
                        : 'glass-panel text-[color:var(--text-primary)] rounded-bl-none'
                    }`}>
                      <p>{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[color:var(--border-subtle)] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${activeChat.name}...`}
                className="flex-1 bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--accent-primary)]"
              />
              <button
                type="submit"
                className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[color:var(--text-tertiary)]">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  )
}
