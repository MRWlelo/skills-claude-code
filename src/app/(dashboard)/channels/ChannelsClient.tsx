'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Plus, X, ExternalLink } from 'lucide-react'

interface Channel {
  id: string
  name: string
  type: string
  status: string
  config: string
  createdAt: Date | string
}

const channelInfo = [
  {
    type: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Connect via WhatsApp Business API (Meta Cloud API)',
    color: 'from-green-400 to-emerald-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    instructions: [
      'Create a Meta Business account at business.facebook.com',
      'Set up a WhatsApp Business app in Meta Developer Portal',
      'Get your Phone Number ID and Access Token',
      'Configure the webhook URL in your Meta App settings',
    ],
  },
  {
    type: 'instagram',
    name: 'Instagram DM',
    description: 'Automate Instagram Direct Messages',
    color: 'from-pink-400 via-purple-500 to-indigo-500',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    instructions: [
      'Connect a professional Instagram account to a Facebook Page',
      'Enable Instagram Messaging in your Meta App',
      'Grant messaging permissions (instagram_manage_messages)',
      'Add the Page Access Token to the configuration',
    ],
  },
  {
    type: 'facebook',
    name: 'Facebook Messenger',
    description: 'Automate Facebook Messenger conversations',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    instructions: [
      'Create a Facebook Page for your business',
      'Create a Meta App and add the Messenger product',
      'Subscribe your app to the Page',
      'Configure the webhook with your Page Access Token',
    ],
  },
  {
    type: 'webchat',
    name: 'Web Chat',
    description: 'Embed a chat widget on your website',
    color: 'from-gray-400 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    instructions: [
      'Copy the embed code snippet below',
      'Paste it before the closing </body> tag on your website',
      'Customize the widget color and greeting message',
      'Start receiving chats from your visitors',
    ],
  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
      <CheckCircle className="w-3.5 h-3.5" /> Connected
    </span>
  )
  if (status === 'error') return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
      <XCircle className="w-3.5 h-3.5" /> Error
    </span>
  )
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
      <AlertCircle className="w-3.5 h-3.5" /> Not connected
    </span>
  )
}

export default function ChannelsClient({ initialChannels }: { initialChannels: Channel[] }) {
  const [channels, setChannels] = useState(initialChannels)
  const [configuring, setConfiguring] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [phoneId, setPhoneId] = useState('')
  const [saving, setSaving] = useState(false)

  function getChannelStatus(type: string) {
    return channels.find((c) => c.type === type)
  }

  async function connectChannel(type: string) {
    setSaving(true)
    try {
      const existingChannel = channels.find((c) => c.type === type)
      const info = channelInfo.find((c) => c.type === type)
      const config = type === 'whatsapp' ? { token, phoneNumberId: phoneId } :
                     type === 'webchat' ? {} :
                     { token }

      if (existingChannel) {
        const res = await fetch(`/api/channels/${existingChannel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'active', config }),
        })
        const updated = await res.json()
        setChannels((prev) => prev.map((c) => c.id === updated.id ? updated : c))
      } else {
        const res = await fetch('/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: info?.name ?? type, type, status: 'active', config }),
        })
        const channel = await res.json()
        setChannels((prev) => [...prev, channel])
      }

      setConfiguring(null)
      setToken('')
      setPhoneId('')
    } finally {
      setSaving(false)
    }
  }

  async function disconnectChannel(channelId: string) {
    await fetch(`/api/channels/${channelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'inactive' }),
    })
    setChannels((prev) => prev.map((c) => c.id === channelId ? { ...c, status: 'inactive' } : c))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Channels</h1>
        <p className="text-gray-500 mt-1">Connect your messaging channels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {channelInfo.map((info) => {
          const existing = getChannelStatus(info.type)
          const isActive = existing?.status === 'active'
          const isConfiguring = configuring === info.type

          return (
            <div key={info.type} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${info.border}`}>
              <div className={`h-2 bg-gradient-to-r ${info.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{info.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{info.description}</p>
                  </div>
                  <StatusBadge status={existing?.status ?? 'inactive'} />
                </div>

                {!isConfiguring ? (
                  <>
                    <div className={`${info.bg} rounded-xl p-4 mb-4`}>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Setup Steps</p>
                      <ol className="space-y-1.5">
                        {info.instructions.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center font-semibold text-gray-500 flex-shrink-0 mt-0.5 shadow-sm">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex gap-3">
                      {isActive ? (
                        <button
                          onClick={() => existing && disconnectChannel(existing.id)}
                          className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfiguring(info.type)}
                          className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Connect
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Enter your credentials:</p>
                    {info.type !== 'webchat' && (
                      <input
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Access Token"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    )}
                    {info.type === 'whatsapp' && (
                      <input
                        value={phoneId}
                        onChange={(e) => setPhoneId(e.target.value)}
                        placeholder="Phone Number ID"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    )}
                    {info.type === 'webchat' && (
                      <div className="bg-gray-50 rounded-xl p-3 font-mono text-xs text-gray-600 overflow-x-auto">
                        {'<script src="https://your-domain.com/widget.js"></script>'}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setConfiguring(null); setToken(''); setPhoneId('') }}
                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm transition-colors hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => connectChannel(info.type)}
                        disabled={saving || (info.type !== 'webchat' && !token)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Connecting...' : 'Connect'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
