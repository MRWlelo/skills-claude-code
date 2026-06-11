import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { instagramAccount: true },
  })
  if (!user) redirect('/entrar')

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    planExpiresAt: user.planExpiresAt ? user.planExpiresAt.toISOString() : null,
    instagramAccount: user.instagramAccount ? {
      id: user.instagramAccount.id,
      username: user.instagramAccount.username,
      name: user.instagramAccount.name,
    } : null,
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie sua conta e integrações</p>
      </div>
      <SettingsClient user={userData} />
    </div>
  )
}
