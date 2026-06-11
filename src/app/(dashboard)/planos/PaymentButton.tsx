'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      if (res.ok) {
        alert('Upgrade realizado com sucesso! Bem-vindo ao Pro 🎉')
        router.refresh()
      } else {
        alert('Erro ao processar pagamento. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Processando...' : 'Assinar por R$15/mês'}
    </button>
  )
}
