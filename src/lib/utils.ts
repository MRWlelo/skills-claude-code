import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmt(value: number, decimals = 0) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function fmtCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(iso))
}

export function fmtDateLong(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(iso))
}

export function priceDelta(current: number, previous: number) {
  return current - previous
}

export function priceColor(price: number) {
  if (price >= 60) return 'text-primary'
  if (price <= 40) return 'text-danger'
  return 'text-yellow-400'
}

export function deltaColor(delta: number) {
  if (delta > 0) return 'text-primary'
  if (delta < 0) return 'text-danger'
  return 'text-zinc-400'
}
