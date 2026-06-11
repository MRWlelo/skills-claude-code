'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Edit, Trash2, ToggleLeft, ToggleRight, Hash, MessageSquare, Play, Users, Mail } from 'lucide-react'

interface Automation {
  id: string
  name: string
  description: string | null
  status: string
  triggerType: string
  triggerValue: string | null
  triggered: number
  messagesSent: number
  leads: number
  createdAt: Date | string
}

const triggerLabels: Record<string, string> = {
  comment_keyword: 'Comentário',
  story_reply: 'Story',
  dm_keyword: 'DM com palavra-chave',
  any_dm: 'Qualquer DM',
  new_follower: 'Novo seguidor',
}

const triggerColors: Record<string, string> = {
  comment_keyword: 'bg-purple-100 text-purple-700',
  story_reply: 'bg-pink-100 text-pink-700',
  dm_keyword: 'bg-blue-100 text-blue-700',
  any_dm: 'bg-cyan-100 text-cyan-700',
  new_follower: 'bg-green-100 text-green-700',
}

export default function AutomacoesClient({ automations: initial }: { automations: Automation[] }) {
  const router = useRouter()
  const [automations, setAutomations] = useState(initial)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function handleToggle(id: string) {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/automacoes/${id}/toggle`, { method: 'POST' })
      if (res.ok) {
        const updated = await res.json()
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a))
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao alterar status')
      }
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta automação?')) return
    const res = await fetch(`/api/automacoes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setAutomations(prev => prev.filter(a => a.id !== id))
    }
  }

  if (automations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-indigo-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma automação criada ainda</h3>
        <p className="text-gray-500 mb-6">Crie sua primeira automação e comece a capturar leads no Instagram.</p>
        <Link
          href="/automacoes/nova"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Criar automação
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {automations.map((auto) => (
        <div key={auto.id} className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${auto.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Zap className={`w-5 h-5 ${auto.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-900">{auto.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${triggerColors[auto.triggerType] || 'bg-gray-100 text-gray-600'}`}>
                  {triggerLabels[auto.triggerType] || auto.triggerType}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${auto.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {auto.status === 'active' ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              {auto.description && (
                <p className="text-sm text-gray-500 mb-3">{auto.description}</p>
              )}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>{auto.triggered} disparos</span>
                <span>{auto.messagesSent} mensagens</span>
                <span className="text-green-600 font-medium">{auto.leads} leads</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleToggle(auto.id)}
                disabled={togglingId === auto.id}
                title={auto.status === 'active' ? 'Desativar' : 'Ativar'}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {auto.status === 'active'
                  ? <ToggleRight className="w-6 h-6 text-green-500" />
                  : <ToggleLeft className="w-6 h-6 text-gray-400" />
                }
              </button>
              <Link
                href={`/automacoes/${auto.id}`}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4 text-gray-400" />
              </Link>
              <button
                onClick={() => handleDelete(auto.id)}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
