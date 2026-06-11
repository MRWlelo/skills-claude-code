import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FlowsClientActions from './FlowsClientActions'
import { GitBranch, Plus, Zap } from 'lucide-react'

export default async function FlowsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const flows = await prisma.flow.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flows</h1>
          <p className="text-gray-500 mt-1">Build automated conversation flows</p>
        </div>
        <FlowsClientActions />
      </div>

      {flows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GitBranch className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No flows yet</h3>
          <p className="text-gray-500 mb-6">Create your first automated conversation flow</p>
          <FlowsClientActions variant="empty" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <Link
              key={flow.id}
              href={`/flows/${flow.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  flow.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : flow.status === 'inactive'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {flow.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{flow.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {flow.description ?? 'No description'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Trigger: {flow.trigger}</span>
                {flow.triggerValue && <span>"{flow.triggerValue}"</span>}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Updated {new Date(flow.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
