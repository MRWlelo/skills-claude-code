import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import FlowBuilder from '@/components/flow-builder/FlowBuilder'

export default async function FlowBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params

  if (id === 'new') {
    return (
      <FlowBuilder
        flow={{
          id: 'new',
          name: 'New Flow',
          description: null,
          status: 'draft',
          nodes: '[]',
          edges: '[]',
          trigger: 'keyword',
          triggerValue: null,
        }}
      />
    )
  }

  const flow = await prisma.flow.findFirst({
    where: { id, userId: session.userId },
  })

  if (!flow) notFound()

  return <FlowBuilder flow={flow} />
}
