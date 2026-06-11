'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

interface Props {
  variant?: 'default' | 'empty'
}

export default function FlowsClientActions({ variant = 'default' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function createFlow() {
    setLoading(true)
    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Flow', description: '' }),
      })
      const flow = await res.json()
      router.push(`/flows/${flow.id}`)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'empty') {
    return (
      <button
        onClick={createFlow}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        Create first flow
      </button>
    )
  }

  return (
    <button
      onClick={createFlow}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      <Plus className="w-4 h-4" />
      New Flow
    </button>
  )
}
