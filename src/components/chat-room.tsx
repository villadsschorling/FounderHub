'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const seedMessages = [
  {
    id: 1,
    profile: { full_name: 'John Doe' },
    content: 'Hey everyone!',
  },
  {
    id: 2,
    profile: { full_name: 'Jane Doe' },
    content: 'Hi John!',
  },
]

export function ChatRoom() {
  const searchParams = useSearchParams()
  const recipient = searchParams.get('recipient')
  const [messages, setMessages] = useState<any[]>(seedMessages)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (recipient) {
      setNewMessage(`@${recipient} `)
    }
  }, [recipient])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === '') return

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        profile: { full_name: 'You' },
        content: newMessage,
      },
    ])

    setNewMessage('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <div>
                <p className="font-semibold">{msg.profile?.full_name || 'Anonymous'}</p>
                <p className="text-gray-700">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
