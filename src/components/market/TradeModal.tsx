import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Market } from '../../types/market'
import { usePortfolio } from '../../store/portfolioStore'
import { cn, fmtCurrency, fmt } from '../../lib/utils'

interface Props {
  market: Market
  onClose: () => void
}

export function TradeModal({ market, onClose }: Props) {
  const [side, setSide] = useState<'yes' | 'no'>('yes')
  const [quantity, setQuantity] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { buy, balance } = usePortfolio()

  const price = side === 'yes' ? market.yes_ask : market.no_ask
  const total = (price / 100) * quantity
  const potential = (1.0 - price / 100) * quantity
  const roi = potential / total * 100

  function handleTrade() {
    const err = buy(market, side, quantity)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
      setTimeout(onClose, 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface-2 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Paper Trade</p>
            <h3 className="text-sm font-semibold text-white leading-snug max-w-xs">
              {market.title}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-surface-3 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <span className="text-2xl">✓</span>
            </div>
            <p className="font-semibold text-white">Ordem executada!</p>
            <p className="text-sm text-zinc-400">
              Comprou {quantity} contrato{quantity > 1 ? 's' : ''} {side === 'yes' ? 'SIM' : 'NÃO'}
            </p>
          </div>
        ) : (
          <>
            {/* Side selector */}
            <div className="mb-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSide('yes')}
                className={cn(
                  'rounded-lg border py-2.5 text-sm font-semibold transition-all',
                  side === 'yes'
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border text-zinc-400 hover:border-zinc-600'
                )}
              >
                SIM — {market.yes_ask}¢
              </button>
              <button
                onClick={() => setSide('no')}
                className={cn(
                  'rounded-lg border py-2.5 text-sm font-semibold transition-all',
                  side === 'no'
                    ? 'border-danger bg-danger/15 text-danger'
                    : 'border-border text-zinc-400 hover:border-zinc-600'
                )}
              >
                NÃO — {market.no_ask}¢
              </button>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Quantidade de contratos
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                  className="h-9 w-9 rounded-lg border border-border text-zinc-400 hover:bg-surface-3 hover:text-white text-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-9 flex-1 rounded-lg border border-border bg-surface-3 px-3 text-center font-mono text-sm text-white focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => q + 10)}
                  className="h-9 w-9 rounded-lg border border-border text-zinc-400 hover:bg-surface-3 hover:text-white text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-4 rounded-lg bg-surface-3 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Preço por contrato</span>
                <span className="font-mono text-white">{fmtCurrency(price / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total investido</span>
                <span className="font-mono text-white">{fmtCurrency(total)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-zinc-400">Ganho potencial</span>
                <span className="font-mono text-primary">+{fmtCurrency(quantity)} (+{fmt(roi, 0)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Saldo disponível</span>
                <span className={cn('font-mono', balance < total ? 'text-danger' : 'text-zinc-300')}>
                  {fmtCurrency(balance)}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleTrade}
              disabled={balance < total}
              className={cn(
                'w-full rounded-xl py-3 text-sm font-semibold transition-all',
                side === 'yes'
                  ? 'bg-primary text-black hover:bg-primary-light disabled:opacity-40'
                  : 'bg-danger text-white hover:bg-red-400 disabled:opacity-40'
              )}
            >
              Comprar {quantity} contrato{quantity > 1 ? 's' : ''} {side === 'yes' ? 'SIM' : 'NÃO'}
            </button>

            <p className="mt-3 text-center text-xs text-zinc-500">
              Simulação educacional — nenhum dinheiro real é movimentado
            </p>
          </>
        )}
      </div>
    </div>
  )
}
