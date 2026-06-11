import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ChannelsClient from './ChannelsClient'

export default async function ChannelsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const channels = await prisma.channel.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return <ChannelsClient initialChannels={channels} />
}
