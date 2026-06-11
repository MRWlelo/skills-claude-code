import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AutomationBuilder from '@/components/flow-builder/AutomationBuilder'

export const dynamic = 'force-dynamic'

export default async function AutomacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const { id } = await params

  const [automation, user] = await Promise.all([
    prisma.automation.findFirst({ where: { id, userId: session.userId } }),
    prisma.user.findUnique({ where: { id: session.userId }, select: { plan: true } }),
  ])

  if (!automation || !user) notFound()

  const automationData = {
    id: automation.id,
    name: automation.name,
    status: automation.status,
    triggerType: automation.triggerType,
    nodes: automation.nodes,
    edges: automation.edges,
  }

  return <AutomationBuilder automation={automationData} userPlan={user.plan} />
}
