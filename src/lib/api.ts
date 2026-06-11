import { Market, PricePoint } from '../types/market'
import { MOCK_MARKETS, getMockHistory } from './mockData'

async function kalshiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/kalshi${path}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

export async function fetchMarkets(): Promise<Market[]> {
  const data = await kalshiFetch<{ markets: unknown[] }>('/markets?limit=100&status=open')
  if (data?.markets?.length) {
    // map real API response to our Market type if available
    return data.markets as unknown as Market[]
  }
  return MOCK_MARKETS
}

export async function fetchMarket(ticker: string): Promise<Market | null> {
  const data = await kalshiFetch<{ market: Market }>(`/markets/${ticker}`)
  if (data?.market) return data.market
  return MOCK_MARKETS.find((m) => m.ticker === ticker) ?? null
}

export async function fetchMarketHistory(ticker: string): Promise<PricePoint[]> {
  const data = await kalshiFetch<{ history: PricePoint[] }>(
    `/markets/${ticker}/history?limit=200&period_interval=1440`
  )
  if (data?.history?.length) return data.history
  return getMockHistory(ticker)
}
