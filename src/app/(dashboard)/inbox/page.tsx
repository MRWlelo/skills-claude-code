import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import InboxClient from './InboxClient'

export const dynamic = 'force-dynamic'

export default async function InboxPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.userId },
    include: { contact: true, messages: { orderBy: { createdAt: 'asc' } } },
    orderBy: { lastMessageAt: 'desc' },
  })

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-gray-100 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Caixa de Entrada</h1>
        <p className="text-gray-500 mt-1">{conversations.length} conversa{conversations.length !== 1 ? 's' : ''}</p>
      </div>
      <InboxClient conversations={conversations} />
    </div>
  )
}
