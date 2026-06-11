import { Link, useLocation } from 'react-router-dom'
import { BarChart2, BookOpen, Briefcase, Home, TrendingUp } from 'lucide-react'
import { cn, fmtCurrency } from '../../lib/utils'
import { usePortfolio } from '../../store/portfolioStore'

const NAV = [
  { to: '/', label: 'Início', Icon: Home },
  { to: '/mercados', label: 'Mercados', Icon: TrendingUp },
  { to: '/carteira', label: 'Carteira', Icon: Briefcase },
  { to: '/aprender', label: 'Aprender', Icon: BookOpen },
]

export function Header() {
  const { pathname } = useLocation()
  const balance = usePortfolio((s) => s.balance)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-2/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <BarChart2 className="h-5 w-5 text-primary" />
          <span>Kalshi <span className="text-primary">BR</span></span>
        </Link>

        {/* Nav links */}
        <nav className="hidden gap-1 md:flex">
          {NAV.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                pathname === to || (to !== '/' && pathname.startsWith(to))
                  ? 'bg-surface-3 text-white'
                  : 'text-zinc-400 hover:bg-surface-3 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Balance */}
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm">
            <span className="text-zinc-400 text-xs mr-1">Saldo</span>
            <span className="font-mono font-semibold text-primary">{fmtCurrency(balance)}</span>
          </div>
          <span className="hidden rounded bg-surface-4 px-2 py-0.5 text-xs text-zinc-400 md:block">
            Simulado
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex border-t border-border md:hidden">
        {NAV.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors',
              pathname === to || (to !== '/' && pathname.startsWith(to))
                ? 'text-primary'
                : 'text-zinc-500'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
