'use client'

import { useState } from 'react'
import { MessageSquare, Send, CheckCircle, Clock, Filter } from 'lucide-react'
import clsx from 'clsx'

interface Message {
  id: string
  content: string
  direction: string
  status: string
  type: string
  createdAt: Date | string
}

interface Contact {
  id: string
  name: string
  phone: string | null
  email: string | null
  channel: string
}

interface Conversation {
  id: string
  channel: string
  status: string
  lastMessage: string | null
  lastMessageAt: Date | string | null
  unreadCount: number
  contact: Contact
  messages: Message[]
  updatedAt: Date | string
}

const channelColors: Record<string, { bg: string; text: string; dot: string }> = {
  whatsapp: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  instagram: { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  facebook: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  webchat: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
}

function timeAgo(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function InboxClient({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations)
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterChannel, setFilterChannel] = useState('all')

  async function openConversation(conv: Conversation) {
    setSelected(conv)
    const res = await fetch(`/api/conversations/${conv.id}`)
    const data = await res.json()
    setMessages(data.messages ?? [])
    if (conv.unreadCount > 0) {
      await fetch(`/api/conversations/${conv.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unreadCount: 0 }),
      })
      setConversations((prev) =>
        prev.map((c) => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
      )
    }
  }

  async function sendMessage() {
    if (!draft.trim() || !selected || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/conversations/${selected.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      })
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
      setConversations((prev) =>
        prev.map((c) => c.id === selected.id ? { ...c, lastMessage: draft, lastMessageAt: new Date().toISOString() } : c)
      )
      setDraft('')
    } finally {
      setSending(false)
    }
  }

  async function resolveConversation(convId: string) {
    await fetch(`/api/conversations/${convId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved' }),
    })
    setConversations((prev) =>
      prev.map((c) => c.id === convId ? { ...c, status: 'resolved' } : c)
    )
    if (selected?.id === convId) setSelected((prev) => prev ? { ...prev, status: 'resolved' } : null)
  }

  const filtered = conversations.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    if (filterChannel !== 'all' && c.channel !== filterChannel) return false
    return true
  })

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Conversation list */}
      <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Inbox</h1>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="waiting">Waiting</option>
            </select>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="webchat">Web Chat</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations</p>
            </div>
          ) : (
            filtered.map((conv) => {
              const colors = channelColors[conv.channel] ?? channelColors.webchat
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={clsx(
                    'w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors',
                    selected?.id === conv.id && 'bg-indigo-50 border-indigo-100'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-semibold">
                        {conv.contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-gray-900 truncate">{conv.contact.name}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {conv.unreadCount}
                            </span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage ?? 'No messages'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${colors.bg} ${colors.text}`}>
                          {conv.channel}
                        </span>
                        {conv.lastMessageAt && (
                          <span className="text-xs text-gray-400">{timeAgo(conv.lastMessageAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Message thread */}
      {selected ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {selected.contact.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selected.contact.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${(channelColors[selected.channel] ?? channelColors.webchat).bg} ${(channelColors[selected.channel] ?? channelColors.webchat).text}`}>
                    {selected.channel}
                  </span>
                  <span className={`text-xs ${selected.status === 'open' ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {selected.status}
                  </span>
                </div>
              </div>
            </div>
            {selected.status === 'open' && (
              <button
                onClick={() => resolveConversation(selected.id)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Resolve
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={clsx('flex', msg.direction === 'outbound' ? 'justify-end' : 'justify-start')}
                >
                  <div className={clsx(
                    'max-w-sm px-4 py-2.5 rounded-2xl text-sm',
                    msg.direction === 'outbound'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {selected.status === 'open' && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!draft.trim() || sending}
                  className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
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
            <p className="font-medium">Select a conversation</p>
            <p className="text-sm mt-1">Choose from the list to start replying</p>
          </div>
        </div>
      )}
    </div>
  )
}
