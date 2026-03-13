'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const seedProfiles = [
  {
    id: 1,
    full_name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    full_name: 'Jane Doe',
    email: 'jane.doe@example.com',
  },
]

export function MemberDirectory() {
  const [profiles, setProfiles] = useState<any[]>(seedProfiles)

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <div key={profile.id} className="flex items-center justify-between rounded-md border p-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-300" />
            <div>
              <p className="font-semibold">{profile.full_name}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
          <Link href={`/chat?recipient=${profile.full_name}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium"
            >
              Message
            </motion.button>
          </Link>
        </div>
      ))}
    </div>
  )
}
