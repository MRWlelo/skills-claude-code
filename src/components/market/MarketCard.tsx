import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Market } from '../../types/market'
import { cn, fmt, fmtDate, priceDelta, deltaColor } from '../../lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
  Brasil: 'bg-green-500/10 text-green-400 border-green-500/20',
  Economia: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Política: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Cripto: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Clima: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Esporte: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Pop: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

interface Props {
  market: Market
}

export function MarketCard({ market }: Props) {
  const delta = priceDelta(market.last_price, market.previous_price)
  const DeltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
  const barWidth = `${market.last_price}%`

  return (
    <Link
      to={`/mercados/${market.ticker}`}
      className="group block rounded-xl border border-border bg-surface-2 p-4 transition-all hover:border-primary/40 hover:bg-surface-3"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={cn(
            'rounded border px-2 py-0.5 text-xs font-medium',
            CATEGORY_COLORS[market.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'
          )}
        >
          {market.category}
        </span>
        <span className="text-xs text-zinc-500">{fmtDate(market.close_time)}</span>
      </div>

      {/* Title */}
      <p className="mb-4 text-sm font-medium leading-snug text-zinc-100 group-hover:text-white line-clamp-2">
        {market.title}
      </p>

      {/* Probability bar */}
      <div className="mb-3">
        <div className="mb-1.5 flex justify-between text-xs text-zinc-500">
          <span>SIM</span>
          <span>NÃO</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-danger/30">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: barWidth }}
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="font-mono text-sm font-semibold text-primary">
            {market.last_price}¢
          </span>
          <span className="font-mono text-sm font-semibold text-danger">
            {100 - market.last_price}¢
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Vol: ${fmt(market.volume_24h / 100, 0)}k/24h</span>
        <span className={cn('flex items-center gap-1', deltaColor(delta))}>
          <DeltaIcon className="h-3 w-3" />
          {delta > 0 ? '+' : ''}{delta}¢
        </span>
      </div>
    </Link>
  )
}
