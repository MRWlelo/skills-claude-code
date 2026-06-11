'use client'

import { useState } from 'react'
import { Instagram, Check, Unlink, User, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserData {
  id: string
  name: string
  email: string
  plan: string
  planExpiresAt: string | null
  instagramAccount: { id: string; username: string; name: string | null } | null
}

export default function SettingsClient({ user }: { user: UserData }) {
  const [name, setName] = useState(user.name)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [instagram, setInstagram] = useState(user.instagramAccount)
  const [mockUsername, setMockUsername] = useState('')

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      setSavedProfile(true)
      setTimeout(() => setSavedProfile(false), 2000)
    } finally {
      setSavingProfile(false)
    }
  }

  async function connectInstagram(e: React.FormEvent) {
    e.preventDefault()
    if (!mockUsername.trim()) return
    setConnecting(true)
    try {
      const res = await fetch('/api/instagram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: mockUsername }),
      })
      if (res.ok) {
        const data = await res.json()
        setInstagram(data.account)
        setMockUsername('')
      }
    } finally {
      setConnecting(false)
    }
  }

  async function disconnectInstagram() {
    setDisconnecting(true)
    try {
      await fetch('/api/instagram/disconnect', { method: 'POST' })
      setInstagram(null)
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Perfil</h2>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              value={user.email}
              disabled
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {savedProfile ? <><Check className="w-4 h-4" /> Salvo!</> : 'Salvar alterações'}
          </button>
        </form>
      </div>

      {/* Instagram section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-semibold text-gray-900">Conta Instagram</h2>
        </div>

        {instagram ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {instagram.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">@{instagram.username}</p>
                {instagram.name && <p className="text-sm text-gray-500">{instagram.name}</p>}
              </div>
              <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                <Check className="w-3 h-3" /> Conectado
              </span>
            </div>
            <button
              onClick={disconnectInstagram}
              disabled={disconnecting}
              className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <Unlink className="w-4 h-4" />
              Desconectar
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Conecte sua conta Instagram para ativar as automações. Em produção, isso usa o OAuth da Meta.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-700">
                <strong>Modo demonstração:</strong> Digite seu @ do Instagram para simular a conexão. A integração real usa a API Oficial da Meta.
              </p>
            </div>
            <form onSubmit={connectInstagram} className="flex gap-3">
              <input
                value={mockUsername}
                onChange={(e) => setMockUsername(e.target.value.replace('@', ''))}
                placeholder="seu.usuario"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={connecting || !mockUsername.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {connecting ? 'Conectando...' : 'Conectar Instagram'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Plan section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Plano atual</h2>
        </div>
        <div className={cn(
          'flex items-center justify-between p-4 rounded-xl',
          user.plan === 'pro' ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50 border border-gray-200'
        )}>
          <div>
            <p className="font-semibold text-gray-900">
              {user.plan === 'pro' ? 'Plano Pro' : 'Plano Gratuito'}
            </p>
            {user.plan === 'pro' && user.planExpiresAt && (
              <p className="text-sm text-gray-500">
                Válido até {new Date(user.planExpiresAt).toLocaleDateString('pt-BR')}
              </p>
            )}
            {user.plan === 'free' && (
              <p className="text-sm text-gray-500">30 respostas/mês · 1 automação ativa</p>
            )}
          </div>
          {user.plan === 'free' && (
            <a
              href="/planos"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Fazer upgrade
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
