import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { fetchMarkets } from '../lib/api'
import { MarketCard } from '../components/market/MarketCard'
import { CATEGORIES } from '../lib/mockData'
import { Market, MarketCategory } from '../types/market'
import { cn } from '../lib/utils'

export function Markets() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const category = (searchParams.get('categoria') as MarketCategory | null) ?? 'Todos'

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
  })

  const filtered = markets.filter((m: Market) => {
    const matchCat = category === 'Todos' || m.category === category
    const matchSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.tags?.some((t) => t.includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  function setCategory(cat: string) {
    if (cat === 'Todos') {
      searchParams.delete('categoria')
    } else {
      searchParams.set('categoria', cat)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 text-xl font-bold text-white">Mercados</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar mercados..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-2 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Category filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {['Todos', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              category === cat
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border text-zinc-400 hover:border-zinc-600 hover:text-white'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mb-4 text-xs text-zinc-500">{filtered.length} mercados encontrados</p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-zinc-500">
          Nenhum mercado encontrado
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m: Market) => (
            <MarketCard key={m.ticker} market={m} />
          ))}
        </div>
      )}
    </div>
  )
}
