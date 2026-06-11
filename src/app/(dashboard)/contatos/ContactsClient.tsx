'use client'

import { useState } from 'react'
import { Search, Users, Instagram } from 'lucide-react'

interface Contact {
  id: string
  name: string | null
  username: string | null
  tags: string
  source: string | null
  isFollower: boolean
  createdAt: Date | string
}

export default function ContactsClient({ contacts: initial }: { contacts: Contact[] }) {
  const [contacts] = useState(initial)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const allTags = Array.from(
    new Set(contacts.flatMap(c => {
      try { return JSON.parse(c.tags) as string[] } catch { return [] }
    }))
  )

  const filtered = contacts.filter(c => {
    const matchSearch =
      !search ||
      (c.name?.toLowerCase().includes(search.toLowerCase())) ||
      (c.username?.toLowerCase().includes(search.toLowerCase()))

    const matchTag =
      !tagFilter || (() => {
        try {
          const tags = JSON.parse(c.tags) as string[]
          return tags.includes(tagFilter)
        } catch { return false }
      })()

    return matchSearch && matchTag
  })

  function getInitials(c: Contact) {
    if (c.name) return c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    if (c.username) return c.username.slice(0, 2).toUpperCase()
    return '?'
  }

  function formatDate(d: Date | string) {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contatos..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Todas as tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum contato encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="text-left px-6 py-3">Contato</th>
                <th className="text-left px-6 py-3">Tags</th>
                <th className="text-left px-6 py-3">Fonte</th>
                <th className="text-left px-6 py-3">Entrada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((contact) => {
                let tags: string[] = []
                try { tags = JSON.parse(contact.tags) } catch { tags = [] }

                return (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {getInitials(contact)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contact.name || contact.username || 'Desconhecido'}</p>
                          {contact.username && (
                            <p className="text-xs text-indigo-500 flex items-center gap-1">
                              <Instagram className="w-3 h-3" />
                              @{contact.username}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tags.map(tag => (
                          <span
                            key={tag}
                            onClick={() => setTagFilter(tag === tagFilter ? '' : tag)}
                            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full cursor-pointer hover:bg-indigo-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 max-w-[160px] truncate">{contact.source || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{formatDate(contact.createdAt)}</p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
