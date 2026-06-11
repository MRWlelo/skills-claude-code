import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import InboxClient from './InboxClient'

export default async function InboxPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      contact: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  return <InboxClient initialConversations={conversations} />
}
