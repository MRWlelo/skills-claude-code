export type MarketStatus = 'open' | 'closed' | 'settled' | 'finalized'
export type MarketResult = 'yes' | 'no' | null
export type MarketCategory =
  | 'Política'
  | 'Economia'
  | 'Brasil'
  | 'Cripto'
  | 'Clima'
  | 'Esporte'
  | 'Pop'

export interface SettlementSource {
  url: string
  name: string
}

export interface Market {
  ticker: string
  event_ticker: string
  title: string
  subtitle?: string
  yes_sub_title: string
  no_sub_title: string
  category: MarketCategory
  status: MarketStatus
  result: MarketResult
  open_time: string
  close_time: string
  yes_bid: number
  yes_ask: number
  no_bid: number
  no_ask: number
  last_price: number
  previous_price: number
  volume: number
  volume_24h: number
  open_interest: number
  liquidity: number
  rules_primary?: string
  settlement_source?: SettlementSource
  tags?: string[]
}

export interface PricePoint {
  ts: number
  yes_price: number
  volume: number
}

export interface Event {
  event_ticker: string
  title: string
  category: MarketCategory
  markets: Market[]
  close_time: string
}

// Paper trading types
export interface Position {
  id: string
  market_ticker: string
  market_title: string
  side: 'yes' | 'no'
  quantity: number
  avg_price: number
  current_price: number
  created_at: string
}

export interface Trade {
  id: string
  market_ticker: string
  market_title: string
  side: 'yes' | 'no'
  action: 'buy' | 'sell'
  quantity: number
  price: number
  total: number
  executed_at: string
}
