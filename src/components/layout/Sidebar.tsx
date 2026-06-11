'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Zap, MessageSquare, Users, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: {
    name: string
    email: string
    plan: string
  }
}

const navItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/automacoes', label: 'Automações', icon: Zap },
  { href: '/inbox', label: 'Caixa de Entrada', icon: MessageSquare },
  { href: '/contatos', label: 'Contatos', icon: Users },
  { href: '/planos', label: 'Planos', icon: CreditCard },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/sair', { method: 'POST' })
    router.push('/entrar')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">AutoGram</span>
            {user.plan === 'pro' ? (
              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-semibold">
                Pro
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                Grátis
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-4.5 h-4.5', isActive ? 'text-indigo-600' : 'text-gray-400')} style={{ width: '18px', height: '18px' }} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-indigo-700">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
