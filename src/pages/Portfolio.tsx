import { Link } from 'react-router-dom'
import { RotateCcw, TrendingUp, TrendingDown } from 'lucide-react'
import { usePortfolio, calcPnl, INITIAL_BALANCE } from '../store/portfolioStore'
import { cn, fmtCurrency, fmt, fmtDate } from '../lib/utils'

export function Portfolio() {
  const { balance, positions, trades, sell, resetPortfolio } = usePortfolio()

  const totalInvested = positions.reduce(
    (sum, p) => sum + (p.avg_price / 100) * p.quantity,
    0
  )
  const totalPnl = positions.reduce((sum, p) => sum + calcPnl(p), 0)
  const totalValue = balance + totalInvested
  const totalReturn = ((totalValue - INITIAL_BALANCE) / INITIAL_BALANCE) * 100

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Minha Carteira</h1>
        <button
          onClick={() => {
            if (confirm('Resetar carteira para R$ 10.000?')) resetPortfolio()
          }}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Resetar
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Saldo disponível', value: fmtCurrency(balance), color: 'text-white' },
          { label: 'Valor total', value: fmtCurrency(totalValue), color: 'text-white' },
          {
            label: 'P&L não realizado',
            value: `${totalPnl >= 0 ? '+' : ''}${fmtCurrency(totalPnl)}`,
            color: totalPnl >= 0 ? 'text-primary' : 'text-danger',
          },
          {
            label: 'Retorno total',
            value: `${totalReturn >= 0 ? '+' : ''}${fmt(totalReturn, 1)}%`,
            color: totalReturn >= 0 ? 'text-primary' : 'text-danger',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-surface-2 p-4">
            <p className="mb-1 text-xs text-zinc-500">{label}</p>
            <p className={cn('font-mono text-sm font-semibold', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Positions */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-white">
          Posições abertas ({positions.length})
        </h2>
        {positions.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-zinc-500">
            <p className="text-sm">Nenhuma posição aberta</p>
            <Link to="/mercados" className="text-xs text-primary hover:underline">
              Explorar mercados →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {positions.map((pos) => {
              const pnl = calcPnl(pos)
              const pnlPct = (pnl / ((pos.avg_price / 100) * pos.quantity)) * 100
              return (
                <div
                  key={pos.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-4"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <Link
                      to={`/mercados/${pos.market_ticker}`}
                      className="block truncate text-sm font-medium text-white hover:text-primary"
                    >
                      {pos.market_title}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                      <span
                        className={cn(
                          'font-semibold',
                          pos.side === 'yes' ? 'text-primary' : 'text-danger'
                        )}
                      >
                        {pos.side === 'yes' ? 'SIM' : 'NÃO'}
                      </span>
                      <span>{pos.quantity} contratos</span>
                      <span>@ {pos.avg_price}¢</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'font-mono text-sm font-semibold',
                        pnl >= 0 ? 'text-primary' : 'text-danger'
                      )}
                    >
                      {pnl >= 0 ? '+' : ''}{fmtCurrency(pnl)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs text-zinc-500">
                      {pnl >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-primary" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-danger" />
                      )}
                      {pnlPct >= 0 ? '+' : ''}{fmt(pnlPct, 1)}%
                    </div>
                    <button
                      onClick={() => sell(pos.id, pos.quantity)}
                      className="mt-1.5 rounded border border-border px-2 py-0.5 text-xs text-zinc-400 hover:border-danger hover:text-danger"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Trade history */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-white">
          Histórico ({trades.length})
        </h2>
        {trades.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border text-sm text-zinc-500">
            Nenhuma operação realizada
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-3 text-xs text-zinc-500">
                  <th className="px-4 py-2.5 text-left">Mercado</th>
                  <th className="px-4 py-2.5 text-center">Lado</th>
                  <th className="px-4 py-2.5 text-center">Ação</th>
                  <th className="px-4 py-2.5 text-right">Qtd</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                  <th className="px-4 py-2.5 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...trades].reverse().map((t) => (
                  <tr key={t.id} className="bg-surface-2 hover:bg-surface-3">
                    <td className="max-w-[180px] truncate px-4 py-2.5 text-zinc-300">
                      {t.market_title}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-xs font-medium',
                          t.side === 'yes'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-danger/10 text-danger'
                        )}
                      >
                        {t.side === 'yes' ? 'SIM' : 'NÃO'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={cn('text-xs', t.action === 'buy' ? 'text-primary' : 'text-danger')}>
                        {t.action === 'buy' ? 'Compra' : 'Venda'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-zinc-300">{t.quantity}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-zinc-300">
                      {fmtCurrency(t.total)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-zinc-500">
                      {fmtDate(t.executed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
