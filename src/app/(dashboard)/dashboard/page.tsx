import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Zap, MessageSquare, Users, TrendingUp, Plus, Instagram } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { instagramAccount: true },
  })
  if (!user) redirect('/entrar')

  const automations = await prisma.automation.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
  })

  const contacts = await prisma.contact.count({ where: { userId: session.userId } })

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const messagesSentThisMonth = await prisma.message.count({
    where: {
      conversation: { userId: session.userId },
      direction: 'outbound',
      createdAt: { gte: startOfMonth },
    },
  })

  const activeAutomations = automations.filter(a => a.status === 'active').length
  const totalTriggered = automations.reduce((sum, a) => sum + a.triggered, 0)
  const totalLeads = automations.reduce((sum, a) => sum + a.leads, 0)
  const conversionRate = totalTriggered > 0 ? Math.round((totalLeads / totalTriggered) * 100) : 0

  const triggerLabels: Record<string, string> = {
    comment_keyword: 'Comentário',
    story_reply: 'Story',
    dm_keyword: 'DM com palavra-chave',
    any_dm: 'Qualquer DM',
    new_follower: 'Novo seguidor',
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel</h1>
          <p className="text-gray-500 mt-1">Bem-vindo(a), {user.name.split(' ')[0]}!</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/inbox"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Ver Inbox
          </Link>
          <Link
            href="/automacoes/nova"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Automação
          </Link>
        </div>
      </div>

      {/* Free plan banner */}
      {user.plan === 'free' && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm font-medium">
            Você está no plano gratuito — 30 respostas/mês e 1 automação ativa.
          </p>
          <Link
            href="/planos"
            className="ml-4 flex-shrink-0 bg-white text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
          >
            Fazer upgrade Pro por R$15/mês →
          </Link>
        </div>
      )}

      {/* Instagram not connected */}
      {!user.instagramAccount && (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 mb-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Instagram className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Conecte seu Instagram para começar</h3>
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            Vincule sua conta do Instagram para ativar as automações e começar a capturar leads.
          </p>
          <Link
            href="/configuracoes"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Conectar Instagram
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Automações ativas', value: activeAutomations, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Mensagens enviadas (mês)', value: messagesSentThisMonth, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Contatos capturados', value: contacts, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Taxa de conversão', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent automations */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Automações recentes</h2>
          <Link href="/automacoes" className="text-sm text-indigo-600 hover:underline">Ver todas</Link>
        </div>
        {automations.length === 0 ? (
          <div className="p-12 text-center">
            <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma automação criada ainda</p>
            <Link href="/automacoes/nova" className="mt-4 inline-flex items-center gap-2 text-indigo-600 text-sm font-medium hover:underline">
              <Plus className="w-4 h-4" />
              Criar primeira automação
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {automations.slice(0, 5).map((auto) => (
              <div key={auto.id} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${auto.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{auto.name}</p>
                  <p className="text-xs text-gray-500">{triggerLabels[auto.triggerType] || auto.triggerType}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>{auto.triggered} gatilhos</span>
                  <span>{auto.leads} leads</span>
                </div>
                <Link href={`/automacoes/${auto.id}`} className="text-sm text-indigo-600 hover:underline flex-shrink-0">
                  Editar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
