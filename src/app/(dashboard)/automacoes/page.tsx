import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Plus, Zap } from 'lucide-react'
import AutomacoesClient from './AutomacoesClient'

export const dynamic = 'force-dynamic'

export default async function AutomacoesPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { plan: true },
  })

  const automations = await prisma.automation.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automações</h1>
          <p className="text-gray-500 mt-1">{automations.length} automação{automations.length !== 1 ? 'ões' : ''} criada{automations.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/automacoes/nova"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Automação
        </Link>
      </div>

      {user?.plan === 'free' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm">
            Plano gratuito: apenas 1 automação ativa. Para ativar mais, faça upgrade.
          </p>
          <Link href="/planos" className="ml-4 flex-shrink-0 text-sm font-semibold text-amber-700 underline">
            Ver planos →
          </Link>
        </div>
      )}

      <AutomacoesClient automations={automations} />
    </div>
  )
}
