import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Users, GitBranch, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [contactCount, flowCount, conversationCount, openCount] = await Promise.all([
    prisma.contact.count({ where: { userId: session.userId } }),
    prisma.flow.count({ where: { userId: session.userId } }),
    prisma.conversation.count(),
    prisma.conversation.count({ where: { status: 'open' } }),
  ])

  const activeFlows = await prisma.flow.count({
    where: { userId: session.userId, status: 'active' },
  })

  const recentConversations = await prisma.conversation.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { contact: true },
  })

  const stats = [
    { label: 'Total Contacts', value: contactCount, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Flows', value: activeFlows, icon: GitBranch, color: 'bg-indigo-500', change: '+3' },
    { label: 'Open Conversations', value: openCount, icon: MessageSquare, color: 'bg-emerald-500', change: '+5' },
    { label: 'Total Flows', value: flowCount, icon: TrendingUp, color: 'bg-purple-500', change: '' },
  ]

  const channelColors: Record<string, string> = {
    whatsapp: 'bg-green-100 text-green-700',
    instagram: 'bg-pink-100 text-pink-700',
    facebook: 'bg-blue-100 text-blue-700',
    webchat: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {session.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.change && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h2>
          {recentConversations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No conversations yet</p>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conv) => (
                <div key={conv.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {conv.contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{conv.contact.name}</p>
                    <p className="text-gray-400 text-xs truncate">{conv.lastMessage ?? 'No messages yet'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${channelColors[conv.channel] ?? 'bg-gray-100 text-gray-600'}`}>
                    {conv.channel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation Stats</h2>
          <div className="space-y-4">
            {[
              { label: 'Open', value: openCount, color: 'bg-emerald-500', total: conversationCount },
              { label: 'Resolved', value: conversationCount - openCount, color: 'bg-gray-300', total: conversationCount },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: item.total > 0 ? `${(item.value / item.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
