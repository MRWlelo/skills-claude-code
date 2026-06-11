import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Info, ShoppingCart } from 'lucide-react'
import { fetchMarket, fetchMarketHistory } from '../lib/api'
import { PriceChart } from '../components/market/PriceChart'
import { TradeModal } from '../components/market/TradeModal'
import { cn, fmtCurrency, fmtDateLong, fmt, deltaColor, priceDelta } from '../lib/utils'
import { usePortfolio } from '../store/portfolioStore'

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-lg bg-surface-3 p-3">
      <p className="mb-0.5 text-xs text-zinc-500">{label}</p>
      <p className={cn('font-mono text-sm font-semibold', className ?? 'text-white')}>{value}</p>
    </div>
  )
}

export function MarketDetail() {
  const { ticker } = useParams<{ ticker: string }>()
  const [showTrade, setShowTrade] = useState(false)

  const { data: market, isLoading } = useQuery({
    queryKey: ['market', ticker],
    queryFn: () => fetchMarket(ticker!),
    enabled: !!ticker,
  })

  const { data: history = [] } = useQuery({
    queryKey: ['history', ticker],
    queryFn: () => fetchMarketHistory(ticker!),
    enabled: !!ticker,
  })

  const positions = usePortfolio((s) => s.positions)
  const myPosition = positions.find((p) => p.market_ticker === ticker)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-2" />
        <div className="h-64 animate-pulse rounded-xl bg-surface-2" />
      </div>
    )
  }

  if (!market) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-zinc-400">
        <p>Mercado não encontrado</p>
        <Link to="/mercados" className="text-primary text-sm hover:underline">← Voltar para mercados</Link>
      </div>
    )
  }

  const delta = priceDelta(market.last_price, market.previous_price)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Back */}
      <Link to="/mercados" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Mercados
      </Link>

      {/* Title */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {market.category}
          </span>
          <span className="text-xs text-zinc-500">
            Encerra em {fmtDateLong(market.close_time)}
          </span>
        </div>
        <h1 className="text-xl font-bold text-white leading-snug md:text-2xl">
          {market.title}
        </h1>
        {market.subtitle && (
          <p className="mt-1 text-sm text-zinc-400">{market.subtitle}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Left: chart + details */}
        <div className="md:col-span-2 space-y-4">
          {/* Price hero */}
          <div className="rounded-xl border border-border bg-surface-2 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                  Probabilidade atual
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold font-mono text-primary">
                    {market.last_price}%
                  </span>
                  <span className={cn('text-sm font-mono', deltaColor(delta))}>
                    {delta > 0 ? '+' : ''}{delta}pts
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">Volume 24h</p>
                <p className="font-mono text-sm font-semibold text-white">
                  ${fmt(market.volume_24h / 100, 0)}k
                </p>
              </div>
            </div>

            {/* Yes/No bar */}
            <div className="mb-4">
              <div className="h-3 overflow-hidden rounded-full bg-danger/30">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${market.last_price}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs font-medium">
                <span className="text-primary">SIM {market.last_price}%</span>
                <span className="text-danger">NÃO {100 - market.last_price}%</span>
              </div>
            </div>

            <PriceChart data={history} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Volume total" value={`$${fmt(market.volume / 100, 0)}`} />
            <Stat label="Open interest" value={fmt(market.open_interest, 0)} />
            <Stat label="Bid SIM" value={`${market.yes_bid}¢`} className="text-primary" />
            <Stat label="Ask SIM" value={`${market.yes_ask}¢`} className="text-primary" />
          </div>

          {/* Rules */}
          {market.rules_primary && (
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Info className="h-4 w-4 text-zinc-400" />
                Regras de resolução
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">{market.rules_primary}</p>
              {market.settlement_source && (
                <a
                  href={market.settlement_source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {market.settlement_source.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right: trade panel */}
        <div className="space-y-4">
          {/* Order book preview */}
          <div className="rounded-xl border border-border bg-surface-2 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Livro de ordens
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Ask (SIM)</span>
                <span className="font-mono text-primary">{market.yes_ask}¢</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Bid (SIM)</span>
                <span className="font-mono text-primary">{market.yes_bid}¢</span>
              </div>
              <div className="my-1 border-t border-border" />
              <div className="flex justify-between">
                <span className="text-zinc-500">Ask (NÃO)</span>
                <span className="font-mono text-danger">{market.no_ask}¢</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Bid (NÃO)</span>
                <span className="font-mono text-danger">{market.no_bid}¢</span>
              </div>
            </div>
          </div>

          {/* Trade button */}
          <button
            onClick={() => setShowTrade(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-black transition-colors hover:bg-primary-light"
          >
            <ShoppingCart className="h-4 w-4" />
            Negociar (Paper Trade)
          </button>

          {/* My position */}
          {myPosition && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Minha posição
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Lado</span>
                  <span className={myPosition.side === 'yes' ? 'text-primary' : 'text-danger'}>
                    {myPosition.side === 'yes' ? 'SIM' : 'NÃO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Qtd</span>
                  <span className="font-mono text-white">{myPosition.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Preço médio</span>
                  <span className="font-mono text-white">{myPosition.avg_price}¢</span>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">
            <p className="text-xs text-yellow-400 leading-relaxed">
              <strong>Aviso:</strong> Esta plataforma é um simulador educacional.
              Nenhuma transação financeira real é realizada.
            </p>
          </div>
        </div>
      </div>

      {showTrade && (
        <TradeModal market={market} onClose={() => setShowTrade(false)} />
      )}
    </div>
  )
}
