import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function NovaAutomacaoPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  // Create a new blank automation
  const automation = await prisma.automation.create({
    data: {
      userId: session.userId,
      name: 'Nova Automação',
      triggerType: 'comment_keyword',
      status: 'inactive',
    },
  })

  redirect(`/automacoes/${automation.id}`)
}
