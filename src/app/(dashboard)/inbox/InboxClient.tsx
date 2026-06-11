'use client'

import { useState } from 'react'
import { MessageSquare, Send, CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  direction: string
  status: string
  createdAt: Date | string
}

interface Contact {
  id: string
  name: string | null
  username: string | null
}

interface Conversation {
  id: string
  status: string
  lastMessage: string | null
  lastMessageAt: Date | string | null
  unreadCount: number
  contact: Contact
  messages: Message[]
}

function formatTime(date: Date | string | null) {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (days === 1) return 'ontem'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function InboxClient({ conversations: initial }: { conversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initial)
  const [selected, setSelected] = useState<Conversation | null>(initial[0] || null)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  const filtered = conversations.filter(c => {
    if (filter === 'open') return c.status === 'open'
    if (filter === 'resolved') return c.status === 'resolved'
    return true
  })

  async function sendMessage() {
    if (!selected || !newMessage.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/conversations/${selected.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })
      if (res.ok) {
        const msg = await res.json()
        const updatedConv = {
          ...selected,
          lastMessage: newMessage,
          messages: [...selected.messages, msg],
        }
        setSelected(updatedConv)
        setConversations(prev =>
          prev.map(c => c.id === selected.id ? { ...updatedConv, lastMessage: newMessage } : c)
        )
        setNewMessage('')
      }
    } finally {
      setSending(false)
    }
  }

  async function toggleStatus(conv: Conversation) {
    const newStatus = conv.status === 'open' ? 'resolved' : 'open'
    const res = await fetch(`/api/conversations/${conv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const updated = { ...conv, status: newStatus }
      setConversations(prev => prev.map(c => c.id === conv.id ? updated : c))
      if (selected?.id === conv.id) setSelected(updated)
    }
  }

  function getInitials(contact: Contact) {
    if (contact.name) return contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    if (contact.username) return contact.username.slice(0, 2).toUpperCase()
    return '??'
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: conversation list */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
        {/* Filter tabs */}
        <div className="flex p-3 gap-1 border-b border-gray-100">
          {(['all', 'open', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors',
                filter === f ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              )}
            >
              {f === 'all' ? 'Todas' : f === 'open' ? 'Abertas' : 'Resolvidas'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma conversa</p>
            </div>
          ) : (
            filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50',
                  selected?.id === conv.id && 'bg-indigo-50 border-l-2 border-l-indigo-500'
                )}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {getInitials(conv.contact)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {conv.contact.name || conv.contact.username || 'Desconhecido'}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  {conv.contact.username && (
                    <p className="text-xs text-indigo-500">@{conv.contact.username}</p>
                  )}
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 bg-indigo-600 text-white text-[10px] rounded-full font-bold mt-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: message thread */}
      {selected ? (
        <div className="flex-1 flex flex-col">
          {/* Thread header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {getInitials(selected.contact)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {selected.contact.name || selected.contact.username}
              </p>
              {selected.contact.username && (
                <p className="text-sm text-indigo-500">@{selected.contact.username}</p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className={cn(
                'text-xs px-2.5 py-1 rounded-full font-medium',
                selected.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              )}>
                {selected.status === 'open' ? 'Aberta' : 'Resolvida'}
              </span>
              <button
                onClick={() => toggleStatus(selected)}
                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600"
                title={selected.status === 'open' ? 'Marcar como resolvida' : 'Reabrir'}
              >
                {selected.status === 'open'
                  ? <CheckCircle className="w-5 h-5" />
                  : <Circle className="w-5 h-5" />
                }
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {selected.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
                )}
              >
                <div className={cn(
                  'max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm',
                  msg.direction === 'outbound'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-700 rounded-tl-sm border border-gray-100'
                )}>
                  {msg.content}
                  {msg.direction === 'outbound' && (
                    <span className="text-xs text-indigo-300 block text-right mt-0.5">
                      {msg.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          {selected.status === 'open' && (
            <div className="bg-white border-t border-gray-100 p-4">
              <div className="flex gap-3">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  )
}
