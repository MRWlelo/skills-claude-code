import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Flag, TrendingUp, Shield, Zap } from 'lucide-react'
import { fetchMarkets } from '../lib/api'
import { MarketCard } from '../components/market/MarketCard'
import { Market } from '../types/market'

function HeroBanner() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface-2 to-surface-2 p-8">
      <div className="relative z-10 max-w-xl">
        <div className="mb-3 flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            Simulador Educacional
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold leading-tight text-white md:text-3xl">
          Mercado de derivativos<br />de eventos — Brasil
        </h1>
        <p className="mb-5 text-sm leading-relaxed text-zinc-400">
          Baseado no modelo da Kalshi (CFTC-regulated), negocie contratos sim/não sobre
          eventos reais com <strong className="text-white">R$ 10.000 virtuais</strong>.
          Sem dinheiro real, 100% educacional.
        </p>
        <Link
          to="/mercados"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-black hover:bg-primary-light transition-colors"
        >
          Explorar mercados <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {/* Decorative */}
      <div className="absolute right-4 top-4 opacity-5 text-[200px] font-bold text-primary select-none">
        ₿
      </div>
    </div>
  )
}

function FeatureRow() {
  const features = [
    {
      Icon: TrendingUp,
      title: 'Mercados reais',
      desc: 'Probabilidades ao vivo baseadas na Kalshi',
    },
    {
      Icon: Zap,
      title: 'Paper Trading',
      desc: 'Negocie com R$ 10k virtuais, sem risco',
    },
    {
      Icon: Shield,
      title: '100% Legal no Brasil',
      desc: 'Plataforma educacional, sem apostas reais',
    },
  ]

  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {features.map(({ Icon, title, desc }) => (
        <div key={title} className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-xs text-zinc-500">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Home() {
  const { data: markets = [], isLoading } = useQuery({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
  })

  const featured = markets
    .sort((a: Market, b: Market) => b.volume_24h - a.volume_24h)
    .slice(0, 6)

  const brMarkets = markets.filter((m: Market) => m.category === 'Brasil').slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <HeroBanner />
      <FeatureRow />

      {/* Brasil Highlights */}
      {brMarkets.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <span className="text-lg">🇧🇷</span> Mercados Brasil
            </h2>
            <Link to="/mercados?categoria=Brasil" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {brMarkets.map((m: Market) => (
              <MarketCard key={m.ticker} market={m} />
            ))}
          </div>
        </section>
      )}

      {/* Featured by volume */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Em Alta</h2>
          <Link to="/mercados" className="text-xs text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-surface-2" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m: Market) => (
              <MarketCard key={m.ticker} market={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
