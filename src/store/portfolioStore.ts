import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Position, Trade, Market } from '../types/market'

const INITIAL_BALANCE = 10_000 // R$ 10.000

interface PortfolioState {
  balance: number
  positions: Position[]
  trades: Trade[]
  buy: (market: Market, side: 'yes' | 'no', quantity: number) => string | null
  sell: (positionId: string, quantity: number) => string | null
  resetPortfolio: () => void
}

function calcPnl(position: Position) {
  return (position.current_price - position.avg_price) * position.quantity
}

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      positions: [],
      trades: [],

      buy(market, side, quantity) {
        const price = side === 'yes' ? market.yes_ask : market.no_ask
        const total = (price / 100) * quantity
        const state = get()

        if (state.balance < total) return 'Saldo insuficiente'

        const tradeId = crypto.randomUUID()
        const trade: Trade = {
          id: tradeId,
          market_ticker: market.ticker,
          market_title: market.title,
          side,
          action: 'buy',
          quantity,
          price,
          total,
          executed_at: new Date().toISOString(),
        }

        const existing = state.positions.find(
          (p) => p.market_ticker === market.ticker && p.side === side
        )

        set((s) => {
          const newPositions = existing
            ? s.positions.map((p) =>
                p.id === existing.id
                  ? {
                      ...p,
                      avg_price:
                        (p.avg_price * p.quantity + price * quantity) /
                        (p.quantity + quantity),
                      quantity: p.quantity + quantity,
                      current_price: price,
                    }
                  : p
              )
            : [
                ...s.positions,
                {
                  id: crypto.randomUUID(),
                  market_ticker: market.ticker,
                  market_title: market.title,
                  side,
                  quantity,
                  avg_price: price,
                  current_price: price,
                  created_at: new Date().toISOString(),
                } satisfies Position,
              ]

          return {
            balance: s.balance - total,
            positions: newPositions,
            trades: [...s.trades, trade],
          }
        })

        return null
      },

      sell(positionId, quantity) {
        const state = get()
        const position = state.positions.find((p) => p.id === positionId)
        if (!position) return 'Posição não encontrada'
        if (quantity > position.quantity) return 'Quantidade inválida'

        const total = (position.current_price / 100) * quantity
        const trade: Trade = {
          id: crypto.randomUUID(),
          market_ticker: position.market_ticker,
          market_title: position.market_title,
          side: position.side,
          action: 'sell',
          quantity,
          price: position.current_price,
          total,
          executed_at: new Date().toISOString(),
        }

        set((s) => ({
          balance: s.balance + total,
          positions:
            quantity === position.quantity
              ? s.positions.filter((p) => p.id !== positionId)
              : s.positions.map((p) =>
                  p.id === positionId ? { ...p, quantity: p.quantity - quantity } : p
                ),
          trades: [...s.trades, trade],
        }))

        return null
      },

      resetPortfolio() {
        set({ balance: INITIAL_BALANCE, positions: [], trades: [] })
      },
    }),
    { name: 'kalshi-br-portfolio' }
  )
)

export { calcPnl, INITIAL_BALANCE }
